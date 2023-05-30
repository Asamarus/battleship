/**
 * Create reducer
 *
 * @param {Object}  initialState
 * @param {Object}  handlers
 */
function createReducer(initialState, handlers) {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action.payload);
		} else {
			return state;
		}
	};
}

export default createReducer;
