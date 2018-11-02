import { Injectable } from '@angular/core';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { ScoreCardClass } from '../models/score-card-class';
// import { ShooterClass } from '../models/shooter-class';

import * as _ from 'underscore';
import { StatClass, StatDataClass, StatDataSubClass, StatScoreClass } from '../models/stat-class';
// import { StatClass } from '../models/stat-class';

@Injectable()
export class StatsService {

	constructor(
				public common: CommonProvider
				) {
		this.common.AddLog( 'StatsService loaded' );
	}

	GetScoreCards( dtFrom: string, dtTo: string ) {

		let scoreCards: ScoreCardClass[] = _.filter( Global.scoreCards,  function( item: ScoreCardClass ) {
												let isInRange: boolean = false;
												
												if( new Date( item.dt ) >= new Date( dtFrom ) && new Date( item.dt ) <= new Date( dtTo ) )
													isInRange = true;

												return item.status == Const.SCORE_CARD_STATUS.COMPLETED && isInRange;
											});

		return scoreCards;

	}

	ConvertScoreCardsToStats( scoreCards: ScoreCardClass[] ) {

		let data: StatClass[] = [];

		for( let scoreCard of scoreCards ) {
			for( let shooter of scoreCard.shooters ) {
				if( !shooter.isGuest ) {
					let stat = new StatClass;
					stat.scoreCardId = scoreCard.id;
					stat.round = scoreCard.round;
					stat.shooter = shooter;
					stat.score = shooter.score;
					stat.dt = scoreCard.dt;
					data.push( stat );
				}
			}
		}

		data = data.sort( ( a, b ) => 0 - ( a.round.name > b.round.name ? -1 : 1 ) );

		return data;

	}

	GetDataByRound( data: StatClass[] ) {
		
		let dataRound: any[] = [];

		for( let stat of data ) {

			// Create new array index if required.
			dataRound[ stat.round.name ] = dataRound[ stat.round.name ] || [];
			dataRound[ stat.round.name ][ 'shooters' ] = dataRound[ stat.round.name ][ 'shooters' ] || [];
			dataRound[ stat.round.name ][ 'shooters' ][ stat.shooter.name] = dataRound[ stat.round.name ][ 'shooters' ][ stat.shooter.name] || [];

			dataRound[ stat.round.name ][ 'best' ] = dataRound[ stat.round.name ][ 'best' ] || stat.shooter;
			if( stat.shooter.score.total_rt > dataRound[ stat.round.name ][ 'best' ].score.total_rt ) {
				dataRound[ stat.round.name ][ 'best' ] = stat.shooter;
			}

			dataRound[ stat.round.name ][ 'worst' ] = dataRound[ stat.round.name ][ 'worst' ] || stat.shooter;
			if( stat.shooter.score.total_rt < dataRound[ stat.round.name ][ 'worst' ].score.total_rt ) {
				dataRound[ stat.round.name ][ 'worst' ] = stat.shooter;
			}
			
			// Add shooter score to array.
			dataRound[ stat.round.name ][ 'shooters' ][ stat.shooter.name].push( { date: stat.dt, score: stat.shooter.score.total_rt, isBest: false, isWorst: false, scoreCardId: stat.scoreCardId } );
			
		}

		// Set which shooters scores for the round are the best and worst.
		for( let dr in dataRound ) {
			for( let sh in dataRound[ dr ][ 'shooters' ] ) {
				let tmp = _.sortBy( dataRound[ dr ][ 'shooters' ][ sh ], 'score' );
				for( let sc in dataRound[ dr ][ 'shooters' ][ sh ] ) {
					if( dataRound[ dr ][ 'shooters' ][ sh ][ sc ].score == tmp[ 0 ].score ) {
						dataRound[ dr ][ 'shooters' ][ sh ][ sc ].isWorst = true;
					}
					if( dataRound[ dr ][ 'shooters' ][ sh ][ sc ].score == tmp[ tmp.length - 1 ].score ) {
						dataRound[ dr ][ 'shooters' ][ sh ][ sc ].isBest = true;
					}
				}
			}
		}

		let statDatas: StatDataClass[] = [];
		
		for( let roundKey of Object.keys( dataRound ) ) {
			let statData = new StatDataClass();
			statData.type = "round";
			statData.id = this.common.GetRandomNumber(); 
			statData.name = roundKey;
			statData.shooterBest = dataRound[ roundKey ][ 'best' ];
			statData.shooterWorst = dataRound[ roundKey ][ 'worst' ];
			statData.data = [];
			for( let shooterKey of Object.keys( dataRound[ roundKey ][ 'shooters' ] ) ) {
				let statDataSub = new StatDataSubClass();
				statDataSub.name = shooterKey;
				statDataSub.scores = [];
				let total: number = 0;
				let best: number = 0;
				let worst: number = 9999999999;
				for( let sc of Object.keys( dataRound[ roundKey ][ 'shooters' ][ shooterKey ] ) ) {

					let score = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].score;
					total += score;
					best = ( score > best ? score : best );
					worst = ( score < worst ? score : worst );
					
					let statScore = new StatScoreClass();
					statScore.score = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].score;
					statScore.date = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].date;
					statScore.isBest = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].isBest;
					statScore.isWorst = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].isWorst;
					statScore.scoreCardId = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].scoreCardId;
					statDataSub.scores.push( statScore ); 
					statDataSub.avg = ( Math.round( ( total / dataRound[ roundKey ][ 'shooters' ][ shooterKey ].length ) * 100 ) / 100 ).toFixed( 2 );
					statDataSub.best = best;
					statDataSub.worst = worst;
				}
				statData.data.push( statDataSub );
			}
			statData.data = statData.data.sort( ( a, b ) => 0 - ( a.name > b.name ? -1 : 1 ) );
			statDatas.push( statData );	
		}

		return statDatas;

	}

}
