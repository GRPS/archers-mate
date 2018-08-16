import { ChangeDetectorRef, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
				private cdr: ChangeDetectorRef,
				public navCtrl: NavController, 
				public navParams: NavParams,
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
		this.cdr.detectChanges();
	}

	Back() {
		this.common.Back( Const.PAGES.HOME );
	}

}
