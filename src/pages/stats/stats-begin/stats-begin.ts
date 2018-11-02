import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../providers/constants';
import { CommonProvider } from '../../../providers/common-provider';
import { StatsService } from '../../../providers/stats-service';
import { StatClass } from '../../../models/stat-class';
import { ScoreCardClass } from '../../../models/score-card-class';

@IonicPage()
@Component({
  selector: 'page-stats-begin',
  templateUrl: 'stats-begin.html',
})
export class StatsBeginPage {

  loading;

  dtFrom: string;
  dtTo: string;
  dtMin: string;
  dtMax: string;
 
  constructor(
              public loadingCtrl: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public common: CommonProvider,
              public statsService: StatsService,
              ) {
  }

  ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'StatsBeginPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

  Init() {
    let dt = new Date();
    this.dtMax = dt.getFullYear().toString();
    this.dtTo = dt.toISOString();
    dt.setMonth( dt.getMonth() - 6 );
    this.dtFrom = dt.toISOString();
    dt = new Date( Const.MISC.MIN_DATE ); 
    this.dtMin = dt.getFullYear().toString();
  }

  Back() {
		this.navCtrl.pop();
  }
  
  ByRound() {
    this.loading = this.loadingCtrl.create({
			dismissOnPageChange: true,
			content: 'Preparing ...'
		});
		
    this.loading.present();
    
    let scoreCards: ScoreCardClass[] = this.statsService.GetScoreCards( this.dtFrom, this.dtTo );
    let stats: StatClass[] = this.statsService.ConvertScoreCardsToStats( scoreCards );
		this.navCtrl.push( Const.PAGES.STATS, { from: this.dtFrom, to: this.dtTo, dataCount: scoreCards.length , data: this.statsService.GetDataByRound( stats ) } );
  }

}
