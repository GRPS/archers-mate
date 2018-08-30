import { TargetClass } from './target-class';

export class RoundClass {
	
	id: 			number;
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

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}
}