import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShooterPage } from './shooter';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ShooterPage,
  ],
  imports: [
    IonicPageModule.forChild(ShooterPage),
    ComponentsModule
  ],
  exports: [
    ShooterPage,
  ]
})
export class ShooterPageModule {}
