import { Injectable } from '@angular/core';

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

	constructor(
				public http: HttpClient,
				public common: CommonProvider
				) {
	this.common.AddLog( 'ShooterService loaded' );
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


}
