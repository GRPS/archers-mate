import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EmailComposer } from '@ionic-native/email-composer';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';

import { BowService } from '../providers/bow-service';
import { RoundService } from '../providers/round-service';
import { ShooterService } from '../providers/shooter-service';
import { TargetService } from '../providers/target-service';
import { CommonProvider } from '../providers/common-provider';
import { SightMarkService } from '../providers/sight-mark-service';
import { ShooterBowService } from '../providers/shooter-bow-service';
import { ScoreCardService } from '../providers/score-card-service';
import { StatsService } from '../providers/stats-service';
import { CameraService } from '../providers/camera-service';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			mode: 'md',
			spinner: 'ios',
			swipeBackEnabled: false
		}),
		IonicStorageModule.forRoot({
			name: '__archers-mate',
			   driverOrder: [ 'sqlite', 'indexeddb', 'websql' ]
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
		ScreenOrientation,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AppVersion,
		File,
		FilePath,
		AndroidPermissions,
		EmailComposer,
		Camera,
		CommonProvider,
		BowService,
		RoundService,
		TargetService,
		ShooterService,
		SightMarkService,
		ShooterBowService,
		ScoreCardService,
		StatsService,
		CameraService
	]
})
export class AppModule {}
