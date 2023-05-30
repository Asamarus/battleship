import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Radio.less';

const propTypes = {
	classNames: PropTypes.object,
	active: PropTypes.bool,
	theme: PropTypes.oneOf([
		'main',
		'primary',
		'success',
		'info',
		'warning',
		'danger',
		'custom',
	]),
};

const defaultProps = {
	classNames: {},
	theme: 'main',
	active: false,
};

class Radio extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const classNames = _g.getClassNames(styles, this.props.classNames);

		const { active, theme } = this.props;

		const circleClassName = _g.classNames(classNames['circle'], {
			[classNames[`circle_${theme}`]]: active,
		});

		return (
			<div className={styles['wrapper']}>
				{active && <div className={circleClassName} />}
			</div>
		);
	}
}

Radio.propTypes = propTypes;

Radio.defaultProps = defaultProps;

export default Radio;
