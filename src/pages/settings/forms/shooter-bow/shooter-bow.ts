import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Const } from '../../../../providers/constants';
import { Global } from '../../../../providers/globals';
import { CommonProvider } from '../../../../providers/common-provider';
import { ShooterClass } from '../../../../models/shooter-class';
import { BowClass } from '../../../../models/bow-class';
import { ShooterBowService } from '../../../../providers/shooter-bow-service';
import { SightMarkClass } from '../../../../models/sight-mark-class';
import { SightMarkService } from '../../../../providers/sight-mark-service';

@IonicPage()
@Component({
	selector: 'page-shooter-bow',
	templateUrl: 'shooter-bow.html',
})
export class ShooterBowPage {

	title: string;
	shooter: ShooterClass;
	bow: BowClass;
	callBack: any;

	constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public common: CommonProvider,
				public shooterBowService: ShooterBowService,
				public sightMarkService: SightMarkService
			) {
		this.GetPassedBow();
	}

  	//Do before page becomes active.
	ionViewWillEnter() {
		Const.MISC.CURRENT_PAGE = 'BowEditPage';
		this.common.AddLog( Const.MISC.CURRENT_PAGE + ': ionViewDidLoad' );
	}

	private GetPassedBow() {

		if( this.navParams.get('shooter') != undefined ) {
			this.shooter = new ShooterClass( this.navParams.data.shooter );		
		}

		if( this.navParams.get('bow') != undefined ) {
			this.bow = new BowClass( this.navParams.data.bow );		
		}

	}

	Back() {
		this.navCtrl.pop();
	}

	AddBowSightMark() {
		this.navCtrl.push( Const.PAGES.SIGHT_MARK_EDIT, { callBack: this.RefreshBowSightMark, sightMarks: this.bow.sightMarks } );
	}

	UpdateBowSightMark( sightmark: SightMarkClass ) {
		this.navCtrl.push( Const.PAGES.SIGHT_MARK_EDIT, { callBack: this.RefreshBowSightMark, sightMarks: this.bow.sightMarks, sightMark: sightmark } );
	}

	DeleteBowSightMark( slidingItem, sightmark: SightMarkClass ) {
		this.sightMarkService.Delete( this.bow.sightMarks, sightmark )
		.then( sightMarks => {
			slidingItem.close(); 
			this.bow.sightMarks = sightMarks;	
			
			this.UpdateGlobal( sightMarks );

			this.common.ShowToastSuccess( 'Deleted!' );
		});
	}

	RefreshBowSightMark = ( sightMarks: SightMarkClass[] ) => {
		return new Promise( resolve => {		
			this.bow.sightMarks = sightMarks;
			this.UpdateGlobal( sightMarks );

			this.common.ShowToastSuccess( 'Saved!' );

			resolve();
		});
	}

	UpdateGlobal( sightMarks: SightMarkClass[] ) {
		let indexShooter: number = this.common.GetIndexOfObjectIdInArray( Global.shooters, this.shooter.id );
		let indexBow: number = this.common.GetIndexOfObjectIdInArray( Global.shooters[ indexShooter ].bows, this.bow.id );
		Global.shooters[ indexShooter ].bows[ indexBow ].sightMarks = sightMarks;

		this.common.SaveToStorage( Const.LABEL.SHOOTERS, Global.shooters );
	}

	reorderItems( indexes ) {
		let indexShooter: number = this.common.GetIndexOfObjectIdInArray( Global.shooters, this.shooter.id );
		let indexBow: number = this.common.GetIndexOfObjectIdInArray( Global.shooters[ indexShooter ].bows, this.bow.id );
		let bow: BowClass = this.shooter.bows[ indexBow ];
		this.shooter.bows[ indexBow ].sightMarks = this.common.reorderItems( bow.sightMarks, indexes );
		Global.shooters[ indexShooter ] = this.shooter;

		this.common.SaveToStorage( Const.LABEL.SHOOTERS, Global.shooters );

		this.common.ShowToastSuccess( 'Saved!' );
	}

}
