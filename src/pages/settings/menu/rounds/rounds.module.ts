import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundsPage } from './rounds';

import { PipesModule } from '../../../../pipes/pipes.module';
import { ComponentsModule } from '../../../../components/components.module';

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
