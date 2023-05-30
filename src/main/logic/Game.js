import BattleField from './BattleField';
import Ai from './Ai';
import Statistics from './Statistics';

import Extras from './Extras';

import gameEvents from '/main/gameEvents';

class Game {
	constructor() {
		this.session = null;
		this.state = null;
		this.statistics = new Statistics(this);

		const leftBattleField = new BattleField(this, 'left');
		const rightBattleField = new BattleField(this, 'right');

		this.battleFields = {
			left: leftBattleField,
			right: rightBattleField,
		};

		this.extras = {
			left: new Extras(this, 'left'),
			right: new Extras(this, 'right'),
		};

		this.busy = false;
		this.ai = null;
	}

	onGameEvent({ event, data }) {
		//<editor-fold defaultstate="collapsed" desc="onGameEvent">
		//all events come from user
		//prevent user from spamming events
		if (this.busy) {
			return;
		}

		this.busy = true;

		switch (event) {
			//game events
			case gameEvents.game.newGame:
				this.gameNewGame();
				break;
			case gameEvents.game.ready:
				this.gameReady();
				break;
			case gameEvents.game.answerQuestion:
				this.gameAnswerQuestion();
				break;
			//battle field events
			case gameEvents.battleField.updateSnapGrid:
				this.battleFieldUpdateSnapGrid(data);
				break;
			case gameEvents.battleField.snap:
				this.battleFieldSnap(data);
				break;
			case gameEvents.battleField.replaceShip:
				this.battleFieldReplaceShip(data);
				break;
			case gameEvents.battleField.placeShip:
				this.battleFieldPlaceShip(data);
				break;
			case gameEvents.battleField.randomize:
				this.battleFieldRandomize();
				break;
			case gameEvents.battleField.reset:
				this.battleFieldReset();
				break;
			case gameEvents.battleField.cellClick:
				this.battleFieldCellClick(data);
				break;

			//cheats
			case gameEvents.cheats.showEnemyShips:
				this.cheatsShowEnemyShips();
				break;
			case gameEvents.cheats.horizontalLaser:
				this.cheatsHorizontalLaser();
				break;
			case gameEvents.cheats.verticalLaser:
				this.cheatsVerticalLaser();
				break;
			case gameEvents.cheats.superblast:
				this.cheatsSuperblast();
				break;
			case gameEvents.cheats.radar:
				this.cheatsRadar();
				break;
		}

		this.busy = false;
		//</editor-fold>
	}

	gameNewGame() {
		//<editor-fold defaultstate="collapsed" desc="gameNewGame">
		this.session = _g.generateShortId();
		this.state = 'place_your_ships';

		this.statistics.reset();

		this.extras['left'].reset();
		this.extras['right'].reset();

		this.battleFields['left'].reset();
		this.battleFields['right'].reset();

		this.battleFields['left'].randomize();
		this.battleFields['left'].setShipsProperties({ draggable: true });

		uiStore.batch({
			set: [
				{
					path: 'Menu.opened',
					value: false,
				},
				{
					path: 'Stats.show',
					value: false,
				},
				{
					path: 'Notification.show',
					value: false,
				},
				{
					path: 'Game.state',
					value: 'place_your_ships',
				},
				{
					path: 'BattleField.left',
					value: this.battleFields['left'].getData(),
				},
				{
					path: 'BattleField.right',
					value: this.battleFields['right'].getData(),
				},
			],
		});
		//</editor-fold>
	}

