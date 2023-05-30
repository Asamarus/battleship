const gameEvents = {
	battleField: {
		updateSnapGrid: 'battleField:updateSnapGrid',
		snap: 'battleField:snap',
		replaceShip: 'battleField:replaceShip',
		placeShip: 'battleField:placeShip',
		cellClick: 'battleField:cellClick',
		reset: 'battleField:reset',
		randomize: 'battleField:randomize',
	},
	game: {
		newGame: 'game:newGame',
		ready: 'game:ready',
		answerQuestion: 'game:answerQuestion',
	},
	cheats: {
		showEnemyShips: 'cheats:showEnemyShips',
		horizontalLaser: 'cheats:horizontalLaser',
		verticalLaser: 'cheats:verticalLaser',
		superblast: 'cheats:superblast',
		radar: 'cheats:radar',
	},
};

export default gameEvents;
