import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../providers/constants';
import { CommonProvider } from '../../../providers/common-provider';
import { ShooterClass } from '../../../models/shooter-class';
import { ShooterService } from '../../../providers/shooter-service';

@IonicPage()
@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class ShooterEditPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	shooter: ShooterClass;
	form: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public shooterService: ShooterService
			) {

		this.GetPassedShooter();

		this.SetupForm();
				
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'ShooterEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {}

	Back() {
		this.common.Back( Const.PAGES.SETTINGS );
	}

	Save() {
		if( this.form.valid ) {
			this.shooterService.Save( this.shooter )
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

	Edit() {
		this.isEditMode = !this.isEditMode;
	}

	private GetPassedShooter() {
		if( this.navParams.get('shooter') != undefined ) {
			this.shooter = new ShooterClass( this.navParams.data.shooter );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.shooter = new ShooterClass();
		}
	}

	private SetupForm() {
		this.form = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			initials: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			age: [ '', Validators.compose( [ Validators.required ] ) ]
		});
	}

}
