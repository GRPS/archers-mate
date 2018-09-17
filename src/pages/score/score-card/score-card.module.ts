import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreCardPage } from './score-card';

import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScoreCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreCardPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    ScoreCardPage,
  ]
})
export class ScoreCardPageModule {}
