import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreCardSetupPage } from './score-card-setup';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ScoreCardSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreCardSetupPage),
    ComponentsModule
  ],
  exports: [
    ScoreCardSetupPage,
  ]
})
export class ScoreCardSetupPageModule {}
