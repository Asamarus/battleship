import shipTypes from 'main/logic/data/ships';

class BattleField {
	constructor(game, name) {
		this.game = game;
		this.name = name;
		this.snapGrid = {};
		this.reset();
	}

	reset() {
		//<editor-fold defaultstate="collapsed" desc="reset">
		this.data = {
			cells: {},
			ships: {},
		};

		this.lastShot = null;

		this.validShipMovements = {};
		this.shipsLocation = this.getEmptyField(null);

		this.previousClick = null;
		//</editor-fold>
	}

	getData() {
		//<editor-fold defaultstate="collapsed" desc="getData">
		return _g.cloneDeep(this.data);
		//</editor-fold>
	}

	randomize() {
		//<editor-fold defaultstate="collapsed" desc="randomize">
		this.reset();

		for (let i = 0; i < shipTypes.length; i++) {
			const shipType = shipTypes[i];

			for (let j = 0; j < shipType.amount; j++) {
				const ship = this.getNewShip(shipType.size);

				const { x, y, orientation } = this.getRandomShipPosition(
					ship.id,
					ship.size,
				);

				ship.x = x;
				ship.y = y;
				ship.orientation = orientation;

				this.data.ships[ship.id] = ship;

				this.placeShip({ shipId: ship.id, coordinates: { x, y } });
			}
		}
		//</editor-fold>
	}

	getRandomShipPosition(shipId, size) {
		//<editor-fold defaultstate="collapsed" desc="getRandomShipPosition">
		let orientation, x, y;

		let shipIsPlaced = false;

		this.calculateValidShipMovements(shipId);
		while (!shipIsPlaced) {
			orientation = _.random(0, 1) === 1 ? 'horizontal' : 'vertical';
			x = _.random(0, 9);
			y = _.random(0, 9);

			shipIsPlaced = this.isValidShipPosition({
				size: size,
				orientation,
				shipId: shipId,
				x,
				y,
			});
		}

		return {
			x,
			y,
			orientation,
		};
		//</editor-fold>
	}

	getNewShip(size) {
		//<editor-fold defaultstate="collapsed" desc="getNewShip">
		return {
			id: _g.generateShortId(),
			size: size,
		};
		//</editor-fold>
	}

	getEmptyField(defaultValue = 0) {
		//<editor-fold defaultstate="collapsed" desc="getEmptyField">
		const field = [];

		for (let i = 0; i < 10; i++) {
			field[i] = new Array(10);
		}

		for (let i = 0; i < 10; i++) {
			field[i] = new Array(10);
			for (let j = 0; j < 10; j++) {
				field[i][j] = defaultValue;
			}
		}

		return field;
		//</editor-fold>
	}

	getDataFromStore() {
		//<editor-fold defaultstate="collapsed" desc="getDataFromStore">
		return uiStore.get(`BattleField.${this.name}`);
		//</editor-fold>
	}

	getShipById(shipId) {
		//<editor-fold defaultstate="collapsed" desc="getShipById">
		return _.get(this.data.ships, shipId, null);
		//</editor-fold>
	}

	getShipByIdFromStore(shipId) {
		//<editor-fold defaultstate="collapsed" desc="getShipByIdFromStore">
		const data = this.getDataFromStore();
		return _.get(data.ships, shipId, null);
		//</editor-fold>
	}

	getAllShips() {
		//<editor-fold defaultstate="collapsed" desc="getAllShips">
		return _.map(this.data.ships, s => s);
		//</editor-fold>
	}

	getRandomDeadShip() {
		//<editor-fold defaultstate="collapsed" desc="getRandomDeadShip">
		let ships = this.getAllShips();

		ships = _.filter(ships, s => _.get(s, 'dead', false));

		if (_g.isEmpty(ships)) {
			return null;
		}

		return ships[_.random(0, ships.length - 1)];
		//</editor-fold>
	}

