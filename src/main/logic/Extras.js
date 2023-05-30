import extras from 'main/logic/data/extras';
import questions from 'main/logic/data/questions';

class Extras {
	constructor(game, name) {
		this.game = game;
		this.name = name;
		this.reset();

		this.timeout = false;
		this.targetShip = null;
	}

	delayedTask(callback, timeout) {
		//<editor-fold defaultstate="collapsed" desc="reset">
		setTimeout(
			(function(self, localSession) {
				return () => {
					if (localSession !== self.game.session) {
						console.error('Game session has changed!');
						return;
					}

					callback();
				};
			})(this, this.game.session),
			timeout,
		);
		//</editor-fold>
	}

	reset() {
		//<editor-fold defaultstate="collapsed" desc="reset">
		this.usage = {};

		this.questions = _.shuffle(questions);

		this.current = null;

		for (const key in extras) {
			let item = extras[key];

			this.usage[item.name] = {
				name: item.name,
				type: item.type,
				max: item.max,
				isBeforeShot: _.get(item, 'isBeforeShot', false),
				current: 0,
			};
		}
		//</editor-fold>
	}

	getRandom(isBeforeShot = false) {
		//<editor-fold defaultstate="collapsed" desc="getRandom">
		const settings = uiStore.get('Settings');
		let stack = [];

		let noise = 5;

		for (let i = 0; i <= _.random(1, noise); i++) {
			stack.push(null);
		}

		for (const key in this.usage) {
			let item = this.usage[key];
			let active = _.get(settings, item.name, true);

			if (item.name === 'penalty_question' && this.name === 'right') {
				active = false;
			}

			if (item.current < item.max && active) {
				if (isBeforeShot) {
					if (item.isBeforeShot) {
						stack.push(item);
					}
				} else {
					if (!item.isBeforeShot) {
						stack.push(item);
					}
				}
			}
		}

		stack = _.shuffle(stack);

		const picked = stack[_.random(0, stack.length - 1)];

		if (!_g.isEmpty(picked) && this.isValid(picked)) {
			return picked;
		}

		return null;
		//</editor-fold>
	}

	isValid(item) {
		//<editor-fold defaultstate="collapsed" desc="isValid">
		if (item.name === 'penalty_mirror') {
			const enemyField = this.name === 'left' ? 'right' : 'left';

			if (_g.isEmpty(this.game.battleFields[enemyField].lastShot)) {
				return false;
			}
			if (
				!this.game.battleFields[this.name].isValidShot(
					this.game.battleFields[enemyField].lastShot,
				)
			) {
				return false;
			}
		} else if (item.name === 'bonus_repair_ship') {
			this.game.battleFields[this.name].calculateValidShipsMovements(true);

			if (!this.game.battleFields[this.name].hasDeadShip()) {
				return false;
			}
			const targetShip = this.game.battleFields[this.name].getMovableShip(
				'dead',
			);

			if (_g.isEmpty(targetShip)) {
				return false;
			}

			this.targetShip = targetShip;
		} else if (item.name === 'bonus_move_ship') {
			this.game.battleFields[this.name].calculateValidShipsMovements(true);
			const targetShip = this.game.battleFields[this.name].getMovableShip(
				'whole',
			);

			if (_g.isEmpty(targetShip)) {
				return false;
			}

			this.targetShip = targetShip;
		}

		return true;
		//</editor-fold>
	}

	incrementUsage(name) {
		//<editor-fold defaultstate="collapsed" desc="incrementUsage">
		this.usage[name].current += 1;
		//</editor-fold>
	}

