import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer';

import { Const } from '../../../providers/constants';
import { Global } from '../../../providers/globals';
import { CommonProvider } from '../../../providers/common-provider';
import { ShooterClass } from '../../../models/shooter-class';
import { ScoreCardClass } from '../../../models/score-card-class';
import { ScoreCardService } from '../../../providers/score-card-service';

import * as _ from 'underscore';

@IonicPage()
@Component({
	selector: 'page-score-card-setup',
	templateUrl: 'score-card-setup.html',
})
export class ScoreCardSetupPage {

	isEditMode: boolean = false;
	isNew: boolean = false;
	scoreCard: ScoreCardClass;
	formValidation: FormGroup;
	reOrder: boolean = true;
	showButtonAddShooter: boolean = true;

	constructor(
				public emailComposer: EmailComposer,
				public formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public modalCtrl: ModalController,
				public common: CommonProvider,
				public scoreCardService: ScoreCardService
			) {
			
		this.GetPassedScoreCard();
		this.SetupForm();
	}

	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ScoreCardSetup';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );

		this.CanAddShooter();

	}

	GetPassedScoreCard() {
		if( this.navParams.get('scoreCard') != undefined ) {
			this.scoreCard = new ScoreCardClass( this.navParams.data.scoreCard );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.scoreCard = new ScoreCardClass({
				dt: new Date().toISOString(),				
				shooters: [ Global.shooter ],
				round: {},
				status: Const.SCORE_CARD_STATUS.ONGOING
			});
			this.scoreCard.shooters[ 0 ].score = null;
		}

		if( this.scoreCard.status != Const.SCORE_CARD_STATUS.ONGOING ) {
			this.reOrder = false;
			
		}

	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			round: [ '', Validators.compose( [ Validators.required ] ) ],
		});
	}

	AndroidBackButton() {
        this.Back();
    }
	Back() {
		this.navCtrl.pop();
	}

	Edit() {
		this.isEditMode = !this.isEditMode;
	}

	Email() {

		// this.emailComposer.isAvailable().then( ( available: boolean ) => {
		// 	if( available ) {
		// 	  alert('Good to send email');
		// 	} else {
		// 		this.common.ShowAlert( "Warning", "Sending of emails is not supported on this device." );
		// 	}
		// });

		let dt = new Date( this.scoreCard.dt );
		let msg: string = "";

		msg += this.AddLine( "<h3>Score Card</h3>" );
		msg += this.AddLine( "<b>Date: </b>" + dt.toLocaleDateString() );
		msg += this.AddLine( "<b>Round: </b>" + this.scoreCard.round.name, 2 );

		msg += this.AddLine( "<h3>Score Summary</h3>" );
		for( let shooter of this.scoreCard.shooters ) {
			msg += this.AddLine( shooter.name + " (" + shooter.initials + ") total score is " + shooter.score.total_rt );
		}

		msg += this.AddLine( "<h3>Shooter's Scores</h3>" );
		for( let shooter of this.scoreCard.shooters ) {
			msg += this.AddLine( "<b>" + shooter.name + " (" + shooter.initials + ")</b>" );
			for( let t=0; t < shooter.score.targets.length; t++ ) {
				msg += this.AddLine( "<b>Target " + ( t + 1 ) + "</b>");
				for( let e=0; e < shooter.score.targets[ t ].ends.length; e++ ) {
					msg += this.AddLine( "<b>End " + ( e + 1 ) + " =</b>" + shooter.score.targets[ t ].ends[ e ].end );
				}
			}
			msg += this.AddLine( "" );
		}

		msg += this.AddLine( "<h3>Shooter's Scores CSV Format</h3>" );

		msg += this.AddLine( "<p>This CSV output can be loaded into Excel by copying the email CSV data to the clipboard and pasting it into an Excel spreadsheet. If you repeat this process for many score cards, each pasting it below the other you can then copy all the data to the clipboard and paste into another worksheet and then select 'Data\\Text to columns' and then select all column and select 'Data\\Filter'. Now you can filter your data on any shooter, date etc.</p>", 2 );

		msg += this.AddLine( "Date,Round Name,Shooter Name,Shooter Initials,Target,End,Arrow 1,Arrow 2,Arrow 3,Arrow 4,Arrow 5,Arrow 6,Total" );
		for( let shooter of this.scoreCard.shooters ) {
			for( let t=0; t < shooter.score.targets.length; t++ ) {
				for( let e=0; e < shooter.score.targets[ t ].ends.length; e++ ) {
					msg += this.AddLine( dt.toLocaleDateString() + "," + this.scoreCard.round.name + "," + shooter.name + "," + shooter.initials + "," + t + "," + e + "," + shooter.score.targets[ t ].ends[ e ].end + this.MissingScores( this.scoreCard.round.arrows ) + "," + shooter.score.targets[ t ].ends[ e ].total_et );
				}
			}
		}

		let email = {
			to: 'grahamsimmons@hotmail.co.uk',
			subject: 'Archers Mate Score Card - ' + dt.toLocaleDateString(),
			body: msg,
			isHtml: true
		  };
		  
		// Send a text message using default options
		this.emailComposer.open(email);

	}

	AddLine( msg:string, numLines: number = 1 ) {
		let lines = "";
		for(let i=0; i < numLines; i++) { lines += "<br>";}
		return msg + lines;
	}

	MissingScores( current: number ) {
		let lines = "";
		for(let i=0; i < (6 - current ); i++) { lines += ",";}
		return lines;
	}

	Save() {
		if( this.formValidation.valid ) {
			this.scoreCardService.Save( this.scoreCard, this.isNew )
				.then( () => {
					this.Edit();
					this.isNew = false;
					this.common.ShowToastSuccess( 'Saved!' );			
				},
				( error ) => {
					this.common.ShowToastFail( 'Failed to save form!' );
				})
				.catch( (error) => {
					this.common.ShowToastFail( JSON.stringify( error ) );
				});

		} else{
			this.common.ShowToastFail( 'Cannot save form with errors!' );
		}
	}

	DeleteScoreCardShooter( slidingItem, shooter ) {
		this.scoreCardService.DeleteScoreCardShooter( this.scoreCard.shooters, shooter )
			.then( shooters => {
				this.scoreCard.shooters = <ShooterClass[]> shooters;
				this.scoreCardService.UpdateScoreCards( this.scoreCard )
					.then( () => {
						this.CanAddShooter();
						slidingItem.close(); 
						this.common.ShowToastSuccess( 'Deleted!' );
					});				
			});
	}

	reorderItems( indexes ) {
		this.scoreCard.shooters = this.common.reorderItems( this.scoreCard.shooters, indexes );
	}

	AddShooterGuest() {
		this.scoreCardService.GetGuest( this.scoreCard.shooters )
			.then( guest => {
				this.scoreCard.shooters.push( new ShooterClass( guest ) );
				this.SaveScoreCardShooters();
			},
            err => {});
	}

	AddShooter() {

		this.scoreCardService.GetUnselectedShooters( this.scoreCard.shooters )
			.then( leftOvers => {
				if( leftOvers.length == 0 ) {
					this.showButtonAddShooter = false;
				} else {
		
					this.scoreCardService.GetShooter( leftOvers )
						.then( shooters => {
							if( shooters ) {
								let newShooters: ShooterClass[] = this.scoreCard.shooters;
								for( let shooter of shooters ) {
									newShooters.push( new ShooterClass( shooter ) );
								}
								this.scoreCard.shooters = newShooters;
								this.SaveScoreCardShooters();
							}				
						},
						err => {});
				}
			});

	}

	CanAddShooter() {
		this.scoreCardService.GetUnselectedShooters( this.scoreCard.shooters )
			.then( leftOvers => {
				if( leftOvers.length == 0 ) {
					this.showButtonAddShooter = false;
				} else {
					this.showButtonAddShooter = true;
				}
			});
	}

	SaveScoreCardShooters() {
		this.scoreCardService.Save( this.scoreCard, this.isNew )
			.then( () => {
				this.CanAddShooter();
				this.common.ShowToastSuccess( 'Saved!' );			
			},
			( error ) => {
				this.common.ShowToastFail( 'Failed to add guest!' );
			})
			.catch( (error) => {
				this.common.ShowToastFail( JSON.stringify( error ) );
			});
	}

	AddRound() {
		let roundModal = this.modalCtrl.create( Const.PAGES.SETTINGS.ROUNDS, { isModal: true } );
		roundModal.onDidDismiss( data => {	
			this.scoreCard.round = data.round;					
		});
		roundModal.present();
	}

	GotoScores() {
		this.navCtrl.push( Const.PAGES.SCORE_CARD, { callBack: this.GetNewScoreCard, 'score-card': this.scoreCard } );
	}

	GetNewScoreCard = ( newScoreCard: ScoreCardClass ) => {
		return new Promise( resolve => {
			this.scoreCard = newScoreCard;

			if( this.scoreCard.status == Const.SCORE_CARD_STATUS.ONGOING ) {
				
				if( this.scoreCardService.IsComplete( this.scoreCard) ) {
					this.scoreCard.status = Const.SCORE_CARD_STATUS.COMPLETED;

					let ids: any[] = [];
					for( let shooter of this.scoreCard.shooters ) {
						ids.push( { id: shooter.id, total: shooter.score.total_rt} );
					}
					let sortedIds: any[] =_.sortBy( ids, 'total' ).reverse();
					let newShooters: ShooterClass[] = [];
					let shooters: ShooterClass[] = this.scoreCard.shooters;
					for( let tmp of sortedIds ) { 
						newShooters.push( _.find( shooters, function( obj ){ return obj.id == tmp.id; }) );
					}
					this.scoreCard.shooters = newShooters;
				}

				//Update global scorecards with this scorecard
				let index = _.findIndex( Global.scoreCards, { id: this.scoreCard.id } );
				Global.scoreCards[ index ] = this.scoreCard;

				this.common.SaveToStorage( Const.LABEL.SCORE_CARDS, Global.scoreCards )
					.then( () => {
						resolve();
						this.common.ShowToastSuccess( 'Saved!' );	
					});
			} else {
				resolve();
			}
		});
	}

}
