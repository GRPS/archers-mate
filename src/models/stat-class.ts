import { RoundClass } from './round-class';
import { ShooterClass } from './shooter-class';
import { ScoreClass } from './score-class';

export class StatClass {
   round: RoundClass;
   shooter: ShooterClass;
   score: ScoreClass;
   dt: string;
}

export class StatDataClass {
    type: string; // round or shooter
    name: string; // round or shooter name
    data: StatDataSubClass[];
    shooter: ShooterClass;
    id: number;
}

export class StatDataSubClass {
    name: string; // round or shooter name. opposite of parent class name
    avg: number;
    scores: StatScoreClass[];
}

export class StatScoreClass {
    score: number;
    date: Date; // used for date range stats
    isBest: boolean;
    isWorst: boolean;
}