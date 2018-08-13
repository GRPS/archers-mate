import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../providers/constants';
import { CommonProvider } from '../../../providers/common-provider';
import { ShooterClass } from '../../../models/shooter-class';

@IonicPage()
@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class ShooterEditPage {

	title: string;
	isNew: boolean = true;
	shooter: ShooterClass;
	form: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider
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
		console.log( 'save model here' );
		console.log( this.shooter );		
	}

	private GetPassedShooter() {
		if( this.navParams.get('shooter') != undefined ) {
			this.isNew = false;
			this.shooter = new ShooterClass( this.navParams.data.shooter );		
		} else {
			this.shooter = new ShooterClass();
		}
	}

	private SetupForm() {
		this.form = this.formBuilder.group({
			name: [ '', [ Validators.required, Validators.minLength(2), Validators.minLength(30) ] ],
			initials: [ '', [ Validators.required, Validators.minLength(2), Validators.maxLength(2) ] ],
			age: [ '', [ Validators.required ] ]
		});
	}

}
