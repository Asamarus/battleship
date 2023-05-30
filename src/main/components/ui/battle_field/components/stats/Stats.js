import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import styles from './Stats.less';

const propTypes = {
	name: PropTypes.string.isRequired,
	//from ui
	show: PropTypes.bool,
	cells: PropTypes.object,
};

const defaultProps = {
	//from ui
	show: false,
};

const uiProps = ownProps => {
	return {
		Stats: {
			show: 'show',
		},
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

	renderLeftScrollIcon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderLeftScrollIcon">
		const { name } = this.props;

		if (name === 'left') {
			return null;
		}

		return (
			<i
				className={`${styles['scroll-icon']} ${
					styles['scroll-icon_left']
				} mdi mdi-gesture-swipe-left`}
			/>
		);
		//</editor-fold>
	};

	renderRightScrollIcon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderRightScrollIcon">
		const { name } = this.props;

		if (name === 'right') {
			return null;
		}

		return (
			<i
				className={`${styles['scroll-icon']} ${
					styles['scroll-icon_right']
				} mdi mdi-gesture-swipe-right`}
			/>
		);
		//</editor-fold>
	};

	render() {
		const { show } = this.props;

		if (!show) {
			return null;
		}

		return (
			<div className={styles['wrapper']}>
				{this.renderLeftScrollIcon()}
				<img src="/img/field/fire.gif" />
				<div className={styles['divider']} />
				<span className={styles['number']}>{this.renderFireNumber()}</span>
				<div className={styles['divider']} />
				<img src="/img/field/missed.png" />
				<div className={styles['divider']} />
				<span className={styles['number']}>{this.renderMissedNumber()}</span>
				{this.renderRightScrollIcon()}
			</div>
		);
	}
}

Stats.propTypes = propTypes;

Stats.defaultProps = defaultProps;

Stats = WithUi(uiProps)(Stats);

export default Stats;
