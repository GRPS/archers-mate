import { Injectable } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { BowClass } from '../models/bow-class';

@Injectable()
export class BowService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'BowService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

  	LoadAll(): Observable<BowClass[]>  {
		return this.http.get <BowClass[]> ( Const.URL.BOWS )
		// .do( this.common.HttpLogResponse )
		.map(bows => { return bows.map( bow => new BowClass( bow ) ); })
		.catch( this.common.HttpCatchError );
	}

	Create() {
		this.navCtrl.push( Const.PAGES.BOW_EDIT );
	}

	Update( bow: BowClass ) {
		this.navCtrl.push( Const.PAGES.BOW_EDIT, { bow: bow } );
	}

	Delete( bow: BowClass ) {
		return new Promise( resolve => {
			let newBows = Global.bows.filter( obj => obj !== bow );
    		Global.bows = newBows;
			resolve();	
		});	
	}	

	Save( bow: BowClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {

			if( isNew ) {
				bow.id = this.common.GetRandomNumber();
				Global.bows.push( bow );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( Global.bows, bow.id );
				Global.bows[ index ] = bow;
			}

			this.common.SaveToStorage( Const.LABEL.BOWS, Global.bows )
				.then( () => {
					resolve();
				});

		});		
	}
	
}