	process(isBeforeShot = false) {
		//<editor-fold defaultstate="collapsed" desc="process">

		if (isBeforeShot) {
			this.timeout = false;
		}

		let changeTurn = true;
		if (_g.isEmpty(this.current) && !this.timeout) {
			const item = this.getRandom(isBeforeShot);

			if (!_g.isEmpty(item)) {
				changeTurn = false;

				this.setCurrent(item);
				this.activate(this.current);

				switch (this.current.name) {
					case 'penalty_mirror':
						this.penaltyMirror();
						break;
					case 'penalty_ricochet':
						this.penaltyRicochet();
						break;
					case 'bonus_repair_ship':
						this.bonusRepairShip();
						break;
					case 'bonus_move_ship':
						this.bonusMoveShip();
						break;
					case 'penalty_question':
						this.penaltyQuestion();
						break;
				}
			}
		} else if (!_g.isEmpty(this.current) && !isBeforeShot) {
			switch (this.current.name) {
				case 'bonus_extra_shot_1':
					this.current.shotsLeft -= 1;

					if (this.current.shotsLeft <= 0) {
						this.clear();
					} else {
						changeTurn = false;
					}
					break;
				case 'bonus_extra_shot_2':
					this.current.shotsLeft -= 1;
					if (this.current.shotsLeft <= 0) {
						this.clear();
					} else {
						changeTurn = false;
					}
					break;
			}
		}

		return changeTurn;
		//</editor-fold>
	}

	setCurrent(item) {
		//<editor-fold defaultstate="collapsed" desc="setCurrent">
		this.current = {
			name: item.name,
			type: item.type,
		};

		switch (item.name) {
			case 'bonus_extra_shot_1':
				this.current.shotsLeft = 1;
				break;
			case 'bonus_extra_shot_2':
				this.current.shotsLeft = 2;
				break;
		}

		//</editor-fold>
	}

	activate(item) {
		//<editor-fold defaultstate="collapsed" desc="activate">
		this.incrementUsage(item.name);

		if (this.name === 'left') {
			uiStore.set('Notification', {
				show: true,
				text: item.name,
				icon: item.name,
			});
		}
		//</editor-fold>
	}

	clear() {
		//<editor-fold defaultstate="collapsed" desc="clear">
		this.current = null;

		if (this.name === 'left') {
			uiStore.set('Notification', {
				show: false,
			});
		}
		//</editor-fold>
	}

