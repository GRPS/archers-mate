import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreCardPage } from './score-card';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ScoreCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreCardPage),
    ComponentsModule
  ],
  exports: [
    ScoreCardPage,
  ]
})
export class ScoreCardPageModule {}
