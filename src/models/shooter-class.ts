import { BowClass } from './bow-class';

export class ShooterClass {

	id: 		number;
	name:		string;
	initials:   string;
	gender:     string;
	age:		number;
	isDefault:	boolean;
	bows:       BowClass[] = [];

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}
	
}