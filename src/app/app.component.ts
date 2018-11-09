import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';

import { Const } from '../providers/constants';
import { CommonProvider } from '../providers/common-provider';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

	rootPage:any = 'HomePage';

	constructor(
				public app: App, 
				public androidPermissions: AndroidPermissions,
				public file: File,
				public platform: Platform, 
				public screenOrientation: ScreenOrientation,
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen,
				public common: CommonProvider,
			) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.backgroundColorByHexString( '#5B8DBB' );
			// statusBar.styleDefault();
			splashScreen.hide();
			
			this.androidPermissions.requestPermissions(
				[
				  this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
				]
			);

			if( this.platform.is( 'android' ) ) {
				Const.IS_ANDROID = true;
				this.CreateFolder( Const.FOLDER.EXPORTS );
				this.CreateFolder( Const.FOLDER.SHOOTERS );
			}

			//Handle Android hardware back button.
			//If the active page has a function called AndroidBackButton then it it called instead.
			platform.registerBackButtonAction(() => {

				let nav = app.getActiveNavs()[ 0 ];
				let activeView = nav.getActive();
		 
				if( activeView != null ){
					if ( typeof activeView.instance.AndroidBackButton === 'function' ) {
						activeView.instance.AndroidBackButton();
					} else if( nav.canGoBack() ) {
						nav.pop();
					}
				}

			});

    	});
	}

	CreateFolder( name: string ) {
		this.file.createDir( this.file.externalDataDirectory, name, false ).then( ( resolve ) => {
			if (!resolve) {} 
		}, (error) => {
			if( error.code != 12 ) {
				this.common.ShowAlert( "Error", "Create folder error: " + JSON.stringify( error ) );
			}
		});
	}

}

