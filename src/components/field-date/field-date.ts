import { Component, Input } from '@angular/core';

@Component({
  selector: 'field-date',
  templateUrl: 'field-date.html'
})
export class FieldDateComponent {

  @Input() label: string;
  @Input() value: any;

  constructor() {}

}
