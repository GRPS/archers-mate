import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { CommonProvider } from '../../../../providers/common-provider';
import { SightMarkClass } from '../../../../models/sight-mark-class';
import { SightMarkService } from '../../../../providers/sight-mark-service';

@IonicPage()
@Component({
	selector: 'page-sight-mark',
	templateUrl: 'sight-mark.html',
})
export class SightMarkPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	sightMark: SightMarkClass;
	sightMarks: SightMarkClass[];
	callBack: any;
	formValidation: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public sightMarkService: SightMarkService
			) {
		this.GetPassedTarget();
		this.SetupForm();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'SightMarkEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	private GetPassedTarget() {
		if( this.navParams.get('sightMarks') != undefined ) {		
			this.sightMarks = this.navParams.data.sightMarks;
		} else {
			this.sightMarks = [];
		}

		if( this.navParams.get('sightMark') != undefined ) {
			this.sightMark = new SightMarkClass( this.navParams.data.sightMark );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.sightMark = new SightMarkClass();
			this.sightMark.unit = "meter";
		}

		if( this.navParams.get('callBack') != undefined ) {
			this.callBack = this.navParams.data.callBack;	
		}

	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			distance: [ '', Validators.compose( [ Validators.required ] ) ]
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
			this.sightMarkService.Save( this.sightMarks, this.sightMark, this.isNew )
				.then( sightMarks => {
					this.callBack( sightMarks )
						.then( () => {
							this.common.ShowToastSuccess( 'Saved!' );
							this.navCtrl.pop();
						});						
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

}
