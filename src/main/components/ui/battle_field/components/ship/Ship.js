import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import DragArea from './components/drag_area';

import styles from './Ship.less';

const propTypes = {
	battleField: PropTypes.oneOf(['left', 'right']).isRequired,
	id: PropTypes.string.isRequired,
	//from ui
	size: PropTypes.oneOf([1, 2, 3, 4]).isRequired,
	orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
	shipModels: PropTypes.oneOf(['classic', 'modern']),
	draggable: PropTypes.bool,
	inPort: PropTypes.bool,
	visible: PropTypes.bool,
	beacon: PropTypes.bool,
};

const defaultProps = {
	shipModels: 'classic',
	inPort: false,
	visible: true,
	beacon: false,
};

const uiProps = ownProps => {
	return {
		Settings: {
			shipModels: 'shipModels',
		},
		BattleField: {
			[ownProps.battleField]: {
				ships: {
					[ownProps.id]: {
						size: 'size',
						orientation: 'orientation',
						draggable: 'draggable',
						inPort: 'inPort',
						visible: 'visible',
						beacon: 'beacon',
					},
				},
			},
		},
	};
};

class Ship extends Component {
	constructor(props) {
		super(props);

		this.showingAnimation = false;

		this.node = React.createRef();

		this.state = {
			isDragging: false,
			top: 0,
			left: 0,
			mounted: false,
			isValidPosition: null,
			shake: false,
		};

		this.newShipPosition = null;
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.setState({ mounted: true });
		ee.on(events.ship.shake, this.onShake);

		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		ee.off(events.ship.shake, this.onShake);
		//</editor-fold>
	}

	renderImage = () => {
		//<editor-fold defaultstate="collapsed" desc="renderImage">
		const { orientation, size, shipModels } = this.props;

		if (shipModels === 'classic') {
			return null;
		}

		const className = _g.classNames(
			styles['ship_image'],
			{ [styles['ship_image_vertical']]: orientation === 'vertical' },
			{ [styles['ship_image_horizontal']]: orientation === 'horizontal' },
		);

		return (
			<img
				className={className}
				src={`/img/ships/${orientation}_${size}.png`}
				alt={`ship_${orientation}_${size}`}
			/>
		);
		//</editor-fold>
	};

	onShake = ({ shipId }) => {
		//<editor-fold defaultstate="collapsed" desc="onShake">
		if (shipId !== this.props.id) return;

		if (this.showingAnimation) return;

		this.showingAnimation = true;
		this.setState({ shake: true });
		//</editor-fold>
	};

	onAnimationEnd = e => {
		//<editor-fold defaultstate="collapsed" desc="onAnimationEnd">
		if (e.target === this.node.current) {
			if (!this.showingAnimation) return;
			this.showingAnimation = false;
			this.setState({ shake: false });
		}
		//</editor-fold>
	};

	// shake = () => {
	// 	//<editor-fold defaultstate="collapsed" desc="shake">
	// 	$(this.node.current)
	// 		.addClass(styles['wrapper_shake'])
	// 		.one(
	// 			'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	// 			() => {
	// 				$(this.node.current).removeClass(styles['wrapper_shake']);
	// 			},
	// 		);
	// 	//</editor-fold>
	// };

	render() {
		const {
			orientation,
			size,
			shipModels,
			battleField,
			draggable,
			inPort,
			beacon,
		} = this.props;
		const {
			top,
			left,
			isDragging,
			mounted,
			isValidPosition,
			shake,
		} = this.state;

		const className = _g.classNames(
			styles['wrapper'],
			{ [styles['wrapper_draggable']]: draggable },
			{ [styles['wrapper_not-pointer-events']]: !draggable },
			{ [styles['wrapper_is_dragging']]: isDragging },
			{ [styles['wrapper_with_image']]: shipModels === 'modern' },
			{ [styles['wrapper_beacon']]: beacon },
			{ [styles['wrapper_shake']]: shake },
			{
				[styles['wrapper_valid_position']]:
					isDragging && isValidPosition === true,
			},
			{
				[styles['wrapper_invalid_position']]:
					isDragging && isValidPosition === false,
			},
			{
				[styles['wrapper_vertical_1']]:
					orientation === 'vertical' && size === 1,
			},
			{
				[styles['wrapper_vertical_2']]:
					orientation === 'vertical' && size === 2,
			},
			{
				[styles['wrapper_vertical_3']]:
					orientation === 'vertical' && size === 3,
			},
			{
				[styles['wrapper_vertical_4']]:
					orientation === 'vertical' && size === 4,
			},
			{
				[styles['wrapper_horizontal_1']]:
					orientation === 'horizontal' && size === 1,
			},
			{
				[styles['wrapper_horizontal_2']]:
					orientation === 'horizontal' && size === 2,
			},
			{
				[styles['wrapper_horizontal_3']]:
					orientation === 'horizontal' && size === 3,
			},
			{
				[styles['wrapper_horizontal_4']]:
					orientation === 'horizontal' && size === 4,
			},
		);

		const { id } = this.props;

		const extra = {};

		if (draggable) {
			extra['data-type'] = 'ship-drag-area';
			extra['data-ship-id'] = id;
		}

		const style = {
			top: top,
			left: left,
		};

		const { visible } = this.props;

		if (!visible) {
			return null;
		}

		return (
			<div
				ref={this.node}
				className={className}
				style={style}
				{...extra}
				onAnimationEnd={this.onAnimationEnd}>
				{this.renderImage()}
				{draggable &&
					mounted && (
						<DragArea
							battleField={battleField}
							shipId={id}
							parent={this}
							inPort={inPort}
						/>
					)}
			</div>
		);
	}
}

Ship.propTypes = propTypes;

Ship.defaultProps = defaultProps;

Ship = WithUi(uiProps)(Ship);

export default Ship;
