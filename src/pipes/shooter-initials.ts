import { Pipe, PipeTransform } from '@angular/core';
import { ShooterClass } from '../models/shooter-class';

import * as _ from 'underscore';

@Pipe({
  name: 'shooterInitials',
})
export class ShooterInitialsPipe implements PipeTransform {
  transform(items: ShooterClass[]) {
    return _.pluck( items, 'initials' )
  }
}
