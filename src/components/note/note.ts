import { Component, Input } from '@angular/core';

@Component({
  selector: 'note',
  templateUrl: 'note.html'
})
export class NoteComponent {

  @Input() message: string;

  constructor() {}

}
