import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
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
	}

	Back() {
		this.navCtrl.pop();
	}

	CreateBow() {
		this.bowService.Create();
	}

	UpdateBow( bow: BowClass) {
		this.bowService.Update( bow );
	}

	DeleteBow( slidingItem, bow: BowClass) {
		this.bowService.Delete( bow )
			.then( () => {
				slidingItem.close(); 
				this.Init();	
				
				this.common.SaveToStorage( Const.LABEL.BOWS, this.bows );

				this.common.ShowToastSuccess( 'Deleted!' );
			});
	}

	reorderItems( indexes ) {
		this.bows = this.common.reorderItems( this.bows, indexes );
	}

}
