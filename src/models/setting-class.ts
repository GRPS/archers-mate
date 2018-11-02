export class SettingClass {

	showToastOnSave: boolean;
	showToastOnScoreInput: boolean;
	maxScoreCardsBeforWeShowLoadingMessage: boolean;

	constructor(values: Object = {}) {
        Object.assign(this, values);
   	}

}