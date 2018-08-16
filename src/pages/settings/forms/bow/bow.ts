import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { CommonProvider } from '../../../../providers/common-provider';
import { BowClass } from '../../../../models/bow-class';
import { BowService } from '../../../../providers/bow-service';

@IonicPage()
@Component({
	selector: 'page-bow',
	templateUrl: 'bow.html',
})
export class BowPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	bow: BowClass;
	form: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public bowService: BowService
			) {

		this.GetPassedBow();

		this.SetupForm();
				
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'BowEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {}

	Back() {
		this.common.Back( Const.PAGES.SETTINGS.BOWS );
	}

	Save() {
		if( this.form.valid ) {
			this.bowService.Save( this.bow, this.isNew )
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

	CreateBow() {
		console.log( 'create bow' );
		
	}

	private GetPassedBow() {
		if( this.navParams.get('bow') != undefined ) {
			this.bow = new BowClass( this.navParams.data.bow );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.bow = new BowClass();
		}
	}

	private SetupForm() {
		this.form = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ]
		});
	}

}
