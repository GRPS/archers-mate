import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { RoundClass } from '../models/round-class';

@Injectable()
export class RoundService {

	constructor(
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'RoundService loaded' );
	}

  	LoadAll(): Observable<RoundClass[]>  {
		return this.http.get <RoundClass[]> ( Const.URL.ROUNDS )
			// .do( this.common.HttpLogResponse )
			.catch( this.common.HttpCatchError );
	}

}
