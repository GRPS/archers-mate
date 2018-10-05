import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { File } from '@ionic-native/file';

import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { ShooterClass } from '../../models/shooter-class';
import { RoundClass } from '../../models/round-class';
import { ScoreCardClass } from '../../models/score-card-class';
import { ScoreEndClass } from '../../models/score-class';
import { ScoreTargetClass } from '../../models/score-class';
import { CommonProvider } from '../../providers/common-provider';
import { ScoreCardService } from '../../providers/score-card-service';
import { AppClass } from '../../models/app-class';

import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {

	app: AppClass;
	global: string;
	loading;

	constructor(
				public clipboard: Clipboard,
				public file: File,
				public loadingCtrl: LoadingController,
				public navCtrl: NavController, 
				public navParams: NavParams, 
				public common: CommonProvider,
				public scoreCardService: ScoreCardService
				) {
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'AboutPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.common.GetApp()
            .then( app => {
			  this.app = app;
			  this.global = JSON.stringify( Global );	
			  	  
			});
	}

	Back() {
		this.navCtrl.insert( 0, Const.PAGES.HOME );
		this.navCtrl.popToRoot();
	}
  
	ExportToFile() {
		this.file.writeFile( this.file.externalDataDirectory  , "archers-mate.json", JSON.stringify( Global ), { replace: true } )
			.then( () => {
				this.common.ShowToastSuccess( 'File created.', true );
			});
	}

	FactoryReset() {
		this.common.ConfirmUser( 'Factory Reset', 'Are you sure?', 'No', 'Yes' )
			.then( result => {
				if( result ) {
					//Yes
					Global.bows = null;
					Global.rounds = null;
					Global.scoreCards = null;
					Global.shooter = null;
					Global.shooters = null;

					this.common.SaveToStorage( Const.LABEL.BOWS, Global.bows )
						.then( () => {
							this.common.SaveToStorage( Const.LABEL.ROUNDS, Global.rounds )
								.then( () => {
									this.common.SaveToStorage( Const.LABEL.SHOOTERS, Global.shooters )
										.then( () => {
											this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
												.then( () => {
													this.common.ShowAlert( "Factory Reset", "Done!" );
												});
										});
								});
						});
					
				} else {
					//No					
				}
			});
	}

	AskForAmountOfDummyScoreCards() {

		this.common.PromptUser( "How many?", "3", "number", 5 )
            .then( (number) => {

				let msg: string = '';

				this.loading = this.loadingCtrl.create({
					content: 'Creating ...'
				});
				
				this.loading.present();

				for( let i=0; i < Number(number); i++ ) {
					this.GenerateDummyScoreCard()
						.then( scoreCard => {
							let info: string[] = [];

							let ids: any[] = [];
							for( let shooter of scoreCard.shooters ) {
								ids.push( { id: shooter.id, total: shooter.score.total_rt } );
							}							
							let sortedIds: any[] =_.sortBy( ids, 'total' ).reverse();
							let newShooters: ShooterClass[] = [];
							for( let tmp of sortedIds ) {
								let shooter: ShooterClass = _.find( scoreCard.shooters, function( obj ){ return obj.id == tmp.id; }); 
								info.push( shooter.name + " : " + shooter.score.total_rt ); 
								newShooters.push( shooter );
							}
							scoreCard.shooters = newShooters;
							Global.scoreCards.push( scoreCard );
							
						});
				}
				this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
					.then( () => {
						this.loading.dismiss();
						this.common.ShowToastSuccess( 'Dummy score cards created!' );
					});

			}, () => {});
			
	}

	GenerateDummyScoreCard(): Promise<ScoreCardClass> {

		return new Promise( resolve => {
			let numbRnd: number = 0;
			do {
				numbRnd = Math.floor( Math.random() * Global.shooters.length );
			 } while ( numbRnd <= 1 );
			let randomShooters: ShooterClass[] = _.sample( Global.shooters, numbRnd );

			numbRnd = Math.floor( Math.random() * Global.rounds.length );
			let randomRound: RoundClass = Global.rounds[ numbRnd ];

			if( randomRound ) {
				
				let possibleScore: string[] = randomRound.scoring.split( ',' );
				possibleScore.unshift( 'X' );
				possibleScore.push( 'M' );

				let scoreCard = new ScoreCardClass();
				scoreCard.status = Const.SCORE_CARD_STATUS.ONGOING
				scoreCard.id = this.common.GetRandomNumber();
				scoreCard.name = "Dummy-" + scoreCard.id;
				scoreCard.dt = new Date().toISOString();
				scoreCard.round = randomRound;

				let newRandomShooters: ShooterClass[] = [];
				for( let shooter of randomShooters ) {
					let newShooter: ShooterClass = Object.assign( {}, shooter );
					newShooter.score = this.scoreCardService.GenerateShooterDefaultScore( randomRound.targets, randomRound.arrows );
					let newScoreTargets: ScoreTargetClass[] = [];
					for( let target of newShooter.score.targets ) {
						let newScoreTargetClass = new ScoreTargetClass();				
						newScoreTargetClass.ends = [];
						for( let targetEnd of target.ends ) {	
							let newEnds: string[] = [];				
							for( let i = 0; i < randomRound.arrows; i++ ) {
								newEnds.push( _.sample( possibleScore, 1 )[ 0 ] );
							}		
							let newScoreEndClass = new ScoreEndClass();
							newScoreEndClass.end = this.scoreCardService.SortScores( newEnds );
							newScoreTargetClass.ends.push( newScoreEndClass );
						}				
						newScoreTargets.push( newScoreTargetClass );
					}
					newShooter.score.targets = newScoreTargets;
					newShooter.score = this.scoreCardService.CalculateStats( newShooter.score );
					newRandomShooters.push( newShooter );
				}

				scoreCard.shooters = newRandomShooters;
				scoreCard.status = Const.SCORE_CARD_STATUS.COMPLETED;

				resolve( scoreCard );

			}

		});

	}

	DeleteAllDummyScoreCard() {
		let scoreCards: ScoreCardClass[] = []
		for( let scoreCard of Global.scoreCards ) {
			if( !scoreCard.name.startsWith( 'Dummy-' ) ) {
				scoreCards.push( scoreCard );
			}
		}
		Global.scoreCards = scoreCards;
		this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
			.then( () => {
				this.common.ShowToastSuccess( 'Dummy score cards deleted!' );
			});
	}

}
