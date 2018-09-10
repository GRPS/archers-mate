import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreCardsPage } from './score-cards';

import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    ScoreCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreCardsPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    ScoreCardsPage,
  ]
})
export class ScoreCardsPagePageModule {}
