import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ShooterClass } from '../../../models/shooter-class';
import { ScoreEndClass } from '../../../models/score-class';
import { ScoreCardService } from '../../../providers/score-card-service';

import { Const } from '../../../providers/constants';

import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-score-entry',
	templateUrl: 'score-entry.html',
})
export class ScoreEntryPage {

	shooter: ShooterClass;
	endScore: ScoreEndClass;
	arrows:number = 6;
	scoring: string[];

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public scoreCardService: ScoreCardService
			) {

		this.GetPassedData();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ScoreEntryPage');
	}

	GetPassedData() {
		if( this.navParams.get( 'arrows' ) != undefined ) {
			this.arrows = Number( this.navParams.get( 'arrows' ) );
		}
		if( this.navParams.get( 'end' ) != undefined ) {
			this.endScore = this.navParams.get( 'end' );
		}
		if( this.navParams.get( 'scoring' ) != undefined ) {
			this.scoring = this.navParams.get( 'scoring' ).split( ',' );
		}
	}

	AndroidBackButton() {
        this.Back();
	}
	
	Back() {
		this.endScore.end = this.scoreCardService.SortScores( this.endScore.end );
		this.viewCtrl.dismiss( this.endScore.end );
	}

	CanUse( score: string ) {
		return !_.contains( this.scoring, score );
	}

	AddScore( score: string ) {
		let arr: string[] = this.endScore.end.filter( v => v != Const.MISC.SCORE_END_EMPTY );
		if( arr.length < this.arrows ) {
			arr.push( score );
			for( let i = 1; i <= ( this.arrows - arr.length ); i++ ) {
				arr.push( Const.MISC.SCORE_END_EMPTY );
			}
		}
		this.endScore.end = arr; 
	}

	Clear() {
		this.endScore.end.pop();
	}

}
