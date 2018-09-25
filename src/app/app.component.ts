import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Const } from '../providers/constants';
import { CommonProvider } from '../providers/common-provider';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

	rootPage:any = 'HomePage';

	constructor(
				public app: App, 
				public platform: Platform, 
				public screenOrientation: ScreenOrientation,
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen,
				public common: CommonProvider,
			) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.backgroundColorByHexString( '#93b4d2' );
			// statusBar.styleDefault();
			splashScreen.hide();

			if( this.platform.is( Const.MISC.CORDOVA ) ) {
				Const.IS_CORDOVA = true;
				this.screenOrientation.lock( screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY );
			}			

			 // Handle Android back button
			 this.platform.registerBackButtonAction( () => {
				 this.common.ShowAlert( "Notice", "The Android back button is disabled.");
			 });

    	});
	}

}

