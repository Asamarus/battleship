import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Notification.less';

const propTypes = {
	icon: PropTypes.node,
	text: PropTypes.any,
};

const defaultProps = {};

class Notification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			mounted: false,
		};
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		setTimeout(() => {
			this.setState({ mounted: true });
		}, 100);

		//</editor-fold>
	}

	render() {
		const { icon, text } = this.props;
		const { mounted } = this.state;

		const className = _g.classNames(styles['wrapper'], {
			[styles['wrapper_mounted']]: mounted,
		});

		return (
			<div className={className}>
				<div className={styles['icon-wrapper']}>{icon}</div>
				<div className={styles['text-wrapper']}>{text}</div>
			</div>
		);
	}
}

Notification.propTypes = propTypes;

Notification.defaultProps = defaultProps;

export default Notification;
