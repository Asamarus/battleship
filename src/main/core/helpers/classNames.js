/**
 * https://github.com/JedWatson/classnames
 *
 *
 classNames('foo', 'bar'); // => 'foo bar'
 classNames('foo', { bar: true }); // => 'foo bar'
 classNames({ 'foo-bar': true }); // => 'foo-bar'
 classNames({ 'foo-bar': false }); // => ''
 classNames({ foo: true }, { bar: true }); // => 'foo bar'
 classNames({ foo: true, bar: true }); // => 'foo bar'

 // lots of arguments of various types
 classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

 // other falsy values are just ignored
 classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
 * @param {string}  classNames
 */
const hasOwn = {}.hasOwnProperty;

function classNames() {
	let classes = [];

	for (let i = 0; i < arguments.length; i++) {
		let arg = arguments[i];
		if (!arg) continue;

		let argType = typeof arg;

		if (argType === 'string' || argType === 'number') {
			classes.push(arg);
		} else if (Array.isArray(arg) && arg.length) {
			let inner = classNames.apply(null, arg);
			if (inner) {
				classes.push(inner);
			}
		} else if (argType === 'object') {
			for (let key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(' ');
}

export default classNames;
