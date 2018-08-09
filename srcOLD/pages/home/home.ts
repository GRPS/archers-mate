import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

// import { Const } from '../../providers/constants';
// import { BowService } from '../../providers/bow-service';
// import { RoundService } from '../../providers/round-service';
// import { Global } from '../../providers/globals';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	loading;
	haveLoadedBows: boolean = false;
	haveLoadedRounds: boolean = false;

	constructor(
				public navCtrl: NavController, 
				public loadingCtrl: LoadingController,
				public navParams: NavParams,
				// public bowService: BowService,
				// public roundService: RoundService,
				) {

		this.loading = this.loadingCtrl.create({
			content: 'Initializing ...'
		});
		
	}

	//Do once when page first loads.
	ionViewDidLoad() {
		// Const.MISC.CURRENT_PAGE = 'HomePage';
		// console.log( Const.MISC.CURRENT_PAGE + ': ionViewWillEnter' );
		// this.Init();
	}

	//Do before page becomes active.
	ionViewWillEnter() {}

	//Do after page becomes active.
	ionViewDidEnter() {}

	//Do before page leaves.
	ionViewWillLeave() {}

	//Do after page leaves.
	ionViewDidLeave() {}

	//Do when page completely removed.
	ionViewWillUnload() {}
	
	// Init() {

	// 	this.loading.present();

	// 	this.bowService.LoadAll()
	// 		.subscribe( bows => Global.bows = bows )
	// 		,err => console.warn( err ),
	// 		() => {
	// 			this.haveLoadedBows = true;
	// 			this.CheckIfReadyNow();
	// 		}

	// 	this.roundService.LoadAll()
	// 		.subscribe( rounds => Global.rounds = rounds )
	// 		,err => console.warn( err ),
	// 		() => {
	// 			this.haveLoadedRounds = true;
	// 			this.CheckIfReadyNow();
	// 		}
	// }

	// CheckIfReadyNow() {
	// 	if( this.haveLoadedRounds && this.haveLoadedBows ) {
	// 		this.loading.dismiss();
	// 	}
	// }

	gotoScore() {
		// this.navCtrl.push( ScorePage );
	}

	gotoHistory() {
		// this.navCtrl.push( HistoryPage );
	}

	gotoSettings() {
		// this.navCtrl.push( SettingsPage );
	}

}
