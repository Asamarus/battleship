import { isArray, toArray } from 'lodash';

/**
 * Recursively clones object or array
 * works faster than _.cloneDeep
 * @param {Object|Array} o
 */
function cloneDeep(o) {
	const wasArray = isArray(o);
	const cloned = extend(true, {}, o);

	if (wasArray) {
		return toArray(cloned);
	} else {
		return cloned;
	}
}

function extend() {
	// Variables
	var extended = {};
	var deep = false;
	var i = 0;
	var length = arguments.length;

	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function(obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				// If deep merge and property is an object, merge properties
				if (
					deep &&
					Object.prototype.toString.call(obj[prop]) === '[object Object]'
				) {
					extended[prop] = extend(true, extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < length; i++) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;
}

export default cloneDeep;
