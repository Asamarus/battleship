import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	targetIdentifier: PropTypes.func.isRequired,
	children: PropTypes.node,
};

const defaultProps = {};

class DragEventListener extends Component {
	constructor(props) {
		super(props);

		this.isDragging = false;
		this.currentTarget = null;
	}

	onDragStart = e => {
		//<editor-fold defaultstate="collapsed" desc="onDragStart">
		const { targetIdentifier } = this.props;

		//only left mouse button
		if (_g.inArray(_.get(e, 'nativeEvent.which'), [2, 3])) {
			return;
		}

		const currentTarget = targetIdentifier(e);

		if (!_.isNull(currentTarget)) {
			this.currentTarget = currentTarget;
			this.isDragging = true;

			let x, y;

			if (e.type === 'touchstart' && e.touches[0]) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.clientX;
				y = e.clientY;
			}

			ee.trigger(events.dragEventListener.onStart, {
				currentTarget: this.currentTarget,
				coordinates: { x, y },
			});
		} else {
			this.currentTarget = null;
			this.isDragging = false;
		}
		//</editor-fold>
	};

	onDragMove = e => {
		//<editor-fold defaultstate="collapsed" desc="onDragMove">
		if (!this.isDragging) return;

		if (!_.isNull(this.currentTarget)) {
			e.preventDefault();

			let x, y;

			if (e.type === 'touchmove' && e.touches[0]) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.clientX;
				y = e.clientY;
			}

			ee.trigger(events.dragEventListener.onMove, {
				currentTarget: this.currentTarget,
				coordinates: { x, y },
			});
		}
		//</editor-fold>
	};

	onDragEnd = e => {
		//<editor-fold defaultstate="collapsed" desc="onDragEnd">

		if (!_.isNull(this.currentTarget)) {
			let x, y;

			if (e.type === 'touchend' && e.touches[0]) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.clientX;
				y = e.clientY;
			}

			ee.trigger(events.dragEventListener.onEnd, {
				currentTarget: this.currentTarget,
				coordinates: { x, y },
			});

			this.currentTarget = null;
		}

		if (this.isDragging) {
			this.isDragging = false;
		}
		//</editor-fold>
	};

	render() {
		const { children, targetIdentifier, ...props } = this.props;
		return (
			<div
				{...props}
				onMouseDown={this.onDragStart}
				onTouchStart={this.onDragStart}
				onTouchEnd={this.onDragEnd}
				onMouseLeave={this.onDragEnd}
				onMouseUp={this.onDragEnd}
				onTouchMove={this.onDragMove}
				onMouseMove={this.onDragMove}>
				{children}
			</div>
		);
	}
}

DragEventListener.propTypes = propTypes;

DragEventListener.defaultProps = defaultProps;

export default DragEventListener;