	getRandomWholeShip() {
		//<editor-fold defaultstate="collapsed" desc="getRandomWholeShip">
		let ships = this.getAllShips();

		ships = _.filter(ships, s => _.get(s, 'shot', false));

		if (_g.isEmpty(ships)) {
			return null;
		}

		return ships[_.random(0, ships.length - 1)];
		//</editor-fold>
	}

	hasDeadShip() {
		//<editor-fold defaultstate="collapsed" desc="hasDeadShip">
		const ships = this.getAllShips();

		for (let i = 0; i < ships.length; i++) {
			const ship = ships[i];
			const isDead = _.get(ship, 'dead', false);

			if (isDead) {
				return true;
			}
		}

		return false;
		//</editor-fold>
	}

	getMovableShip(type) {
		//<editor-fold defaultstate="collapsed" desc="getMovableShip">
		let ships = this.getAllShips();

		ships = _.shuffle(ships);

		for (let i = 0; i < ships.length; i++) {
			const ship = ships[i];

			if (!_.isUndefined(type)) {
				if (type === 'dead' && !_.get(ship, 'dead', false)) {
					continue;
				} else if (type === 'whole' && _.get(ship, 'shot', false)) {
					continue;
				}
			}

			const validCoordinates = _.shuffle(
				this.getValidShipMovementsCoordinates(ship.id),
			);

			for (let i = 0; i < validCoordinates.length; i++) {
				const { x, y } = validCoordinates[i];

				const orientation = this.getValidShipOrientation({
					x,
					y,
					size: ship.size,
					validShipMovements: this.validShipMovements[ship.id],
				});

				if (!_g.isEmpty(orientation)) {
					return {
						ship,
						newCoordinates: { x, y },
						newOrientation: orientation,
					};
				}
			}
		}

		return null;
		//</editor-fold>
	}

	getValidShipMovementsCoordinates(shipId) {
		//<editor-fold defaultstate="collapsed" desc="getValidShipMovementsCoordinates">
		const validShipMovements = this.validShipMovements[shipId];
		const coordinates = [];

		for (let x = 0; x <= 9; x++) {
			for (let y = 0; y <= 9; y++) {
				if (validShipMovements[x][y]) {
					coordinates.push({ x, y });
				}
			}
		}

		return coordinates;
		//</editor-fold>
	}

	getValidShipOrientation({ x, y, size, validShipMovements }) {
		//<editor-fold defaultstate="collapsed" desc="getValidShipOrientation">
		let orientation = null;

		let decision = _.shuffle(['horizontal', 'vertical']);

		if (decision === 'horizontal') {
			const cells = [];
			for (let i = 1; i <= size - 1; i++) {
				cells.push(_.get(validShipMovements, `${x + i}.${y}`, 0));
			}

			if (_.every(cells)) {
				return 'horizontal';
			}
		} else {
			const cells = [];
			for (let i = 1; i <= size - 1; i++) {
				cells.push(_.get(validShipMovements, `${x}.${y + i}`, 0));
			}

			if (_.every(cells)) {
				return 'vertical';
			}
		}

		return orientation;
		//</editor-fold>
	}

	place(data, x, y, value) {
		//<editor-fold defaultstate="collapsed" desc="place">
		if (!_.isUndefined(data[x]) && !_.isUndefined(data[x][y])) {
			data[x][y] = value;
		}
		//</editor-fold>
	}

	transpose(data) {
		//<editor-fold defaultstate="collapsed" desc="transpose">
		const display = _g.cloneDeep(data);
		return display[0].map((col, i) => display.map(row => row[i]));
		//</editor-fold>
	}

	calculateValidShipsMovements(includeCurrentShip = false) {
		//<editor-fold defaultstate="collapsed" desc="calculateValidShipsMovements">
		this.validShipMovements = {};
		const ships = this.getAllShips();

		for (let i = 0; i < ships.length; i++) {
			let currentShip = ships[i];
			this.calculateValidShipMovements(currentShip.id, includeCurrentShip);
		}
		//</editor-fold>
	}

