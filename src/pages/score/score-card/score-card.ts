import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ViewController } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { ScoreCardClass } from '../../../models/score-card-class';
import { ShooterClass } from '../../../models/shooter-class';
import { TargetClass } from '../../../models/target-class';
import { CommonProvider } from '../../../providers/common-provider';
import { ScoreCardService } from '../../../providers/score-card-service';
import { ScoreClass, ScoreTargetClass, ScoreEndClass } from '../../../models/score-class';

import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-score-card',
	templateUrl: 'score-card.html',
})
export class ScoreCardPage {

	scoreCard: ScoreCardClass;
	allEnds = [1,2,3,4,5,6];

	maxShooters: number = 0;
	shooters: ShooterClass[] = [];
	shooterIndex: number = 0;
	shooterIndex_n: number = -1;
	shooterIndex_p: number = -1;
	shooter: ShooterClass;
	shooter_n: ShooterClass;
	shooter_p: ShooterClass;
	
	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public modalCtrl: ModalController,
				public popoverCtrl: PopoverController,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public scoreCardService: ScoreCardService
			) {

		this.GetPassedScoreCard();

	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ScoreCard';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );

	}

	GetPassedScoreCard() {
		if( this.navParams.get( Const.LABEL.SCORE_CARD ) != undefined ) {		
			this.scoreCard = <ScoreCardClass> this.navParams.get( Const.LABEL.SCORE_CARD );

			//Get shooter and next/previous shooter, so we can show inititals of shooter for quick change.
			this.shooters = this.scoreCard.shooters;
			this.maxShooters = this.shooters.length;
			this.shooter = this.shooters[ this.shooterIndex ];
			this.SetShooterNextPrevious();
			this.PrepareShooterScore();
		} else {
			this.Back();
		}
	}

	PrepareShooterScore() {

		for( let shooter of this.shooters ) {
			if( shooter.score == null ) {

				let score = new ScoreClass();
				score.targets = [];

				for( let target of this.scoreCard.round.targets) {

					let scoreTarget: ScoreTargetClass = new ScoreTargetClass();
					scoreTarget.ends = [];
					scoreTarget.id = target.id;

					for ( let i = 0; i < target.ends; i++ ) {	
						
						let scoreEnd: ScoreEndClass = new ScoreEndClass();
						scoreEnd.end = [];

						//Set placeholder for arrow scores for each end.
						for ( let a = 0; a < this.scoreCard.round.arrows; a++ ) {
							scoreEnd.end.push( Const.MISC.SCORE_END_EMPTY );
						}				
						scoreTarget.ends.push( scoreEnd );

					}
					
					score.targets.push( scoreTarget );
					
				}
				
				shooter.score = score;
				
			}
		}
		console.log( this.shooters );
	}

	SetShooterNextPrevious() {

		this.shooterIndex_p = this.shooterIndex - 1;
		this.shooterIndex_n = this.shooterIndex + 1;
	
		if ( this.shooterIndex_p < 0 ) { this.shooterIndex_p = this.scoreCard.shooters.length - 1; }
		if ( this.shooterIndex_n > this.scoreCard.shooters.length - 1 ) { this.shooterIndex_n = 0; }
	
		this.shooter_p = this.scoreCard.shooters[ this.shooterIndex_p ];
		this.shooter_n = this.scoreCard.shooters[ this.shooterIndex_n ];
	
	}

	Back() {
		this.viewCtrl.dismiss( this.scoreCard );
		// this.navCtrl.pop();
	}

	ChangeShooter( myEvent ) {
		let popover = this.popoverCtrl.create( Const.LABEL.SHOOTER_POPOVER, { shooters: this.scoreCard.shooters, selectedShooter: this.shooter } );
		popover.present({
			ev: myEvent
		});
		popover.onWillDismiss( shooter => {
			if ( shooter != null ) {
				this.shooter = shooter;
				this.shooterIndex = this.getShooterIndex( shooter );
				this.SetShooterNextPrevious();
			}
		});
	}
	
	getShooterIndex( shooter ) {
		return _.findIndex(this.scoreCard.shooters, function(item) { return item.initials == shooter.initials })
	}
	
	SwipeShooter( $event ) {
		if( $event.offsetDirection == 4 ){
			this.next();
		} else if( $event.offsetDirection == 2 ){
			this.prev();
		}
	}

	prev() {
		this.shooterIndex--;
		if ( this.shooterIndex < 0 ) {
			this.shooterIndex = this.maxShooters - 1;
		}
		this.shooter = this.scoreCard.shooters[ this.shooterIndex ];
		this.SetShooterNextPrevious();
	}
	
	next() {
		this.shooterIndex++;
		if ( this.shooterIndex >= this.maxShooters ) {
			this.shooterIndex = 0;
		}
		this.shooter = this.scoreCard.shooters[ this.shooterIndex ];
		this.SetShooterNextPrevious();
	}
		
	FindTargetInTargets( target: TargetClass ) {
		return _.findIndex( this.shooter.score.targets, { id: target.id } );
	}
	GetNextEndToScore( target: TargetClass ) {
		let index_t = this.FindTargetInTargets( target );
		for( let i = 0; i < this.shooter.score.targets[ index_t ].ends.length; i++ ) {
			let arr: string[] = this.shooter.score.targets[ index_t ].ends[ i ].end.filter( v => v != Const.MISC.SCORE_END_EMPTY );
			if( arr.length < this.scoreCard.round.arrows ) {
				return i;
			}
		}
		return -1;
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

	EnterScore( target: TargetClass ) {

		//Find next available end.
		let index_t = this.FindTargetInTargets( target );
		let index_e = this.GetNextEndToScore( target );

		if( index_e == -1 ) {
			if( this.scoreCard.status == Const.SCORE_CARD_STATUS.COMPLETED ) {
				this.common.ShowAlert( "Notice", "Score card is already complete." );
			} else {
				this.common.ShowAlert( "Notice", "Target has been scored. A long press will edit the target's scores." );
			}
		} else {

			let scoreModal = this.modalCtrl.create( Const.PAGES.SCORE_ENTRY, { end: this.shooter.score.targets[ index_t ].ends[ index_e ], arrows: this.scoreCard.round.arrows, scoring: this.scoreCard.round.scoring } );
			scoreModal.onDidDismiss(data => {
				this.shooter.score.targets[ index_t ].ends[ index_e ].end = data;
				this.shooter.score = this.CalculateStats( this.shooter.score );
				
				this.scoreCardService.IsScoreCardComplete( this.scoreCard )
				 	.then( result => {
						 //Leave
						//this.scoreCard.status = ( this.scoreCardService.IsComplete( this.scoreCard ) ? Const.SCORE_CARD_STATUS.COMPLETED : this.scoreCard.status );
						this.Back();
					 },
					 ( error ) => {
						//Stay
					 })
					 .catch( (error) => {
						 this.common.ShowToastFail( JSON.stringify( error ) );
					 });
				 
			});
			scoreModal.present();			
		}

	}

	EditScore( target: TargetClass, endIndex: number ) {

		if( this.scoreCard.status == Const.SCORE_CARD_STATUS.ONGOING ) {

			let index_t = this.FindTargetInTargets( target );

			let scoreModal = this.modalCtrl.create( Const.PAGES.SCORE_ENTRY, { end: this.shooter.score.targets[ index_t ].ends[ endIndex ], arrows: this.scoreCard.round.arrows, scoring: this.scoreCard.round.scoring } );
			scoreModal.onDidDismiss(data => {
				let index_t = this.FindTargetInTargets( target );
				this.shooter.score.targets[ index_t ].ends[ endIndex ].end = data;
				this.shooter.score.targets[ index_t ].ends[ endIndex ].total_et = 0;
				this.shooter.score.targets[ index_t ].ends[ endIndex ].total_rt = 0;
				this.shooter.score = this.CalculateStats( this.shooter.score );	
			});
			scoreModal.present();

		}
		
	}

	GetColor( value: string ) {
		return '';
		// switch ( value ) {
		// 	case '1':
		// 	case'2' :
		// 		return 'score-white';
		// 		break;
		// 	case '3':
		// 	case'4' :
		// 		return 'score-black';
		// 		break;
		// 	case '5':
		// 	case'6' :
		// 		return 'score-blue';
		// 		break;
		// 	case '7':
		// 	case'8' :
		// 		return 'score-red';
		// 		break;
		// 	case '9':
		// 	case'10' :
		// 		return 'score-yellow';
		// 		break;
		// 	case'X' :
		// 		return 'score-yellow';
		// 		break;
		// 	case'M' :
		// 		return '';
		// 		break;
		// }
	}

	
}
