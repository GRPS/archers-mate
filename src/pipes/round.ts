import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
  name: 'round',
})
export class RoundPipe implements PipeTransform {
	transform( items: any[], round_type: string, round_organisation: string, round_season: string ) {
		return _.filter( items,  function( item ) {
			return item.type == round_type && item.organisation == round_organisation && item.season == round_season;
		})
		.map( (item) => {
			item.isExpanded = false;
			return item;
		});   
  }
}
