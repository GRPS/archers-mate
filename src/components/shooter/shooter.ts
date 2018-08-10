import { Component, Input  } from '@angular/core';

import { ShooterClass } from '../../models/shooter-class';

@Component({
  selector: 'shooter',
  templateUrl: 'shooter.html'
})
export class ShooterComponent {

  @Input() shooter: ShooterClass;

  constructor() {}

}
