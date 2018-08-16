import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralPage } from './general';

import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    GeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralPage),
    PipesModule
  ],
  exports: [
    GeneralPage,
  ]
})
export class GeneralPageModule {}
