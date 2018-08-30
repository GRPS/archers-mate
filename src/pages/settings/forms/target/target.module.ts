import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetPage } from './target';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    TargetPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetPage),
    ComponentsModule
  ],
  exports: [
    TargetPage,
  ]
})
export class TargetPageModule {}
