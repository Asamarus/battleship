import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Switch.less';

const propTypes = {
	classNames: PropTypes.object,
	theme: PropTypes.oneOf([
		'main',
		'primary',
		'success',
		'info',
		'warning',
		'danger',
		'custom',
	]),
	label: PropTypes.any,
	active: PropTypes.bool,

	//renderers
	render: PropTypes.func,
	renderControls: PropTypes.func,
	renderLabel: PropTypes.func,
	renderThumb: PropTypes.func,

	//settings
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
};

const defaultProps = {
	classNames: {},
	theme: 'main',
	active: false,
	disabled: false,
	readonly: false,
};

class Switch extends Component {
	constructor(props) {
		super(props);
	}

	/* ========================================================================*
	 *
	 *                     Renderers
	 *
	 * ========================================================================*/

	renderThumb = () => {
		//<editor-fold defaultstate="collapsed" desc="renderThumb">

		const { theme, renderThumb, active } = this.props;
		const classNames = _g.getClassNames(styles, this.props.classNames);

		const thumb = _g.classNames(classNames['thumb'], {
			[classNames['thumb_active']]: active,
			[classNames[`thumb_${theme}_active`]]: active,
		});
		if (_.isFunction(renderThumb)) {
			return renderThumb({
				className: thumb,
			});
		}
		return <div className={thumb} />;
		//</editor-fold>
	};

	renderLabel = () => {
		//<editor-fold defaultstate="collapsed" desc="renderLabel">
		const { label, renderLabel } = this.props;
		const classNames = _g.getClassNames(styles, this.props.classNames);

		if (_.isFunction(renderLabel)) {
			return renderLabel({
				className: classNames['label'],
				label: label,
				Switch: this,
			});
		}

		return (
			<div onClick={this.onChange} className={classNames['label']}>
				{label}
			</div>
		);
		//</editor-fold>
	};

	renderControls = () => {
		//<editor-fold defaultstate="collapsed" desc="renderControls">

		const { theme, renderControls, active } = this.props;
		const classNames = _g.getClassNames(styles, this.props.classNames);

		const track = _g.classNames(classNames['track'], {
			[classNames[`track_${theme}_active`]]: active,
		});

		if (_.isFunction(renderControls)) {
			return renderControls({
				thumb: this.renderThumb(),
				className: track,
				Switch: this,
			});
		}

		return <div className={track}>{this.renderThumb()}</div>;
		//</editor-fold>
	};

	render() {
		const { render, disabled } = this.props;
		const classNames = _g.getClassNames(styles, this.props.classNames);

		const wrapper = _g.classNames(classNames['wrapper'], {
			[classNames['wrapper_disabled']]: disabled,
		});

		if (_.isFunction(render)) {
			return render({
				classNames,
				controls: this.renderControls(),
				label: this.renderLabel(),
				disabled: disabled,
				Switch: this,
			});
		}

		return (
			<div className={wrapper}>
				{this.renderControls()} {this.renderLabel()}
			</div>
		);
	}
}

Switch.propTypes = propTypes;

Switch.defaultProps = defaultProps;

export default Switch;
