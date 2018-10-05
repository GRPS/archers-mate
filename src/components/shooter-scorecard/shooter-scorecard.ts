import { Component, Input  } from '@angular/core';

import { ShooterClass } from '../../models/shooter-class';

@Component({
  selector: 'shooter-scorecard',
  templateUrl: 'shooter-scorecard.html'
})
export class ShooterScorecardComponent {

  @Input() shooter: ShooterClass;
  @Input() index: number;
  
  constructor() {
  }

  placeMe( index ) {

    let nth: string = "th";
    let indexStr = String( index );
    let lastChar = indexStr.substr( indexStr.length - 1 );

    switch( lastChar ) {
      case "1" :
        if( index != 11 ) 
          nth = "st";
        break;
      case "2" :
        if( index != 12 )
          nth = "nd";
        break;
      case "3" :
        if( index != 14 )
          nth = "rd";
        break;
    }
    return index + nth;
  }
}
