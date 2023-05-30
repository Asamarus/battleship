import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import GreenButton from 'main/components/ui/controls/green_button';
import Text from 'main/components/ui/text';

import gameEvents from 'main/gameEvents';

import styles from './RightFieldUi.less';

const propTypes = {
	//from ui
	state: PropTypes.string,
	stateExtra: PropTypes.string,
	ships: PropTypes.object,
	showReplay: PropTypes.bool,
};

const defaultProps = {
	//from ui
	ships: {},
	showReplay: false,
};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'state',
			stateExtra: 'stateExtra',
		},
		Replay: {
			show: 'showReplay',
		},
		BattleField: {
			left: {
				ships: 'ships',
			},
		},
	};
};

class RightFieldUi extends Component {
	constructor(props) {
		super(props);
	}

	onReadyClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onReadyClick">
		ee.trigger(events.gameEvent, { event: gameEvents.game.ready });
		//</editor-fold>
	};

	hasShipInPort = () => {
		//<editor-fold defaultstate="collapsed" desc="hasShipInPort">
		const ships = _.filter(this.props.ships, s => s.inPort);

		if (!_g.isEmpty(ships)) {
			return true;
		}

		return false;
		//</editor-fold>
	};

	renderWaitOverlay = () => {
		//<editor-fold defaultstate="collapsed" desc="renderWaitOverlay">
		const { state, stateExtra, showReplay } = this.props;

		if (
			_g.isEmpty(state) ||
			_g.inArray(state, ['place_your_ships', 'your_turn'])
		) {
			return null;
		}

		if (state === 'radar' && stateExtra !== 'radarEnemy') {
			return null;
		}

		const className = _g.classNames(styles['overlay'], {
			[styles['wait']]: !showReplay,
		});

		return <div className={className} />;
		//</editor-fold>
	};

	renderReadyButton = () => {
		//<editor-fold defaultstate="collapsed" desc="renderReadyButton">
		const { state } = this.props;

		if (!(state === 'place_your_ships' && !this.hasShipInPort())) {
			return null;
		}

		return (
			<Fragment>
				<div className={`${styles['overlay']} ${styles['backdrop']}`} />
				<div className={`${styles['overlay']} ${styles['center']}`}>
					<GreenButton
						fullWidth={false}
						theme="custom"
						title={<Text name="ready" />}
						onClick={this.onReadyClick}
					/>
				</div>
			</Fragment>
		);
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				{this.renderReadyButton()}
				{this.renderWaitOverlay()}
			</Fragment>
		);
	}
}

RightFieldUi.propTypes = propTypes;

RightFieldUi.defaultProps = defaultProps;

RightFieldUi = WithUi(uiProps)(RightFieldUi);

export default RightFieldUi;