	calculateValidShipMovements(currentShipId, includeCurrentShip = false) {
		//<editor-fold defaultstate="collapsed" desc="calculateValidShipMovements">
		this.validShipMovements[currentShipId] = this.getEmptyField(1);
		const cells = this.data.cells;

		for (const coordinates in cells) {
			const [x, y] = coordinates.split('_').map(v => _.toInteger(v));

			let data = cells[coordinates];

			const shipId = _.get(data, 'shipId');

			let includeShip = !_g.isEmpty(shipId);

			if (includeShip && !includeCurrentShip) {
				includeShip = shipId !== currentShipId;
			}

			if (includeShip) {
				const shipData = this.getShipById(shipId);
				const size = _.get(shipData, 'size');
				const orientation = _.get(shipData, 'orientation');

				if (orientation === 'horizontal') {
					for (let i = x - 1; i < x + size + 1; i++) {
						this.place(this.validShipMovements[currentShipId], i, y - 1, 0);
						this.place(this.validShipMovements[currentShipId], i, y, 0);
						this.place(this.validShipMovements[currentShipId], i, y + 1, 0);
					}
				} else {
					for (let i = y - 1; i < y + size + 1; i++) {
						this.place(this.validShipMovements[currentShipId], x - 1, i, 0);
						this.place(this.validShipMovements[currentShipId], x, i, 0);
						this.place(this.validShipMovements[currentShipId], x + 1, i, 0);
					}
				}
			}

			const fire = _.get(data, 'fire', false);
			const missed = _.get(data, 'missed', false);
			const gray = _.get(data, 'gray', false);

			if (fire || missed || gray) {
				this.place(this.validShipMovements[currentShipId], x, y, 0);
			}
		}
		//</editor-fold>
	}

	updateSnapGrid(grid) {
		//<editor-fold defaultstate="collapsed" desc="updateSnapGrid">
		this.snapGrid = _g.cloneDeep(grid);
		//</editor-fold>
	}

	isValidShipPosition({ size, orientation, shipId, x, y }) {
		//<editor-fold defaultstate="collapsed" desc="isValidShipPosition">
		let isValid = true;

		if (orientation === 'horizontal') {
			for (let i = 0; i < size; i++) {
				if (!_.get(this.validShipMovements, `${shipId}.${x + i}.${y}`)) {
					isValid = false;
				}
			}
		} else {
			for (let i = 0; i < size; i++) {
				if (!_.get(this.validShipMovements, `${shipId}.${x}.${y + i}`)) {
					isValid = false;
				}
			}
		}

		return isValid;
		//</editor-fold>
	}

	snap(ship) {
		//<editor-fold defaultstate="collapsed" desc="snap">
		const { grid, cells } = this.snapGrid;

		const currentShipTop = ship.currentTop + ship.elementData.top;
		const currentShipLeft = ship.currentLeft + ship.elementData.left;

		const shipTop = ship.freeTop + ship.elementData.top;
		const shipLeft = ship.freeLeft + ship.elementData.left;
		const shipBottom = shipTop + ship.elementData.height;
		const shipRight = shipLeft + ship.elementData.width;

		//check if ship is inside battle field
		if (
			shipTop >= grid.top &&
			shipLeft >= grid.left &&
			shipBottom <= grid.top + grid.height &&
			shipRight <= grid.left + grid.width + ship.battleFields[0].scrollLeft
		) {
			//get nearest cell and snap to it

			for (let i = 0; i < cells.length; i++) {
				const snapTarget = cells[i];

				if (
					shipLeft >= snapTarget.gravityXStart &&
					shipLeft <= snapTarget.gravityXEnd &&
					shipTop >= snapTarget.gravityYStart &&
					shipTop <= snapTarget.gravityYEnd
				) {
					ship.currentTop += snapTarget.y - currentShipTop;
					ship.currentLeft += snapTarget.x - currentShipLeft;

					if (
						this.isValidShipPosition({
							size: ship.props.parent.props.size,
							orientation: ship.props.parent.props.orientation,
							shipId: ship.props.parent.props.id,
							x: snapTarget.coordinates.x,
							y: snapTarget.coordinates.y,
						})
					) {
						ship.props.parent.newShipPosition = { ...snapTarget.coordinates };
						ship.props.parent.setState({ isValidPosition: true });
					} else {
						ship.props.parent.newShipPosition = null;
						ship.props.parent.setState({ isValidPosition: false });
					}

					break;
				}
			}
		} else {
			ship.props.parent.newShipPosition = null;
			ship.props.parent.setState({ isValidPosition: null });
		}

		//</editor-fold>
	}

