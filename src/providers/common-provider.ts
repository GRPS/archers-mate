import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommonProvider {

  constructor() {
    console.log(' CommonProvider loaded');
  }

  HttpLogResponse( res: Response ) {
		console.log( res );
	}

	HttpCatchError( error: Response | any ) {
		console.log( error.message || error );
		return Observable.throw( error || 'CatctError called!' );
  }
  
}
