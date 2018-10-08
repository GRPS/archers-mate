import { Injectable } from '@angular/core';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { ScoreCardClass } from '../models/score-card-class';
import { ShooterClass } from '../models/shooter-class';

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

	GetData() {

		let data: StatClass[] = [];

		let scoreCards: ScoreCardClass[] = _.filter( Global.scoreCards,  function( item: ScoreCardClass ) {
												return item.status == Const.SCORE_CARD_STATUS.COMPLETED;
											});

		for( let scoreCard of scoreCards ) {
			for( let shooter of scoreCard.shooters ) {
				if( !shooter.isGuest ) {
					let stat = new StatClass;
					stat.round = scoreCard.round;
					stat.shooter = shooter;
					stat.score = shooter.score;
					stat.dt = scoreCard.dt;

					data.push( stat );

				}
			}
		}

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
			
			// Add shooter score to array.
			dataRound[ stat.round.name ][ 'shooters' ][ stat.shooter.name].push( { date: stat.dt, score: stat.shooter.score.total_rt, isBest: false, isWorst: false } );
			
		}

		// Set which shooters scres for the round are the best and worst.
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
			statData.shooter = dataRound[ roundKey ][ 'best' ];
			statData.data = [];
			for( let shooterKey of Object.keys( dataRound[ roundKey ][ 'shooters' ] ) ) {
				let statDataSub = new StatDataSubClass();
				statDataSub.name = shooterKey;
				statDataSub.scores = [];
				let total: number = 0;
				for( let sc of Object.keys( dataRound[ roundKey ][ 'shooters' ][ shooterKey ] ) ) {
					total += dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].score;
					let statScore = new StatScoreClass();
					statScore.score = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].score;
					statScore.date = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].date;
					statScore.isBest = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].isBest;
					statScore.isWorst = dataRound[ roundKey ][ 'shooters' ][ shooterKey ][ sc ].isWorst;
					statDataSub.scores.push( statScore ); 
					statDataSub.avg = Math.round( ( total / dataRound[ roundKey ][ 'shooters' ][ shooterKey ].length ) * 100 ) / 100;
				}
				statData.data.push( statDataSub );
			}
			statData.data = statData.data.sort( ( a, b ) => 0 - ( a.name > b.name ? -1 : 1 ) );
			statDatas.push( statData );	
		}

		console.log(statDatas);
		
		return statDatas;

	}

}
