import React, { Fragment, PureComponent } from 'react';

import PropTypes from 'prop-types';

import styles from './Coordinates.less';

const propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
};

const defaultProps = {};

const topCoordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

class Coordinates extends PureComponent {
	renderY = () => {
		//<editor-fold defaultstate="collapsed" desc="renderY">
		const { x, y } = this.props;

		if (x !== 0) {
			return null;
		}

		return <div className={styles['wrapper_y']}>{y + 1}</div>;
		//</editor-fold>
	};

	renderX = () => {
		//<editor-fold defaultstate="collapsed" desc="renderX">

		const { x, y } = this.props;

		if (y !== 0) {
			return null;
		}

		return (
			<div className={styles['wrapper_x']}>{_.get(topCoordinates, x)}</div>
		);
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				{this.renderY()}
				{this.renderX()}
			</Fragment>
		);
	}
}

Coordinates.propTypes = propTypes;

Coordinates.defaultProps = defaultProps;

export default Coordinates;
