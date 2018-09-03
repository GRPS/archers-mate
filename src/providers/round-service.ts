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
import { RoundClass } from '../models/round-class';
import { TargetClass } from '../models/target-class';
import { TargetService } from './target-service';

@Injectable()
export class RoundService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public http: HttpClient,
				public common: CommonProvider,
				public targetService: TargetService
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

	Create( callBack ) {
		this.navCtrl.push( Const.PAGES.ROUND_EDIT, { callBack: callBack } );
	}

	Update( round: RoundClass ) {
		this.navCtrl.push( Const.PAGES.ROUND_EDIT, { round: round } );
	}

	Delete( round: RoundClass ) {
		return new Promise( resolve => {
			let newCodes = Global.rounds.filter( obj => obj !== round );
    		Global.rounds = newCodes;
			resolve();	
		});	
	}	

	Save( round: RoundClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {

			if( isNew ) {
				round.id = this.common.GetRandomNumber();
				Global.rounds.push( round );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( Global.rounds, round.id );
				Global.rounds[ index ] = round;
			}

			this.common.SaveToStorage( Const.LABEL.ROUNDS, Global.rounds )
				.then( () => {
					resolve();
				});

		});		
	}

	CalculateValues( round: RoundClass ) {
		let maxScore: number = 0;
		let maxEnds: number = 0;
		let maxArrows: number = 0;

		let targets: TargetClass[] = [];
		for( let target of round.targets ) {
			target = this.targetService.CalculateValues( round, target );
			targets.push( target );
			maxScore += Number( target.maxScore );
			maxEnds += Number( target.ends );
			maxArrows += Number( target.totalArrows );
		}
		round.targets = targets;
		round.maxScore = maxScore;
		round.maxEnds = maxEnds;
		round.maxArrows = maxArrows;
		return round;
	}

}
