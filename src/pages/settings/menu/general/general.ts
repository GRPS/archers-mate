import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { SettingClass } from '../../../../models/setting-class';

@IonicPage()
@Component({
	selector: 'page-general',
	templateUrl: 'general.html',
})
export class GeneralPage {

	setting: SettingClass;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				) {
		this.setting = Global.setting;
		
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'GeneralPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );		
	}

	ionViewWillLeave() {
		this.common.SaveToStorage( Const.LABEL.SETTINGS, Global.setting )
			.then( () => {});	
	}

	Back() {
		this.navCtrl.pop();
	}

}
