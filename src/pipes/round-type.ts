import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
	name: 'roundType',
})
export class RoundTypePipe implements PipeTransform {
	transform( items: any[] ) {    
    	return _.sortBy( _.uniq( _.pluck( items, 'type' ) ), function( type ) { return name; } ).reverse();
  	}
}
