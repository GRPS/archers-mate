import { Component, Input  } from '@angular/core';

import { ScoreCardClass } from '../../models/score-card-class';

@Component({
  selector: 'scorecard-summary',
  templateUrl: 'scorecard-summary.html'
})
export class ScorecardSummaryComponent {

  @Input() scoreCard: ScoreCardClass;

  constructor() {}

}