	performClick({ battleField, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="performClick">

		switch (this.current.name) {
			case 'bonus_extra_shot_1':
			case 'bonus_extra_shot_2':
				this.game.makeShot({ battleField, coordinates });
				break;
			case 'bonus_superblast':
				this.bonusSuperBlast({ battleField, coordinates });
				break;
			case 'bonus_laser_horizontal':
				this.bonusLaser({
					battleField,
					coordinates,
					orientation: 'horizontal',
				});
				break;
			case 'bonus_laser_vertical':
				this.bonusLaser({ battleField, coordinates, orientation: 'vertical' });
				break;
			case 'bonus_radar':
				this.bonusRadar({ battleField, coordinates });
				break;
		}

		//</editor-fold>
	}

	bonusSuperBlast({ battleField, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="bonusSuperBlast">
		const { x, y } = coordinates;

		const cells = [coordinates];

		if (x + 1 <= 9) {
			cells.push({ x: x + 1, y });
		}
		if (x - 1 >= 0) {
			cells.push({ x: x - 1, y });
		}

		if (y + 1 <= 9) {
			cells.push({ x: x, y: y + 1 });
		}
		if (y - 1 >= 0) {
			cells.push({ x: x, y: y - 1 });
		}

		this.performMultipleClicks({ battleField, cells });
		//</editor-fold>
	}

	bonusLaser({ battleField, coordinates, orientation }) {
		//<editor-fold defaultstate="collapsed" desc="bonusLaser">
		const { x, y } = coordinates;

		const cells = [];

		if (orientation === 'horizontal') {
			for (let i = 0; i <= 9; i++) {
				cells.push({ x: i, y });
			}
		} else {
			for (let i = 0; i <= 9; i++) {
				cells.push({ x, y: i });
			}
		}

		this.performMultipleClicks({ battleField, cells });
		//</editor-fold>
	}

	bonusRadar({ battleField, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="bonusRadar">
		const { x, y } = coordinates;

		let cells = [coordinates];

		if (x + 1 <= 9) {
			cells.push({ x: x + 1, y });
		}
		if (x - 1 >= 0) {
			cells.push({ x: x - 1, y });
		}
		if (y + 1 <= 9) {
			cells.push({ x: x, y: y + 1 });
		}
		if (y - 1 >= 0) {
			cells.push({ x: x, y: y - 1 });
		}
		if (x + 1 <= 9 && y + 1 <= 9) {
			cells.push({ x: x + 1, y: y + 1 });
		}
		if (x - 1 >= 0 && y - 1 >= 0) {
			cells.push({ x: x - 1, y: y - 1 });
		}
		if (x + 1 <= 9 && y - 1 >= 0) {
			cells.push({ x: x + 1, y: y - 1 });
		}
		if (x - 1 >= 0 && y + 1 <= 9) {
			cells.push({ x: x - 1, y: y + 1 });
		}

		cells = _.filter(cells, ({ x, y }) => {
			if (!this.game.battleFields[battleField].isValidShot({ x, y })) {
				return false;
			}

			const shipId = _.get(
				this.game.battleFields[battleField].shipsLocation,
				`${x}.${y}.shipId`,
				null,
			);

			if (_g.isEmpty(shipId)) {
				return false;
			}

			return true;
		});

		let set = [
			{
				path: 'Game.state',
				value: 'radar',
			},
			{
				path: `BattleField.${battleField}.cells.${x}_${y}.radar`,
				value: true,
			},
		];

		if (this.name === 'right') {
			set.push({
				path: 'Game.stateExtra',
				value: 'radarEnemy',
			});
		}

		for (var i = 0; i < cells.length; i++) {
			const { x, y } = cells[i];
			set.push({
				path: `BattleField.${battleField}.cells.${x}_${y}.radarShip`,
				value: true,
			});
		}

		uiStore.batch({
			set: set,
		});

		this.game.statistics.addToHistory({
			data: {
				left: uiStore.get('BattleField.left'),
				right: uiStore.get('BattleField.right'),
			},
			sound: ['radar'],
		});

		set = [
			{
				path: 'Game.state',
				value: this.game.state,
			},
			{
				path: `BattleField.${battleField}.cells.${x}_${y}.radar`,
				value: false,
			},
		];

		ee.trigger(events.audio.play, 'radar');

		this.delayedTask(() => {
			if (!_g.isEmpty(cells)) {
				for (var i = 0; i < cells.length; i++) {
					const { x, y } = cells[i];
					set.push({
						path: `BattleField.${battleField}.cells.${x}_${y}.radarShip`,
						value: false,
					});
				}

				uiStore.batch({
					set: set,
					remove: ['Game.stateExtra'],
				});

				this.game.statistics.addToHistory({
					data: {
						left: uiStore.get('BattleField.left'),
						right: uiStore.get('BattleField.right'),
					},
					delay: 2000,
				});

				this.performMultipleClicks({ battleField, cells });
			} else {
				uiStore.batch({
					set: set,
					remove: ['Game.stateExtra'],
				});

				this.game.statistics.addToHistory({
					data: {
						left: uiStore.get('BattleField.left'),
						right: uiStore.get('BattleField.right'),
					},
				});

				this.clear();
				this.timeout = true;
				if (this.game.state === 'enemys_turn') {
					this.game.ai.makeMove();
				}
			}
		}, 2000);
		//</editor-fold>
	}

	performMultipleClicks({ battleField, cells }) {
		//<editor-fold defaultstate="collapsed" desc="performMultipleClicks">
		const newHistoryItem = {};
		ee.trigger(
			events.cell.highlight,
			_.map(cells, c => {
				return { battleField, coordinates: c };
			}),
		);

		newHistoryItem.highlight = _.map(cells, c => {
			return { battleField, coordinates: c };
		});

		const results = this.game.battleFields[battleField].cellsClick(cells);

		let changeTurn = true;

		let hasTarget = false;

		for (let i = 0; i < results.length; i++) {
			const result = results[i];

			if (_.isNull(result)) {
				continue;
			}

			switch (result.state) {
				case 'shipIsDead':
					//ee.trigger(events.audio.play, 'killed');
					hasTarget = true;
					this.game.battleFieldShipDead({
						battleField: battleField,
						shipId: result.shipId,
						coordinates: result.coordinates,
						makeMove: false,
					});
					changeTurn = false;
					break;
				case 'shipIsWounded':
					//ee.trigger(events.audio.play, 'explosion');
					hasTarget = true;
					this.game.battleFieldShipWounded({
						battleField: battleField,
						shipId: result.shipId,
						coordinates: result.coordinates,
						makeMove: false,
					});
					changeTurn = false;
					break;
				case 'missed':
					//ee.trigger(events.audio.play, 'shot');
					break;
			}
		}

		uiStore.batch({
			set: [
				{
					path: `BattleField.${battleField}`,
					value: this.game.battleFields[battleField].getData(),
				},
			],
		});

		newHistoryItem.data = {
			left: this.game.battleFields['left'].getData(),
			right: this.game.battleFields['right'].getData(),
		};

		if (hasTarget) {
			ee.trigger(events.audio.play, 'blast');
			newHistoryItem.sound = 'blast';
		} else {
			ee.trigger(events.audio.play, 'shot');
			newHistoryItem.sound = 'shot';
		}

		this.game.statistics.addToHistory(newHistoryItem);

		this.clear();
		this.timeout = true;

		if (changeTurn) {
			this.game.gameChangeTurn();
		} else {
			if (this.game.state === 'enemys_turn' && battleField === 'left') {
				this.game.ai.makeMove();
			}
		}
		//</editor-fold>
	}

	penaltyMirror() {
		//<editor-fold defaultstate="collapsed" desc="penaltyMirror">
		const newHistoryItem = {};

		const enemyField = this.name === 'left' ? 'right' : 'left';

		const lastShot = this.game.battleFields[enemyField].lastShot;

		ee.trigger(events.cell.highlight, [
			{ battleField: this.name, coordinates: lastShot },
		]);

		newHistoryItem.highlight = [
			{ battleField: this.name, coordinates: lastShot },
		];

		const result = this.game.battleFields[this.name].cellClick(lastShot);

		switch (result.state) {
			case 'shipIsDead':
				ee.trigger(events.audio.play, 'killed');
				newHistoryItem.sound = 'killed';
				this.game.battleFieldShipDead({
					battleField: this.name,
					shipId: result.shipId,
					coordinates: result.coordinates,
					makeMove: false,
				});
				break;
			case 'shipIsWounded':
				ee.trigger(events.audio.play, 'explosion');
				newHistoryItem.sound = 'explosion';
				this.game.battleFieldShipWounded({
					battleField: this.name,
					shipId: result.shipId,
					coordinates: result.coordinates,
					makeMove: false,
				});
				break;
			case 'missed':
				ee.trigger(events.audio.play, 'shot');
				newHistoryItem.sound = 'shot';
				break;
		}

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value: 'mirror',
				},
				{
					path: `BattleField.${this.name}`,
					value: this.game.battleFields[this.name].getData(),
				},
			],
		});

