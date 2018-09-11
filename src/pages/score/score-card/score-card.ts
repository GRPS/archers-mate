import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { ScoreCardClass } from '../../../models/score-card-class';
import { ShooterClass } from '../../../models/shooter-class';
import { CommonProvider } from '../../../providers/common-provider';

import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-score-card',
	templateUrl: 'score-card.html',
})
export class ScoreCardPage {

	scoreCard: ScoreCardClass;

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
				public popoverCtrl: PopoverController,
				public common: CommonProvider
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
		} else {
			this.Back();
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

	Back() {
		this.navCtrl.pop();
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
	
}
