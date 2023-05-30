import shortid from 'shortid';

/**
 * Generate short id
 *
 */
function generateShortId() {
	return shortid.generate();
}

export default generateShortId;
