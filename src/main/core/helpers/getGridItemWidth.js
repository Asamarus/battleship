/**
 * Get width of grid item
 *
 *
 * @param {integer}  minWidth - minWidth
 * @param {integer}  gutter - gutter
 * @param {integer} containerWidth - containerWidth
 */
function getGridItemWidth(minWidth, gutter, containerWidth) {
	let gridItemWidth = '';
	if (containerWidth <= (minWidth + gutter) * 2) {
		gridItemWidth = '100%';
	} else {
		let columns = Math.floor(containerWidth / (minWidth + gutter));
		gridItemWidth = containerWidth / columns;

		if (gridItemWidth * columns > containerWidth) {
			gridItemWidth = minWidth;
		}

		if (gridItemWidth < minWidth) {
			gridItemWidth = minWidth;
		}

		columns = Math.floor(containerWidth / gridItemWidth);

		if (gutter > 0) {
			gridItemWidth = `calc((100% / ${columns}) - ${gutter}px)`;
		} else {
			gridItemWidth = `calc(100% / ${columns})`;
		}
	}

	return gridItemWidth;
}

export default getGridItemWidth;
