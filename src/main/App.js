import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithBrowserWidth from 'hoc/browser/with_browser_width';

import Header from 'main/components/layout/header';
import Playground from 'main/components/layout/playground';
import Popups from 'main/components/popups';
import AudioPlayer from 'main/components/ui/misc/audio_player';

import Settings from 'main/logic/Settings';
import Game from 'main/logic/Game';

import lv from 'main/translations/lv';
import en from 'main/translations/en';
import ru from 'main/translations/ru';

const propTypes = {
	//from hoc
	browserWidth: PropTypes.number,
};

const defaultProps = {};

class App extends Component {
	constructor(props) {
		super(props);

		this.game = new Game();

		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.updateStore();
		ee.on(events.gameEvent, this.onGameEvent);
		//</editor-fold>
	}

	componentDidUpdate(prevProps) {
		//<editor-fold defaultstate="collapsed" desc="componentDidUpdate">
		if (prevProps.browserWidth !== this.props.browserWidth) {
			this.updateCellSize(this.props.browserWidth);
		}
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		ee.off(events.gameEvent, this.onGameEvent);
		//</editor-fold>
	}

	getCellSize = (browserWidth) => {
		//<editor-fold defaultstate="collapsed" desc="getCellSize">
		return browserWidth < 850 ? 26 : 33;
		//</editor-fold>
	};

	onGameEvent = (payload) => {
		//<editor-fold defaultstate="collapsed" desc="onGameEvent">
		this.game.onGameEvent(payload);
		//</editor-fold>
	};

	async updateStore() {
		//<editor-fold defaultstate="collapsed" desc="updateStore">

		const settings = await Settings.getSettings();

		const { browserWidth } = this.props;

		uiStore.batch({
			set: [
				{
					path: 'Global',
					value: {
						cellSize: this.getCellSize(browserWidth),
					},
				},
				{
					path: 'Menu.opened',
					value: true,
				},
				{
					path: 'Settings',
					value: settings,
				},
				{
					path: 'translations',
					value: { lv, en, ru },
				},
			],
		});

		this.setState({ loaded: true });
		//</editor-fold>
	}

	updateCellSize = (browserWidth) => {
		//<editor-fold defaultstate="collapsed" desc="updateCellSize">
		const newCellSize = this.getCellSize(browserWidth);
		const currentCellSize = uiStore.get('Global.cellSize');

		if (newCellSize !== currentCellSize) {
			uiStore.set('Global.cellSize', newCellSize);
		}
		//</editor-fold>
	};

	render() {
		const { loaded } = this.state;

		if (!loaded) {
			return null;
		}

		return (
			<Fragment>
				<Header />
				<Playground />
				<Popups />
				<AudioPlayer />
			</Fragment>
		);
	}
}

App.propTypes = propTypes;

App.defaultProps = defaultProps;

App = WithBrowserWidth(App);

export default App;
