/**
 * Create action
 *
 * @param {String}  type
 * @param {Object}  payload
 */
function createAction(type, payload) {
	return {
		type,
		payload,
	};
}

export default createAction;
