class Statistics {
	constructor(game) {
		this.game = game;

		this.gameStarted = null;
		this.history = [];
	}

	reset() {
		//<editor-fold defaultstate="collapsed" desc="reset">
		this.gameStarted = new Date();
		this.history = [];
		//</editor-fold>
	}

	addToHistory({ data = {}, sound = null, highlight = [], delay = 2000 }) {
		//<editor-fold defaultstate="collapsed" desc="addToHistory">
		this.history.push({ data: _g.cloneDeep(data), sound, highlight, delay });
		//</editor-fold>
	}

	onGameEnd() {
		//<editor-fold defaultstate="collapsed" desc="onGameEnd">
		const timePassed = Math.abs(this.gameStarted - new Date());

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value: this.game.state,
				},
				{
					path: 'Popups.statistics',
					value: true,
				},
				{
					path: 'Notification.show',
					value: false,
				},
				{
					path: 'Statistics',
					value: {
						timePassed: timePassed,
						state: this.game.state,
						history: _g.cloneDeep(this.history),
					},
				},
			],
		});
		//</editor-fold>
	}
}

export default Statistics;
