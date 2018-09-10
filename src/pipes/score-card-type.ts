import { Pipe, PipeTransform } from '@angular/core';
import { ScoreCardClass } from '../models/score-card-class';

import * as _ from 'underscore';

@Pipe({
	name: 'scoreCardType',
	pure: false
})
export class ScoreCardTypePipe implements PipeTransform {
	transform( items: any[], score_card_type: string ) {
		let scoreCards: ScoreCardClass[] = _.filter( items,  function( item ) {
						return item.status == score_card_type;
					});
		return scoreCards;
	}
}
