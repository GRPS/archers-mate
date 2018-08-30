export class SightMarkClass {
    
    id:         number;
    distance:   number;
    unit:       string;
    notch:      string;
    position:   string;  
    note:       string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
       
}