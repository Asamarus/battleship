import {
	SET,
	MULTI_SET,
	UPDATE,
	MULTI_UPDATE,
	REMOVE,
	MULTI_REMOVE,
	BATCH,
} from './action_types';
import createAction from 'main/core/redux/actions/createAction.js';

export const set = (path, value) => {
	return dispatch => {
		dispatch(createAction(SET, { path, value }));
	};
};

export const multiSet = params => {
	return dispatch => {
		dispatch(createAction(MULTI_SET, params));
	};
};

export const update = (path, value) => {
	return dispatch => {
		dispatch(createAction(UPDATE, { path, value }));
	};
};

export const multiUpdate = params => {
	return dispatch => {
		dispatch(createAction(MULTI_UPDATE, params));
	};
};

export const remove = path => {
	return dispatch => {
		dispatch(createAction(REMOVE, path));
	};
};

export const multiRemove = path => {
	return dispatch => {
		dispatch(createAction(MULTI_REMOVE, path));
	};
};

export const batch = path => {
	return dispatch => {
		dispatch(createAction(BATCH, path));
	};
};
