import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
  name: 'roundSeason',
})
export class RoundSeasonPipe implements PipeTransform {
  transform( items: any[], round_type: string, round_organisation: string) {
    return _.sortBy(
				_.uniq(
					_.pluck(
						_.filter( items,  function( item ) {
							return item.type == round_type && item.organisation == round_organisation;
						}),
						'season'
					)
				), function( type ) { return name; } 
			);     
  }
}
