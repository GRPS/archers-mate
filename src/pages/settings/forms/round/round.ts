import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { CommonProvider } from '../../../../providers/common-provider';
import { RoundClass } from '../../../../models/round-class';
import { RoundService } from '../../../../providers/round-service';

@IonicPage()
@Component({
	selector: 'page-round',
	templateUrl: 'round.html',
})
export class RoundPage {

	title: string;
	isEditMode: boolean = false;
	isNew: boolean = false;
	round: RoundClass;
	form: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public roundService: RoundService
			) {

		this.GetPassedRound();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'RoundEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
		this.Init();
	}

	Init() {
		this.SetupForm();
	}

	Back() {
		this.viewCtrl.dismiss( { 'round': this.round } );
	}

	Save() {
		if( this.form.valid ) {
			this.roundService.Save( this.round, this.isNew )
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
		console.log(this.round);
		this.isEditMode = !this.isEditMode;
	}

	CreateRoundTarget() {
		console.log( 'create round target' );
		
	}

	private GetPassedRound() {
		if( this.navParams.get('round') != undefined ) {
			this.round = new RoundClass( this.navParams.data.round );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.round = new RoundClass();
		}
		console.log(this.round);
		
	}

	private SetupForm() {
		this.form = this.formBuilder.group({
			type: [ '', Validators.compose( [ Validators.required ] ) ],
			organistion: [ '', Validators.compose( [ Validators.required ] ) ],
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ],
			season: [ '', Validators.compose( [ Validators.required ] ) ],
			distance: [ '', Validators.compose( [ Validators.required ] ) ],
			unit: [ '', Validators.compose( [ Validators.required ] ) ],
			scoring: [ '', Validators.compose( [ Validators.required ] ) ],
			arrows: [ '', Validators.compose( [ Validators.required ] ) ],
		});
	}

}
