import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'validation-error',
  templateUrl: 'validation-error.html'
})
export class ValidationErrorComponent {

  @Input() fv: FormGroup;
  @Input() messages: any[];
  @Input() fld: string;

  constructor() {
  }

}
