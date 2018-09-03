import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundsPage } from './rounds';

import { ComponentsModule } from '../../../../components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    RoundsPage,
  ],
  imports: [
    IonicPageModule.forChild(RoundsPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    RoundsPage,
  ]
})
export class RoundsPageModule {}
