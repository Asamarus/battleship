import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

const propTypes = {
	children: PropTypes.node.isRequired,
	store: PropTypes.object.isRequired,
};

const defaultProps = {};

class Root extends Component {
	render() {
		const { children, store } = this.props;

		return <Provider store={store}>{children}</Provider>;
	}
}

Root.propTypes = propTypes;

Root.defaultProps = defaultProps;

export default Root;
