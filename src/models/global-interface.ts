import { RoundClass } from './round-class';
import { BowClass } from './bow-class';
import { ShooterClass } from './shooter-class';
import { SettingClass } from './setting-class';

export interface IGlobal {
	rounds:		RoundClass[], 
	bows:		BowClass[],
	shooter:	ShooterClass,
	shooters:	ShooterClass[]
	setting:	SettingClass
}