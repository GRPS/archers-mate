import { SightMarkClass } from './sightmark-class';

export class BowClass {

	id: 		number;
	name:		string;
	sightMarks:	SightMarkClass[];

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}

  }