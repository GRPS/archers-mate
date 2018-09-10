import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version';
import { Clipboard } from '@ionic-native/clipboard';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { BowService } from '../providers/bow-service';
import { RoundService } from '../providers/round-service';
import { ShooterService } from '../providers/shooter-service';
import { TargetService } from '../providers/target-service';
import { CommonProvider } from '../providers/common-provider';
import { SightMarkService } from '../providers/sight-mark-service';
import { ShooterBowService } from '../providers/shooter-bow-service';
import { ScoreCardService } from '../providers/score-card-service';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			mode: 'md',
			spinner: 'ios',
			swipeBackEnabled: true
		}),
		IonicStorageModule.forRoot({
			name: '__archers-mate',
			   driverOrder: ['indexeddb', 'sqlite', 'websql']
		}),
		HttpClientModule
	],
	bootstrap: [
		IonicApp
	],
	entryComponents: [
		MyApp
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AppVersion,
		Clipboard,
		CommonProvider,
		BowService,
		RoundService,
		TargetService,
		ShooterService,
		SightMarkService,
		ShooterBowService,
		ScoreCardService
	]
})
export class AppModule {}
