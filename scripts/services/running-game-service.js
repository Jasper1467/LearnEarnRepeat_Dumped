/**
 * Detect whether a game is currently running
 */
export class RunningGameService {
	constructor () {
		this._gameRunningChangedListeners = [];
		this._onGameInfoUpdatedBound = this._onGameInfoUpdated.bind(this);
		this.curGameId = null;
		this.prevGameId = null;
		this.isRunningCached = null;
		overwolf.games.onGameInfoUpdated.removeListener(this._onGameInfoUpdatedBound);
		overwolf.games.onGameInfoUpdated.addListener(this._onGameInfoUpdatedBound);
	}

	/**
	 * A game info was updated (running state, or other state changed such as
	 * resolution changed)
	 * @param event
	 * @private
	 */
	_onGameInfoUpdated (event) {
		if (
			event &&
			(event.runningChanged || event.gameChanged)
		) {
			const isRunning = (event.gameInfo && event.gameInfo.isRunning);
			const gameId = event && event.gameInfo && event.gameInfo.classId;

			this._notifyRunningChanged(event, isRunning, gameId);
		}
	}

	_notifyRunningChanged(event, isRunning, gameId) {
		console.log('_onGameInfoUpdated', event)
		for (let listener of this._gameRunningChangedListeners) {
			listener(isRunning, gameId);
		}
	}

	_updateInternalVars (runningGameInfo) {
		const isRunning = (runningGameInfo && runningGameInfo.isRunning);
		const gameId = isRunning ? (runningGameInfo && runningGameInfo.classId) : null;
		if (gameId !== this.prevGameId) {
			this.prevGameId = this.curGameId;
		}
		this.curGameId = gameId;
		let prevRunning = this.isRunningCached;
		this.isRunningCached = isRunning;
		if (this.isRunningCached !== prevRunning) {
			setTimeout(() => this._notifyRunningChanged('_updateInternalVars', this.isRunningCached, this.curGameId), 50);
		}
	}

	/**
	 * Check whether a game is running
	 * @returns {Promise<boolean>}
	 */
	isGameRunning () {
		console.log(`running-game-service isGameRunning.1`);
		return new Promise(resolve => {
			// get the current running game info if any game is running
			overwolf.games.getRunningGameInfo(runningGameInfo => {
				this._updateInternalVars(runningGameInfo); // This updates the cached values
				console.log(`running-game-service isGameRunning.2`, this.isRunningCached);
				resolve({gameId: this.curGameId, isRunning: this.isRunningCached});
			});
		});
	}

	getRunningGameInfo () {
		return new Promise(resolve => {
			// get the current running game info if any game is running
			overwolf.games.getRunningGameInfo(runningGameInfo => {
				this._updateInternalVars(runningGameInfo);
				resolve(runningGameInfo);
			});
		});
	}

	async getCurrentRunningGameId () {
		await this.isGameRunning();
		return this.curGameId;
	}

	addGameRunningChangedListener (callback) {
		this._gameRunningChangedListeners.push(callback);
	}
}
