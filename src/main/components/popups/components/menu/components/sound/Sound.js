import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Settings from 'main/logic/Settings';

import styles from './Sound.less';

const propTypes = {
	//from ui
	enabled: PropTypes.bool,
};

const defaultProps = {
	//from ui
	enabled: false,
};

const uiProps = ownProps => {
	return {
		Settings: {
			sound: 'enabled',
		},
	};
};

class Sound extends PureComponent {
	onClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onClick">
		const { enabled } = this.props;
		Settings.setItem('sound', !enabled);
		//</editor-fold>
	};

	render() {
		const { enabled } = this.props;

		const icon = enabled ? 'mdi mdi-volume-high' : 'mdi mdi-volume-off';

		return (
			<div className={styles['wrapper']} onClick={this.onClick}>
				<i className={`${styles['icon']} ${icon}`} />
			</div>
		);
	}
}

Sound.propTypes = propTypes;

Sound.defaultProps = defaultProps;

Sound = WithUi(uiProps)(Sound);

export default Sound;
