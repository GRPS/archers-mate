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
		.map(shooters => { return shooters.map( shooter => new ShooterClass( shooter ) ); })
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

	Save( shooter: ShooterClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {
			console.log( shooter );	

			if( isNew ) {
				shooter.id = this.common.GetRandomNumber();
				Global.shooters.push( shooter );
			} else {
				let index: number = _.findIndex( Global.shooters, { id: shooter.id } );
				Global.shooters[ index ] = shooter;
				if( shooter.isDefault ) {
					Global.shooter = shooter;
				}
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
