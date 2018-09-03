import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { ShooterClass } from '../../../../models/shooter-class';
import { BowClass } from '../../../../models/bow-class';
import { ShooterService } from '../../../../providers/shooter-service';
import { BowService } from '../../../../providers/bow-service';
import { SightMarkService } from '../../../../providers/sight-mark-service';
import { ShooterBowService } from '../../../../providers/shooter-bow-service';

@IonicPage()
@Component({
	selector: 'page-shooter',
	templateUrl: 'shooter.html',
})
export class ShooterPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	shooter: ShooterClass;
	formValidation: FormGroup;
	showButtonAdd: boolean = true;

	constructor(
				public alertCtrl: AlertController,
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public shooterService: ShooterService,
				public bowService: BowService,
				public sightMarkService: SightMarkService,
				public shooterBowService: ShooterBowService
			) {
		this.GetPassedShooter();
		this.SetupForm();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ShooterEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	private GetPassedShooter() {
		if( this.navParams.get('shooter') != undefined ) {
			this.shooter = new ShooterClass( this.navParams.data.shooter );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.shooter = new ShooterClass({
				gender: 'male'
			});
		}
	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			initials: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			age: [ '', Validators.compose( [ Validators.required ] ) ]
		});
	}

	Back() {
		this.navCtrl.pop();
	}

	Edit() {
		this.isEditMode = !this.isEditMode;
	}

	Save() {
		if( this.formValidation.valid ) {
			this.shooterService.Save( this.shooter, this.isNew )
				.then( () => {
					this.navCtrl.pop();	
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

	AddShooterBow() {
		this.shooterBowService.GetBowByAlert( 'Add Bow', this.shooter.bows )
			.then( ( bow: BowClass ) => {			
				bow.sightMarks = [];
				this.shooter.bows.push( bow ); 

				this.UpdateGlobal();

				this.common.ShowToastSuccess( 'Saved!' );
			})
			.catch(
				err => {
					// this.showButtonAdd = false;
				}
			);
	}

	UpdateShooterBow( bow ) {
		this.navCtrl.push( Const.PAGES.SHOOTER_BOW_EDIT, { callBack: this.RefreshShooterBow, shooter: this.shooter, bow: bow } );
	}

	DeleteShooterBow( slidingItem, bow ) {
		this.shooterBowService.DeleteShooterBow( this.shooter.bows, bow )
			.then( bows => {
				slidingItem.close(); 
				this.shooter.bows = bows;

				this.UpdateGlobal();		

				this.common.ShowToastSuccess( 'Deleted!' );
			});
	}

	RefreshShooterBow = ( bows: BowClass[] ) => {
		return new Promise( resolve => {
			this.shooter.bows = bows;	
			this.UpdateGlobal();

			this.common.ShowToastSuccess( 'Saved!' );

			resolve();
		});
	}

	UpdateGlobal() {
		if( this.shooter.isDefault ) {
			Global.shooter = this.shooter;
			Global.shooters[ 0 ] = this.shooter;
		} else {
			let index: number = this.common.GetIndexOfObjectIdInArray( Global.shooters, this.shooter.id );
			Global.shooters[ index ] = this.shooter;
		}
		this.common.SaveToStorage( Const.LABEL.SHOOTERS, Global.shooters )
			.then( () => {
				this.common.ShowToastSuccess( 'Saved!' );
			});

	}

	reorderItems( indexes ) {
		this.shooter.bows = this.common.reorderItems( this.shooter.bows, indexes );
		this.UpdateGlobal();
	}

}
