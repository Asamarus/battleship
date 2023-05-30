class Ai {
	constructor(game, enemy, own) {
		this.game = game;
		this.state = null;

		this.battleFields = {
			enemy: enemy,
			own: own,
		};

		this.busy = false;

		this.shipsToKill = {};
	}

	makeMove() {
		//<editor-fold defaultstate="collapsed" desc="makeMove">
		this.killShips();
		//</editor-fold>
	}

	makeShot(coordinates) {
		//<editor-fold defaultstate="collapsed" desc="makeShot">
		let x, y;

		if (_.isUndefined(coordinates)) {
			x = _.random(0, 9);
			y = _.random(0, 9);
		} else {
			x = coordinates.x;
			y = coordinates.y;
		}

		let isValidShot = this.isValidShot({ x, y });

		while (!isValidShot) {
			x = _.random(0, 9);
			y = _.random(0, 9);

			isValidShot = this.isValidShot({ x, y });
		}

		setTimeout(
			(function(self, localSession, coordinates) {
				return () => {
					if (localSession !== self.game.session) {
						console.error('Game session has changed!');
						return;
					}

					self.game.battleFieldCellClick({
						battleField: self.battleFields['enemy'].name,
						coordinates,
					});
				};
			})(this, this.game.session, { x, y }),
			1000,
		);
		//</editor-fold>
	}

	isValidShot(coordinates) {
		//<editor-fold defaultstate="collapsed" desc="isValidShot">
		const { x, y } = coordinates;

		if (x < 0 || x > 9 || y < 0 || y > 9) {
			return false;
		}

		const cells = this.battleFields['enemy'].data.cells;

		const data = cells[`${x}_${y}`];

		const fire = _.get(data, 'fire', false);
		const missed = _.get(data, 'missed', false);
		const gray = _.get(data, 'gray', false);

		if (fire || missed || gray) {
			return false;
		}

		return true;
		//</editor-fold>
	}

	shipIsWounded({ shipId, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="shipIsWounded">
		if (_g.isEmpty(this.shipsToKill[shipId])) {
			this.shipsToKill[shipId] = {
				shipId: shipId,
				orientation: 'unknown',
				shots: [coordinates],
			};
		} else {
			this.shipsToKill[shipId]['shots'].push(coordinates);
		}
		//</editor-fold>
	}

	shipIsDead({ shipId }) {
		//<editor-fold defaultstate="collapsed" desc="shipIsDead">
		_.unset(this.shipsToKill, shipId);
		//</editor-fold>
	}

	killShips() {
		//<editor-fold defaultstate="collapsed" desc="killShips">
		if (_g.isEmpty(this.shipsToKill)) {
			this.makeShot();
		} else {
			const keys = _.keys(this.shipsToKill);

			const shipToKill = this.shipsToKill[keys[0]];
			this.killShip(shipToKill);
		}
		//</editor-fold>
	}

	killShip(shipToKill) {
		//<editor-fold defaultstate="collapsed" desc="killShip">
		if (shipToKill.orientation === 'unknown' && shipToKill.shots.length >= 2) {
			const firstShot = _.first(shipToKill.shots);
			const lastShot = _.last(shipToKill.shots);

			if (firstShot.y === lastShot.y) {
				shipToKill.orientation = 'horizontal';
			} else if (firstShot.x === lastShot.x) {
				shipToKill.orientation = 'vertical';
			}
		}

		if (shipToKill.orientation === 'unknown') {
			const firstShot = _.first(shipToKill.shots);
			const coordinates = {};

			let isValidShot = false;

			while (!isValidShot) {
				let { x, y } = firstShot;
				const turn = this.getRandomTurn();
				switch (turn) {
					case 'up':
						y += 1;
						break;
					case 'down':
						y -= 1;
						break;
					case 'left':
						x -= 1;
						break;
					case 'right':
						x += 1;
						break;
				}
				isValidShot = this.isValidShot({ x, y });
				coordinates.x = x;
				coordinates.y = y;
			}
			this.makeShot(coordinates);
		} else {
			const coordinates = this.getShotCoordinates(shipToKill);

			this.makeShot(coordinates);
		}
		//</editor-fold>
	}

	getShotCoordinates(shipToKill) {
		//<editor-fold defaultstate="collapsed" desc="getShotCoordinates">
		const coordinates = {};

		let isValidShot = false;

		while (!isValidShot) {
			let { x, y } = shipToKill.shots[_.random(0, shipToKill.shots.length - 1)];

			if (shipToKill.orientation === 'horizontal') {
				x += [-1, 1][_.random(0, 1)];
			} else {
				y += [-1, 1][_.random(0, 1)];
			}

			isValidShot = this.isValidShot({ x, y });
			coordinates.x = x;
			coordinates.y = y;
		}

		return coordinates;
		//</editor-fold>
	}

	getRandomTurn() {
		//<editor-fold defaultstate="collapsed" desc="getRandomTurn">
		return ['up', 'down', 'left', 'right'][_.random(0, 3)];
		//</editor-fold>
	}
}

export default Ai;
