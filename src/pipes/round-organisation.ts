import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
	name: 'roundOrganisation',
})
export class RoundOrganisationPipe implements PipeTransform {
	transform( items: any[], round_type: string ) {
		return _.sortBy( 
				_.uniq(
					_.pluck(
						_.filter( items,  function( item ) {
												return item.type == round_type && item.organisation != "";
										}),
										'organisation'
									)
				), function( type ) { return name; } 
			);
	}
}
