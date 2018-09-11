export class SettingClass {

	showToastOnSave: boolean;
	showToastOnScoreInput: boolean;

	constructor(values: Object = {}) {
        Object.assign(this, values);
   	}

}