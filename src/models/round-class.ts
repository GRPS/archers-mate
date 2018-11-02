import { TargetClass } from './target-class';

export class RoundClass {
	
	id: 			string;
	type:			string;
    organisation:	string;
    name:			string;
	season:			string;
    distance:		string;
	unit:			string;
	scoring:		string;
	arrows: 		number;
	targets: 		TargetClass[];
	totalArrows:	number;
	maxScore:		number;
	maxEnds:		number;
	maxArrows:		number;

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}
}