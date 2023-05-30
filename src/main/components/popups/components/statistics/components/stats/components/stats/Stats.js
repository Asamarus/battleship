import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import styles from './Stats.less';

const propTypes = {
	name: PropTypes.string.isRequired,
	//from ui
	cells: PropTypes.object,
};

const defaultProps = {
	//from ui
};

const uiProps = ownProps => {
	return {
		BattleField: {
			[ownProps.name]: {
				cells: 'cells',
			},
		},
	};
};

class Stats extends Component {
	constructor(props) {
		super(props);
	}

	renderFireNumber = () => {
		//<editor-fold defaultstate="collapsed" desc="renderFireNumber">
		let counter = 0;
		const { cells } = this.props;

		for (const key in cells) {
			let cell = cells[key];

			const fire = _.get(cell, 'fire', false);

			if (fire) {
				counter++;
			}
		}

		return counter;
		//</editor-fold>
	};

	renderMissedNumber = () => {
		//<editor-fold defaultstate="collapsed" desc="renderMissedNumber">
		let counter = 0;
		const { cells } = this.props;

		for (const key in cells) {
			let cell = cells[key];

			const missed = _.get(cell, 'missed', false);

			if (missed) {
				counter++;
			}
		}

		return counter;
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['wrapper']}>
				<img src="/img/field/fire.gif" />
				<div className={styles['divider']} />
				<span className={styles['number']}>{this.renderFireNumber()}</span>
				<div className={styles['divider']} />
				<img src="/img/field/missed.png" />
				<div className={styles['divider']} />
				<span className={styles['number']}>{this.renderMissedNumber()}</span>
			</div>
		);
	}
}

Stats.propTypes = propTypes;

Stats.defaultProps = defaultProps;

Stats = WithUi(uiProps)(Stats);

export default Stats;
