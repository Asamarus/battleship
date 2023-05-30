import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { getAll } from 'main/core/store/ui/selectors';
import getDisplayName from 'main/core/helpers/getDisplayName';

const hoc = ui => WrappedComponent => {
	ui = _.isUndefined(ui) ? null : ui;

	const mapStateToProps = (state, ownProps) => {
		if (_.isFunction(ui)) {
			const data = {};
			const keys = ui(ownProps);
			const result = [];

			iterate(keys, '', result);

			_.forEach(result, o => {
				data[o.name] = _.get(getAll(state), o.path);
			});

			return data;
		} else {
			return {};
		}
	};

	const iterate = (obj, stack, result) => {
		for (const property in obj) {
			if (_.has(obj, property)) {
				if (_.isObject(obj[property])) {
					iterate(obj[property], stack + '.' + property, result);
				} else {
					let path = stack + '.' + property;
					path = path.substr(1);
					result.push({
						path: path,
						name: obj[property],
					});
				}
			}
		}
	};

	class WithUi extends Component {
		static displayName = `WithUi(${getDisplayName(WrappedComponent)})`;

		constructor(props, context) {
			super(props, context);
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	}

	const WithUiConnected = connect(mapStateToProps)(WithUi);

	return WithUiConnected;
};

export default hoc;
