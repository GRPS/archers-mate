import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Const } from '../providers/constants';

@Injectable()
export class CommonProvider {

	constructor() {
		console.log(' CommonProvider loaded');
	}

	HttpLogResponse( res: Response ) {
		if( Const.LOGGING )
			console.log( res );
	}

	HttpCatchError( error: Response | any ) {
		if( Const.LOGGING )
			console.log( error.message || error );
		return Observable.throw( error || 'CatctError called!' );
	}
  
}
