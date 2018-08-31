import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Const } from '../providers/constants';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

	rootPage:any = 'HomePage';

	constructor(
				public app: App, 
				public platform: Platform, 
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen
			) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();

			if( this.platform.is( Const.MISC.CORDOVA ) ) {
				Const.IS_CORDOVA = true;
			}

    	});
	}

}

