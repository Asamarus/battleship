import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Text from 'main/components/ui/text';
import Button from 'main/components/ui/controls/button';

import styles from './Replay.less';

const propTypes = {};

const defaultProps = {};

class Replay extends Component {
	constructor(props) {
		super(props);
	}

	onReplayClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onReplayClick">

		uiStore.batch({
			set: [
				{
					path: 'Popups.statistics',
					value: false,
				},
				{
					path: 'Replay.show',
					value: true,
				},
			],
		});
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['button-wrapper']}>
				<Button
					fullWidth={false}
					title={<Text name="replay" />}
					onClick={this.onReplayClick}
				/>
			</div>
		);
	}
}

Replay.propTypes = propTypes;

Replay.defaultProps = defaultProps;

export default Replay;
