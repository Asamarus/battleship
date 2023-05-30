import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';
import Notification from 'main/components/ui/notification';

const propTypes = {
	//from ui
	show: PropTypes.bool,
	icon: PropTypes.string,
	text: PropTypes.string,
};

const defaultProps = {
	//from ui
	show: false,
};

const uiProps = ownProps => {
	return {
		Notification: {
			show: 'show',
			icon: 'icon',
			text: 'text',
		},
	};
};

class NotificationContainer extends Component {
	constructor(props) {
		super(props);
	}

	renderIcon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderIcon">
		const { icon } = this.props;

		return <img src={`/img/icons/${icon}.png`} />;
		//</editor-fold>
	};

	renderText = () => {
		//<editor-fold defaultstate="collapsed" desc="renderText">
		const { text } = this.props;

		return <Text name={text} />;
		//</editor-fold>
	};

	render() {
		const { show, icon } = this.props;

		if (!show) {
			return null;
		}

		return (
			<Notification
				key={icon}
				icon={this.renderIcon()}
				text={this.renderText()}
			/>
		);
	}
}

NotificationContainer.propTypes = propTypes;

NotificationContainer.defaultProps = defaultProps;

NotificationContainer = WithUi(uiProps)(NotificationContainer);

export default NotificationContainer;
