import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScoreCardClass } from '../../../models/score-card-class';
import { CommonProvider } from '../../../providers/common-provider';
import { Const } from '../../../providers/constants';
import { Global } from '../../../providers/globals';
import { ScoreCardService } from '../../../providers/score-card-service';

@IonicPage()
@Component({
	selector: 'page-score-cards',
	templateUrl: 'score-cards.html',
})
export class ScoreCardsPage {

	scoreCards: ScoreCardClass[];
	scoreCardType: string = Const.SCORE_CARD_STATUS.ONGOING;
	countOngoing: number;
	countCompleted: number;
	countDeleted: number;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public scoreCardService: ScoreCardService
			) {
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ScoreCards';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.scoreCards = Global.scoreCards;
		
		this.scoreCardService.GetSegmentCounts()
			.then( counts => {
				this.countOngoing = counts[ 0 ];
				this.countCompleted = counts[ 1 ];
				this.countDeleted = counts[ 2 ];
			});		

	}

	Back() {
		this.navCtrl.pop();
	}

	UpdateScoreCard( scoreCard: ScoreCardClass ) {
		this.scoreCardService.Update( scoreCard );
	}

	DeleteScoreCard( slidingItem, scoreCard ) {
		this.scoreCardService.DeleteScoreCards( this.scoreCards, scoreCard )
			.then( scoreCards => {
				this.scoreCards = <ScoreCardClass[]> scoreCards;
				this.UpdateGlobal();

				slidingItem.close(); 

				this.common.ShowToastSuccess( 'Deleted!' );
			});
	}

	UpdateGlobal() {
		Global.scoreCards = this.scoreCards;
		this.Init();

		this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
			.then( () => {
				this.common.ShowToastSuccess( 'Saved!' );
			});
	}

}
