import {
	set,
	multiSet,
	update,
	multiUpdate,
	remove,
	multiRemove,
	batch,
} from 'main/core/store/ui/actions';
import { getAll } from 'main/core/store/ui/selectors';
const uiStore = {
	set: (path, value) => {
		store.dispatch(set(path, value));
	},

	multiSet: params => {
		store.dispatch(multiSet(params));
	},

	update: (path, value) => {
		store.dispatch(update(path, value));
	},

	multiUpdate: params => {
		store.dispatch(multiUpdate(params));
	},

	remove: path => {
		store.dispatch(remove(path));
	},

	multiRemove: params => {
		store.dispatch(multiRemove(params));
	},

	batch: params => {
		store.dispatch(batch(params));
	},

	get: (path, placeholder = null) => {
		return _.get(getAll(store.getState()), path, placeholder);
	},
};

export default uiStore;
