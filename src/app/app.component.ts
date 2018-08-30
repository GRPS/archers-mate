import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Const } from '../providers/constants';

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

		// platform.ready().then(() => {
		// 	// Okay, so the platform is ready and our plugins are available.
		// 	// Here you can do any higher level native things you might need.
		// 	statusBar.styleDefault();
		// 	splashScreen.hide();

		// 	// Handle Android back button
		// 	platform.registerBackButtonAction( () => {

		// 		let navCtrl = this.app.getActiveNavs()[0];
		// 		let activePage = navCtrl.getActive();

		// 		switch ( activePage.name ) {
		// 			case Const.PAGES.SETTINGS.GENERAL :
		// 			case Const.PAGES.SETTINGS.BOWS :
		// 			case Const.PAGES.SETTINGS.SHOOTERS :
		// 			case Const.PAGES.SETTINGS.ROUNDS :
		// 				navCtrl.setRoot( Const.PAGES.HOME );
		// 				break;
		// 			default:
		// 				navCtrl.pop();
		// 				break;
		// 		}

		// 	});

    	// });
	}

}

