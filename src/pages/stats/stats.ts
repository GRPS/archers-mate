import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { CommonProvider } from '../../providers/common-provider';

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
	}
  
  	Back() {
		this.navCtrl.pop();
	}

}
