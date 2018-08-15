import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BowsPage } from './bows';

import { PipesModule } from '../../../../pipes/pipes.module';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    BowsPage,
  ],
  imports: [
    IonicPageModule.forChild(BowsPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    BowsPage,
  ]
})
export class BowsPageModule {}
