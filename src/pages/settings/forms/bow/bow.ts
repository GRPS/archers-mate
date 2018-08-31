import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { CommonProvider } from '../../../../providers/common-provider';
import { BowClass } from '../../../../models/bow-class';
import { BowService } from '../../../../providers/bow-service';
import { SightMarkClass } from '../../../../models/sight-mark-class';

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
	bows: BowClass[];
	callBack: any;
	formValidation: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
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
	}

	private GetPassedBow() {

		if( this.navParams.get(Const.LABEL.BOWS) != undefined ) {		
			this.bows = this.navParams.data.bows;
		} else {
			this.bows = [];
		}

		if( this.navParams.get('bow') != undefined ) {
			this.bow = new BowClass( this.navParams.data.bow );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.bow = new BowClass({
				id: this.common.GetRandomNumber(),
				name: '',
				SightMarks: new SightMarkClass({
					// distance: '',
					unit: 'meter',
					// notch: '',
					// position: '',
					// note: ''
				})
			});
		}

		if( this.navParams.get('callBack') != undefined ) {
			this.callBack = this.navParams.data.callBack;	
		}

	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ]
		});		
	}

	Back() {
		this.common.Back();
	}

	Edit() {
		this.isEditMode = !this.isEditMode;
	}

	Save() {
		if( this.formValidation.valid ) {
			this.bowService.Save( this.bow, this.isNew )
				.then( () => {
					this.navCtrl.pop();	
					this.common.ShowToastSuccess( 'Saved!' );			
				},
				( error ) => {
					this.common.ShowToastFail( 'Failed to save form!' );
				})
				.catch( ( error ) => {
					this.common.ShowToastFail( JSON.stringify( error ) );
				});

		} else{
			this.common.ShowToastFail( 'Cannot save form with errors!' );
		}
	}

}
