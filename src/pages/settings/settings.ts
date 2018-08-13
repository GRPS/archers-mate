import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { CommonProvider } from '../../providers/common-provider';
import { ShooterClass } from '../../models/shooter-class';
import { ShooterService } from '../../providers/shooter-service';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {

	shooters: ShooterClass[];
	shooter: ShooterClass;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public shooterService: ShooterService
				) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'SettingsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );

		this.shooters = Global.shooters;
		this.shooter = Global.shooter;

		this.Init();
	}

	Init() {}

	Back() {
		this.common.Back( Const.PAGES.HOME );
	}

	CreateShooter() {
		this.shooterService.Create();
	}

	UpdateShooter( shooter: ShooterClass) {
		this.shooterService.Update( shooter );
	}

}
