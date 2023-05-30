import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Title.less';

const propTypes = {
	classNames: PropTypes.object,
	level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
	children: PropTypes.node,
};

const defaultProps = {
	classNames: {},
	level: 3,
};

class Title extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const classNames = _g.getClassNames(styles, this.props.classNames);

		const { children, level } = this.props;

		const className = _g.classNames(
			classNames['wrapper'],
			classNames[`wrapper_${level}`],
		);

		return React.createElement(`h${level}`, { className: className }, children);
	}
}

Title.propTypes = propTypes;

Title.defaultProps = defaultProps;

export default Title;
