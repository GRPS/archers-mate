import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShooterBowPage } from './shooter-bow';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ShooterBowPage,
  ],
  imports: [
    IonicPageModule.forChild(ShooterBowPage),
    ComponentsModule
  ],
  exports: [
    ShooterBowPage,
  ]
})
export class BowPageModule {}
