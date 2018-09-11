import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShooterPopoverPage } from './shooter-popover';

@NgModule({
  declarations: [
    ShooterPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ShooterPopoverPage),
  ],
  exports: [
    ShooterPopoverPage,
  ]
})
export class ShooterPopoverPageModule {}