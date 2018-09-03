import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
	name: 'roundTypeCount',
})
export class RoundTypeCountPipe implements PipeTransform {
	transform( items: any[], round_type: string ) {
		let a = _.filter( items,  function( item ) {
					return item.type == round_type;
				});
		return a.length;
	}
}
