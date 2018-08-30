import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShootersPage } from './shooters';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    ShootersPage,
  ],
  imports: [
    IonicPageModule.forChild(ShootersPage),
    ComponentsModule
  ],
  exports: [
    ShootersPage,
  ]
})
export class ShootersPageModule {}
