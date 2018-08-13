import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShooterEditPage } from './edit';

@NgModule({
  declarations: [
    ShooterEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ShooterEditPage),
  ],
  exports: [
    ShooterEditPage,
  ]
})
export class ShooterEditPageModule {}
