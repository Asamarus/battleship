import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import Content from './components/content';
import Langs from './components/langs';
import Text from 'main/components/ui/text';
import Popup from 'main/components/ui/popup';

import styles from './Menu.less';

const propTypes = {};

const defaultProps = {};

class Menu extends PureComponent {
	onMenuCloseClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onMenuCloseClick">
		uiStore.set('Menu.opened', false);
		//</editor-fold>
	};

	renderHeader = () => {
		return (
			<div className={styles['header']}>
				<span className={styles['header_text']}>
					<Text name="menu" />
				</span>
				<div
					className={styles['header_close-wrapper']}
					onClick={this.onMenuCloseClick}>
					<i className={`${styles['header_icon']} mdi mdi-close`} />
				</div>
			</div>
		);
	};

	render() {
		return (
			<Popup level={0} contentWrapStyle={{ maxWidth: 600 }}>
				<div className={styles['wrapper']}>
					{this.renderHeader()}
					<Content />
					<Langs />
				</div>
			</Popup>
		);
	}
}

Menu.propTypes = propTypes;

Menu.defaultProps = defaultProps;

export default Menu;
