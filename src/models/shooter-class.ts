import { BowClass } from './bow-class';

export class ShooterClass {
	name:		string;
	initials:   string;
	gender:     string;
	age:		number;
	isDefault:	boolean;
	bows:       BowClass[] = [];
}