import { Component, Input } from '@angular/core';


@Component({
  selector: 'help',
  templateUrl: 'help.html'
})
export class HelpComponent {

  @Input() text: string;

  constructor() {
  }

}
