import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Text from 'main/components/ui/text';

import styles from './TopControls.less';

const propTypes = {};

const defaultProps = {};

class TopControls extends Component {
	constructor(props) {
		super(props);
	}

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		const items = uiStore.get('Statistics.history');

		uiStore.batch({
			set: [
				{
					path: 'BattleField.left',
					value: _.get(_.last(items), 'data.left'),
				},
				{
					path: 'BattleField.right',
					value: _.get(_.last(items), 'data.right'),
				},
			],
			remove: ['Statistics', 'Replay'],
		});
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['wrapper']}>
				<div className={styles['inner']}>
					<span className={styles['title']}>
						<Text name="replay" />
					</span>
					<div className={styles['close-wrapper']} onClick={this.onClose}>
						<i className={`${styles['close-icon']} mdi mdi-close`} />
					</div>
				</div>
			</div>
		);
	}
}

TopControls.propTypes = propTypes;

TopControls.defaultProps = defaultProps;

export default TopControls;
