import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BowPage } from './bow';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    BowPage,
  ],
  imports: [
    IonicPageModule.forChild(BowPage),
    ComponentsModule
  ],
  exports: [
    BowPage,
  ]
})
export class BowPageModule {}
