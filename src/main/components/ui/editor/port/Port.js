import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Ship from 'main/components/ui/battle_field/components/ship';
import Text from 'main/components/ui/text';

import styles from './Port.less';

const propTypes = {
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
			left: {
				ships: 'ships',
			},
		},
	};
};

class Port extends Component {
	constructor(props) {
		super(props);
	}

	renderShip = shipData => {
		//<editor-fold defaultstate="collapsed" desc="renderShip">
		const id = _.get(shipData, 'id');
		const inPort = _.get(shipData, 'inPort', false);
		const size = _.get(shipData, 'size');

		const className = _g.classNames(
			styles['ship-place'],
			styles['ship-place_' + size],
		);

		return (
			<div key={id} className={className}>
				{inPort && <Ship id={id} battleField="left" />}
			</div>
		);
		//</editor-fold>
	};

	render4Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render4Size">
		const ships = _.filter(this.props.ships, s => s.size === 4);

		return (
			<div className={styles['harbour']}>{_.map(ships, this.renderShip)}</div>
		);
		//</editor-fold>
	};

	render3Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render3Size">
		const ships = _.filter(this.props.ships, s => s.size === 3);

		return (
			<div className={styles['harbour']}>{_.map(ships, this.renderShip)}</div>
		);
		//</editor-fold>
	};

	render2Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render2Size">
		const ships = _.filter(this.props.ships, s => s.size === 2);
		return (
			<div className={styles['harbour']}>{_.map(ships, this.renderShip)}</div>
		);
		//</editor-fold>
	};

	render1Size = () => {
		//<editor-fold defaultstate="collapsed" desc="render1Size">
		const ships = _.filter(this.props.ships, s => s.size === 1);
		return (
			<div className={styles['harbour']}>{_.map(ships, this.renderShip)}</div>
		);
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['wrapper']}>
				{this.render4Size()}
				{this.render3Size()}
				{this.render2Size()}
				{this.render1Size()}
				<div className={styles['bottom-text']}>
					<Text name="drag_to_the_field_and_double_click_to_rotate" />
				</div>
			</div>
		);
	}
}

Port.propTypes = propTypes;

Port.defaultProps = defaultProps;

Port = WithUi(uiProps)(Port);

export default Port;
