import { ChangeDetectorRef, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { BowClass } from '../../../../models/bow-class';
import { BowService } from '../../../../providers/bow-service';

@IonicPage()
@Component({
	selector: 'page-bows',
	templateUrl: 'bows.html',
})
export class BowsPage {

	bows: BowClass[];

	constructor(
				private cdr: ChangeDetectorRef,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public bowService: BowService
				) {

	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'BowsPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.bows = Global.bows;
		this.cdr.detectChanges();
	}

	Back() {
		this.common.Back( Const.PAGES.HOME );
	}

}
