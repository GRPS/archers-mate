import { Injectable } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Const } from './constants';
import { CommonProvider } from './common-provider';
import { RoundClass } from '../models/round-class';
import { TargetClass } from '../models/target-class';

@Injectable()
export class TargetService {

	navCtrl: NavController;
	callBack: any;

	constructor(
				public app: App,
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'TargetService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	Create( callBack: any,  targets: TargetClass[] )  {
		this.navCtrl.push( Const.PAGES.TARGET_EDIT, { callBack: callBack, targets: targets } );
	}

	Read( target: TargetClass ) {
		console.log( 'Read target' );	
	}

	Delete( targets: TargetClass[], target: TargetClass ): Promise<TargetClass[]> {
		return new Promise( resolve => {
			resolve( targets.filter( obj => obj !== target ) );
		});	
	}	

	Save( targets: TargetClass[], target: TargetClass, isNew: boolean ): Promise<TargetClass[]> {
		return new Promise( resolve => {
			if( isNew ) {
				target.id = this.common.GetRandomNumber();
				targets.push( target );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( targets, target.id );
				targets[ index ] = target;
			}

			resolve( targets );
		});		
	}

	CalculateValues( round: RoundClass, target: TargetClass ) {
		target.totalArrows = round.arrows * target.ends;
		target.maxScore = Number( round.scoring.split(',')[0] ) * target.totalArrows;
		return target;
	}

}
