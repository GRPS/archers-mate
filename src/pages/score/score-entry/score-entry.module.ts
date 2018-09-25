import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreEntryPage } from './score-entry';

import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScoreEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreEntryPage),
    PipesModule
  ],
  exports: [
    ScoreEntryPage,
  ]
})
export class ScoreEntryPageModule {}