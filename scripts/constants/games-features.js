export const kGamesFeatures = new Map([
	// goose goose duck
	[
		22092,
		[]
	],
	// Among us
	[
		21652,
		[]
	],
	// Apex Legends
	[
		21566,
		[
			'death',
			// 'kill',
			'match_state',
			// 'me',
			// 'revive',
			// 'team',
			// 'roster',
			// 'kill_feed',
			// 'rank',
			// 'match_summary',
			// 'location',
			// 'match_info',
			// 'victory',
			// 'damage',
			// 'inventory'
		]
	],
	// Fortnite
	[
		21216,
		[
			'kill',
			'killed',
			'killer',
			'revived',
			'death',
			'match',
			'match_info',
			'rank',
			'me',
			'phase',
			'location',
			'team',
			'items',
			'counters'
		]
	],
	// CSGO
	[
		7764,
		[
			'death',
			'round_start',
			'match_start',
			'match_end',
			'team_round_win',
			'player_activity_change',
			'team_set',
			'info',
			'scene',
			'match_info',
			'replay',
		]
	],
	// League of Legends
	[
		5426,
		[
			'live_client_data',
			'matchState',
			'match_info',
			'death',
			'respawn',
			'abilities',
			'kill',
			'assist',
			'gold',
			'minions',
			'summoner_info',
			'gameMode',
			'teams',
			'level',
			'announcer',
			'counters',
			'damage',
			'heal'
		]
	],
	// Escape From Tarkov
	[
		21634,
		[
			'match_info',
			'game_info'
		]
	],
	// Minecraft
	[
		8032,
		[
			'game_info',
			'match_info'
		]
	],
	// Overwatch
	[
		10844,
		[
			'game_info',
			'match_info',
			'kill',
			'death'
		]
	],
	// PUBG
	[
		10906,
		[
			'kill',
			'revived',
			'death',
			'killer',
			'match',
			'match_info',
			'rank',
			'counters',
			'location',
			'me',
			'team',
			'phase',
			'map',
			'roster'
		]
	],
	// Rainbow Six Siege
	[
		10826,
		[
			'game_info',
			'match',
			'match_info',
			'roster',
			'kill',
			'death',
			'me',
			'defuser'
		]
	],
	// Splitgate: Arena Warfare
	[
		21404,
		[
			'game_info',
			'match_info',
			'player',
			'location',
			'match',
			'feed',
			'connection',
			'kill',
			'death',
			'portal',
			'assist'
		]
	],
	// Path of Exile
	[
		7212,
		[
			'kill',
			'death',
			'me',
			'match_info'
		]
	],
	// Valorant
	[
		21640,
		[
			'me',
			'game_info',
			'match_info',
			'kill',
			'death',
			'gep_internal'
		]
	],
	// Dota 2
	[
		7314,
		[
			'game_state_changed',
			'match_state_changed',
			'match_detected',
			'daytime_changed',
			'clock_time_changed',
			'ward_purchase_cooldown_changed',
			'match_ended',
			'kill',
			'assist',
			'death',
			'cs',
			'xpm',
			'gpm',
			'gold',
			'hero_leveled_up',
			'hero_respawned',
			'hero_buyback_info_changed',
			'hero_boughtback',
			'hero_health_mana_info',
			'hero_status_effect_changed',
			'hero_attributes_skilled',
			'hero_ability_skilled',
			'hero_ability_used',
			'hero_ability_cooldown_changed',
			'hero_ability_changed',
			'hero_item_cooldown_changed',
			'hero_item_changed',
			'hero_item_used',
			'hero_item_consumed',
			'hero_item_charged',
			'match_info',
			'roster',
			'party',
			'error',
			'hero_pool',
			'me',
			'game'
		]
	],
	// Call of Duty: Warzone
	[
		21626,
		[
			'match_info',
			'game_info',
			'kill',
			'death'
		]
	],
	// Warframe
	[
		8954,
		[
			'game_info',
			'match_info'
		]
	],
	// rocket league
	[
		10798,
		[
			'stats',
			'roster',
			'match',
			'me',
			'match_info',
			'death',
			'game_info'
		]
	]
]);

export const kGameClassIds = Array.from(kGamesFeatures.keys());
