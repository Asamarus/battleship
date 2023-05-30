import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './PopupContent.less';

const propTypes = {
	classNames: PropTypes.object,
	noHeader: PropTypes.bool,
	noPadding: PropTypes.bool,
	children: PropTypes.node,
};

const defaultProps = {
	noHeader: false,
	noPadding: false,
	classNames: {},
};

class PopupContent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const classNames = _g.getClassNames(styles, this.props.classNames);
		const { children, noHeader, noPadding } = this.props;

		const className = _g.classNames(
			classNames['wrapper'],
			{ [classNames['wrapper_no-header']]: noHeader },
			{ [classNames['wrapper_no-padding']]: noPadding },
		);

		return <div className={className}>{children}</div>;
	}
}

PopupContent.propTypes = propTypes;

PopupContent.defaultProps = defaultProps;

export default PopupContent;
