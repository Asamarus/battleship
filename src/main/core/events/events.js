/* ========================================================================*
*
*                       Global events
*
* ========================================================================*/
const events = {
	browserWindow: {
		resize: 'browserWindow:resize',
		widthChange: 'browserWindow:widthChange',
		scrolledToBottom: 'browserWindow:scrolledToBottom',
		scrolledToTop: 'browserWindow:scrolledToTop',
	},

	keyup: {
		enter: 'keyup:enter',
		ctrl: 'keyup:ctrl',
		shift: 'keyup:shift',
		alt: 'keyup:alt',
		tab: 'keyup:tab',
		esc: 'keyup:esc',
		backspace: 'keyup:backspace',
		space: 'keyup:space',
		up: 'keyup:up',
		down: 'keyup:down',
		left: 'keyup:left',
		right: 'keyup:right',
		keycode: 'keyup:keycode',
	},

	keydown: {
		enter: 'keydown:enter',
		ctrl: 'keydown:ctrl',
		shift: 'keydown:shift',
		alt: 'keydown:alt',
		tab: 'keydown:tab',
		esc: 'keydown:esc',
		backspace: 'keydown:backspace',
		space: 'keydown:space',
		up: 'keydown:up',
		down: 'keydown:down',
		left: 'keydown:left',
		right: 'keydown:right',
		keycode: 'keydown:keycode',
	},
};

export default events;
