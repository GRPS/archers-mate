export const Const = {

	LOGGING: true,
	IS_CORDOVA: false,
	IS_TABLET: false,
	IS_ANDROID: false,
	currentShooter: null,
	
	URL: {
		BOWS: './assets/files/bows.json',
		ROUNDS: './assets/files/rounds.json',
		SHOOTERS: './assets/files/shooters.json',
	},

	FOLDER: {
		EXPORTS: 'exports',
		SHOOTERS: 'shooters',
	},

	CAMERA: {
		SHOOTER: {
			QUALITY: 100,
			WIDTH: 300,
			HEIGHT: 300
		}
	},

	MISC: {
		CURRENT_PAGE: '',
		CORDOVA: "cordova",
		SCORE_END_EMPTY: " ", 
		MAX_SCORE_CARDS_BEFORE_WE_SHOW_LOADING_MESSAGE: 100,
		TEST_SCORE_CARD_LABEL: "Test",
		MIN_DATE: '01/01/2010',
		SCORE_CARDS_PER_STORAGE: 1000,
		MAX_SCORE_CARDS: 10000
	},

	LABEL: {
		SHOOTERS: 'shooters',
		BOWS: 'bows',
		ROUNDS: 'rounds',
		SETTINGS: 'settings',
		SCORE_CARDS: 'score-cards',
		SCORE_CARD: 'score-card',
		SHOOTER_POPOVER: 'ShooterPopoverPage',
		SHOW_BUTTON_CREATE_ROUND: 'showButtonCreateRound'
	},

	SCORE_CARD_STATUS: {
		ONGOING: 'ongoing',
		COMPLETED: 'completed',
		DELETED: 'deleted',
		ARCHIVED: 'archived'
	},

	PAGES: {
		HOME: 'HomePage',
		SETTINGS: {
			GENERAL: 'GeneralPage',
			SHOOTERS: 'ShootersPage',
			BOWS: 'BowsPage',
			ROUNDS: 'RoundsPage',
			ABOUT: 'AboutPage',
		},
		SHOOTER_EDIT: 'ShooterPage',
		BOW_EDIT: 'BowPage',
		ROUND_EDIT: 'RoundPage',
		TARGET_EDIT: 'TargetPage',
		SIGHT_MARK_EDIT: 'SightMarkPage',
		SHOOTER_BOW_EDIT: 'ShooterBowPage',
		SCORE_CARD_SETUP: 'ScoreCardSetupPage',
		SCORE_CARDS: 'ScoreCardsPage',
		SCORE_CARD: 'ScoreCardPage',
		SCORE_ENTRY: 'ScoreEntryPage',
		STATS: 'StatsPage',
		STATS_BEGIN: 'StatsBeginPage'
	},

	TOAST: {
		SUCCESS: 'toast-success',
		FAIL: 'toast-fail'
	}

}