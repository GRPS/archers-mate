import { Injectable } from '@angular/core';
import { AlertController, App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { ShooterClass } from '../models/shooter-class';
import { ScoreClass } from '../models/score-class';
import { ScoreTargetClass } from '../models/score-class';
import { TargetClass } from '../models/target-class';
import { ScoreEndClass } from '../models/score-class';
import { ScoreCardClass } from '../models/score-card-class';
import { ShooterService } from '../providers/shooter-service';

import * as _ from 'underscore';

@Injectable()
export class ScoreCardService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public alertCtrl: AlertController,
				public http: HttpClient,
				public common: CommonProvider,
				public shooterService: ShooterService
				) {
		this.common.AddLog( 'ShooterService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	DeleteScoreCardShooter( shooters: ShooterClass[], shooter: ShooterClass ) {
		return new Promise( resolve => {
			resolve( shooters.filter( obj => obj !== shooter ) );
		});	
	}	

	Update( scoreCard: ScoreCardClass ) {
		this.navCtrl.push( Const.PAGES.SCORE_CARD_SETUP, { scoreCard: scoreCard } );
	}

	DeleteScoreCards( scoreCards: ScoreCardClass[], scoreCard: ScoreCardClass ) {
		return new Promise( resolve => {
			let newScoreCards: ScoreCardClass[] = _.filter( scoreCards, function( obj ) { return obj.id != scoreCard.id });		
			resolve( newScoreCards );
		});
	}

	ArchiveScoreCards( scoreCards: ScoreCardClass[], scoreCard: ScoreCardClass ) {
		return new Promise( resolve => {			
			let index = _.findIndex( scoreCards, { id: scoreCard.id } );
			scoreCards[ index ].status = Const.SCORE_CARD_STATUS.ARCHIVED;	
			resolve( scoreCards );
		});
	}
	UnarchiveScoreCards( scoreCards: ScoreCardClass[], scoreCard: ScoreCardClass ) {
		return new Promise( resolve => {			
			let index = _.findIndex( scoreCards, { id: scoreCard.id } );
			let inCompleteShooters: ShooterClass[] = _.filter( scoreCards[ index ].shooters, function( obj: ShooterClass ) { return !obj.score.isComplete });	
			scoreCards[ index ].status = (inCompleteShooters.length == 0 ? Const.SCORE_CARD_STATUS.COMPLETED : Const.SCORE_CARD_STATUS.ONGOING );
			resolve( scoreCards );
		});
	}

	OrderScoreCards() {
		Global.scoreCards = _.sortBy( Global.scoreCards, function( sc: ScoreCardClass ) { return new Date( sc.dt ); }).reverse();
	}

	Save( scoreCard: ScoreCardClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {

			if( isNew ) {
				scoreCard.id = this.common.GetRandomNumber();
				Global.scoreCards.push( scoreCard );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( Global.scoreCards, scoreCard.id );
				if( index == -1 ) {
					Global.scoreCards.push( scoreCard );
				} else {
					Global.scoreCards[ index ] = scoreCard;
				}
			}
			this.OrderScoreCards();

			this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
				.then( () => {
					resolve();
				});

		});		
	}

	GetGuest( shooters: ShooterClass[] ): Promise<ShooterClass> {		
		return new Promise( resolve => {

			let nextNumber: number = 1;
			let newNumber: number = 1;

			for( let shooter of shooters ) {
				if( shooter.name.indexOf( 'Guest ' ) > -1 ) {
					newNumber = Number( shooter.initials.replace('G', '') ) + 1;
					if( newNumber > nextNumber ) {
						nextNumber = newNumber;
					}
				}
			}
			
			resolve( new ShooterClass({
				id: this.common.GetRandomNumber(),
				name: 'Guest ' + nextNumber,
				initials: 'G' + nextNumber,
				generder: 'male',
				age: 21,
				isDefault: false,
				isGuest: true,
				bows: [],
				score: null
			}));
		});
	}

	GetShooter( leftOvers: any[] ): Promise<ShooterClass[]> {
		return new Promise( ( resolve, reject ) => {

			let alert = this.alertCtrl.create({
				title: 'Shooters',
				inputs: leftOvers,
				buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						handler: data => {
							reject();
						}
					},
					{
						text: 'Select',
						handler: ids => {

							let shooters: ShooterClass[] = _.filter( Global.shooters, function( shooter: ShooterClass) {
								let found = _.contains( ids, shooter.id );
								if ( found ) {
									return Object.assign( {}, shooter );
								}
							});

							//Return a clone of the Global.bow else anything we do to it will effect the Global.bows too.
							resolve( <ShooterClass[]> shooters );
						}
					}
				]
				});
				alert.present();
			});

	}

	GetUnselectedShooters( shooters: ShooterClass[] ): Promise<any[]> {
		return new Promise( ( resolve, reject ) => {
			let leftOvers = [];
			for( let shooter of Global.shooters ) {
				let index = this.common.GetIndexOfObjectIdInArray( shooters, shooter.id );
				if( index == -1 ) {
					leftOvers.push({
						type: 'checkbox',
						label: shooter.name,
						value: shooter.id
					});
				}
			}
			resolve( leftOvers );
		});
	}
	
	GetSegmentScoreCards(): Promise<any[]> {
		return new Promise( ( resolve, reject ) => {
			resolve( [
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.ONGOING } ),
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.COMPLETED } ),
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.ARCHIVED } ),
			] );
		});
	}

	UpdateScoreCards( scoreCard: ScoreCardClass ): Promise<ScoreCardClass[]> {
		return new Promise( ( resolve, reject ) => {
			let index = _.findIndex( Global.scoreCards, { id: scoreCard.id } );
			Global.scoreCards[ index ] = scoreCard;
			this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
				.then( () =>{
					resolve();
				});
		});
	} 

	IsComplete( scoreCard: ScoreCardClass ) {
		var notCompleteShooterScoreCard: ShooterClass = _.find( scoreCard.shooters, function( obj ){ return obj.score.isComplete == false; });
		return ( notCompleteShooterScoreCard == undefined ? true : false );
	}

	IsScoreCardComplete( scoreCard: ScoreCardClass ): Promise<boolean> {

		return new Promise( ( resolve, reject ) => {
			
			if( this.IsComplete( scoreCard) ) {

				this.common.ConfirmUser( 'Score Card Complete', 'All shooters have a completed score card. Stay to edit or go for stats?', 'Stay', 'Leave' )
					.then( result => {
						if( result ) {
							resolve(); //Leave
						} else {
							reject(); //Stay					
						}
					});
			}
		});		

	}

	GenerateShooterDefaultScore( targets: TargetClass[], arrows: number ) {

		let score = new ScoreClass();
		score.targets = [];

		for( let target of targets) {

			let scoreTarget: ScoreTargetClass = new ScoreTargetClass();
			scoreTarget.ends = [];
			scoreTarget.id = target.id;

			for ( let i = 0; i < target.ends; i++ ) {	
				
				let scoreEnd: ScoreEndClass = new ScoreEndClass();
				scoreEnd.end = [];

				//Set placeholder for arrow scores for each end.
				for ( let a = 0; a < arrows; a++ ) {
					scoreEnd.end.push( Const.MISC.SCORE_END_EMPTY );
				}				
				scoreTarget.ends.push( scoreEnd );

			}
			
			score.targets.push( scoreTarget );
			
		}

		return score;

	}

	CalculateStats( scoreCard: ScoreClass ) {

		let total = 0;
		let total_hits = 0;
		let total_avg = 0;
		let total_x = 0;
		let total_10 = 0;
		let total_9 = 0;
		let total_M = 0;
		let endCount: number = 0;
		let end_prev: ScoreEndClass;

		for( let target of scoreCard.targets ) {

			let t_total = 0;
			let t_total_hits = 0;
			let t_total_avg = 0;
			let t_total_x = 0;
			let t_total_10 = 0;
			let t_total_9 = 0;
			let t_total_M = 0;

			let targetEndsScored = 0;

			for( let end of target.ends ) {
				if( end.total_et == 0 ) {
					end = this.CalculateEndStats( end );
				}
				if( endCount == 0 ) {
					end.total_rt = end.total_et;
				} else if( end.total_et != 0 ) {
					end.total_rt = end.total_et + end_prev.total_rt;
				}

				if( end.statHits + end.statMs > 0 ){
					targetEndsScored++;
					if( end.total_rt == 0 && end_prev ) {
						end.total_rt = end_prev.total_rt;
					}
				}
								
				t_total += end.total_et;
				t_total_hits += end.statHits;
				t_total_avg += end.statAvg;
				t_total_x += end.statXs;
				t_total_10 += end.stat10s;
				t_total_9 += end.stat9s;
				t_total_M += end.statMs;

				end_prev = end;
				endCount++;

			}

			if( t_total > 0 ) {
				target.statHits = t_total_hits;
				target.statAvg = Math.round( ( t_total_avg / targetEndsScored ) * 100 ) / 100;
				target.total_et = t_total;
				target.total_rt = end_prev.total_rt;
				target.statXs = t_total_x;
				target.stat10s = t_total_10;
				target.stat9s = t_total_9;
				target.statMs = t_total_M;
			}

			// total += target.total_rt;
			total_hits += t_total_hits;
			total_avg += target.statAvg;
			total_x += t_total_x;
			total_10 += t_total_10;
			total_9 += t_total_9;
			total_M += t_total_M;

		}

		if( end_prev.total_rt > 0 ) {

			scoreCard.isComplete = true;
			scoreCard.statHits = total_hits;
			scoreCard.total_et = total;
			scoreCard.total_rt = end_prev.total_rt;
			scoreCard.statAvg = Math.round( ( total_avg / scoreCard.targets.length ) * 100 ) / 100;
			scoreCard.statXs = total_x;
			scoreCard.stat10s = total_10;
			scoreCard.stat9s = total_9;
			scoreCard.statMs = total_M;

		}

		return scoreCard;
	}

	CalculateEndStats( scoreEnd: ScoreEndClass ) {

		let total = 0;
		let total_hits = 0;
		let total_x = 0;
		let total_10 = 0;
		let total_9 = 0;
		let total_M = 0;
		
		for( let i = 0; i < scoreEnd.end.length; i++ ) {
			let str_num: any = scoreEnd.end[ i ];
			total_hits++;
			switch( str_num ) {
				case 'X':
					str_num = '10';
					total_x++;
					break;
				case '10':
					total_10++;
					break;
				case '9':
					total_9++;
					break;
				case 'M':
					str_num = '0';
					total_hits--;
					total_M++;
					break;
			}

			total += Number( str_num );

		}

		scoreEnd.statHits = (total == 0 ? 0 : total_hits );
		scoreEnd.total_et = total;
		scoreEnd.total_rt = total;
		scoreEnd.statAvg = Math.round( (total / scoreEnd.end.length) * 100 ) / 100;
		scoreEnd.statXs = total_x;
		scoreEnd.stat10s = total_10;
		scoreEnd.stat9s = total_9;
		scoreEnd.statMs = total_M;
			
		return scoreEnd;

	}

	SortScores( scores: string[] ) {
		let tmp: number[] = [];
		for( let n of scores ) {
			if( n == 'X' ) {
				tmp.push( 11 );
			} else if ( n == 'M' ) {
				tmp.push( 0 );
			} else {
				tmp.push( Number(n) );
			}
		}
		let tmp2 = _.sortBy( tmp, function( num ) { return num; }).reverse();
		scores = [];
		for( let n of tmp2 ) {
			if( n == 11 ) {
				scores.push( 'X' );
			} else if ( n == 0 ) {
				scores.push( 'M' );
			} else {
				scores.push( String(n) );
			}
		}
		return scores;
	}

}
