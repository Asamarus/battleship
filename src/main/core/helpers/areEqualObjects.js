import cloneDeep from 'main/core/helpers/cloneDeep';
/**
 * Check if two object are equal
 *
 * @param {Object}  object1
 * @param {Object}  object2
 * @param {boolean}  debug - show object comparison
 */
function areEqualObjects(object1, object2, debug) {
	object1 = cloneDeep(object1);
	object2 = cloneDeep(object2);

	for (let prop in object1) {
		if (typeof object1[prop] == 'number') {
			object1[prop] = object1[prop] + '';
		}
	}

	for (let prop in object2) {
		if (typeof object2[prop] == 'number') {
			object2[prop] = object2[prop] + '';
		}
	}

	if (typeof debug !== 'undefined' && debug) {
		console.log('object1:' + JSON.stringify(object1));
		console.log('object2:' + JSON.stringify(object2));
	}

	return JSON.stringify(object1) === JSON.stringify(object2);
}

export default areEqualObjects;
