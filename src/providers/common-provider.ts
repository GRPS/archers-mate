import { Injectable } from '@angular/core';
import { AlertController, App, LoadingController, NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { File } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';

import { Const } from './constants';
import { Global } from './globals';
import { AppClass } from '../models/app-class';

import * as _ from 'underscore';

@Injectable()
export class CommonProvider {

	navCtrl: NavController;
	loading;

	constructor(
				public alertCtrl: AlertController,
				public screenOrientation: ScreenOrientation,
				public loadingCtrl: LoadingController,
				app: App,
				public file: File,
				public http: HttpClient,
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
		return dt.getTime() + "-" + _.random(0, 10000);
	}

	GetRandomDate( startDate, endDate, startHour, endHour ) {
		var date = new Date( + startDate + Math.random() * ( endDate - startDate ) );
		var hour = startHour + Math.random() * (endHour - startHour) | 0;
		date.setHours(hour);
		return date;
	}
		
	Back( rootPage: string = '', forceBack: boolean = false ) {
		// if( this.navCtrl.canGoBack() && !forceBack ) {
		if( !forceBack ) { 
			this.navCtrl.pop();
		} else {
			this.navCtrl.setRoot( rootPage );
		}
	}

	ShowAlert( title: string, message: string ) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: message,
			buttons: ['Dismiss']
		  });
		  alert.present();
	}

	ShowToastSuccess( message: string, forceShow: boolean = false ) {
		if( forceShow || Global.setting.showToastOnSave || Global.setting.showToastOnScoreInput ) {
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

	SaveToFile( label: string, data: any, msg: string = "Saving ..." ): Promise<any> {

		return new Promise( resolve => {
			this.file.writeFile( this.file.dataDirectory  , "archers-mate-" + label + ".json", data, { replace: true } )
					.then( () => {
						resolve();
					});
		});	
	}

	GetFromFile( label: string, msg: string = "Loading ..." ): Promise<any> {

		return new Promise( resolve => {
			this.file.resolveDirectoryUrl( this.file.dataDirectory )
				.then( rootDir => {
					return this.file.readAsText( rootDir.nativeURL, "archers-mate-" + label + ".json" )
						.then( data  => {
							resolve( JSON.parse( data ) );
						});
				});
		});
	}

	GetStorageKeys( label: string ): Promise<any> {
		return new Promise( resolve => {
			let ourKeys = [];
			this.storage.keys()
				.then( keys => {
					for( let key of keys ) {
						if( key.startsWith( label ) ) {
							ourKeys.push( key );
						}
					}
					resolve( ourKeys );
				});

		});
	}

	LoadStorageKeys( keys ): Promise<any> {
		return new Promise( resolve => {
			//Loop keys and get data from each entry and append together into Global.Score-Cards
			let promise_arr3 = [];
			let newData = [];
			for( let i = 0; i < keys.length; i++ ) {
				promise_arr3.push(
					this.storage.get( keys[ i ] ) 
						.then( data => {
							newData = newData.concat( data );
						})
					);
			}
			Promise.all(promise_arr3).then( results => {
				resolve( newData );
			});
		});
	}

	RemoveStorageKeys( label: string, keys ): Promise<any> {
		return new Promise( resolve => {
			//remove ALL the keys
			let promise_arr1 = [];

			for( let i = 0; i < keys.length; i++ ) {
				promise_arr1.push(this.storage.remove( label + "-" + i ) );
			}

			Promise.all(promise_arr1).then( results => {
				resolve();
			});
		});
	}

	SaveStorageKeys( label: string, data ): Promise<any> {
		return new Promise( resolve => {

			let promise_arr2 = [];

			for( let i = 0; i < data.length; i++ ) {
				promise_arr2.push(this.storage.set( label + "-" + i, data[ i ] ) );
			}

			Promise.all(promise_arr2).then( results => {
				resolve();
			});

		});
	}

	SaveToStorage( label: string, data: any ): Promise<any> {
		return new Promise( resolve => {

			if( label == Const.LABEL.SCORE_CARDS ) {

				return this.GetStorageKeys( label )
					.then( keys => {
						return this.RemoveStorageKeys( label, keys )
							.then( () => {
								return this.SaveStorageKeys( label, _.chunk( data, Const.MISC.SCORE_CARDS_PER_STORAGE ) )
									.then( () => {
										resolve();
									});
							});

					});

			} else {

				this.storage.remove( label )
					.then( () => {
						this.storage.set( label, data )
							.then( () => {											
								resolve();
							});
					});	

			}
	
		});				
	}
	
	GetFromStorage( label: string ): Promise<any> {

		return new Promise( resolve => {
			
			if( label == Const.LABEL.SCORE_CARDS ) {

				return this.GetStorageKeys( label )
					.then( keys => {
						return this.LoadStorageKeys( keys )
							.then( res => {
								resolve( res );
							});
					});

			} else {

				this.storage.get( label )
					.then( res => {				
						resolve( res );
					});		

			}

		});

	}

	ConfirmUser( title: string, message: string, btnStopLabel: string, btnContinueLabel: string ) {

		return new Promise( ( resolve, reject ) => {
	
		  let prompt = this.alertCtrl.create({
			title: title,
			message: message,
			buttons: [
			  {
				text: btnStopLabel,
				role: 'cancel',
				cssClass: 'alertStop',
				handler: () => {
				  resolve( false );
				}
			  },
			  {
				text: btnContinueLabel,
				cssClass: 'alertContinue',
				handler: () => {
				  resolve( true );
				}
			  }
			]
		  });
		  
		  prompt.present();
	
		});
	
	  }

	  PromptUser( title: string = "Title", placeHolder: string = "", type: string = "text", value: any ="" ) {

		return new Promise( ( resolve, reject ) => {
	
		  let alert = this.alertCtrl.create({
			title: title,
			inputs: [
			  {
				name: 'Code',
				placeholder: placeHolder,
				type: type,
				value: value
			  }
			],
			buttons: [
			  {
				text: 'Cancel',
				role: 'cancel',
				handler: data => {
				  reject( false );
				}
			  },
			  {
				text: 'Create',
				handler: data => {
				  resolve( data.Code );
				}
			  }
			]
		  });
	
		  alert.present();      
	
		});
	
		};
		
		UnlockScreen() {
			this.screenOrientation.unlock();
		}

		LockScreen() {
			this.screenOrientation.lock( this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY );
		}

}
