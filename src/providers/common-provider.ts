import { Injectable } from '@angular/core';
import { App, NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Const } from './constants';

@Injectable()
export class CommonProvider {

	navCtrl: NavController;

	constructor(
				app: App,
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
		
	Back( rootPage ) {
		if( this.navCtrl.canGoBack() ) {
			this.navCtrl.pop();
		} else {
			this.navCtrl.setRoot( rootPage );
		}
	}

	ShowToastSuccess( message: string ) {
		this.ShowToast( message, Const.TOAST.SUCCESS, 1000, false, '', 'bottom' );
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
	
}
