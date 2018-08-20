import { Injectable } from '@angular/core';
import { App, ModalController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { BowClass } from '../models/bow-class';

import * as _ from 'underscore';

@Injectable()
export class BowService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				private modalCtrl: ModalController,
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

	Read( bow: BowClass ) {
		console.log( 'Read bow' );	
	}

	Update( bow: BowClass ) {
		let modal = this.modalCtrl.create( Const.PAGES.BOW_EDIT, { bow: bow } );
		modal.onDidDismiss( bow => {
			if( !bow ) {
				console.log('cancel');				
			} else {
				console.log(bow);				
			}
		});
		modal.present();	
	}

	Delete( bow: BowClass ) {
		return new Promise( resolve => {
			let newCodes = Global.bows.filter( obj => obj !== bow );
    		Global.bows = newCodes;
			resolve( true );	
		});	
	}	

	Save( bow: BowClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {
			console.log( bow );	

			if( isNew ) {
				bow.id = this.common.GetRandomNumber();
				Global.bows.push( bow );
			} else {
				let index: number = _.findIndex( Global.bows, { id: bow.id } );
				Global.bows[ index ] = bow;
			}

			console.log(Global);
			
			if( 1 == 1 ) {
				resolve( true ); //Code has worked and we want to return a success to the caller.
			} else {
				resolve( false ); //Code has worked, but we want to return a fail to the caller.
			}
		});		
	}

}