	placeShip({ shipId, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="placeShip">
		_.set(this.data.cells, `${coordinates.x}_${coordinates.y}.shipId`, shipId);
		this.calculateValidShipsMovements();
		//</editor-fold>
	}

	placeShipInEditor({ shipId, coordinates }) {
		//<editor-fold defaultstate="collapsed" desc="placeShipInEditor">
		_.set(this.data.cells, `${coordinates.x}_${coordinates.y}.shipId`, shipId);
		_.set(this.data.ships, `${shipId}.x`, coordinates.x);
		_.set(this.data.ships, `${shipId}.y`, coordinates.y);
		_.unset(this.data.ships, `${shipId}.inPort`);

		this.calculateValidShipsMovements();
		//</editor-fold>
	}

	replaceShip({ shipId, coordinates: newCoordinates }) {
		//<editor-fold defaultstate="collapsed" desc="replaceShip">
		const shipData = this.getShipByIdFromStore(shipId);
		if (_g.isEmpty(shipData)) {
			console.error('BattleField.replaceShip', 'no ship with id:' + shipId);
			return;
		}

		const oldCoordinates = { x: shipData.x, y: shipData.y };

		if (
			newCoordinates.x == oldCoordinates.x &&
			newCoordinates.y == oldCoordinates.y
		) {
			//coordinates did not change
			return;
		}

		_.set(
			this.data,
			`cells.${newCoordinates.x}_${newCoordinates.y}.shipId`,
			shipData.id,
		);

		_.set(this.data, `ships.${shipData.id}.x`, newCoordinates.x);

		_.set(this.data, `ships.${shipData.id}.y`, newCoordinates.y);

		_.unset(this.data, `cells.${oldCoordinates.x}_${oldCoordinates.y}.shipId`);

		uiStore.batch({
			set: [
				{
					path: `BattleField.${this.name}.cells.${newCoordinates.x}_${
						newCoordinates.y
					}.shipId`,
					value: shipData.id,
				},
				{
					path: `BattleField.${this.name}.ships.${shipData.id}.x`,
					value: newCoordinates.x,
				},
				{
					path: `BattleField.${this.name}.ships.${shipData.id}.y`,
					value: newCoordinates.y,
				},
			],
			remove: [
				`BattleField.${this.name}.cells.${oldCoordinates.x}_${
					oldCoordinates.y
				}.shipId`,
			],
		});
		this.calculateValidShipsMovements();
		//</editor-fold>
	}

	isValidShot(coordinates) {
		//<editor-fold defaultstate="collapsed" desc="isValidShot">
		const cells = this.data.cells;
		const { x, y } = coordinates;
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

	cellsClick(cells) {
		//<editor-fold defaultstate="collapsed" desc="cellClick">
		const result = [];

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			result.push(this.cellClick(cell));
		}

		return result;
		//</editor-fold>
	}

	cellClick(coordinates) {
		//<editor-fold defaultstate="collapsed" desc="cellClick">
		if (!this.isValidShot(coordinates)) {
			return null;
		}

		const { x, y } = coordinates;

		this.lastShot = { x, y };

		const result = {};
		result.coordinates = { x, y };
		result.state = null; //shipIsDead,shipIsWounded,missed

		const shipId = _.get(this.shipsLocation, `${x}.${y}.shipId`, null);

		if (!_g.isEmpty(shipId)) {
			const isDead = this.shipShot({ shipId, x, y });

			result.state = isDead ? 'shipIsDead' : 'shipIsWounded';
			result.shipId = shipId;
		} else {
			this.markCellAsMissed({ x, y });
			result.state = 'missed';
		}

		return result;
		//</editor-fold>
	}

	shipShot = ({ shipId, x, y }) => {
		//<editor-fold defaultstate="collapsed" desc="shipShot">
		let isDead = false;
		const cells = this.data.cells;
		const shipData = this.getShipById(shipId);
		const shipCoordinates = this.getShipCellsCoordinates(shipId);

		_.set(this.data.cells, `${x}_${y}.fire`, true);
		_.set(this.data, `ships.${shipId}.shot`, true);

		//check if dead
		const damage = [];
		for (let i = 0; i < shipCoordinates.length; i++) {
			const { x, y } = shipCoordinates[i];

			damage.push(_.get(cells, `${x}_${y}.fire`, false));
		}

		if (_.every(damage)) {
			isDead = true;
			//ship is dead
			_.set(this.data, `ships.${shipId}.visible`, true);
			_.set(this.data, `ships.${shipId}.dead`, true);

			//mark area as gray

			if (shipData.orientation === 'horizontal') {
				for (let i = shipData.x - 1; i < shipData.x + shipData.size + 1; i++) {
					this.markCellAsGray({ x: i, y: shipData.y - 1 });
					this.markCellAsGray({ x: i, y: shipData.y });
					this.markCellAsGray({ x: i, y: shipData.y + 1 });
				}
			} else {
				for (let i = shipData.y - 1; i < shipData.y + shipData.size + 1; i++) {
					this.markCellAsGray({ x: shipData.x - 1, y: i });
					this.markCellAsGray({ x: shipData.x, y: i });
					this.markCellAsGray({ x: shipData.x + 1, y: i });
				}
			}
		}

		return isDead;
		//</editor-fold>
	};

	markCellAsMissed = ({ x, y }) => {
		//<editor-fold defaultstate="collapsed" desc="markCellAsMissed">
		_.set(this.data.cells, `${x}_${y}.missed`, true);
		//</editor-fold>
	};

	markCellAsGray = ({ x, y }) => {
		//<editor-fold defaultstate="collapsed" desc="markCellAsGray">
		const cell = _.get(this.data.cells, `${x}_${y}`, null);

		if (x < 0 || x > 9 || y < 0 || y > 9) {
			return;
		}

		const missed = _.get(cell, 'missed', false);

		if (missed) {
			return;
		}

		const fire = _.get(cell, 'fire', false);

		if (fire) {
			return;
		}

		_.set(this.data.cells, `${x}_${y}.gray`, true);
		//</editor-fold>
	};

	rotateShipIfAllowed(coordinates) {
		//<editor-fold defaultstate="collapsed" desc="rotateShipIfAllowed">
		if (_g.isEmpty(this.previousClick)) {
			this.previousClick = { coordinates };
			return;
		}

		if (
			_.get(this.previousClick, 'coordinates.x') != coordinates.x ||
			_.get(this.previousClick, 'coordinates.y' != coordinates.y)
		) {
			this.previousClick = { coordinates };
			return;
		}

		let shipId = uiStore.get(
			`BattleField.${this.name}.cells.${coordinates.x}_${coordinates.y}.shipId`,
		);

		if (_g.isEmpty(shipId)) {
			this.previousClick = null;
			return;
		}

		const shipData = uiStore.get(`BattleField.${this.name}.ships.${shipId}`);

		if (_g.isEmpty(shipData) || !shipData.draggable) {
			this.previousClick = null;
			return;
		}

		const orientation =
			shipData.orientation === 'horizontal' ? 'vertical' : 'horizontal';

		if (
			!this.isValidShipPosition({
				size: shipData.size,
				orientation: orientation,
				shipId: shipData.id,
				x: coordinates.x,
				y: coordinates.y,
			})
		) {
			ee.trigger(events.ship.shake, { shipId: shipData.id });
			this.previousClick = null;
			return;
		}

		_.set(this.data, `ships.${shipData.id}.orientation`, orientation);

		uiStore.set(
			`BattleField.${this.name}.ships.${shipData.id}.orientation`,
			orientation,
		);
		this.calculateValidShipsMovements();

		this.previousClick = null;
		//</editor-fold>
	}

	setShipsProperties(props, updateStore = false) {
		//<editor-fold defaultstate="collapsed" desc="setShipsProperties">
		const ships = this.getAllShips();

		const set = [];

		for (let i = 0; i < ships.length; i++) {
			let currentShip = ships[i];

			_.forEach(props, (v, k) => {
				_.set(this.data, `ships.${currentShip.id}.${k}`, v);

				set.push({
					path: `BattleField.${this.name}.ships.${currentShip.id}.${k}`,
					value: v,
				});
			});
		}

		if (updateStore) {
			uiStore.multiSet(set);
		}
		//</editor-fold>
	}

	setShipProperties(shipId, props, updateStore = false) {
		//<editor-fold defaultstate="collapsed" desc="setShipProperties">
		const shipData = this.getShipById(shipId);

		if (_g.isEmpty(shipData)) {
			return;
		}

		const set = [];

		_.forEach(props, (v, k) => {
			_.set(this.data, `ships.${shipData.id}.${k}`, v);

			set.push({
				path: `BattleField.${this.name}.ships.${shipData.id}.${k}`,
				value: v,
			});
		});

		if (updateStore) {
			uiStore.multiSet(set);
		}
		//</editor-fold>
	}

	createShipsInPort() {
		//<editor-fold defaultstate="collapsed" desc="createShipsInPort">
		for (let i = 0; i < shipTypes.length; i++) {
			const shipType = shipTypes[i];

			for (let j = 0; j < shipType.amount; j++) {
				const ship = this.getNewShip(shipType.size);

				ship.inPort = true;
				ship.orientation = 'horizontal';
				ship.draggable = true;

				this.data.ships[ship.id] = ship;
			}
		}

		this.calculateValidShipsMovements();
		//</editor-fold>
	}

	calculateShispLocations() {
		//<editor-fold defaultstate="collapsed" desc="calculateShispLocations">
		this.shipsLocation = this.getEmptyField(null);

		const cells = this.data.cells;

		for (const coordinates in cells) {
			const [x, y] = coordinates.split('_').map(v => _.toInteger(v));

			let data = cells[coordinates];

			const shipId = _.get(data, 'shipId');

			if (!_g.isEmpty(shipId)) {
				const shipData = this.getShipById(shipId);
				const size = _.get(shipData, 'size');
				const orientation = _.get(shipData, 'orientation');

				if (orientation === 'horizontal') {
					for (let i = x; i < x + size; i++) {
						this.place(this.shipsLocation, i, y, { shipId: shipId });
					}
				} else {
					for (let i = y; i < y + size; i++) {
						this.place(this.shipsLocation, x, i, { shipId: shipId });
					}
				}
			}
		}
		//</editor-fold>
	}

	getShipCellsCoordinates(shipId) {
		//<editor-fold defaultstate="collapsed" desc="getShipCellsCoordinates">
		const coordinates = [];
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const _shipId = _.get(this.shipsLocation, `${i}.${j}.shipId`);

				if (_shipId == shipId) {
					coordinates.push({ x: i, y: j });
				}
			}
		}

		return coordinates;
		//</editor-fold>
	}

	areAllShipsDead() {
		//<editor-fold defaultstate="collapsed" desc="areAllShipsDead">
		const ships = this.data.ships;
		const check = [];
		for (const key in ships) {
			let ship = ships[key];
			check.push(_.get(ship, 'dead', false));
		}

		return _.every(check);
		//</editor-fold>
	}
}

export default BattleField;
