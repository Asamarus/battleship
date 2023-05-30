import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Text from 'main/components/ui/text';
import RulesContent from './components/content';

const maxWidth = '500px';

const propTypes = {};

const defaultProps = {};

class Rules extends Component {
	constructor(props) {
		super(props);
	}

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		uiStore.set('Popups.rules', false);
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
					title={<Text name="rules" />}
					showCloseControl={true}
					onClose={this.onClose}
				/>
				<Content>
					<RulesContent />
				</Content>
			</Popup>
		);
	}
}

Rules.propTypes = propTypes;

Rules.defaultProps = defaultProps;

export default Rules;
