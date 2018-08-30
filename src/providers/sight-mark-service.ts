import { Injectable } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

// import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { SightMarkClass } from '../models/sight-mark-class';

@Injectable()
export class SightMarkService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'SightMarkService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	Delete( sightmarks: SightMarkClass[], sightmark: SightMarkClass ): Promise<SightMarkClass[]> {
		return new Promise( resolve => {
			resolve( sightmarks.filter( obj => obj !== sightmark ) );
		});	
	}	

	Save( sightmarks: SightMarkClass[], sightmark: SightMarkClass, isNew: boolean ): Promise<SightMarkClass[]> {
		return new Promise( resolve => {
			if( isNew ) {
				sightmark.id = this.common.GetRandomNumber();
				sightmarks.push( sightmark );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( sightmarks, sightmark.id );
				sightmarks[ index ] = sightmark;
			}

			resolve( sightmarks );
		});		
	}

}
