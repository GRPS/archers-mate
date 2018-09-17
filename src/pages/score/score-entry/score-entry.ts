import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ShooterClass } from '../../../models/shooter-class';
import { TargetClass } from '../../../models/target-class';

@IonicPage()
@Component({
	selector: 'page-score-entry',
	templateUrl: 'score-entry.html',
})
export class ScoreEntryPage {

	shooter: ShooterClass;
	target: TargetClass;
	scores: string = "X,9,10,5,M,X";
	
	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController
			) {
	
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScoreEntryPage');
	}

	Back() {
		this.viewCtrl.dismiss( this.scores.split( ',' ) );
	}

}
