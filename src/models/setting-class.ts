export class SettingClass {

	showToastOnSave: boolean;
	showToastOnScoreInput: boolean;
	maxScoreCardsBeforWeShowLoadingMessage: boolean;
	shooterImageQuality: number;

	constructor(values: Object = {}) {
        Object.assign(this, values);
   	}

}