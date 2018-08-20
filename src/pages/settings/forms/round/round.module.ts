import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundPage } from './round';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    RoundPage,
  ],
  imports: [
    IonicPageModule.forChild(RoundPage),
    ComponentsModule
  ],
  exports: [
    RoundPage,
  ]
})
export class RoundPageModule {}
