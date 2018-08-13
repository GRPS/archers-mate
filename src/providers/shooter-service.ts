import { Injectable } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { ShooterClass } from '../models/shooter-class';

import * as _ from 'underscore';

@Injectable()
export class ShooterService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				public common: CommonProvider
				) {
		this.common.AddLog( 'ShooterService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
}

	LoadAll(): Observable<ShooterClass[]>  {
		return this.http.get <ShooterClass[]> ( Const.URL.SHOOTERS )
		// .do( this.common.HttpLogResponse )
		.catch( this.common.HttpCatchError );
	}

	GetDefault( shooters: ShooterClass[] ): ShooterClass {
		let shooter: ShooterClass = _.where( shooters, { isDefault: true } );
		return shooter[0];
	}

	Create() {
		this.navCtrl.push( Const.PAGES.SHOOTER_EDIT );
	}

	Read( shooter: ShooterClass ) {
		console.log( 'Read shooter' );	
	}

	Update( shooter: ShooterClass ) {
		this.navCtrl.push( Const.PAGES.SHOOTER_EDIT, { shooter: shooter } );	
	}

	Delete( shooter: ShooterClass ) {
		console.log( 'Delete shooter' );		
	}	

	Save( shooter: ShooterClass ): Promise<boolean> {
		return new Promise( resolve => {
			console.log( shooter );	
			if( 1 == 1 ) {
				resolve( true ); //Code has worked and we want to return a success to the caller.
			} else {
				resolve( false ); //Code has worked, but we want to return a fail to the caller.
			}
		});		
	}

}
