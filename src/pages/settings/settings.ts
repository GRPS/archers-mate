import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { CommonProvider } from '../../providers/common-provider';
import { ShooterClass } from '../../models/shooter-class';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {

	shooter: ShooterClass;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider
				) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'SettingsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );

		this.shooter = Global.shooter;
		this.Init();
	}

	Init() {}

	Back() {
		this.common.Back( Const.PAGES.HOME );
	}

}
