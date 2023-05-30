import $ from 'jquery';
window.$ = $;

import _ from 'lodash';
window._ = _;

import ee from 'main/core/events/ee';
window.ee = ee;

import events from 'main/core/events/events';
window.events = events;

import _g from 'main/core/helpers';
window._g = _g;

import uiStore from 'main/core/containers/ui/uiStore';
window.uiStore = uiStore;

import browser_window from 'main/core/browser/browser_window';
window.browser_window = browser_window;
browser_window.init();
