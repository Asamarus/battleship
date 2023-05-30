/**
 *  Get components display name
 *
 *
 *
 * @param {Object} Component - component

 */
function getDisplayName(Component) {
	return Component.displayName || Component.name || 'Component';
}

export default getDisplayName;
