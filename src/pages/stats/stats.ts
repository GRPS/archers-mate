import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../providers/constants';
import { CommonProvider } from '../../providers/common-provider';
import { StatsService } from '../../providers/stats-service';
import { StatClass, StatDataClass } from '../../models/stat-class';

// import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-stats',
	templateUrl: 'stats.html',
})
export class StatsPage {

	data: StatClass[];
	dataByRound: StatDataClass[];
	showSection: string = null;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public common: CommonProvider,
				public statsService: StatsService
				) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'StatsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}
  
	Init() {
		this.data = this.statsService.GetData();
		this.dataByRound = this.statsService.GetDataByRound( this.data );
	}

  	Back() {
		this.navCtrl.pop();
	}

	ShowSection( name ) {
		if( name == this.showSection ) {
			this.showSection = null;
		} else {
			this.showSection = name;
		}
	}

}
