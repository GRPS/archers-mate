import { Injectable } from '@angular/core';
import { AlertController, App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

// import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { BowClass } from '../models/bow-class';

@Injectable()
export class ShooterBowService {

	navCtrl: NavController;
	callBack: any;

	constructor(
				public app: App,
				public alertCtrl: AlertController,
				public http: HttpClient,
				public common: CommonProvider
			) {
		this.common.AddLog( 'ShooterBowService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	CreateShooterBow( bows: BowClass[] ): Promise<BowClass[]> {
		return new Promise( resolve => {
			resolve( bows );
		});
	}

	DeleteShooterBow( bows: BowClass[], bow: BowClass): Promise<BowClass[]> {
		return new Promise( resolve => {
			let newBows = bows.filter( obj => obj !== bow );
			resolve( newBows );	
		});
	}

	GetBowByAlert( title: string, shooterBows: BowClass[] ): Promise<BowClass> {

		return new Promise( ( resolve, reject ) => {

			let bows: BowClass[] = Global.bows;

			let options = [];
			for( let bow of bows ) {
				let index = this.common.GetIndexOfObjectIdInArray( shooterBows, bow.id );
				if( index == -1 ) {
					options.push({
						type: 'radio',
						label: bow.name,
						value: bow.id
					});
				}
			}
			if( options.length == 0 ) {
				reject();
			} else {
				let alert = this.alertCtrl.create({
					title: title,
					inputs: options,
					buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						handler: data => {
							reject();
						}
					},
					{
						text: 'Select',
						handler: id => {
							let index: number = this.common.GetIndexOfObjectIdInArray( Global.bows, id );

							//Return a clone of the Global.bow else anything we do to it will effect the Global.bows too.
							resolve( <BowClass> Object.assign( {}, Global.bows[ index ] ) );
						}
					}
					]
				});
				alert.present();
			}

		});
	}

}