		newHistoryItem.data = {
			left: this.game.battleFields['left'].getData(),
			right: this.game.battleFields['right'].getData(),
		};

		this.game.statistics.addToHistory(newHistoryItem);

		this.delayedTask(() => {
			this.clear();
			this.timeout = true;
			this.game.gameChangeTurn();
		}, 2000);
		//</editor-fold>
	}

	penaltyRicochet() {
		//<editor-fold defaultstate="collapsed" desc="penaltyRicochet">
		const newHistoryItem = {};
		let x, y;

		x = _.random(0, 9);
		y = _.random(0, 9);

		let isValidShot = this.game.battleFields[this.name].isValidShot({ x, y });

		while (!isValidShot) {
			x = _.random(0, 9);
			y = _.random(0, 9);

			isValidShot = this.game.battleFields[this.name].isValidShot({ x, y });
		}

		ee.trigger(events.cell.highlight, [
			{ battleField: this.name, coordinates: { x, y } },
		]);

		newHistoryItem.highlight = [
			{ battleField: this.name, coordinates: { x, y } },
		];

		const result = this.game.battleFields[this.name].cellClick({ x, y });

		switch (result.state) {
			case 'shipIsDead':
				ee.trigger(events.audio.play, 'killed');
				newHistoryItem.sound = 'killed';
				this.game.battleFieldShipDead({
					battleField: this.name,
					shipId: result.shipId,
					coordinates: result.coordinates,
					makeMove: false,
				});
				break;
			case 'shipIsWounded':
				ee.trigger(events.audio.play, 'explosion');
				newHistoryItem.sound = 'explosion';
				this.game.battleFieldShipWounded({
					battleField: this.name,
					shipId: result.shipId,
					coordinates: result.coordinates,
					makeMove: false,
				});
				break;
			case 'missed':
				ee.trigger(events.audio.play, 'shot');
				newHistoryItem.sound = 'shot';
				break;
		}

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value: 'ricochet',
				},
				{
					path: `BattleField.${this.name}`,
					value: this.game.battleFields[this.name].getData(),
				},
			],
		});

		newHistoryItem.data = {
			left: this.game.battleFields['left'].getData(),
			right: this.game.battleFields['right'].getData(),
		};

		this.game.statistics.addToHistory(newHistoryItem);

		this.delayedTask(() => {
			this.clear();
			this.timeout = true;
			this.game.gameChangeTurn();
		}, 2000);
		//</editor-fold>
	}

	bonusRepairShip() {
		//<editor-fold defaultstate="collapsed" desc="bonusRepairShip">
		const battleField = this.game.battleFields[this.name];
		const ship = this.targetShip.ship;
		const newCoordinates = this.targetShip.newCoordinates;
		const newOrientation = this.targetShip.newOrientation;

		_.set(battleField.data.ships, `${ship.id}.dead`, false);
		_.set(battleField.data.ships, `${ship.id}.shot`, false);
		if (this.name === 'right') {
			_.set(battleField.data.ships, `${ship.id}.visible`, false);
		}

		if (ship.orientation === 'horizontal') {
			const { x, y } = ship;
			for (let i = 0; i <= ship.size; i++) {
				_.set(battleField.data.cells, `${x + i}_${y}.fire`, false);
				_.set(battleField.data.cells, `${x + i}_${y}.gray`, true);
			}
		} else {
			const { x, y } = ship;
			for (let i = 0; i <= ship.size; i++) {
				_.set(battleField.data.cells, `${x}_${y + i}.fire`, false);
				_.set(battleField.data.cells, `${x}_${y + i}.gray`, true);
			}
		}

		_.unset(battleField.data.cells, `${ship.x}_${ship.y}.shipId`);

		_.set(battleField.data.ships, `${ship.id}.x`, newCoordinates.x);
		_.set(battleField.data.ships, `${ship.id}.y`, newCoordinates.y);
		_.set(battleField.data.ships, `${ship.id}.orientation`, newOrientation);
		_.set(
			battleField.data.cells,
			`${newCoordinates.x}_${newCoordinates.y}.shipId`,
			ship.id,
		);

		if (this.name === 'left') {
			_.set(battleField.data.ships, `${ship.id}.beacon`, true);
		}

		battleField.calculateShispLocations();

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value:
						this.name === 'left'
							? 'your_ship_is_repaired'
							: 'enemys_ship_is_repaired',
				},
				{
					path: `BattleField.${this.name}`,
					value: this.game.battleFields[this.name].getData(),
				},
			],
		});

		this.game.statistics.addToHistory({
			data: {
				left: this.game.battleFields['left'].getData(),
				right: this.game.battleFields['right'].getData(),
			},
		});

		this.delayedTask(() => {
			this.clear();
			this.timeout = true;

			const set = [
				{
					path: 'Game.state',
					value: this.game.state,
				},
			];

			if (this.name === 'left') {
				_.set(battleField.data.ships, `${ship.id}.beacon`, false);

				set.push({
					path: `BattleField.${this.name}.ships.${ship.id}.beacon`,
					value: false,
				});
			}

			uiStore.batch({
				set: set,
			});

			this.game.statistics.addToHistory({
				data: {
					left: this.game.battleFields['left'].getData(),
					right: this.game.battleFields['right'].getData(),
				},
				delay: this.game.state === 'enemys_turn' ? 2000 : 5000,
			});

			if (this.game.state === 'enemys_turn') {
				this.game.ai.makeMove();
			}
		}, this.game.state === 'enemys_turn' ? 2000 : 5000);
		//</editor-fold>
	}

	bonusMoveShip() {
		//<editor-fold defaultstate="collapsed" desc="bonusMoveShip">
		const battleField = this.game.battleFields[this.name];
		const ship = this.targetShip.ship;
		const newCoordinates = this.targetShip.newCoordinates;
		const newOrientation = this.targetShip.newOrientation;

		_.unset(battleField.data.cells, `${ship.x}_${ship.y}.shipId`);

		_.set(battleField.data.ships, `${ship.id}.x`, newCoordinates.x);
		_.set(battleField.data.ships, `${ship.id}.y`, newCoordinates.y);
		_.set(battleField.data.ships, `${ship.id}.orientation`, newOrientation);
		_.set(
			battleField.data.cells,
			`${newCoordinates.x}_${newCoordinates.y}.shipId`,
			ship.id,
		);

		if (this.name === 'left') {
			_.set(battleField.data.ships, `${ship.id}.beacon`, true);
		}

		battleField.calculateShispLocations();

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value:
						this.name === 'left'
							? 'your_ship_is_replaced'
							: 'enemys_ship_is_replaced',
				},
				{
					path: `BattleField.${this.name}`,
					value: this.game.battleFields[this.name].getData(),
				},
			],
		});

		this.game.statistics.addToHistory({
			data: {
				left: this.game.battleFields['left'].getData(),
				right: this.game.battleFields['right'].getData(),
			},
		});

		this.delayedTask(() => {
			this.clear();
			this.timeout = true;

			const set = [
				{
					path: 'Game.state',
					value: this.game.state,
				},
			];

			if (this.name === 'left') {
				_.set(battleField.data.ships, `${ship.id}.beacon`, false);

				set.push({
					path: `BattleField.${this.name}.ships.${ship.id}.beacon`,
					value: false,
				});
			}

			uiStore.batch({
				set: set,
			});

			this.game.statistics.addToHistory({
				data: {
					left: this.game.battleFields['left'].getData(),
					right: this.game.battleFields['right'].getData(),
				},
				delay: this.game.state === 'enemys_turn' ? 2000 : 5000,
			});

			if (this.game.state === 'enemys_turn') {
				this.game.ai.makeMove();
			}
		}, this.game.state === 'enemys_turn' ? 2000 : 5000);
		//</editor-fold>
	}

	penaltyQuestion() {
		//<editor-fold defaultstate="collapsed" desc="penaltyQuestion">
		this.timeout = true;
		const question = this.questions.pop();

		uiStore.batch({
			set: [
				{
					path: 'Game.state',
					value: 'question',
				},
				{
					path: 'Popups.question',
					value: true,
				},
				{
					path: 'Question',
					value: question,
				},
			],
		});
		//</editor-fold>
	}

	answerQuestion() {
		//<editor-fold defaultstate="collapsed" desc="answerQuestion">
		const question = uiStore.get('Question');

		this.current = null;

		let turnChanged = false;

		if (question.userAnswer !== question.answer) {
			this.game.state = 'enemys_turn';
			turnChanged = true;
		}

		uiStore.batch({
			set: [
				{
					path: 'Notification.show',
					value: false,
				},
				{
					path: 'Game.state',
					value: this.game.state,
				},
				{
					path: 'Popups.question',
					value: false,
				},
			],
			remove: ['Question'],
		});

		if (turnChanged) {
			this.game.gameTurnChanged();
		}
		//</editor-fold>
	}
}

export default Extras;
