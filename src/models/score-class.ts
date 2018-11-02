export class ScoreStatsClass {
	total_et:	number = 0;
	total_rt:	number = 0;	
	statHits:	number = 0;
	statAvg:	number = 0;
	statXs:		number = 0;
	stat10s:	number = 0;
	stat9s:		number = 0;
	statMs:		number = 0;
}

export class ScoreClass extends ScoreStatsClass {
	targets:	ScoreTargetClass[];
	isComplete: boolean = false;
}

export class ScoreTargetClass extends ScoreStatsClass {
	id:			string;
	ends:		ScoreEndClass[];
}

export class ScoreEndClass extends ScoreStatsClass {
	end:		string[];
}
