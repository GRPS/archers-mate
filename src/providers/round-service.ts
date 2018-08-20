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
import { RoundClass } from '../models/round-class';
import { TargetClass } from '../models/target-class';

import * as _ from 'underscore';

@Injectable()
export class RoundService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				private modalCtrl: ModalController,
				public common: CommonProvider
			) {
		this.common.AddLog( 'RoundService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

  	LoadAll(): Observable<RoundClass[]>  {
		return this.http.get <RoundClass[]> ( Const.URL.ROUNDS )
			// .do( this.common.HttpLogResponse )
			.map( rounds => { return rounds.map( round => new RoundClass( round ) ); })
			.map( rounds => {
				let mewRounds: RoundClass[] = [];
				for( let round of rounds ) {
					let newTargets: TargetClass[] = [];
					for( let target of round.targets ) {
						newTargets.push( new TargetClass( target ) );
					}
					round.targets = newTargets;
					mewRounds.push( round );
				}				
				return mewRounds; 
			})
			.catch( this.common.HttpCatchError );
	}

	Create() {
		this.navCtrl.push( Const.PAGES.ROUND_EDIT );
	}

	Read( round: RoundClass ) {
		console.log( 'Read bow' );	
	}

	Update( round: RoundClass ) {
		let modal = this.modalCtrl.create( Const.PAGES.ROUND_EDIT, { round: round } );
		modal.onDidDismiss( round => {
			if( !round ) {
				console.log('cancel');				
			} else {
				console.log(round);				
			}
		});
		modal.present();
	}

	Delete( round: RoundClass ) {
		return new Promise( resolve => {
			let newCodes = Global.rounds.filter( obj => obj !== round );
    		Global.rounds = newCodes;
			resolve( true );	
		});	
	}	

	Save( round: RoundClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {
			console.log( round );	

			if( isNew ) {
				round.id = this.common.GetRandomNumber();
				Global.rounds.push( round );
			} else {
				let index: number = _.findIndex( Global.rounds, { id: round.id } );
				Global.rounds[ index ] = round;
			}

			if( 1 == 1 ) {
				resolve( true ); //Code has worked and we want to return a success to the caller.
			} else {
				resolve( false ); //Code has worked, but we want to return a fail to the caller.
			}
		});		
	}

}
