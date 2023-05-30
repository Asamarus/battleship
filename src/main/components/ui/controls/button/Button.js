import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Button.less';

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
	fullWidth: PropTypes.bool,
	title: PropTypes.any,
	onClick: PropTypes.func,
	icon: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.object,
};

const defaultProps = {
	classNames: {},
	theme: 'main',
	fullWidth: true,
	disabled: false,
};

class Button extends Component {
	constructor(props) {
		super(props);
		this.classNames = {};
	}

	onClick = event => {
		//<editor-fold defaultstate="collapsed" desc="onClick">
		const { onClick, disabled } = this.props;

		if (disabled) {
			return;
		}

		if (_.isFunction(onClick)) {
			onClick({ event, Button: this });
		}

		//</editor-fold>
	};

	renderIcon = () => {
		const { icon } = this.props;

		if (_.isUndefined(icon)) {
			return;
		}

		return <i className={`${this.classNames['icon']} ${icon}`} />;
	};

	renderTitle = () => {
		const { title } = this.props;

		return <span className={this.classNames['title']}>{title}</span>;
	};

	render() {
		const classNames = _g.getClassNames(styles, this.props.classNames);
		this.classNames = classNames;
		const { theme, fullWidth, disabled, style } = this.props;

		const className = _g.classNames(
			classNames['wrapper'],
			classNames[`wrapper_${theme}`],
			{ [classNames['wrapper_full-width']]: fullWidth },
			{ [classNames['wrapper_disabled']]: disabled },
		);

		return (
			<button
				className={className}
				onClick={this.onClick}
				disabled={disabled}
				style={style}>
				{this.renderIcon()}
				{this.renderTitle()}
			</button>
		);
	}
}

Button.propTypes = propTypes;

Button.defaultProps = defaultProps;

export default Button;
