import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { BowClass } from '../models/bow-class';

@Injectable()
export class BowService {

	constructor(
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'BowService loaded' );
	}

  	LoadAll(): Observable<BowClass[]>  {
		return this.http.get( Const.URL.BOWS )
			// .do( this.common.HttpLogResponse )
			.map( bow => { return new BowClass( bow ); } )
			.catch( this.common.HttpCatchError );
	}

}