	gameReady() {
		//<editor-fold defaultstate="collapsed" desc="gameReady">

		this.battleFields['right'].reset();

		this.battleFields['right'].randomize();
		this.battleFields['right'].setShipsProperties({ visible: false });
		this.battleFields['left'].setShipsProperties({ draggable: false });

		this.battleFields['right'].calculateShispLocations();
		this.battleFields['left'].calculateShispLocations();

		const state = ['your_turn', 'enemys_turn'][_.random(0, 1)];
		this.state = state;

		this.ai = new Ai(
			this,
			this.battleFields['left'],
			this.battleFields['right'],
		);

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value: state,
				},
				{
					path: 'Stats.show',
					value: true,
				},
				{
					path: 'BattleField.left',
					value: this.battleFields['left'].getData(),
				},
				{
					path: 'BattleField.right',
					value: this.battleFields['right'].getData(),
				},
			],
		});

		ee.trigger(events.audio.play, 'game_started');

		this.statistics.addToHistory({
			data: {
				left: this.battleFields['left'].getData(),
				right: this.battleFields['right'].getData(),
			},
			sound: ['game_started'],
		});

		this.gameTurnChanged();
		//</editor-fold>
	}

	gameChangeTurn() {
		//<editor-fold defaultstate="collapsed" desc="gameChangeTurn">
		if (!this.isGameOver()) {
			let changeTurn = true;

			if (this.state === 'your_turn') {
				changeTurn = this.extras['left'].process();
			} else {
				changeTurn = this.extras['right'].process();
			}

			if (changeTurn) {
				this.state = this.state === 'your_turn' ? 'enemys_turn' : 'your_turn';
				uiStore.set('Game.state', this.state);
			}
			//allows ai to make move
			this.gameTurnChanged();
		}
		//</editor-fold>
	}

	gameTurnChanged() {
		//<editor-fold defaultstate="collapsed" desc="gameTurnChanged">
		if (this.state === 'your_turn') {
			this.extras['left'].process(true);
		} else {
			this.extras['right'].process(true);
		}

		if (this.state === 'enemys_turn') {
			this.ai.makeMove();
		}
		//</editor-fold>
	}

	gameAnswerQuestion() {
		//<editor-fold defaultstate="collapsed" desc="gameAnswerQuestion">
		this.extras['left'].answerQuestion();
		//</editor-fold>
	}

	battleFieldUpdateSnapGrid({ battleField, grid }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldUpdateSnapGrid">
		this.battleFields[battleField].updateSnapGrid(grid);
		//</editor-fold>
	}

	battleFieldSnap({ battleField, ship }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldSnap">
		this.battleFields[battleField].snap(ship);
		//</editor-fold>
	}

	battleFieldReplaceShip({ battleField, shipId, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldReplaceShip">
		this.battleFields[battleField].replaceShip({ shipId, coordinates });
		//</editor-fold>
	}

	battleFieldPlaceShip({ battleField, shipId, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldPlaceShip">
		this.battleFields[battleField].placeShipInEditor({ shipId, coordinates });

		uiStore.batch({
			set: [
				{
					path: 'BattleField.' + battleField,
					value: this.battleFields[battleField].getData(),
				},
			],
		});
		//</editor-fold>
	}

	battleFieldCellClick({ battleField, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldCellClick">
		if (this.state === 'place_your_ships' && battleField === 'left') {
			this.battleFields[battleField].rotateShipIfAllowed(coordinates);
		} else {
			if (!this.battleFields[battleField].isValidShot(coordinates)) {
				return;
			}

			if (this.state === 'your_turn' && battleField === 'right') {
				if (!_g.isEmpty(this.extras['left'].current)) {
					this.extras['left'].performClick({ battleField, coordinates });
				} else {
					this.makeShot({ battleField, coordinates });
				}
			} else if (this.state === 'enemys_turn' && battleField === 'left') {
				if (!_g.isEmpty(this.extras['right'].current)) {
					this.extras['right'].performClick({ battleField, coordinates });
				} else {
					this.makeShot({ battleField, coordinates });
				}
			}
		}

		//</editor-fold>
	}

	battleFieldShipWounded({
		battleField,
		shipId,
		coordinates,
		makeMove = true,
	}) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldShipWounded">
		if (battleField === 'left') {
			this.ai.shipIsWounded({ shipId, coordinates });
			if (this.state === 'enemys_turn' && makeMove) {
				this.ai.makeMove();
			}
		}
		//</editor-fold>
	}

	battleFieldShipDead({ battleField, shipId, coordinates, makeMove = true }) {
		//<editor-fold defaultstate="collapsed" desc="battleFieldShipDead">
		if (!this.isGameOver()) {
			if (battleField === 'left') {
				this.ai.shipIsDead({ shipId, coordinates });
				if (this.state === 'enemys_turn' && makeMove) {
					this.ai.makeMove();
				}
			}
		}
		//</editor-fold>
	}

	battleFieldRandomize() {
		//<editor-fold defaultstate="collapsed" desc="battleFieldRandomize">
		this.battleFields['left'].reset();
		this.battleFields['left'].randomize();
		this.battleFields['left'].setShipsProperties({ draggable: true });

		uiStore.batch({
			set: [
				{
					path: 'BattleField.left',
					value: this.battleFields['left'].getData(),
				},
			],
		});
		//</editor-fold>
	}

	battleFieldReset() {
		//<editor-fold defaultstate="collapsed" desc="battleFieldReset">
		this.battleFields['left'].reset();
		this.battleFields['left'].createShipsInPort();

		uiStore.batch({
			set: [
				{
					path: 'BattleField.left',
					value: this.battleFields['left'].getData(),
				},
			],
		});

		setTimeout(() => {
			const d = $("[data-name='battle-fields']");
			this.scrollBattleFields(d.prop('scrollWidth') / 4);
		}, 100);

		//</editor-fold>
	}

	scrollBattleFields(scrollLeft) {
		//<editor-fold defaultstate="collapsed" desc="scrollBattleFields">
		const d = $("[data-name='battle-fields']");

		d.animate(
			{
				scrollLeft: scrollLeft,
			},
			1000,
		);
		//</editor-fold>
	}

	isGameOver() {
		//<editor-fold defaultstate="collapsed" desc="isGameOver">

		if (this.battleFields['right'].areAllShipsDead()) {
			this.state = 'you_won';
			ee.trigger(events.audio.play, 'win');

			this.statistics.addToHistory({
				data: {
					left: this.battleFields['left'].getData(),
					right: this.battleFields['right'].getData(),
				},
				sound: 'win',
			});

			this.statistics.onGameEnd();

			return true;
		}

		if (this.battleFields['left'].areAllShipsDead()) {
			this.state = 'you_lost';
			ee.trigger(events.audio.play, 'lose');
			this.battleFields['right'].setShipsProperties({ visible: true }, true);

			this.statistics.addToHistory({
				data: {
					left: this.battleFields['left'].getData(),
					right: this.battleFields['right'].getData(),
				},
				sound: 'lose',
			});

			this.statistics.onGameEnd();

			return true;
		}

		return false;
		//</editor-fold>
	}

	makeShot({ battleField, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="makeShot">
		const result = this.battleFields[battleField].cellClick(coordinates);

		if (_.isNull(result)) {
			return;
		}

		ee.trigger(events.cell.highlight, [
			{ battleField: battleField, coordinates: coordinates },
		]);

		uiStore.batch({
			set: [
				{
					path: `BattleField.${battleField}`,
					value: this.battleFields[battleField].getData(),
				},
			],
		});

		const newHistoryItem = {
			data: {
				left: this.battleFields['left'].getData(),
				right: this.battleFields['right'].getData(),
			},
			highlight: [{ battleField: battleField, coordinates: coordinates }],
		};

		switch (result.state) {
			case 'shipIsDead':
				newHistoryItem.sound = 'killed';
				break;
			case 'shipIsWounded':
				newHistoryItem.sound = 'explosion';
				break;
			case 'missed':
				newHistoryItem.sound = 'shot';
				break;
		}

		this.statistics.addToHistory(newHistoryItem);

		switch (result.state) {
			case 'shipIsDead':
				ee.trigger(events.audio.play, 'killed');
				this.battleFieldShipDead({
					battleField: battleField,
					shipId: result.shipId,
					coordinates: coordinates,
				});
				break;
			case 'shipIsWounded':
				ee.trigger(events.audio.play, 'explosion');
				this.battleFieldShipWounded({
					battleField: battleField,
					shipId: result.shipId,
					coordinates: coordinates,
				});
				break;
			case 'missed':
				ee.trigger(events.audio.play, 'shot');
				this.gameChangeTurn();
				break;
		}

		//</editor-fold>
	}

	/* ========================================================================*
	 *
	 *                     Cheats
	 *
	 * ========================================================================*/

	cheatsPrepare() {
		//<editor-fold defaultstate="collapsed" desc="cheatsPrepare">
		if (this.state !== 'your_turn') {
			this.gameNewGame();

			this.battleFields['right'].reset();

			this.battleFields['right'].randomize();
			this.battleFields['right'].setShipsProperties({ visible: false });
			this.battleFields['left'].setShipsProperties({ draggable: false });

			this.battleFields['right'].calculateShispLocations();
			this.battleFields['left'].calculateShispLocations();

			this.state = 'your_turn';

			this.ai = new Ai(
				this,
				this.battleFields['left'],
				this.battleFields['right'],
			);

			uiStore.batch({
				set: [
					{
						path: 'Game.state',
						value: this.state,
					},
					{
						path: 'Stats.show',
						value: true,
					},
					{
						path: 'BattleField.left',
						value: this.battleFields['left'].getData(),
					},
					{
						path: 'BattleField.right',
						value: this.battleFields['right'].getData(),
					},
				],
			});
		}
		//</editor-fold>
	}

	cheatsShowEnemyShips() {
		//<editor-fold defaultstate="collapsed" desc="cheatsShowEnemyShips">
		if (this.state === 'enemys_turn') {
			return;
		}

		this.cheatsPrepare();

		this.battleFields['right'].setShipsProperties({ visible: true }, true);

		uiStore.set('Popups.cheats', false);
		//</editor-fold>
	}

	cheatsHorizontalLaser() {
		//<editor-fold defaultstate="collapsed" desc="cheatsHorizontalLaser">
		if (this.state === 'enemys_turn') {
			return;
		}

		this.cheatsPrepare();

		this.extras['left'].current = {
			name: 'bonus_laser_horizontal',
			type: 'bonus',
		};

		uiStore.batch({
			set: [
				{
					path: 'Notification',
					value: {
						show: true,
						text: 'bonus_laser_horizontal',
						icon: 'bonus_laser_horizontal',
					},
				},
				{
					path: 'Popups.cheats',
					value: false,
				},
			],
		});
		//</editor-fold>
	}

	cheatsVerticalLaser() {
		//<editor-fold defaultstate="collapsed" desc="cheatsVerticalLaser">
		if (this.state === 'enemys_turn') {
			return;
		}

		this.cheatsPrepare();

		this.extras['left'].current = {
			name: 'bonus_laser_vertical',
			type: 'bonus',
		};

		uiStore.batch({
			set: [
				{
					path: 'Notification',
					value: {
						show: true,
						text: 'bonus_laser_vertical',
						icon: 'bonus_laser_vertical',
					},
				},
				{
					path: 'Popups.cheats',
					value: false,
				},
			],
		});
		//</editor-fold>
	}

	cheatsSuperblast() {
		//<editor-fold defaultstate="collapsed" desc="cheatsSuperblast">
		if (this.state === 'enemys_turn') {
			return;
		}

		this.cheatsPrepare();

		this.extras['left'].current = {
			name: 'bonus_superblast',
			type: 'bonus',
		};

		uiStore.batch({
			set: [
				{
					path: 'Notification',
					value: {
						show: true,
						text: 'bonus_superblast',
						icon: 'bonus_superblast',
					},
				},
				{
					path: 'Popups.cheats',
					value: false,
				},
			],
		});
		//</editor-fold>
	}

	cheatsRadar() {
		//<editor-fold defaultstate="collapsed" desc="cheatsRadar">
		if (this.state === 'enemys_turn') {
			return;
		}

		this.cheatsPrepare();

		this.extras['left'].current = {
			name: 'bonus_radar',
			type: 'bonus',
		};

		uiStore.batch({
			set: [
				{
					path: 'Notification',
					value: {
						show: true,
						text: 'bonus_radar',
						icon: 'bonus_radar',
					},
				},
				{
					path: 'Popups.cheats',
					value: false,
				},
			],
		});
		//</editor-fold>
	}
}

export default Game;
