import { ShooterClass } from './shooter-class';
import { RoundClass } from './round-class';

export class ScoreCardClass {

	id: 		number;
	dt: 		string;
	name:		string;
	notes:		string;
	shooters:	ShooterClass[] = [];
	round:		RoundClass;

	status:		string;

	constructor( values: Object = {} ) {
		Object.assign(this, values);		
	}

  }