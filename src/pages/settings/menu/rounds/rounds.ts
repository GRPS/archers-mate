import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { RoundClass } from '../../../../models/round-class';
import { RoundService } from '../../../../providers/round-service';

@IonicPage()
@Component({
	selector: 'page-rounds',
	templateUrl: 'rounds.html',
})
export class RoundsPage {

	rounds: RoundClass[];

	selectedType: string = '';
	selectedOrganisation: string = '';
	  selectedSeason: string = '';
	  rememberType: string = 'custom';

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public roundService: RoundService
				) {

	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'RoundsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.rounds = Global.rounds;
		this.selectedType = this.rememberType;
	}

	Back() {
		this.navCtrl.pop();
	}

	ShowSeason(organisation, season) {
		this.selectedOrganisation = organisation;
		this.selectedSeason = season;
	}

	CreateRound() {
		this.rememberType = this.selectedType;
		this.selectedType = '';
		this.roundService.Create( this.Init );
	}

	UpdateRound( round: RoundClass) {
		this.roundService.Update( round );
	}

	DeleteRound( slidingItem, round: RoundClass ) {
		this.roundService.Delete( round )
			.then( () => {
				this.rememberType = this.selectedType;
				slidingItem.close(); 
				this.Init();	
				
				this.common.SaveToStorage( Const.LABEL.ROUNDS, this.rounds )
					.then( () => {
						this.common.ShowToastSuccess( 'Deleted!' );
					});
			});
	}

	reorderItems( indexes ) {
		this.rounds = this.common.reorderItems( this.rounds, indexes ); 

		this.common.SaveToStorage( Const.LABEL.ROUNDS, this.rounds )
			.then( () => {
				this.common.ShowToastSuccess( 'Saved!' );
			});
	}

	info( round: RoundClass ) {
		if( round.targets.length == 0 ) { 
			this.common.ShowAlert( 'Warning', 'A round with no targets, cannot be played.' );
		}
	}

}
