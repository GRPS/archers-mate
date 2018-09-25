import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ShooterClass } from '../../../models/shooter-class';
import { CommonProvider } from '../../../providers/common-provider';

@IonicPage()
@Component({
	selector: 'page-shooter-popover',
	templateUrl: 'shooter-popover.html',
})
export class ShooterPopoverPage {

	shooters: ShooterClass[];
	selectedShooter: ShooterClass;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public viewCtrl: ViewController,
				public common: CommonProvider
			) {
		this.shooters = this.navParams.data.shooters;
		this.selectedShooter = this.navParams.data.selectedShooter;

		console.log(this.selectedShooter);
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ShooterPopoverPage');
	}

	close( shooter ) {
		this.viewCtrl.dismiss( shooter );
	}

	info( shooter ) {
		if( shooter.score.isComplete ) {
			this.common.ShowAlert( "Score Card Complete", "This score card is now complete." );
		}
	}

}
