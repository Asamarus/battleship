import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export const composeEnhancers =
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const configureStore = ({ rootReducer, preloadedState, enhancers }) => {
	let _preloadedState = preloadedState;

	if (_.isUndefined(_preloadedState)) {
		if (_.has(window, '__PRELOADED_STATE__')) {
			_preloadedState = window.__PRELOADED_STATE__;
			delete window.__PRELOADED_STATE__;
		}
	}

	let _enhancers = enhancers;
	if (_.isUndefined(_enhancers)) {
		_enhancers = enhancer;
	}

	return createStore(rootReducer, _preloadedState, _enhancers);
};

export default configureStore;
