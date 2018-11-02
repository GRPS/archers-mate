import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ViewController } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { ScoreCardClass } from '../../../models/score-card-class';
import { ShooterClass } from '../../../models/shooter-class';
import { TargetClass } from '../../../models/target-class';
import { CommonProvider } from '../../../providers/common-provider';
import { ScoreCardService } from '../../../providers/score-card-service';

import * as _ from 'underscore';
import { SightMarkClass } from '../../../models/sight-mark-class';

@IonicPage()
@Component({
	selector: 'page-score-card',
	templateUrl: 'score-card.html',
})
export class ScoreCardPage {

	callBack: any;

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

	sm_data: any[] = [];

	shooterSightMarks: SightMarkClass[];
	
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
		this.GenerateShooterSightMarkData();

	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ScoreCard';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );

	}

	GetPassedScoreCard() {

		if( this.navParams.get('callBack') != undefined ) {
			this.callBack = this.navParams.data.callBack;	
		}

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
				shooter.score = this.scoreCardService.GenerateShooterDefaultScore( this.scoreCard.round.targets, this.scoreCard.round.arrows );			
			}
		}
	}

	SetShooterNextPrevious() {

		this.shooterIndex_p = this.shooterIndex - 1;
		this.shooterIndex_n = this.shooterIndex + 1;
	
		if ( this.shooterIndex_p < 0 ) { this.shooterIndex_p = this.scoreCard.shooters.length - 1; }
		if ( this.shooterIndex_n > this.scoreCard.shooters.length - 1 ) { this.shooterIndex_n = 0; }
	
		this.shooter_p = this.scoreCard.shooters[ this.shooterIndex_p ];
		this.shooter_n = this.scoreCard.shooters[ this.shooterIndex_n ];
	
	}

	AndroidBackButton() {
        this.Back();
	}
	
	Back() {
		// this.viewCtrl.dismiss( this.scoreCard );
		this.callBack( this.scoreCard )
			.then( () => {
				this.navCtrl.pop();
			});	
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
			this.prev();
		} else if( $event.offsetDirection == 2 ){
			this.next();
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
				this.shooter.score = this.scoreCardService.CalculateStats( this.shooter.score );
				
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
				this.shooter.score = this.scoreCardService.CalculateStats( this.shooter.score );	
			});
			scoreModal.present();
		

		} else {
			this.common.ShowAlert( "Notice", "Score card is already complete." );
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

	GenerateShooterSightMarkData() {

		for( let shooter of this.shooters ) {
			for( let bow of shooter.bows ) {
				for( let sightMark of bow.sightMarks ) {
					this.sm_data[ shooter.name + "-" + sightMark.distance + "-" + sightMark.unit ] = this.sm_data[ shooter.name + "-" + sightMark.distance + "-" + sightMark.unit ] || [];
					this.sm_data[ shooter.name + "-" + sightMark.distance + "-" + sightMark.unit ].push( "<table class='bow-table'><tbody><tr><td colspan='2' class='bow-detail'>" + bow.name + "</td</tr><tr><td>Notch: </td><td>" + sightMark.notch + "</td></tr><tr><td>Position: </td><td>" + sightMark.position + "</td></tr><tr><td>Notes: </td><td>" + sightMark.note + "</td></tr></tbody></table>" ); 
				}
			}
		}
		
		console.log(this.sm_data);

	}

	ShowShooterSightMarks( target: TargetClass, shooter: ShooterClass ) {
		let key: string = shooter.name + "-" + target.distance + "-" + this.scoreCard.round.distance;
		if( this.sm_data[ key ] != undefined ) {
			this.common.ShowAlert( "Sight Marks", this.sm_data[ key ].join('<br>') );
		}
	}

	DoesHaveSightMarks( target: TargetClass, shooter: ShooterClass ) {
		let key: string = shooter.name + "-" + target.distance + "-" + this.scoreCard.round.distance;
		return this.sm_data[ key ] == undefined ? false: true;
	}

}
