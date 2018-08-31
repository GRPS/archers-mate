import { Component } from '@angular/core';
import { ActionSheetController , IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { CommonProvider } from '../../providers/common-provider';
import { BowService } from '../../providers/bow-service';
import { RoundService } from '../../providers/round-service';
import { ShooterService } from '../../providers/shooter-service';
import { RoundClass } from '../../models/round-class';
import { BowClass } from '../../models/bow-class';
import { ShooterClass } from '../../models/shooter-class';

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
				private actionCtrl: ActionSheetController,
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

			this.common.GetFromStorage( 'bows' )
					.then( res => {
						if( res == null ) {
							this.bowService.LoadAll()
								.subscribe( (bows) => {								
									Global.bows = bows;
									this.common.SaveToStorage( 'bows', Global.bows );
									this.haveLoadedBows = true;
									this.CheckIfReadyNow();
								}),
								err => this.common.AddWarning( err );
						} else {							
							let newBows: BowClass[] = [];
							for( let bow of res ) {
								newBows.push( new BowClass( bow ) );
							}
							Global.bows = newBows;		
							this.haveLoadedBows = true;
							this.CheckIfReadyNow();			
						}
					});

				this.common.GetFromStorage( 'rounds' )
					.then( res => {
						if( res == null ) {
							this.roundService.LoadAll()
								.subscribe( (rounds) => {
									let newRounds: RoundClass[] = [];
									for( let round of rounds ) {
										newRounds.push( this.roundService.CalculateValues( round ) );
									}
									Global.rounds = newRounds;
									this.common.SaveToStorage( 'rounds', Global.rounds );
									this.haveLoadedRounds = true;
									this.CheckIfReadyNow();
								}),
								err => this.common.AddWarning( err );
						} else {							
							let newRounds: RoundClass[] = [];
							for( let round of res ) {
								newRounds.push( new RoundClass( round ) );
							}
							Global.rounds = newRounds;		
							this.haveLoadedRounds = true;
							this.CheckIfReadyNow();			
						}
					});

				this.common.GetFromStorage( 'shooters' )
					.then( res => {
						if( res == null ) {
							this.shooterService.LoadAll()
								.subscribe( (shooters) => {
									Global.shooters = shooters;
									Global.shooter = this.shooterService.GetDefault( shooters );
									
									this.common.SaveToStorage( 'shooters', Global.shooters );
									this.haveLoadedShooters = true;
									this.CheckIfReadyNow();				
								}),
								err => this.common.AddWarning( err );
						} else {								
							let newShooters: ShooterClass[] = [];
							for( let shooter of res ) {
								newShooters.push( new ShooterClass( shooter ) );
							}
							Global.shooters = newShooters;		
							Global.shooter = this.shooterService.GetDefault( Global.shooters );

							this.haveLoadedShooters = true;
							this.CheckIfReadyNow();			
						}
					});

		} else {
						
		}

		console.log( JSON.stringify( Global ) ); 
		
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

	GotoSettings() {
		this.actionCtrl.create({
			title: "Settings",
			buttons: [
			  {
				text: 'General',
				handler: () => {
				  this.LoadSettings( Const.PAGES.SETTINGS.GENERAL );
				}
			  },
			  {
				text: 'Shooters',
				handler: () => {
				  this.LoadSettings( Const.PAGES.SETTINGS.SHOOTERS );
				}
			  },
			  {
				text: 'Bows',
				handler: () => {
				  this.LoadSettings( Const.PAGES.SETTINGS.BOWS );
				}
			  },
			  {
				text: 'Rounds',
				handler: () => {
				  this.LoadSettings( Const.PAGES.SETTINGS.ROUNDS );
				}
			  },
			  {
				text: 'About',
				handler: () => {
				  this.LoadSettings( Const.PAGES.SETTINGS.ABOUT );
				}
			  },
			  {
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
				  // console.log('Cancel clicked');
				}
			  }
			]
		  }).present();
	}

	LoadSettings( page: string ) {
		this.navCtrl.push( page );
	}

}