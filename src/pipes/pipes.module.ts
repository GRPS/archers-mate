import { NgModule } from '@angular/core';
import { ShooterInitialsPipe } from './shooter-initials';
import { RoundPipe } from './round';
import { RoundTypePipe } from './round-type';
import { RoundSeasonPipe } from './round-season';
import { RoundOrganisationPipe } from './round-organisation';
import { NumberIncPipe } from './number-inc';
@NgModule({
	declarations: [ShooterInitialsPipe,
    RoundPipe,
    RoundTypePipe,
    RoundSeasonPipe,
    RoundOrganisationPipe,
    NumberIncPipe],
	imports: [],
	exports: [ShooterInitialsPipe,
    RoundPipe,
    RoundTypePipe,
    RoundSeasonPipe,
    RoundOrganisationPipe,
    NumberIncPipe]
})
export class PipesModule {}
