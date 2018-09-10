import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { CommonModule } from '@angular/common';

import { ShooterComponent } from './shooter/shooter';
import { NoteComponent } from './note/note';
import { HelpComponent } from './help/help';
import { FieldComponent } from './field/field';
import { FieldDateComponent } from './field-date/field-date';
import { SettingFooterComponent } from './setting-footer/setting-footer';

export const components = [
	ShooterComponent,
	NoteComponent,
	HelpComponent,
	FieldComponent,
	FieldDateComponent,
	SettingFooterComponent
];

@NgModule({
	declarations: [ components ],
	imports: [ CommonModule, IonicModule ],
	exports: [ components],
})
export class ComponentsModule {}
