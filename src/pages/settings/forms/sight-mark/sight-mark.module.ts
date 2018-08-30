import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SightMarkPage } from './sight-mark';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    SightMarkPage,
  ],
  imports: [
    IonicPageModule.forChild(SightMarkPage),
    ComponentsModule
  ],
  exports: [
    SightMarkPage,
  ]
})
export class SightMarkPageModule {}
