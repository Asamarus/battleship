import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Text from 'main/components/ui/text';
import CheatsContent from './components/content';

const maxWidth = '400px';

const propTypes = {};

const defaultProps = {};

class Cheats extends Component {
	constructor(props) {
		super(props);
	}

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		uiStore.set('Popups.cheats', false);
		//</editor-fold>
	};

	render() {
		return (
			<Popup
				level={3}
				contentWrapStyle={{
					maxWidth: maxWidth,
				}}>
				<Header
					theme="primary"
					title={<Text name="cheats" />}
					showCloseControl={true}
					onClose={this.onClose}
				/>
				<Content>
					<CheatsContent />
				</Content>
			</Popup>
		);
	}
}

Cheats.propTypes = propTypes;

Cheats.defaultProps = defaultProps;

export default Cheats;
