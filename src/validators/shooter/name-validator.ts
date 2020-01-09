import { FormControl } from '@angular/forms';
 
import { Const } from '../../providers/constants';
import { Global } from '../../providers/globals';
import { ShooterClass } from '../../models/shooter-class';

import * as _ from 'underscore';

export class NameValidator {
 
	static IsUnique( control: FormControl ): any {
		
		let shooter: ShooterClass = _.find( Global.shooters, function( obj ){ return obj.name == control.value && obj.id != Const.currentShooter.id; }); 

		if( shooter == undefined ) {
			return null;
		} else {
			return { IsUnique: true };
		}

	}
 
}