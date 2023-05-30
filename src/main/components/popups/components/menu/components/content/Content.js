import React, { Fragment, PureComponent } from 'react';

import PropTypes from 'prop-types';

import Button from 'main/components/ui/controls/button';
import Text from 'main/components/ui/text';

import gameEvents from 'main/gameEvents';

import styles from './Content.less';

const propTypes = {};

const defaultProps = {};

class Content extends PureComponent {
	onNewGameClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onNewGameClick">
		ee.trigger(events.gameEvent, { event: gameEvents.game.newGame });
		//</editor-fold>
	};

	onRulesClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onRulesClick">
		uiStore.batch({
			set: [
				// {
				// 	path: 'Menu.opened',
				// 	value: false,
				// },
				{
					path: 'Popups.rules',
					value: true,
				},
			],
		});
		//</editor-fold>
	};

	onSettingsClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onSettingsClick">
		uiStore.batch({
			set: [
				// {
				// 	path: 'Menu.opened',
				// 	value: false,
				// },
				{
					path: 'Popups.settings',
					value: true,
				},
			],
		});
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				<div className={styles['button-wrapper']}>
					<Button
						icon="mdi mdi-ship-wheel"
						title={<Text name="new_game" />}
						onClick={this.onNewGameClick}
					/>
				</div>
				<div className={styles['button-wrapper']}>
					<Button
						icon="mdi mdi-script"
						title={<Text name="rules" />}
						onClick={this.onRulesClick}
					/>
				</div>
				<div className={styles['button-wrapper']}>
					<Button
						icon="mdi mdi-wrench"
						title={<Text name="settings" />}
						onClick={this.onSettingsClick}
					/>
				</div>
			</Fragment>
		);
	}
}

Content.propTypes = propTypes;

Content.defaultProps = defaultProps;

export default Content;
