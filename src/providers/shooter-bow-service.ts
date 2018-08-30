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
/*
	Create( callBack: any,  bows: BowClass[] )  {
		this.navCtrl.push( Const.PAGES.BOW_EDIT, { callBack: callBack, bows: bows } );
	}

	Read( bow: BowClass ) {
		console.log( 'Read bow' );	
	}

	Update( bows: BowClass[], bow: BowClass ) : Promise<BowClass[]> {		
		return new Promise( resolve => {
			let modal = this.modalCtrl.create( Const.PAGES.BOW_EDIT, { bows: bows, bow: bow } );
			modal.onDidDismiss( bow => {
				if( !bow ) {
					console.log('cancel');		// Return the passed in targets as nothing has changed.	
					resolve( bows );		
				} else {
					console.log(bow);		//Find the passed target in the passed tasrgets and update it with our modified target.
					let index: number = this.common.GetIndexOfObjectIdInArray( bows, bow.id );
					bows[ index ] = bow;
					resolve( bows );		
				}
			});
			modal.present();	
		});	
	}

	Delete( bows: BowClass[], bow: BowClass ): Promise<BowClass[]> {
		return new Promise( resolve => {
			resolve( bows.filter( obj => obj !== bow ) );
		});	
	}	

	Save( bows: BowClass[], bow: BowClass, isNew: boolean ): Promise<BowClass[]> {
		return new Promise( resolve => {
			if( isNew ) {
				bow.id = this.common.GetRandomNumber();
				bows.push( bow );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( bows, bow.id );
				bows[ index ] = bow;
			}

			resolve( bows );
		});		
	}
*/
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
				reject( false );
			} else {
				let alert = this.alertCtrl.create({
					title: title,
					inputs: options,
					buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						handler: data => {
							reject( false );
						}
					},
					{
						text: 'Select',
						handler: id => {
							let index: number = this.common.GetIndexOfObjectIdInArray( Global.bows, id );
							let a: BowClass = Global.bows[ index ];
							resolve( a );
						}
					}
					]
				});
				alert.present();
			}

		});
	}

}
