import EventEmitter from './EventEmitter';

const instance = new EventEmitter();

class ee {
	static on(event_name, callback) {
		instance.addListener(event_name, callback);
	}

	static off(event_name, callback) {
		instance.removeListener(event_name, callback);
	}

	static trigger(event_name, params) {
		instance.emit(event_name, params);
	}
}

export default ee;
