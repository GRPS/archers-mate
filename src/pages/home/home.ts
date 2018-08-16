import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { CommonProvider } from '../../providers/common-provider';
import { BowService } from '../../providers/bow-service';
import { RoundService } from '../../providers/round-service';
import { ShooterService } from '../../providers/shooter-service';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {

  	loading;
	haveLoadedBows: boolean = false;
	haveLoadedRounds: boolean = false;
	haveLoadedShooters: boolean = false;

	constructor(
				public navCtrl: NavController, 
				public loadingCtrl: LoadingController,
				public navParams: NavParams,
				public common: CommonProvider,
				public bowService: BowService,
				public roundService: RoundService,
				public shooterService: ShooterService
				) {
		
	}

  	//Do once when page first loads.
	ionViewDidLoad() {}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'HomePage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	//Do after page becomes active.
	ionViewDidEnter() {}

	//Do before page leaves.
	ionViewWillLeave() {}

	//Do after page leaves.
	ionViewDidLeave() {}

	//Do when page completely removed.
	ionViewWillUnload() {}
	
	Init() {

		//Load data if required.
		if( Global.bows == null || Global.rounds == null || Global.shooters == null ) {

			this.loading = this.loadingCtrl.create({
				content: 'Initializing ...'
			});
			
			this.loading.present();

			if( Global.bows == null ) {
				this.bowService.LoadAll()
					.subscribe( (bows) => {
						Global.bows = bows;
						this.haveLoadedBows = true;
						this.CheckIfReadyNow();
					}),
					err => this.common.AddWarning( err );
			}

			if( Global.rounds == null ) {
				this.roundService.LoadAll()
					.subscribe( (rounds) => {
						Global.rounds = rounds;
						this.haveLoadedRounds = true;
						this.CheckIfReadyNow();
					}),
					err => this.common.AddWarning( err );
			}

			if( Global.shooters == null ) {
				this.shooterService.LoadAll()
					.subscribe( (shooters) => {

						Global.shooters = shooters;
						Global.shooter = this.shooterService.GetDefault( shooters );
						
						this.haveLoadedShooters = true;
						this.CheckIfReadyNow();				
					}),
					err => this.common.AddWarning( err );
			}

		}

	}

	CheckIfReadyNow() {
		if( this.haveLoadedRounds && this.haveLoadedBows && this.haveLoadedShooters ) {
			this.loading.dismiss();
			this.common.AddLog( Global );      
		}
	}

	GotoScore() {
		// this.navCtrl.push( ScorePage );
	}

	GotoHistory() {
		// this.navCtrl.push( HistoryPage );
	}

	GotoSettings( page: string ) {
		switch( page ) {
			case "general":
				this.navCtrl.push( Const.PAGES.SETTINGS.GENERAL );
				break;
			case "shooters":
				this.navCtrl.push( Const.PAGES.SETTINGS.SHOOTERS );
				break;
			case "bows":
				this.navCtrl.push( Const.PAGES.SETTINGS.BOWS );
				break;
			case "rounds":
				this.navCtrl.push( Const.PAGES.SETTINGS.ROUNDS );
				break;
		}
	}

}