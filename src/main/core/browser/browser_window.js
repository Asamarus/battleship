class browser_window {
	static isTouchDevice = false;
	static hasHistoryApi = false;

	static enterIsPressed = false;
	static ctrlIsPressed = false;
	static shiftIsPressed = false;
	static altIsPressed = false;
	static tabIsPressed = false;
	static escIsPressed = false;
	static backspaceIsPressed = false;
	static spaceIsPressed = false;

	static upIsPressed = false;
	static downIsPressed = false;
	static leftIsPressed = false;
	static rightIsPressed = false;

	static device = 'mobile';
	static width = 0;

	/*
   *  Get window sizes
   */
	static getDimensions() {
		return {
			viewport: {
				height: $(window).height(), // returns height of browser viewport
				width: $(window).width(), // returns width of browser viewport
			},
			document: {
				height: $(document).height(), // returns height of HTML document
				width: $(document).width(), // returns width of HTML document
			},
		};
	}

	/*
   *  Get device
   */
	static getDevice(width) {
		if (width <= 480) {
			return 'mobile';
		} else if (width <= 1023) {
			return 'tablet';
		} else {
			return 'desktop';
		}
	}

	/*
   *  Check if current device is touch device
   */
	static _isTouchDevice() {
		return (
			'ontouchstart' in window || 'onmsgesturechange' in window // works on most browsers
		); // works on ie10
	}

	/*
   *  Check if current browser supports history api
   */
	static _hasHistoryApi() {
		return !!(window.history && history.pushState);
	}

	static init() {
		const width = $(window).width();
		browser_window.width = width;
		browser_window.device = browser_window.getDevice(width);

		browser_window.isTouchDevice = browser_window._isTouchDevice();
		browser_window.hasHistoryApi = browser_window._hasHistoryApi();

		/* ========================================================================*
    *
    *                        Usefull event listeners
    *
    * ========================================================================*/
		/*
     *  Keyboard keys up events
     */
		$(document).on('keyup', function(e) {
			//keycode
			ee.trigger(events.keyup.keycode, { keycode: e.keyCode, event: e });

			switch (e.keyCode) {
				case 13:
					//enter
					browser_window.enterIsPressed = false;
					ee.trigger(events.keyup.enter, { event: e });
					break;
				case 17:
					//ctrl
					browser_window.ctrlIsPressed = false;
					ee.trigger(events.keyup.ctrl, { event: e });
					break;
				case 16:
					//shift
					browser_window.shiftIsPressed = false;
					ee.trigger(events.keyup.shift, { event: e });
					break;
				case 18:
					//alt
					browser_window.altIsPressed = false;
					ee.trigger(events.keyup.alt, { event: e });
					break;
				case 9:
					//tab
					browser_window.tabIsPressed = false;
					ee.trigger(events.keyup.tab, { event: e });
					break;
				case 27:
					//esc
					browser_window.escIsPressed = false;
					ee.trigger(events.keyup.esc, { event: e });
					break;
				case 8:
					//backspace
					browser_window.backspaceIsPressed = false;
					ee.trigger(events.keyup.backspace, { event: e });
					break;
				case 32:
					//space
					browser_window.spaceIsPressed = false;
					ee.trigger(events.keyup.space, { event: e });
					break;
				case 38:
					//up arrow
					browser_window.upIsPressed = false;
					ee.trigger(events.keyup.up, { event: e });
					break;
				case 40:
					//down arrow
					browser_window.downIsPressed = false;
					ee.trigger(events.keyup.down, { event: e });
					break;
				case 37:
					//left arrow
					browser_window.leftIsPressed = false;
					ee.trigger(events.keyup.left, { event: e });
					break;
				case 39:
					//right arrow
					browser_window.rightIsPressed = false;
					ee.trigger(events.keyup.right, { event: e });
					break;
			}
		});

		/*
     *  Keyboard keys down events
     */
		$(document).on('keydown', function(e) {
			//keycode
			ee.trigger(events.keydown.keycode, { keycode: e.keyCode, event: e });

			switch (e.keyCode) {
				case 13:
					//enter
					browser_window.enterIsPressed = true;
					ee.trigger(events.keydown.enter, { event: e });
					break;
				case 17:
					//ctrl
					browser_window.ctrlIsPressed = true;
					ee.trigger(events.keydown.ctrl, { event: e });
					break;
				case 16:
					//shift
					browser_window.shiftIsPressed = true;
					ee.trigger(events.keydown.shift, { event: e });
					break;
				case 18:
					//alt
					browser_window.altIsPressed = true;
					ee.trigger(events.keydown.alt, { event: e });
					break;
				case 9:
					//tab
					browser_window.tabIsPressed = true;
					ee.trigger(events.keydown.tab, { event: e });
					break;
				case 27:
					//esc
					browser_window.escIsPressed = true;
					ee.trigger(events.keydown.esc, { event: e });
					break;
				case 8:
					//backspace
					browser_window.backspaceIsPressed = true;
					ee.trigger(events.keydown.backspace, { event: e });
					break;
				case 32:
					//space
					browser_window.spaceIsPressed = true;
					ee.trigger(events.keydown.space, { event: e });
					break;
				case 38:
					//up arrow
					browser_window.upIsPressed = true;
					ee.trigger(events.keydown.up, { event: e });
					break;
				case 40:
					//down arrow
					browser_window.downIsPressed = true;
					ee.trigger(events.keydown.down, { event: e });
					break;
				case 37:
					//left arrow
					browser_window.leftIsPressed = true;
					ee.trigger(events.keydown.left, { event: e });
					break;
				case 39:
					//right arrow
					browser_window.rightIsPressed = true;
					ee.trigger(events.keydown.right, { event: e });
					break;
			}
		});

		/*
     *  Window scroll
     */
		$(window).scroll(function() {
			if ($(window).scrollTop() === 0) {
				ee.trigger(events.browserWindow.scrolledToTop);
			}

			if ($(window).scrollTop() + $(window).height() === $(document).height()) {
				ee.trigger(events.browserWindow.scrolledToBottom);
			}
		});

		/*
      *  Browser window resize event
         Fires only after user stopped resizing window
      */
		let resizeTimer;

		$(window).on('resize', function(e) {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				//console.log({resize:browser_window.getDimensions()});
				const width = $(window).width();
				const device = browser_window.getDevice(width);
				const widthChange = width !== browser_window.width;

				browser_window.width = width;
				browser_window.device = device;
				const payLoad = {
					event: e,
					width: width,
					device: device,
				};

				ee.trigger(events.browserWindow.resize, payLoad);

				if (widthChange) {
					ee.trigger(events.browserWindow.widthChange, payLoad);
				}
			}, 250);
		});
	}
}

export default browser_window;
