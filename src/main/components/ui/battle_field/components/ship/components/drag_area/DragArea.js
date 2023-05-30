import { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import gameEvents from 'main/gameEvents';

const propTypes = {
	battleField: PropTypes.oneOf(['left', 'right']).isRequired,
	shipId: PropTypes.string.isRequired,
	parent: PropTypes.any.isRequired,
	inPort: PropTypes.bool,
	//from ui
	cellSize: PropTypes.number.isRequired,
};

const defaultProps = {
	inPort: false,
};

const uiProps = ownProps => {
	return {
		Global: {
			cellSize: 'cellSize',
		},
	};
};

class DragArea extends Component {
	constructor(props) {
		super(props);

		this.mounted = false;
		const { shipId } = this.props;

		this.currentTarget = `ship-drag-area-${shipId}`;
		this.initialX;
		this.initialY;
		this.currentX;
		this.currentY;
		this.currentTop = 0;
		this.currentLeft = 0;
		this.freeTop = 0;
		this.freeLeft = 0;
		this.element = null;
		this.elementData = {};

		this.isDragging = false;
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.mounted = true;

		const { parent } = this.props;

		this.battleFields = $("[data-name='battle-fields']");
		this.element = $(parent.node.current);
		this.elementData = this.getElementData();

		ee.on(events.dragEventListener.onStart, this.onDragStart);
		ee.on(events.dragEventListener.onMove, this.onDrag);
		ee.on(events.dragEventListener.onEnd, this.onDragEnd);
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		this.mounted = false;
		ee.off(events.dragEventListener.onStart, this.onDragStart);
		ee.off(events.dragEventListener.onMove, this.onDrag);
		ee.off(events.dragEventListener.onEnd, this.onDragEnd);
		//</editor-fold>
	}

	getBoundaries = () => {
		//<editor-fold defaultstate="collapsed" desc="getBoundaries">
		const border = this.battleFields;

		return {
			top: border.offset().top,
			left: border.offset().left,
			width: border.outerWidth(),
			height: border.outerHeight(),
		};
		//</editor-fold>
	};

	getElementData = () => {
		//<editor-fold defaultstate="collapsed" desc="getElementData">
		const offset = this.element.offset();

		return {
			width: this.element.outerWidth(),
			height: this.element.outerHeight(),
			top: offset.top,
			left: offset.left,
		};
		//</editor-fold>
	};

	checkBounds = () => {
		//<editor-fold defaultstate="collapsed" desc="checkBounds">
		const elementTop = this.currentTop + this.elementData.top;
		const elementLeft = this.currentLeft + this.elementData.left;

		//top boundary
		if (elementTop < this.boundaries.top) {
			this.currentTop += this.boundaries.top - elementTop;
		}
		//bottom boundary
		if (
			elementTop + this.elementData.height >
			this.boundaries.top + this.boundaries.height
		) {
			this.currentTop +=
				this.boundaries.top +
				this.boundaries.height -
				(elementTop + this.elementData.height);
		}
		//left boundary
		if (elementLeft < this.boundaries.left) {
			this.currentLeft += this.boundaries.left - elementLeft;
		}
		//right boundary
		if (
			elementLeft + this.elementData.width >
			this.boundaries.left +
				this.boundaries.width +
				this.battleFields[0].scrollLeft
		) {
			this.currentLeft +=
				this.boundaries.left +
				this.battleFields[0].scrollLeft +
				this.boundaries.width -
				(elementLeft + this.elementData.width);
		}
		//</editor-fold>
	};

	snap = () => {
		//<editor-fold defaultstate="collapsed" desc="snap">
		const { battleField } = this.props;

		ee.trigger(events.gameEvent, {
			event: gameEvents.battleField.snap,
			data: {
				battleField,
				ship: this,
			},
		});
		//</editor-fold>
	};

	onDragStart = ({ currentTarget, coordinates }) => {
		//<editor-fold defaultstate="collapsed" desc="onDragStart">
		if (this.currentTarget !== currentTarget) return;

		const { x, y } = coordinates;

		this.initialX = x;
		this.initialY = y;

		this.isDragging = true;
		this.boundaries = this.getBoundaries();
		this.elementData = this.getElementData();

		const { parent } = this.props;

		parent.setState({ isDragging: true });
		//</editor-fold>
	};

	onDrag = ({ currentTarget, coordinates }) => {
		//<editor-fold defaultstate="collapsed" desc="onDrag">
		if (this.currentTarget !== currentTarget) return;

		if (!this.isDragging) return;

		const { x, y } = coordinates;

		this.currentX = x;
		this.currentY = y;

		let offsetTop = this.currentY - this.initialY;
		let offsetLeft = this.currentX - this.initialX;

		this.currentTop += offsetTop;
		this.freeTop += offsetTop;
		this.initialY = this.currentY;

		this.currentLeft += offsetLeft;
		this.freeLeft += offsetLeft;
		this.initialX = this.currentX;

		this.checkBounds();

		this.snap();

		const { parent } = this.props;

		parent.setState({
			top: this.currentTop,
			left: this.currentLeft,
		});
		//</editor-fold>
	};

	onDragEnd = ({ currentTarget }) => {
		//<editor-fold defaultstate="collapsed" desc="onDragEnd">
		if (this.currentTarget !== currentTarget) return;

		if (this.isDragging) {
			this.isDragging = false;
			this.currentTop = 0;
			this.currentLeft = 0;
			this.freeTop = 0;
			this.freeLeft = 0;

			const { parent, battleField, shipId } = this.props;

			if (!_g.isEmpty(parent.newShipPosition)) {
				const { inPort } = this.props;

				if (inPort) {
					ee.trigger(events.gameEvent, {
						event: gameEvents.battleField.placeShip,
						data: {
							battleField: battleField,
							shipId: shipId,
							coordinates: parent.newShipPosition,
						},
					});
				} else {
					ee.trigger(events.gameEvent, {
						event: gameEvents.battleField.replaceShip,
						data: {
							battleField: battleField,
							shipId: shipId,
							coordinates: parent.newShipPosition,
						},
					});
				}
			}

			parent.newShipPosition = null;
			parent.setState({
				top: 0,
				left: 0,
				isDragging: false,
				isValidPosition: null,
			});
		}
		//</editor-fold>
	};

	render() {
		return null;
	}
}

DragArea.propTypes = propTypes;

DragArea.defaultProps = defaultProps;

DragArea = WithUi(uiProps)(DragArea);

export default DragArea;
