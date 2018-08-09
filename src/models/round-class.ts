import { TargetClass } from './target-class';

export class RoundClass {
	
	type:			string;
    organisation:	string;
    name:			string;
	season:			string;
    distance:		string;
	unit:			string;
	scoring:		number[];
	arrows: 		number;
	targets: 		TargetClass[];
	totalArrows:	number;
	maxScore:		number;
	minmaxScore:	number[];

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}
}