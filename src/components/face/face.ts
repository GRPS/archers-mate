import { Component, Input  } from '@angular/core';

import { ShooterClass } from '../../models/shooter-class';

@Component({
  selector: 'face',
  templateUrl: 'face.html'
})
export class FaceComponent {

  @Input() shooter: ShooterClass;

  constructor() {}

}