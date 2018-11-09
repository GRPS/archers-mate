import { BowClass } from './bow-class';
import { ScoreClass } from './score-class';

export class ShooterClass {

	id: 		string;
	name:		string;
	initials:   string;
	gender:     string;
	age:		number;
	isDefault:	boolean;
	isGuest:	boolean;
	bows:       BowClass[] = [];
	score:		ScoreClass;
	image:		string;
	prevImage:	string;

	constructor(values: Object = {}) {
        Object.assign(this, values);
   	}

}