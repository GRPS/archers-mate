import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { CommonProvider } from '../../../providers/common-provider';

@IonicPage()
@Component({
	selector: 'page-rounds',
	templateUrl: 'rounds.html',
})
export class RoundsPage {

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				) {

	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'RoundsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	Back() {
		this.common.Back( Const.PAGES.HOME, true );
	}

}
