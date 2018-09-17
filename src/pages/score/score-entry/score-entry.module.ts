import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreEntryPage } from './score-entry';

@NgModule({
  declarations: [
    ScoreEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreEntryPage),
  ],
  exports: [
    ScoreEntryPage,
  ]
})
export class ScoreEntryPageModule {}