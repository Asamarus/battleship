import React, { PureComponent as Component } from 'react';
import getDisplayName from 'main/core/helpers/getDisplayName';

const hoc = WrappedComponent => {
	class WithBrowserWidth extends Component {
		static displayName = `WithBrowserWidth(${getDisplayName(
			WrappedComponent,
		)})`;

		constructor(props, context) {
			super(props, context);
			this.state = {
				browserWidth: browser_window.width,
			};
			this.mounted = false;
		}

		componentDidMount() {
			//<editor-fold defaultstate="collapsed" desc="componentDidMount">
			this.mounted = true;
			ee.on(events.browserWindow.widthChange, this.onResize);
			//</editor-fold>
		}

		componentWillUnmount() {
			//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
			this.mounted = false;
			ee.off(events.browserWindow.widthChange, this.onResize);
			//</editor-fold>
		}

		onResize = ({ width }) => {
			//<editor-fold defaultstate="collapsed" desc="onResize">
			if (!this.mounted) {
				return;
			}

			this.setState({
				browserWidth: width,
			});
			//</editor-fold>
		};

		render() {
			const { browserWidth } = this.state;
			return <WrappedComponent {...this.props} browserWidth={browserWidth} />;
		}
	}

	return WithBrowserWidth;
};

export default hoc;
