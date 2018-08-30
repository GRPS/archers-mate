import { SightMarkClass } from './sight-mark-class';

export class BowClass {

	id: 		number;
	name:		string;
	sightMarks:	SightMarkClass[];

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}

  }