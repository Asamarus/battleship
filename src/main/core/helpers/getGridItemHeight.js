/**
 * Get height of grid item in px
 *
 *
 * @param {integer}  minWidth - minWidth
 * @param {integer}  gutter - gutter
 * @param {integer} containerWidth - containerWidth
 */
function getGridItemHeight(minWidth, gutter, containerWidth) {
	let getGridItemHeight;
	if (containerWidth <= (minWidth + gutter) * 2) {
		getGridItemHeight = containerWidth;
	} else {
		let columns = Math.floor(containerWidth / (minWidth + gutter));
		getGridItemHeight = containerWidth / columns;

		if (getGridItemHeight * columns > containerWidth) {
			getGridItemHeight = minWidth;
		}

		if (getGridItemHeight < minWidth) {
			getGridItemHeight = minWidth;
		}

		columns = Math.floor(containerWidth / getGridItemHeight);

		if (gutter > 0) {
			getGridItemHeight = containerWidth / columns - gutter;
		} else {
			getGridItemHeight = containerWidth / columns;
		}
	}

	return getGridItemHeight + 'px';
}

export default getGridItemHeight;
