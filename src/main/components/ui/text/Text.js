import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

const propTypes = {
	name: PropTypes.string.isRequired,
	//from ui
	text: PropTypes.any,
	currentLang: PropTypes.string,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Settings: {
			language: 'currentLang',
		},
	};
};

class Text extends PureComponent {
	render() {
		const { text, name } = this.props;

		if (_g.isEmpty(text)) {
			return name;
		}

		return text;
	}
}

Text.propTypes = propTypes;

Text.defaultProps = defaultProps;

Text = WithUi(ownProps => {
	return {
		translations: {
			[ownProps.currentLang]: {
				[ownProps.name]: 'text',
			},
		},
	};
})(Text);

Text = WithUi(uiProps)(Text);

export default Text;
