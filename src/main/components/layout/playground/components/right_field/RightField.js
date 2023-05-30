import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import BattleField from 'main/components/ui/battle_field';
import Port from 'main/components/ui/editor/port';
import RightFieldUi from './components/right_field_ui';

import styles from './RightField.less';

const propTypes = {
	//from ui
	state: PropTypes.string,
	ships: PropTypes.object,
};

const defaultProps = {
	//from ui
	ships: {},
};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'state',
		},
		BattleField: {
			left: {
				ships: 'ships',
			},
		},
	};
};

class RightField extends Component {
	constructor(props) {
		super(props);
	}

	hasShipInPort = () => {
		//<editor-fold defaultstate="collapsed" desc="hasShipInPort">
		const ships = _.filter(this.props.ships, s => s.inPort);

		if (!_g.isEmpty(ships)) {
			return true;
		}

		return false;
		//</editor-fold>
	};

	renderBattleField = () => {
		//<editor-fold defaultstate="collapsed" desc="renderBattleField">

		return (
			<div className={styles['wrapper']}>
				<BattleField name="right" />
				<RightFieldUi />
			</div>
		);
		//</editor-fold>
	};

	renderPort = () => {
		//<editor-fold defaultstate="collapsed" desc="renderPort">
		return <Port />;
		//</editor-fold>
	};

	render() {
		const { state } = this.props;

		if (_g.isEmpty(state)) {
			return this.renderBattleField();
		}

		if (state === 'place_your_ships' && this.hasShipInPort()) {
			return this.renderPort();
		}

		return this.renderBattleField();
	}
}

RightField.propTypes = propTypes;

RightField.defaultProps = defaultProps;

RightField = WithUi(uiProps)(RightField);

export default RightField;
