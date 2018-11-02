import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { Global } from '../../../providers/globals';
import { CommonProvider } from '../../../providers/common-provider';
import { StatsService } from '../../../providers/stats-service';
import { ScoreCardService } from '../../../providers/score-card-service';
import { StatDataClass } from '../../../models/stat-class';

import * as _ from 'underscore';
import { ScoreCardClass } from '../../../models/score-card-class';

@IonicPage()
@Component({
	selector: 'page-stats',
	templateUrl: 'stats.html',
})
export class StatsPage {

	dtFrom: string;
  	dtTo: string;

	data: StatDataClass[];
	dataCount: number = 0;

	showSection: string = null;
	showShooterSection: string = null;
	sortBy: string = 'name';
	sortByPrev: string = '';
	sortAsc: boolean = true;
	
	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public common: CommonProvider,
				public statsService: StatsService,
				public scoreCardService: ScoreCardService
				) {
		this.GetPassedParameters();
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'StatsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}
  
	GetPassedParameters() {
		if( this.navParams.get('data') == undefined ) {
			this.common.ShowAlert( "ERROR", "Cannot get date range!" );
			this.Back();
		}
		this.dtFrom = this.navParams.data.from;
		this.dtTo = this.navParams.data.to;
		this.data = this.navParams.data.data;
		this.dataCount = this.navParams.data.dataCount;
	}

	Init() {
	}

	AndroidBackButton() {
        this.Back();
    }
  	Back() {
		this.navCtrl.pop();
	}

	ShowSection( round ) {
		if( round == this.showSection ) {
			this.showSection = null;
		} else {
			this.showSection = round;
		}
	}

	ShowShooterSection( shooter ) {
		if( shooter == this.showShooterSection ) {
			this.showShooterSection = null;
		} else {
			this.showShooterSection = shooter;
		}
	}

	SortShootersBy( roundIndex: number, col: string) { 
		this.sortBy = col;
		if( col == 'best' || col == 'avg' ) {
			if( col == this.sortByPrev ) {
				this.data[ roundIndex ].data = _.sortBy( this.data[ roundIndex ].data, col );
				this.sortAsc = true;
				this.sortByPrev = '';
			} else {
				this.data[ roundIndex ].data = _.sortBy( this.data[ roundIndex ].data, col ).reverse();
				this.sortAsc = false;
				this.sortByPrev = col;
			}
		} else {
			if( col == this.sortByPrev ) {
				this.data[ roundIndex ].data = _.sortBy( this.data[ roundIndex ].data, col ).reverse();
				this.sortAsc = false;
				this.sortByPrev = '';
			} else {
				this.data[ roundIndex ].data = _.sortBy( this.data[ roundIndex ].data, col );
				this.sortAsc = true;
				this.sortByPrev = col;
			}
		}
		
	}

	OpenScoreCard( id: number ) {
		let scoreCard: ScoreCardClass = _.find( Global.scoreCards, function( obj ){ return obj.id == id; })
		this.scoreCardService.Update( scoreCard );
	}

	InformUser() {
		this.common.ShowToastSuccess( 'Long press to see the score card.' );
	}

}
