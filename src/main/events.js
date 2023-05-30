const events = {
	dragEventListener: {
		onStart: 'dragEventListener:onStart',
		onMove: 'dragEventListener:onMove',
		onEnd: 'dragEventListener:onEnd',
	},
	ship: {
		shake: 'ship:shake',
	},
	cell: {
		highlight: 'cell:highlight',
	},
	playground: {
		onScroll: 'playground:onScroll',
	},
	gameEvent: 'gameEvent',
	audio: {
		play: 'audio:play',
	},
};

export default events;
