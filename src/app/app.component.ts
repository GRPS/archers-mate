import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { CommonProvider } from '../providers/common-provider';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

	rootPage:any = 'HomePage';

	constructor(
				public app: App, 
				public androidPermissions: AndroidPermissions,
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

}

