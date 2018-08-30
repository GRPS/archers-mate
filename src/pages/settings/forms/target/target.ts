import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { CommonProvider } from '../../../../providers/common-provider';
import { TargetClass } from '../../../../models/target-class';
import { TargetService } from '../../../../providers/target-service';

@IonicPage()
@Component({
	selector: 'page-target',
	templateUrl: 'target.html',
})
export class TargetPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	target: TargetClass;
	targets: TargetClass[];
	callBack: any;
	formValidation: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public targetService: TargetService
			) {
		this.GetPassedTarget();
		this.SetupForm();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'TargetEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	private GetPassedTarget() {
		if( this.navParams.get('targets') != undefined ) {		
			this.targets = this.navParams.data.targets;
		} else {
			this.targets = [];
		}

		if( this.navParams.get('target') != undefined ) {
			this.target = new TargetClass( this.navParams.data.target );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.target = new TargetClass();
		}		

		if( this.navParams.get('callBack') != undefined ) {
			this.callBack = this.navParams.data.callBack;	
		}

	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			distance: [ '', Validators.compose( [ Validators.required ] ) ],
			size: [ '', Validators.compose( [ Validators.required ] ) ],
			ends: [ '', Validators.compose( [ Validators.required ] ) ],
		});
	}

	Back() {
		this.navCtrl.pop();
	}

	Save() {
		if( this.formValidation.valid ) {
			this.targetService.Save( this.targets, this.target, this.isNew )
				.then( targets => {
					this.callBack( targets )
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

	Edit() {
		this.isEditMode = !this.isEditMode;
	}

}
