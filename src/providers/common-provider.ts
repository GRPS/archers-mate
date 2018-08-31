import { Injectable } from '@angular/core';
import { App, NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';

import { Const } from './constants';
import { Global } from './globals';
import { AppClass } from '../models/app-class';

import * as _ from 'underscore';
// import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';
// import { resolveDefinition } from '../../node_modules/@angular/core/src/view/util';

@Injectable()
export class CommonProvider {

	navCtrl: NavController;

	constructor(
				app: App,
				public appVersion: AppVersion,
				private storage: Storage,
				private toastCtrl: ToastController,
				) {
		this.AddLog( 'CommonProvider loaded' );
		this.navCtrl = app.getActiveNavs()[0];
	}

	AddLog( message ) {
		if( Const.LOGGING )
			console.log( message );			
	}
	AddWarning( message ) {
		if( Const.LOGGING )
			console.warn( message );			
	}
	AddError( message ) {
		if( Const.LOGGING )
			console.error( message );			
	}

	HttpLogResponse( res: Response ) {
		if( Const.LOGGING )
			this.AddLog( res );
	}

	HttpCatchError( error: Response | any ) {
		if( Const.LOGGING )
			this.AddError( error.message || error );
		return Observable.throw( error || 'CatchError called!' );
	}

	GetRandomNumber() {
		let dt = new Date();
		return dt.getTime();
	}
		
	Back( rootPage: string = '', forceBack: boolean = false ) {
		// if( this.navCtrl.canGoBack() && !forceBack ) {
		if( !forceBack ) { 
			this.navCtrl.pop();
		} else {
			this.navCtrl.setRoot( rootPage );
		}
	}

	ShowToastSuccess( message: string, forceShow: boolean = false ) {
		if( forceShow || Global.setting.showToastOnSave ) {
			this.ShowToast( message, Const.TOAST.SUCCESS, 1000, false, '', 'bottom' );
		}
	}

	ShowToastFail( message: string ) {
		this.ShowToast( message, Const.TOAST.FAIL );
	}

	private ShowToast( message: string, cssClass: string = Const.TOAST.SUCCESS, duration: number = 3000, showCloseButton: boolean = true, closeButtonLabel: string = 'OK', position: string = 'middle' ) {
		let toast = this.toastCtrl.create({
		  message: message,
		  cssClass: cssClass,
		  duration: duration,
		  position: position,
		  showCloseButton: showCloseButton,
		  closeButtonText: closeButtonLabel
		});
	  
		toast.onDidDismiss(() => {});
	  
		toast.present();
	}

	GetIndexOfObjectIdInArray( arr, id ) {
		return _.findIndex( arr, { id: id } );
	}

	reorderItems( items: any, indexes ) {
		let item = items[ indexes.from ];
		items.splice( indexes.from, 1);
		items.splice( indexes.to, 0, item);
		return items;
	}
	
	GetApp(): Promise<AppClass>  {

		let app = new AppClass();
	
		//if cordova the do appVersion.something to get app details
		if( Const.IS_CORDOVA ) {
			return Promise.all( [
				this.appVersion.getAppName().then( result => { app.appName = result; }),
				this.appVersion.getVersionNumber().then( result => { app.versionNumber = result; }),
			] ).then( value => {
				return app;
			} );
		} else {
			return new Promise( function( resolve, reject ){
			app.appName = '';
			app.versionNumber = '';
			resolve( app );
			});
		}

	}

	SaveToStorage( label: string, data: any ): Promise<any> {
		return new Promise( resolve => {
			this.storage.remove( label )
				.then( () => {
					this.storage.set( label, data )
						.then( () => {
							console.log('SaveToStorage: ' + label);													
							resolve();
						});
				});		
		});				
	}
	
	GetFromStorage( label: string ): Promise<any> {
		return new Promise( resolve => {
			this.storage.get( label )
				.then( res => {									
					resolve( res );
				});			
		});
	}

}
