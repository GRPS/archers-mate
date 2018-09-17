import { Injectable } from '@angular/core';
import { AlertController, App, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Const } from './constants';
import { Global } from './globals';
import { CommonProvider } from './common-provider';
import { ShooterClass } from '../models/shooter-class';
import { ScoreCardClass } from '../models/score-card-class';
import { ShooterService } from '../providers/shooter-service';

import * as _ from 'underscore';

@Injectable()
export class ScoreCardService {

	navCtrl: NavController;

	constructor(
				public app: App,
				public alertCtrl: AlertController,
				public http: HttpClient,
				public common: CommonProvider,
				public shooterService: ShooterService
				) {
		this.common.AddLog( 'ShooterService loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	DeleteScoreCardShooter( shooters: ShooterClass[], shooter: ShooterClass ) {
		return new Promise( resolve => {
			resolve( shooters.filter( obj => obj !== shooter ) );
		});	
	}	

	Update( scoreCard: ScoreCardClass ) {
		this.navCtrl.push( Const.PAGES.SCORE_CARD_SETUP, { scoreCard: scoreCard } );
	}

	DeleteScoreCards( scoreCards: ScoreCardClass[], scoreCard: ScoreCardClass ) {
		return new Promise( resolve => {
			if( scoreCard.status == Const.SCORE_CARD_STATUS.DELETED ) {
				let newScoreCards: ScoreCardClass[] = _.filter( scoreCards, function( obj ) { return obj != scoreCard });
				scoreCards = newScoreCards;
			} else {
				let index = _.findIndex( scoreCards, { id: scoreCard.id } );
				scoreCards[ index ].status = Const.SCORE_CARD_STATUS.DELETED;				
			}
			resolve( scoreCards );
		});
	}

	Save( scoreCard: ScoreCardClass, isNew: boolean ): Promise<boolean> {
		return new Promise( resolve => {

			if( isNew ) {
				scoreCard.id = this.common.GetRandomNumber();
				Global.scoreCards.push( scoreCard );
			} else {
				let index: number = this.common.GetIndexOfObjectIdInArray( Global.scoreCards, scoreCard.id );
				if( index == -1 ) {
					Global.scoreCards.push( scoreCard );
				} else {
					Global.scoreCards[ index ] = scoreCard;
				}
			}

			this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
				.then( () => {
					resolve();
				});

		});		
	}

	GetGuest( shooters: ShooterClass[] ): Promise<ShooterClass> {		
		return new Promise( resolve => {

			let nextNumber: number = 1;
			let newNumber: number = 1;

			for( let shooter of shooters ) {
				if( shooter.name.indexOf( 'Guest ' ) > -1 ) {
					newNumber = Number( shooter.initials.replace('G', '') ) + 1;
					if( newNumber > nextNumber ) {
						nextNumber = newNumber;
					}
				}
			}
			
			resolve( new ShooterClass({
				id: this.common.GetRandomNumber(),
				name: 'Guest ' + nextNumber,
				initials: 'G' + nextNumber,
				generder: 'male',
				age: 21,
				isDefault: false,
				bows: [],
				score: null
			}));
		});
	}

	GetShooter( leftOvers: any[] ): Promise<ShooterClass[]> {
		return new Promise( ( resolve, reject ) => {

			let alert = this.alertCtrl.create({
				title: 'Shooters',
				inputs: leftOvers,
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
						handler: ids => {

							let shooters: ShooterClass[] = _.filter( Global.shooters, function( shooter: ShooterClass) {
								let found = _.contains( ids, shooter.id );
								if ( found ) {
									return Object.assign( {}, shooter );
								}
							});

							//Return a clone of the Global.bow else anything we do to it will effect the Global.bows too.
							resolve( <ShooterClass[]> shooters );
						}
					}
				]
				});
				alert.present();
			});

	}

	GetUnselectedShooters( shooters: ShooterClass[] ): Promise<any[]> {
		return new Promise( ( resolve, reject ) => {
			let leftOvers = [];
			for( let shooter of Global.shooters ) {
				let index = this.common.GetIndexOfObjectIdInArray( shooters, shooter.id );
				if( index == -1 ) {
					leftOvers.push({
						type: 'checkbox',
						label: shooter.name,
						value: shooter.id
					});
				}
			}
			resolve( leftOvers );
		});
	}
	
	GetSegmentCounts(): Promise<number[]> {
		return new Promise( ( resolve, reject ) => {
			resolve( [
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.ONGOING } ).length,
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.COMPLETED } ).length,
				_.filter( Global.scoreCards, { status: Const.SCORE_CARD_STATUS.DELETED } ).length,
			] );
		});
	}

	UpdateScoreCards( scoreCard: ScoreCardClass ): Promise<ScoreCardClass[]> {
		return new Promise( ( resolve, reject ) => {
			let index = _.findIndex( Global.scoreCards, { id: scoreCard.id } );
			Global.scoreCards[ index ] = scoreCard;
			this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
				.then( () =>{
					resolve();
				});
		});
	} 
}
