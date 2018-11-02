import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
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

	perPage: number = Const.MISC.MAX_SCORE_CARDS_BEFORE_WE_SHOW_LOADING_MESSAGE;
	currentPage: number = 1;
	canShowGetNext: boolean = true;

	isTablet: boolean = false;
	scoreCards: ScoreCardClass[];
	scoreCardType: string = Const.SCORE_CARD_STATUS.ONGOING;
	scoreCardOngoing: ScoreCardClass[];
	scoreCardCompleted: ScoreCardClass[];
	scoreCardArchived: ScoreCardClass[];
	countOngoing: number = 0;
	countCompleted: number = 0;
	countArchived: number = 0;
	count: number = 0;
	currentCount: number = 0;

	constructor(
				public loadingCtrl: LoadingController,
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
		
		this.isTablet = Const.IS_TABLET;

		this.scoreCardService.GetSegmentScoreCards()
			.then( scoreCards => {
				this.scoreCardOngoing = <ScoreCardClass[]> scoreCards[ 0 ];
				this.scoreCardCompleted = <ScoreCardClass[]> scoreCards[ 1 ];
				this.scoreCardArchived = <ScoreCardClass[]> scoreCards[ 2 ];

				this.countOngoing = this.scoreCardOngoing.length;
				this.countCompleted = this.scoreCardCompleted.length;
				this.countArchived = this.scoreCardArchived.length;

				this.PaginateScoreCards();

			});		

	}

	Back() {
		this.navCtrl.pop();
	}

	UpdateScoreCard( scoreCard: ScoreCardClass ) {
		this.scoreCardService.Update( scoreCard );
	}

	ArchiveScoreCard( slidingItem, scoreCard ) {
		this.scoreCardService.ArchiveScoreCards( Global.scoreCards, scoreCard )
			.then( scoreCards => {
				this.scoreCards = <ScoreCardClass[]> scoreCards;
				this.UpdateGlobal( false );
				slidingItem.close(); 
				this.common.ShowToastSuccess( 'Archived!' );
			});
	}

	UnarchiveScoreCard( slidingItem, scoreCard ) {
		this.scoreCardService.UnarchiveScoreCards( Global.scoreCards, scoreCard )
			.then( scoreCards => {
				this.scoreCards = <ScoreCardClass[]> scoreCards;
				this.UpdateGlobal( false );
				slidingItem.close(); 
				this.common.ShowToastSuccess( 'Unarchived!' );
			});
	}

	DeleteScoreCard( slidingItem, scoreCard ) {
		this.common.ConfirmUser( 'Delete Score Card', 'Are you sure?', 'No', 'Yes' )
			.then( result => {
				if( result ) {
					this.scoreCardService.DeleteScoreCards( Global.scoreCards, scoreCard )
						.then( scoreCards => {
							this.scoreCards = <ScoreCardClass[]> scoreCards;
							this.UpdateGlobal( false );
							slidingItem.close(); 
							this.common.ShowToastSuccess( 'Deleted!' );
						});
				} else {
					slidingItem.close(); 				
				}
			});
	}

	UpdateGlobal( showSave: boolean = true ) {
		Global.scoreCards = this.scoreCards;
		this.Init();

		this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
			.then( () => {
				if( showSave ) {
					this.common.ShowToastSuccess( 'Saved!' );
				}
			});
	}

	ScoreCardTypeChange() {
		this.currentPage = 1;
		this.PaginateScoreCards();
	}

	PaginateScoreCards() {

		let toLoad: number = this.perPage * this.currentPage;

		switch ( this.scoreCardType ) {
			case Const.SCORE_CARD_STATUS.ONGOING:
				this.count = this.countOngoing;
				this.scoreCards =  this.scoreCardOngoing.slice( 0, this.CheckMax( toLoad, this.countOngoing ) );
				break;
			case Const.SCORE_CARD_STATUS.COMPLETED:
				this.count = this.countCompleted;
				this.scoreCards =  this.scoreCardCompleted.slice( 0, this.CheckMax( toLoad, this.countCompleted ) );
				break;
			case Const.SCORE_CARD_STATUS.ARCHIVED:
				this.count = this.countArchived;
				this.scoreCards =  this.scoreCardArchived.slice( 0, this.CheckMax( toLoad, this.countArchived ) );	
				break;
		}

	}

	CheckMax( toLoad: number, total: number ) {
		if( toLoad >= total ) {
			this.canShowGetNext = false;
			this.currentCount = total;
			return total;
		} else {
			this.canShowGetNext = true;
			this.currentCount = toLoad;
			return toLoad;
		}
	}

	GetNext() {
		this.currentPage++;
		this.PaginateScoreCards();
	}

}
