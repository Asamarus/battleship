import dotProp from 'dot-prop-immutable';
import {
	SET,
	MULTI_SET,
	UPDATE,
	MULTI_UPDATE,
	REMOVE,
	MULTI_REMOVE,
	BATCH,
	SET_ALL,
} from './action_types';
import createReducer from 'main/core/redux/reducers/createReducer';

const initial_state = {};

const modificators = {
	/*** SET_ALL ***/
	[SET_ALL](state, data) {
		return data;
	},

	/*** SET ***/
	[SET](state, { path, value }) {
		return dotProp.set(state, path, value);
	},

	/*** MULTI_SET ***/
	[MULTI_SET](state, params) {
		_.forEach(params, param => {
			const { path, value } = param;
			state = dotProp.set(state, path, value);
		});

		return state;
	},

	/*** UPDATE ***/
	[UPDATE](state, { path, value }) {
		return dotProp.merge(state, path, value);
	},

	/*** MULTI_UPDATE ***/
	[MULTI_UPDATE](state, params) {
		_.forEach(params, param => {
			const { path, value } = param;
			state = dotProp.merge(state, path, value);
		});

		return state;
	},

	/*** REMOVE ***/
	[REMOVE](state, path) {
		return dotProp.delete(state, path);
	},

	/*** MULTI_REMOVE ***/
	[MULTI_REMOVE](state, params) {
		_.forEach(params, path => {
			state = dotProp.delete(state, path);
		});

		return state;
	},

	/*** BATCH ***/
	[BATCH](state, params) {
		const set = _.get(params, 'set', null);

		if (!_.isNull(set)) {
			_.forEach(set, param => {
				const { path, value } = param;
				state = dotProp.set(state, path, value);
			});
		}

		const update = _.get(params, 'update', null);

		if (!_.isNull(update)) {
			_.forEach(update, param => {
				const { path, value } = param;
				state = dotProp.merge(state, path, value);
			});
		}

		const remove = _.get(params, 'remove', null);

		if (!_.isNull(remove)) {
			_.forEach(remove, path => {
				state = dotProp.delete(state, path);
			});
		}

		return state;
	},
};

export default createReducer(initial_state, modificators);
