import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular/umd';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	
	@ViewChild('myNav') navCtrl: NavController  
	rootPage:any = 'HomePage';

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			statusBar.backgroundColorByHexString("#5B8DBB");
			splashScreen.hide();
		});
	}
	
}
