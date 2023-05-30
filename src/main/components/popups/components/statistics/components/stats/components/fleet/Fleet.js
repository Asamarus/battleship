import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import styles from './Fleet.less';

const propTypes = {
	name: PropTypes.string.isRequired,
	//from ui
	ships: PropTypes.object,
};

const defaultProps = {
	//from ui
	ships: {},
};

const uiProps = ownProps => {
	return {
		BattleField: {
			[ownProps.name]: {
				ships: 'ships',
			},
		},
	};
};

class Fleet extends Component {
	constructor(props) {
		super(props);
	}

	renderCell = (item, index) => {
		//<editor-fold defaultstate="collapsed" desc="renderCell">
		return <div key={index} className={styles['cell']} />;
		//</editor-fold>
	};

	renderShip = shipData => {
		//<editor-fold defaultstate="collapsed" desc="renderShip">
		const id = _.get(shipData, 'id');
		const isDead = _.get(shipData, 'dead', false);
		const size = _.get(shipData, 'size');

		const className = _g.classNames(styles['ship'], {
			[styles['ship_is-dead']]: isDead,
		});

		const cells = new Array(size);

		return (
			<div key={id} className={className}>
				{_.map(cells, this.renderCell)}
			</div>
		);
		//</editor-fold>
	};

	render4Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render4Size">
		const ships = _.filter(this.props.ships, s => s.size === 4);

		return <Fragment>{_.map(ships, this.renderShip)}</Fragment>;
		//</editor-fold>
	};

	render3Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render3Size">
		const ships = _.filter(this.props.ships, s => s.size === 3);

		return <Fragment>{_.map(ships, this.renderShip)}</Fragment>;
		//</editor-fold>
	};

	render2Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render2Size">
		const ships = _.filter(this.props.ships, s => s.size === 2);
		return <Fragment>{_.map(ships, this.renderShip)}</Fragment>;
		//</editor-fold>
	};

	render1Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render1Size">
		const ships = _.filter(this.props.ships, s => s.size === 1);
		return <Fragment>{_.map(ships, this.renderShip)}</Fragment>;
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				<div className={styles['container']}>
					{this.render4Size()}
					{this.render3Size()}
				</div>
				<div className={styles['container']}>
					{this.render2Size()}
					{this.render1Size()}
				</div>
			</Fragment>
		);
	}
}

Fleet.propTypes = propTypes;

Fleet.defaultProps = defaultProps;

Fleet = WithUi(uiProps)(Fleet);

export default Fleet;
