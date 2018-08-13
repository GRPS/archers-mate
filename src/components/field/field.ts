import { Component, Input } from '@angular/core';

@Component({
  selector: 'field',
  templateUrl: 'field.html'
})
export class FieldComponent {

  @Input() label: string;
  @Input() value: any;

  constructor() {}

}
