import 'assets/styles/normalize.less';

import 'assets/fonts/material.less';

import 'main/styles.less';
import 'main/core/common';
import Root from 'main/core/Root';

import events from 'main/events';
window.events = { ...window.events, ...events };

import store from 'main/store/config';

import React from 'react';
import { render } from 'react-dom';

import App from 'main/App';

render(
	<Root store={store}>
		<App />
	</Root>,
	document.getElementById('app'),
);
