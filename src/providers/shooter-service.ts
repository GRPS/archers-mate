import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { ShooterClass } from '../models/shooter-class';

@Injectable()
export class ShooterService {

  constructor(
    public http: HttpClient,
    public common: CommonProvider
  ) {
console.log( 'BowService loaded' );
}

LoadAll(): Observable<ShooterClass[]>  {
return this.http.get( Const.URL.SHOOTERS )
  .do( this.common.HttpLogResponse )
  .map( shooter => { return new ShooterClass( shooter ); } )
  .catch( this.common.HttpCatchError );
}

}