import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
	name: 'properCase',
})
export class ProperCasePipe implements PipeTransform {
	transform( convertWord ) {
		
		let words = [
			{ from: 'standard', to: 'Standard' },
			{ from: 'custom', to: 'Custom' },
			{ from: 'fita', to: 'FITA' },
			{ from: 'gnas', to: 'GNAS' },
			{ from: 'outdoor', to: 'Outdoor' },
			{ from: 'indoor', to: 'Indoor' },
			{ from: 'yard', to: 'Yard' },
			{ from: 'meter', to: 'Meter' },
			{ from: 'cm', to: 'cm' },
			{ from: 'inch', to: 'inch' },
			{ from: 'mate', to: 'Male' },
			{ from: 'female', to: 'Female' }
		];

		let res = _.find( words,  function( word ) {
						return word.from == convertWord;
					});

		return res.to;
	}
}