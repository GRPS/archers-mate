import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BowsPage } from './bows';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    BowsPage,
  ],
  imports: [
    IonicPageModule.forChild(BowsPage),
    ComponentsModule
  ],
  exports: [
    BowsPage,
  ]
})
export class BowsPageModule {}
