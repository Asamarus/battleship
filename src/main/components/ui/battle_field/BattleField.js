import React, { PureComponent } from 'react';

import WithBrowserWidth from 'hoc/browser/with_browser_width';
import WithUi from 'hoc/store/ui';

import PropTypes from 'prop-types';

import Cell from './components/cell';
import EditorControls from 'main/components/ui/editor/controls';
import Stats from './components/stats';

import gameEvents from 'main/gameEvents';

import styles from './BattleField.less';

const propTypes = {
	name: PropTypes.oneOf(['left', 'right']).isRequired,
	//from hoc
	browserWidth: PropTypes.number,
	//from ui
	gameState: PropTypes.string,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'gameState',
		},
	};
};

const field = [];

for (let i = 0; i < 10; i++) {
	field[i] = new Array(10);
}

for (let i = 0; i < 10; i++) {
	field[i] = new Array(10);
	for (let j = 0; j < 10; j++) {
		field[i][j] = { x: j, y: i };
	}
}

class BattleField extends PureComponent {
	constructor(props) {
		super(props);
		this.table = React.createRef();
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.calculateSnapGrid();
		ee.on(events.playground.onScroll, this.onPlaygroundScroll);
		//</editor-fold>
	}

	componentDidUpdate(prevProps) {
		//<editor-fold defaultstate="collapsed" desc="componentDidUpdate">
		if (prevProps.browserWidth !== this.props.browserWidth) {
			this.calculateSnapGrid();
		}
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		ee.off(events.playground.onScroll, this.onPlaygroundScroll);
		//</editor-fold>
	}

	onPlaygroundScroll = () => {
		//<editor-fold defaultstate="collapsed" desc="onPlaygroundScroll">
		this.calculateSnapGrid();
		//</editor-fold>
	};

	calculateSnapGrid = () => {
		//<editor-fold defaultstate="collapsed" desc="calculateSnapGrid">
		const node = $(this.table.current);
		const offset = node.offset();
		const grid = {
			top: offset.top,
			left: offset.left,
			width: node.outerWidth(),
			height: node.outerHeight(),
		};

		const cells = [];

		node.find('> tbody > tr > td').each(function() {
			const cellNode = $(this).find('div:first');

			const cellOffset = cellNode.offset();

			const cellCoordinates = {
				x: _.toInteger(cellNode.attr('data-x')),
				y: _.toInteger(cellNode.attr('data-y')),
			};

			const cellSize = cellNode.outerWidth();
			const half = _.round(cellSize / 2);

			const x = cellOffset.left;

			const y = cellOffset.top;

			cells.push({
				x: x,
				y: y,
				gravityXStart: x - half,
				gravityXEnd: x + half,
				gravityYStart: y - half,
				gravityYEnd: y + half,
				width: cellSize,
				height: cellSize,
				coordinates: cellCoordinates,
			});
		});
		const { name } = this.props;
		ee.trigger(events.gameEvent, {
			event: gameEvents.battleField.updateSnapGrid,
			data: {
				battleField: name,
				grid: { grid, cells },
			},
		});
		//</editor-fold>
	};

	renderCell = ({ x, y }, index) => {
		//<editor-fold defaultstate="collapsed" desc="renderCell">
		const { name } = this.props;
		return (
			<td className={styles['cell']} key={index}>
				<Cell x={x} y={y} battleField={name} />
			</td>
		);
		//</editor-fold>
	};

	renderRow = (cells, index) => {
		//<editor-fold defaultstate="collapsed" desc="renderRow">
		return <tr key={index}>{_.map(cells, this.renderCell)}</tr>;
		//</editor-fold>
	};

	renderEditorContorls = () => {
		//<editor-fold defaultstate="collapsed" desc="renderEditorContorls">
		const { name } = this.props;

		if (name !== 'left') {
			return null;
		}

		return <EditorControls />;
		//</editor-fold>
	};

	renderScrollIcon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderScrollIcon">
		const { name, gameState } = this.props;

		if (!_g.isEmpty(gameState) && gameState !== 'place_your_ships') {
			return null;
		}

		const icon = name === 'right' ? 'left' : 'right';

		return (
			<div className={styles['scroll-icon-wrapper']}>
				<i
					className={`${styles['scroll-icon']} mdi mdi-gesture-swipe-${icon}`}
				/>
			</div>
		);
		//</editor-fold>
	};

	render() {
		const { name } = this.props;

		return (
			<div className={styles['wrapper']}>
				<table ref={this.table} className={styles['table']}>
					<tbody>{_.map(field, this.renderRow)}</tbody>
				</table>
				{this.renderEditorContorls()}
				<Stats name={name} />
				{this.renderScrollIcon()}
			</div>
		);
	}
}

BattleField.propTypes = propTypes;

BattleField.defaultProps = defaultProps;

BattleField = WithBrowserWidth(BattleField);

BattleField = WithUi(uiProps)(BattleField);

export default BattleField;
