import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'main/components/ui/controls/button';

import styles from './GreenButton.less';

const propTypes = {};

const defaultProps = {};

class GreenButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Button classNames={styles} {...this.props} />;
	}
}

GreenButton.propTypes = propTypes;

GreenButton.defaultProps = defaultProps;

export default GreenButton;
