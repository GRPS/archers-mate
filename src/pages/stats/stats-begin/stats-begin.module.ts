import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatsBeginPage } from './stats-begin';

@NgModule({
  declarations: [
    StatsBeginPage,
  ],
  imports: [
    IonicPageModule.forChild(StatsBeginPage),
  ],
})
export class StatsBeginPageModule {}
