import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import gameEvents from 'main/gameEvents';

import Text from 'main/components/ui/text';

import styles from './Controls.less';

const propTypes = {
	//from ui
	state: PropTypes.string,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'state',
		},
	};
};

class Controls extends Component {
	constructor(props) {
		super(props);
	}

	onRandomizeClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onRandomizeClick">
		ee.trigger(events.gameEvent, { event: gameEvents.battleField.randomize });
		//</editor-fold>
	};

	onResetClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onResetClick">
		ee.trigger(events.gameEvent, { event: gameEvents.battleField.reset });
		//</editor-fold>
	};

	render() {
		const { state } = this.props;

		if (state !== 'place_your_ships') {
			return null;
		}

		return (
			<div className={styles['wrapper']}>
				<div className={styles['item']} onClick={this.onRandomizeClick}>
					<i className={`${styles['icon']} mdi mdi-shuffle`} />
					<Text name="randomize" />
				</div>
				<div className={styles['divider']} />
				<div className={styles['item']} onClick={this.onResetClick}>
					<i className={`${styles['icon']} mdi mdi-eraser`} />
					<Text name="reset" />
				</div>
			</div>
		);
	}
}

Controls.propTypes = propTypes;

Controls.defaultProps = defaultProps;

Controls = WithUi(uiProps)(Controls);

export default Controls;
