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
	}

	Back() {
		this.navCtrl.pop();
	}

	CreateRound() {
		this.roundService.Create();
	}

	UpdateRound( round: RoundClass) {
		this.roundService.Update( round );
	}

	DeleteRound( slidingItem, round: RoundClass ) {
		this.roundService.Delete( round )
			.then( () => {
				slidingItem.close(); 
				this.Init();	
				
				this.common.SaveToStorage( Const.LABEL.ROUNDS, this.rounds );

				this.common.ShowToastSuccess( 'Deleted!' );
			});
	}

	reorderItems( indexes ) {
		this.rounds = this.common.reorderItems( this.rounds, indexes ); 
	}

}
