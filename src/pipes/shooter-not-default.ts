import { Pipe, PipeTransform } from '@angular/core';

import { ShooterClass } from '../models/shooter-class';

import * as _ from 'underscore';

@Pipe({
	name: 'ShooterNotDefault',
})
export class ShooterNotDefaultPipe implements PipeTransform {

	transform( items: ShooterClass[] ) {
		return _.where( items, { isDefault: false } );
	}

}
