import { kAppStates } from './app-states.js';

export const kStatesConfig = {
	'*': { // Generic game state
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION, // Defines we should trigger state change by launchedWithGameEvent
			'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		firstQuestionDelay: 10,
		questionInterval: 999999999,
	},
	'5426': { // lol game id
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_GAME_QUESTION_SUGGESTION, // Defines we should trigger state change by launchedWithGameEvent
			'gameProcessStart': kAppStates.IN_GAME_QUESTION_SUGGESTION,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		infoUpdate: null,
		eventUpdate: {
			'event.name': {
				// 'matchStart': kAppStates.IN_GAME_HIDDEN,
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'matchEnd': null // matchEnd is deprecated by OW
			}
		}
	},
	// '10540': { // The Sims 4
	// 	processUpdate: {
	// 		'launchedWithGameEvent': kAppStates.IN_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessStart': kAppStates.IN_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
	// 	}
	// },
	'6738': { // Terraria
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		firstQuestionDelay: 5,
		questionInterval: 600,
	},
	// '8032': { //minecraft
	// 	processUpdate: {
	// 		'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION, // Defines we should trigger state change by launchedWithGameEvent
	// 		'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
	// 	},
	// 	firstQuestionDelay: 10,
	// 	questionInterval: 600,
	// },
	// '21650': { // fall guys
	// 	processUpdate: {
	// 		'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION, // Defines we should trigger state change by launchedWithGameEvent
	// 		'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
	// 	},
	// 	firstQuestionDelay: 10,
	// 	questionInterval: 600,
	// },
	'21652': { // Among us
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		firstQuestionDelay: 1,
		// questionInterval: 600,
	},
	// '3683': { // Osu!
	// 	processUpdate: {
	// 		'launchedWithGameEvent': kAppStates.IN_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessStart': kAppStates.IN_GAME_QUESTION_SUGGESTION,
	// 		'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
	// 	}
	// },
	'21566': { // Apex Legends
		processUpdate: {
			// Low FPS during game loading
			// Originally used IN_NO_EVENTS_GAME_QUESTION_SUGGESTION to have a delay, but the timing is not hitting

			// 'launchedWithGameEvent': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION,
			// 'gameProcessStart': kAppStates.IN_NO_EVENTS_GAME_QUESTION_SUGGESTION, // Low FPS during game loading
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		infoUpdate: {
			'info.game_info.phase': {}
		},
		eventUpdate: {
			'name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': kAppStates.IN_GAME_QUESTION_SUGGESTION,
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			},
			'event.name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': kAppStates.IN_GAME_QUESTION_SUGGESTION,
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			}
		},
		// IN_NO_EVENTS_GAME_QUESTION_SUGGESTION
		// firstQuestionDelay: 20,
		// questionInterval: 600,

	},
	'7764': { // CS:GO https://overwolf.github.io/api/games/events/counter-strike-global-offensive
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_GAME_HIDDEN, // Defines we should trigger state change by launchedWithGameEvent
			'gameProcessStart': kAppStates.IN_GAME_HIDDEN,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		infoUpdate: {
			'info.scene.scene': {
				'LoadingScreen': kAppStates.IN_GAME_QUESTION_SUGGESTION,
				'ClientLoading': kAppStates.IN_GAME_QUESTION_SUGGESTION,
			},
			'info.round.phase': {
				'gameover': kAppStates.IN_GAME_QUESTION_SUGGESTION,
			}
		},
		eventUpdate: {
			'name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': kAppStates.IN_GAME_QUESTION_SUGGESTION,
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			},
			'event.name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': kAppStates.IN_GAME_QUESTION_SUGGESTION,
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			}
		}
	},
	'21640': { // VALORANT (https://overwolf.github.io/api/games/events/valorant)
		processUpdate: {
			'launchedWithGameEvent': kAppStates.IN_GAME_HIDDEN, // Defines we should trigger state change by launchedWithGameEvent
			'gameProcessStart': kAppStates.IN_GAME_HIDDEN,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		infoUpdate: {
			'info.game_info.scene': {
				'CharacterSelectPersistentLevel': kAppStates.IN_GAME_QUESTION_SUGGESTION, // NOT SURE WE HAVE ENOUGH TIME THERE
			}
		},
		eventUpdate: {
			'name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': {
					// Key must be defined at game-props.js
					'conditions': [{ key: 'valorantGameMode', value: ['deathmatch', 'escalation'], operator: 'nin' }],
					'targetState': kAppStates.IN_GAME_QUESTION_SUGGESTION
				},
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			},
			'event.name': {
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'death': {
					// Key must be defined at game-props.js
					'conditions': [{ key: 'valorantGameMode', value: ['deathmatch', 'escalation'], operator: 'nin' }],
					'targetState': kAppStates.IN_GAME_QUESTION_SUGGESTION
				},
				'match_end': kAppStates.IN_GAME_QUESTION_SUGGESTION
			}
		}
	},
	'21216': { // fortnite game id
		processUpdate: {
			'launchedWithGameEvent': null, // Defines we should trigger state change by launchedWithGameEvent
			'gameProcessStart': null,
			'gameProcessEnd': kAppStates.DESKTOP_AFTER_GAME
		},
		infoUpdate: {
			'info.match_info.partyID': {
				'#EXISTS#': kAppStates.IN_GAME_QUESTION_SUGGESTION
			},
			'info.game_info.phase': {
				'loading_screen': kAppStates.IN_GAME_QUESTION_SUGGESTION,
			}
		},
		eventUpdate: {
			'event.name': {
				// 'matchStart': kAppStates.IN_GAME_HIDDEN,
				// 'match_start': kAppStates.IN_GAME_HIDDEN,
				'matchEnd': null
			}
		}
	}
};
