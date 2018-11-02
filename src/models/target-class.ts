export class TargetClass {

	id: 		  string;
	distance:     number;
	size:         number;
	ends:         number;
	totalArrows:  number;
	maxScore:     number;

	constructor(values: Object = {}) {
        Object.assign(this, values);
   	}

}