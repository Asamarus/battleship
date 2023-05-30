import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';
import Button from 'main/components/ui/controls/button';

import gameEvents from 'main/gameEvents';

import styles from './GameState.less';

const propTypes = {
	//from ui
	state: PropTypes.string,
};

const defaultProps = {
	//from ui
};

const uiProps = ownProps => {
	return {
		Statistics: {
			state: 'state',
		},
	};
};

class GameState extends Component {
	constructor(props) {
		super(props);
	}

	onNewGameClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onNewGameClick">
		ee.trigger(events.gameEvent, { event: gameEvents.game.newGame });
		uiStore.set('Popups.statistics', false);
		//</editor-fold>
	};

	renderWon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderWon">
		return (
			<div className={styles['info-wrapper']}>
				<div>
					<div className={styles['icon-wrapper']}>
						<i
							className={`${styles['won-icon']} mdi mdi-checkbox-marked-circle`}
						/>
					</div>
					<div style={{ height: 20 }} />
					<div className={styles['won-text']}>
						<Text name="you_won" />
					</div>
				</div>
			</div>
		);
		//</editor-fold>
	};

	renderLost = () => {
		//<editor-fold defaultstate="collapsed" desc="renderLost">
		return (
			<div className={styles['info-wrapper']}>
				<div>
					<div className={styles['icon-wrapper']}>
						<i className={`${styles['lost-icon']} mdi mdi-close-circle`} />
					</div>
					<div style={{ height: 20 }} />
					<div className={styles['lost-text']}>
						<Text name="you_lost" />
					</div>
				</div>
			</div>
		);
		//</editor-fold>
	};

	render() {
		const { state } = this.props;

		const lostWon = state === 'you_won' ? this.renderWon() : this.renderLost();

		return (
			<div>
				{lostWon}
				<div className={styles['button-wrapper']}>
					<Button
						fullWidth={false}
						title={<Text name="new_game" />}
						onClick={this.onNewGameClick}
					/>
				</div>
			</div>
		);
	}
}

GameState.propTypes = propTypes;

GameState.defaultProps = defaultProps;

GameState = WithUi(uiProps)(GameState);

export default GameState;
