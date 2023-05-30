import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	className: PropTypes.string,
	value: PropTypes.any,
	valueId: PropTypes.any,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //number of 'any'
	onChange: PropTypes.func,
	onChangeCompleted: PropTypes.func,
	controlled: PropTypes.bool,
	debounceTimeout: PropTypes.number, //number of milliseconds when onChangeComplete will fire
};

const defaultProps = {
	min: 0,
	max: 100,
	step: 1,
	controlled: false,
	debounceTimeout: 400,
};

class RangeInput extends Component {
	constructor(props) {
		super(props);
		this.input = React.createRef();

		const { value } = this.props;

		this.value = this.formatValue(value);

		this.state = {
			value: this.formatValue(value),
		};

		const { onChangeCompleted, debounceTimeout } = this.props;
		if (_.isFunction(onChangeCompleted)) {
			this._onChangeCompleted = _.debounce(onChangeCompleted, debounceTimeout);
		}
	}

	componentDidUpdate(prevProps) {
		//<editor-fold defaultstate="collapsed" desc="componentDidUpdate">
		if (prevProps.value !== this.props.value) {
			if (this.value !== this.props.value) {
				this.setValue(this.props.value);
			}
		}

		if (prevProps.valueId !== this.props.valueId) {
			this.setValue(this.props.value);
		}
		//</editor-fold>
	}

	getDOMNode = () => {
		//<editor-fold defaultstate="collapsed" desc="getDOMNode">
		return this.input.current;
		//</editor-fold>
	};

	focus = () => {
		//<editor-fold defaultstate="collapsed" desc="focus">
		if (this.input.current) {
			this.input.current.focus();
		}
		//</editor-fold>
	};

	setValue = value => {
		//<editor-fold defaultstate="collapsed" desc="setValue">
		value = this.formatValue(value);
		this.value = value;

		this.setState({
			value: value,
		});
		//</editor-fold>
	};

	getValue = () => {
		//<editor-fold defaultstate="collapsed" desc="getValue">
		return this.value;
		//</editor-fold>
	};

	formatValue = value => {
		//<editor-fold defaultstate="collapsed" desc="formatValue">
		if (_.isUndefined(value)) {
			value = 0;
		}

		value = _.toNumber(value);

		return value;
		//</editor-fold>
	};

	onChange = e => {
		//<editor-fold defaultstate="collapsed" desc="onChange">
		const { controlled, onChange } = this.props;

		let value = e.target.value;

		if (!controlled) {
			this.setValue(value);
		}

		if (controlled) {
			value = this.formatValue(value);
		} else {
			value = this.getValue();
		}

		if (_.isFunction(onChange)) {
			onChange({ value: value, event: e, RangeInput: this, debounce: true });
		}

		if (_.isFunction(this._onChangeCompleted)) {
			this._onChangeCompleted({
				value: value,
				event: e,
				RangeInput: this,
			});
		}
		//</editor-fold>
	};

	render() {
		const { value } = this.state;
		const { min, max, step, className } = this.props;

		return (
			<input
				ref={this.input}
				className={className}
				type="range"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={this.onChange}
			/>
		);
	}
}

RangeInput.propTypes = propTypes;

RangeInput.defaultProps = defaultProps;

export default RangeInput;
