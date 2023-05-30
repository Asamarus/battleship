import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';
import StatsUi from './components/stats';
import Fleet from './components/fleet';

import styles from './Stats.less';

const propTypes = {
	//from ui
	duration: PropTypes.number,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Statistics: {
			timePassed: 'duration',
		},
	};
};

class Stats extends Component {
	constructor(props) {
		super(props);
	}

	renderTime = duration => {
		//<editor-fold defaultstate="collapsed" desc="renderTime">
		const portions = [];

		let h = null;
		let m = null;
		let s = null;

		const msInHour = 1000 * 60 * 60;
		const hours = Math.trunc(duration / msInHour);
		if (hours > 0) {
			h = (
				<span>
					{hours} <Text name="h" />
				</span>
			);

			duration = duration - hours * msInHour;
		}

		const msInMinute = 1000 * 60;
		const minutes = Math.trunc(duration / msInMinute);
		if (minutes > 0) {
			portions.push(minutes + 'm');
			m = (
				<span>
					{minutes} <Text name="m" />
				</span>
			);
			duration = duration - minutes * msInMinute;
		}

		const seconds = Math.trunc(duration / 1000);
		if (seconds > 0) {
			s = (
				<span>
					{seconds} <Text name="s" />
				</span>
			);
		}

		return (
			<span>
				{h} {m} {s}
			</span>
		);
		//</editor-fold>
	};

	render() {
		const { duration } = this.props;

		let _duration = duration;

		return (
			<div>
				<div className={styles['title']}>
					<Text name="round_time" />: {this.renderTime(_duration)}
				</div>

				<div className={styles['title']}>
					<Text name="player" />
				</div>
				<div className={styles['content']}>
					<div className={styles['inner']}>
						<StatsUi name="left" />
						<div className={styles['divider']} />
						<Fleet name="left" />
					</div>
				</div>
				<div className={styles['divider']} />
				<div className={styles['title']}>
					<Text name="enemy" />
				</div>
				<div className={styles['content']}>
					<div className={styles['inner']}>
						<StatsUi name="right" />
						<div className={styles['divider']} />
						<Fleet name="right" />
					</div>
				</div>
			</div>
		);
	}
}

Stats.propTypes = propTypes;

Stats.defaultProps = defaultProps;

Stats = WithUi(uiProps)(Stats);

export default Stats;
