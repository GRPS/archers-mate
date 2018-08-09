import { SightMarkClass } from './sightmark-class';

export class BowClass {

	name:		string;
	sightMarks:	SightMarkClass[];

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}

  }