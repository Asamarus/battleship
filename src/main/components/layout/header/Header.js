import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import Text from 'main/components/ui/text';
import NotificationContainer from './components/notification_container';
import CheatsIcon from './components/cheats_icon';

import styles from './Header.less';

const propTypes = {};

const defaultProps = {};

class Header extends PureComponent {
	onMenuIconClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onMenuIconClick">
		uiStore.set('Menu.opened', true);
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['wrapper']} data-name="header">
				<div className={styles['inner']}>
					<div
						className={styles['icon-wrapper']}
						onClick={this.onMenuIconClick}>
						<i className={`${styles['icon']} mdi mdi-menu`} />
					</div>
					<span className={styles['text']}>
						<Text name="app_name" />
					</span>
					<NotificationContainer />
					<CheatsIcon />
				</div>
			</div>
		);
	}
}

Header.propTypes = propTypes;

Header.defaultProps = defaultProps;

export default Header;
