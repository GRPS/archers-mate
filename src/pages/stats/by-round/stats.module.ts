import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatsPage } from './stats';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    StatsPage,
  ],
  imports: [
    IonicPageModule.forChild(StatsPage),
    ComponentsModule
  ],
  exports: [
    StatsPage,
  ]
})
export class StatsPageModule {}