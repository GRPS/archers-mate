import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { CommonProvider } from '../../providers/common-provider';

// import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-stats',
	templateUrl: 'stats.html',
})
export class StatsPage {

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public common: CommonProvider
				) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'StatsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}
  
	Init() {
		// let scoreCards: ScoreCardClass = _.where( Global.scoreCards, {status: Const.SCORE_CARD_STATUS.COMPLETED } );
		// console.log( scoreCards );
		// let shooters: ShooterClass = _.pluck( scoreCards, 'shooters' );
		// console.log( shooters );
		// let shootersFlatten: ShooterClass = _.flatten( shooters, false );
		// console.log( shootersFlatten );
	}

  	Back() {
		this.navCtrl.pop();
	}

}
