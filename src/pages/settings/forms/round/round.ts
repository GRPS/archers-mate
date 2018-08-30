import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { RoundClass } from '../../../../models/round-class';
import { RoundService } from '../../../../providers/round-service';
import { TargetClass } from '../../../../models/target-class';
import { TargetService } from '../../../../providers/target-service';

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
	formValidation: FormGroup;

	constructor(
				private formBuilder: FormBuilder,
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				public common: CommonProvider,
				public roundService: RoundService,
				public targetService: TargetService
			) {
		this.GetPassedRound();
		this.SetupForm();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'RoundEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	private GetPassedRound() {
		if( this.navParams.get('round') != undefined ) {
			this.round = new RoundClass( this.navParams.data.round );		
		} else {			
			this.isNew = true;
			this.isEditMode = true;
			this.round = new RoundClass();
			this.round.type = 'custom';
			this.round.organisation = 'fita';
			this.round.season = 'outdoor';
			this.round.distance = 'meter';
			this.round.unit = 'cm';
			this.round.scoring = '10,9,8,7,6,5,4,3,2,1';
			this.round.arrows = 6;

			let newTarget: TargetClass = new TargetClass({
				id: this.common.GetRandomNumber(),
				distance: 100,
				size: 150,
				ends: 1
			});
			newTarget = this.targetService.CalculateValues( this.round, newTarget );

			this.round.targets = [];//[ newTarget ];

			this.round = this.roundService.CalculateValues( this.round );

		}		
	}

	private SetupForm() {
		this.formValidation = this.formBuilder.group({
			name: [ '', Validators.compose( [ Validators.required, Validators.minLength(2) ] ) ]
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

	AddRoundTarget() {
		this.navCtrl.push( Const.PAGES.TARGET_EDIT, { callBack: this.RefreshRoundTarget, targets: this.round.targets } );
	}

	UpdateRoundTarget( target: TargetClass) {	
		this.navCtrl.push( Const.PAGES.TARGET_EDIT, { callBack: this.RefreshRoundTarget, targets: this.round.targets, target: target } );
	}

	DeleteRoundTarget( slidingItem, target: TargetClass ) {
		this.targetService.Delete( this.round.targets, target )
			.then( targets => {
				slidingItem.close(); 
				this.round.targets = targets;	
				
				let index: number = this.common.GetIndexOfObjectIdInArray( Global.rounds, this.round.id );
				Global.rounds[ index ] = this.round;

				this.common.ShowToastSuccess( 'Deleted!' );
			});	
	}

	RefreshRoundTarget = ( targets: TargetClass[] ) => {
		return new Promise( resolve => {
			this.round.targets = targets;	
			resolve();
		});
	}

	reorderItems( indexes ) {
		this.round.targets = this.common.reorderItems( this.round.targets, indexes );
	}

}
