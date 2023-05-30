import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './PopupHeader.less';

const propTypes = {
	classNames: PropTypes.object,
	theme: PropTypes.oneOf([
		'main',
		'primary',
		'success',
		'info',
		'warning',
		'danger',
		'custom',
	]),
	title: PropTypes.any,
	showCloseControl: PropTypes.bool,
	onClose: PropTypes.func,
};

const defaultProps = {
	classNames: {},
	theme: 'main',
	title: '',
	showCloseControl: true,
};

class PopupHeader extends Component {
	constructor(props) {
		super(props);
	}

	renderClose = classNames => {
		//<editor-fold defaultstate="collapsed" desc="renderClose">
		const { showCloseControl, onClose } = this.props;

		if (!showCloseControl) {
			return null;
		}

		return (
			<div className={classNames['close-wrapper']} onClick={onClose}>
				<span className={classNames['close']}>×</span>
			</div>
		);

		//</editor-fold>
	};

	render() {
		const classNames = _g.getClassNames(styles, this.props.classNames);
		const { theme, title } = this.props;

		const className = _g.classNames(
			classNames['wrapper'],
			classNames[`wrapper_${theme}`],
		);

		return (
			<div className={className}>
				<div className={classNames['title-wrapper']}>
					<span className={classNames['title']}>{title}</span>
				</div>
				{this.renderClose(classNames)}
			</div>
		);
	}
}

PopupHeader.propTypes = propTypes;

PopupHeader.defaultProps = defaultProps;

export default PopupHeader;
