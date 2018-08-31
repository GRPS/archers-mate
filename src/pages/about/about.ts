import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { CommonProvider } from '../../providers/common-provider';
import { AppClass } from '../../models/app-class';

@IonicPage()
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {

	app: AppClass;
	global: string;

	constructor(
				public clipboard: Clipboard,
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public common: CommonProvider,
				) {
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'AboutPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.common.GetApp()
            .then( app => {
			  this.app = app;
			  this.global = JSON.stringify( Global );	
			  	  
			});
	}

	Back() {
		this.navCtrl.pop();
	}
  
	ExportToClipboard() {
		this.clipboard.copy( this.global );	
		this.common.ShowToastSuccess( 'Clipboard updated.', true );
	}

}
