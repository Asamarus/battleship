import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';

import styles from './CheatsIcon.less';

const propTypes = {
	//from ui
	cheats: PropTypes.bool,
};

const defaultProps = {
	//from ui
	cheats: false,
};

const uiProps = ownProps => {
	return {
		Settings: {
			cheats: 'cheats',
		},
	};
};

class CheatsIcon extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">

		ee.on(events.keyup.keycode, this.onKeyCode);
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">

		ee.off(events.keyup.keycode, this.onKeyCode);
		//</editor-fold>
	}

	onKeyCode = ({ keycode }) => {
		//<editor-fold defaultstate="collapsed" desc="onKeyCode">

		const { cheats } = this.props;
		if (keycode === 68 && cheats) {
			uiStore.set('Popups.cheats', true);
		}
		//</editor-fold>
	};

	onIconClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onIconClick">
		uiStore.set('Popups.cheats', true);
		//</editor-fold>
	};

	render() {
		const { cheats } = this.props;

		if (!cheats) {
			return null;
		}

		return (
			<div className={styles['wrapper']} onClick={this.onIconClick}>
				<i className={`${styles['cheats-icon']} mdi mdi-ninja`} />
			</div>
		);
	}
}

CheatsIcon.propTypes = propTypes;

CheatsIcon.defaultProps = defaultProps;

CheatsIcon = WithUi(uiProps)(CheatsIcon);

export default CheatsIcon;
