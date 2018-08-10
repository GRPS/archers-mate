import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { CommonModule } from '@angular/common';

import { ShooterComponent } from './shooter/shooter';
import { NoteComponent } from './note/note';

export const components = [
	ShooterComponent,
	NoteComponent
];

@NgModule({
	declarations: [ components ],
	imports: [ CommonModule, IonicModule ],
	exports: [ components ],
})
export class ComponentsModule {}
