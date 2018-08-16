import { Component, Input } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import {Const } from '../../providers/constants';

@Component({
	selector: 'setting-footer',
	templateUrl: 'setting-footer.html'
})
export class SettingFooterComponent {

	@Input() active: string;
	  
	navCtrl: NavController;

	constructor(
				public app: App
				) {
		this.navCtrl = app.getActiveNavs()[0];
	}

	GotoPage( page: string ) {
		switch( page ) {
			case "general":
				this.navCtrl.push( Const.PAGES.SETTINGS.GENERAL );
				break;
			case "shooters":
				this.navCtrl.push( Const.PAGES.SETTINGS.SHOOTERS );
				break;
			case "bows":
				this.navCtrl.push( Const.PAGES.SETTINGS.BOWS );
				break;
			case "rounds":
				this.navCtrl.push( Const.PAGES.SETTINGS.ROUNDS );
				break;
		}
	}

}
