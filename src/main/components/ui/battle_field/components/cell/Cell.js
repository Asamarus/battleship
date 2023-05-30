import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Coordinates from './components/coordinates';
import Ship from '../ship';

import gameEvents from 'main/gameEvents';

import styles from './Cell.less';

const propTypes = {
	battleField: PropTypes.oneOf(['left', 'right']).isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	//from ui
	state: PropTypes.string,
	shipId: PropTypes.string,
	fire: PropTypes.bool,
	missed: PropTypes.bool,
	gray: PropTypes.bool,
	radarShip: PropTypes.bool,
	radar: PropTypes.bool,
};

const defaultProps = {
	//from ui
	fire: false,
	missed: false,
	gray: false,
	radarShip: false,
	radar: false,
};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'state',
		},
		BattleField: {
			[ownProps.battleField]: {
				cells: {
					[`${ownProps.x}_${ownProps.y}`]: {
						shipId: 'shipId',
						fire: 'fire',
						missed: 'missed',
						gray: 'gray',
						radarShip: 'radarShip',
						radar: 'radar',
					},
				},
			},
		},
	};
};

class Cell extends PureComponent {
	constructor(props) {
		super(props);
		this.mounted = false;

		this.node = React.createRef();

		this.showingAnimation = false;

		this.state = {
			highlight: false,
		};
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.mounted = true;
		ee.on(events.cell.highlight, this.onHighlight);
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		this.mounted = false;
		ee.off(events.cell.highlight, this.onHighlight);
		//</editor-fold>
	}

	onHighlight = cells => {
		//<editor-fold defaultstate="collapsed" desc="onHighlight">
		if (this.showingAnimation) return;

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];

			if (
				this.props.battleField == cell.battleField &&
				this.props.x == cell.coordinates.x &&
				this.props.y == cell.coordinates.y
			) {
				this.showingAnimation = true;

				this.setState({
					highlight: true,
				});
				return;
			}
		}
		//</editor-fold>
	};

	onAnimationEnd = e => {
		//<editor-fold defaultstate="collapsed" desc="onAnimationEnd">
		if (e.target === this.node.current) {
			this.showingAnimation = false;
			this.setState({ highlight: false });
		}
		//</editor-fold>
	};

	onClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onClick">
		const { battleField, x, y } = this.props;

		if (!this.isClickable) {
			return;
		}
		ee.trigger(events.gameEvent, {
			event: gameEvents.battleField.cellClick,
			data: {
				battleField: battleField,
				coordinates: { x, y },
			},
		});
		//</editor-fold>
	};

	isClickable = () => {
		//<editor-fold defaultstate="collapsed" desc="isClickable">
		const { battleField, state, missed, gray, fire } = this.props;

		if (
			state === 'your_turn' &&
			battleField === 'right' &&
			!missed &&
			!gray &&
			!fire
		) {
			return true;
		}

		return false;
		//</editor-fold>
	};

	renderCoordinates = () => {
		//<editor-fold defaultstate="collapsed" desc="renderCoordinates">
		const { x, y } = this.props;

		if (x !== 0 && y !== 0) {
			return null;
		}

		return <Coordinates x={x} y={y} />;
		//</editor-fold>
	};

	renderShip = () => {
		//<editor-fold defaultstate="collapsed" desc="renderShip">
		const { shipId, battleField } = this.props;

		if (_g.isEmpty(shipId)) {
			return null;
		}

		return <Ship key={shipId} battleField={battleField} id={shipId} />;
		//</editor-fold>
	};

	renderFire = () => {
		//<editor-fold defaultstate="collapsed" desc="renderFire">
		const { fire } = this.props;

		if (!fire) {
			return null;
		}

		return <div className={styles['fire']} />;
		//</editor-fold>
	};

	renderMissed = () => {
		//<editor-fold defaultstate="collapsed" desc="renderMissed">
		const { missed } = this.props;

		if (!missed) {
			return null;
		}

		return <div className={styles['missed']} />;
		//</editor-fold>
	};

	renderRadar = () => {
		//<editor-fold defaultstate="collapsed" desc="renderRadar">
		const { radar } = this.props;

		if (!radar) {
			return null;
		}

		return (
			<div className={styles['radar']}>
				<div className={styles['radar_sweep']} />
			</div>
		);
		//</editor-fold>
	};

	render() {
		const { x, y, gray, radarShip } = this.props;
		const { highlight } = this.state;

		const className = _g.classNames(
			styles['wrapper'],
			{ [styles['wrapper_highlight']]: highlight },
			{ [styles['wrapper_radar_ship']]: radarShip },
			{ [styles['wrapper_gray']]: gray },
			{ [styles['wrapper_clickable']]: this.isClickable() },
		);

		return (
			<div
				ref={this.node}
				className={className}
				onClick={this.onClick}
				data-x={x}
				data-y={y}
				onAnimationEnd={this.onAnimationEnd}>
				{this.renderCoordinates()}
				{this.renderFire()}
				{this.renderMissed()}
				{this.renderShip()}
				{this.renderRadar()}
				<div className={styles['highlight']} />
			</div>
		);
	}
}

Cell.propTypes = propTypes;

Cell.defaultProps = defaultProps;

Cell = WithUi(uiProps)(Cell);

export default Cell;
