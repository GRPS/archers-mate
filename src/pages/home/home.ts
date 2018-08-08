import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

	loading;
	haveLoadedRounds: boolean = false;
	haveLoadedBows: boolean = false;

	constructor(
				public navCtrl: NavController, 
				public loadingCtrl: LoadingController,
				public navParams: NavParams
				) {

		this.loading = this.loadingCtrl.create({
			content: 'Please data ...'
		});
		
	}

	//Do once when page first loads.
	ionViewDidLoad() {
		Const.MISC.CURRENT_PAGE = 'HomePage';
		console.log( Const.MISC.CURRENT_PAGE + ': ionViewWillEnter' );
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
