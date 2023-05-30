import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Text from 'main/components/ui/text';
import GameState from './components/game_state';
import Stats from './components/stats';
import Replay from './components/replay';

const maxWidth = '600px';

const propTypes = {};

const defaultProps = {};

class Statistics extends Component {
	constructor(props) {
		super(props);
	}

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		uiStore.set('Popups.statistics', false);
		//</editor-fold>
	};

	render() {
		return (
			<Popup
				level={10}
				contentWrapStyle={{
					maxWidth: maxWidth,
				}}>
				<Header
					theme="primary"
					title={<Text name="statistics" />}
					showCloseControl={true}
					onClose={this.onClose}
				/>
				<Content>
					<GameState />
					<Stats />
					<Replay />
				</Content>
			</Popup>
		);
	}
}

Statistics.propTypes = propTypes;

Statistics.defaultProps = defaultProps;

export default Statistics;
