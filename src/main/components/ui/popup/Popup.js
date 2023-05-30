import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Popup.less';

const propTypes = {
	classNames: PropTypes.object,

	level: PropTypes.number, //popup level in hierarchy

	//overlay
	showOverlay: PropTypes.bool,
	onOverlayClick: PropTypes.func, //overrides default behaviour

	//ui
	verticalAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
	contentWrapStyle: PropTypes.object, //styles for .content-wrap
	renderPopup: PropTypes.func, //override popup rendering
	inner: PropTypes.node, //inner for container
	children: PropTypes.node, //children for render

	//animation
	openAnimation: PropTypes.string, //openAnimation className
};

const defaultProps = {
	classNames: {},
	level: 0,
	verticalAlign: 'top',
	showOverlay: true,
	openAnimation: '',
};

class Popup extends Component {
	constructor(props) {
		super(props);
	}

	onOverlayClick = e => {
		//<editor-fold defaultstate="collapsed" desc="onOverlayClick">
		e.stopPropagation();
		const classNames = _g.getClassNames(styles, this.props.classNames);
		if (
			!_g.inArray(e.target.className, [
				classNames['wrapper'],
				classNames['container'],
				classNames['content-holder'],
			])
		) {
			return;
		}

		const { onOverlayClick } = this.props;

		if (_.isFunction(onOverlayClick)) {
			onOverlayClick();
		}

		//</editor-fold>
	};

	renderOverlay = (zIndex, classNames) => {
		//<editor-fold defaultstate="collapsed" desc="renderOverlay">
		const { showOverlay } = this.props;

		if (!showOverlay) {
			return null;
		}

		return (
			<div
				className={classNames['overlay']}
				style={{
					zIndex: zIndex,
				}}
			/>
		);
		//</editor-fold>
	};

	renderPopup = (zIndex, classNames) => {
		//<editor-fold defaultstate="collapsed" desc="renderPopup">
		const {
			verticalAlign,
			contentWrapStyle,
			renderPopup,
			openAnimation,
			inner,
			children,
			level,
		} = this.props;

		if (_.isFunction(renderPopup)) {
			return renderPopup({
				zIndex,
				classNames,
				verticalAlign,
				contentWrapStyle,
				children,
				onOverlayClick: this.onOverlayClick,
				openAnimation,
				inner,
				Popup: this,
			});
		}

		const contentWrapclassName = _g.classNames(classNames['content-wrap'], {
			[openAnimation]: !_g.isEmpty(openAnimation),
		});

		return (
			<div
				className={classNames['wrapper']}
				style={{ zIndex: zIndex }}
				onClick={this.onOverlayClick}>
				<div data-name={`popup-${level}`} className={classNames['container']}>
					<div
						className={classNames['content-holder']}
						style={{ verticalAlign: verticalAlign }}>
						<div className={contentWrapclassName} style={contentWrapStyle}>
							{children}
						</div>
					</div>
					{inner}
				</div>
			</div>
		);
		//</editor-fold>
	};

	render() {
		const { level } = this.props;
		let zIndex = 1000 + 100 * level;
		const classNames = _g.getClassNames(styles, this.props.classNames);

		return (
			<div>
				{this.renderOverlay(++zIndex, classNames)}
				{this.renderPopup(++zIndex, classNames)}
			</div>
		);
	}
}

Popup.propTypes = propTypes;

Popup.defaultProps = defaultProps;

export default Popup;
