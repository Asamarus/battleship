import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Text from 'main/components/ui/text';
import ShipModels from './components/ship_models';
import Extras from './components/extras';

const maxWidth = '600px';

const propTypes = {};

const defaultProps = {};

class Settings extends Component {
	constructor(props) {
		super(props);
	}

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		uiStore.set('Popups.settings', false);
		//</editor-fold>
	};

	render() {
		return (
			<Popup
				level={1}
				contentWrapStyle={{
					maxWidth: maxWidth,
				}}>
				<Header
					theme="primary"
					title={<Text name="settings" />}
					showCloseControl={true}
					onClose={this.onClose}
				/>
				<Content>
					<ShipModels />
					<div style={{ height: 20 }} />
					<Extras />
				</Content>
			</Popup>
		);
	}
}

Settings.propTypes = propTypes;

Settings.defaultProps = defaultProps;

export default Settings;
