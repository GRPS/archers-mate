import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShooterEditPage } from './edit';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ShooterEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ShooterEditPage),
    ComponentsModule
  ],
  exports: [
    ShooterEditPage,
  ]
})
export class ShooterEditPageModule {}
