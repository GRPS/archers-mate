import { NgModule } from '@angular/core';
import { ShooterInitialsPipe } from './shooter-initials';
import { RoundPipe } from './round';
import { RoundTypePipe } from './round-type';
import { RoundSeasonPipe } from './round-season';
import { RoundOrganisationPipe } from './round-organisation';
import { NumberIncPipe } from './number-inc';
import { ShooterNotDefaultPipe } from './shooter-not-default';

export const pipes = [
	ShooterInitialsPipe,
    RoundPipe,
    RoundTypePipe,
    RoundSeasonPipe,
    RoundOrganisationPipe,
    NumberIncPipe,
    ShooterNotDefaultPipe
];

@NgModule({
	declarations: [ pipes ],
	imports: [],
	exports: [ pipes ]
})
export class PipesModule {}
