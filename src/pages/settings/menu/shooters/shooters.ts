import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { ShooterClass } from '../../../../models/shooter-class';
import { ShooterService } from '../../../../providers/shooter-service';

@IonicPage()
@Component({
	selector: 'page-shooters',
	templateUrl: 'shooters.html',
})
export class ShootersPage {

	shooters: ShooterClass[];
	shooter: ShooterClass;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public shooterService: ShooterService
				) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ShootersPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.shooters = Global.shooters;
		this.shooter = Global.shooter;
	}

	Back() {
		this.navCtrl.pop();
	}

	CreateShooter() {
		this.shooterService.Create();
	}

	UpdateShooter( shooter: ShooterClass ) {
		this.shooterService.Update( shooter );
	}

	DeleteShooter( slidingItem, shooter: ShooterClass ) {
		this.shooterService.Delete( shooter )
			.then( () => {
				slidingItem.close(); 
				this.Init();

				this.common.ShowToastSuccess( 'Deleted!' );
			});
	}

	reorderItems( indexes ) {
		this.shooters = this.common.reorderItems( this.shooters, indexes );
	}

}
