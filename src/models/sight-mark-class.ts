export class SightMarkClass {
    
    id:         string;
    distance:   number;
    unit:       string;
    notch:      string;
    position:   string;  
    note:       string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
       
}