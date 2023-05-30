/**
 *  Get classNames
 *
 *
 *
 * @param {Object} styles - default classNames
 * @param {Object} classNames - overridden classNames

 */
function getClassNames(styles, classNames = {}) {
	const result = _.clone(classNames);

	_.forEach(styles, (value, key) => {
		if (!_.has(result, key)) {
			result[key] = value;
		}
	});

	return result;
}

export default getClassNames;
