import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Text from 'main/components/ui/text';
import QuestionContent from './components/content';

const maxWidth = '500px';

const propTypes = {};

const defaultProps = {};

class Question extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Popup
				level={2}
				contentWrapStyle={{
					maxWidth: maxWidth,
				}}>
				<Header
					theme="primary"
					title={<Text name="question" />}
					showCloseControl={false}
				/>
				<Content>
					<QuestionContent />
				</Content>
			</Popup>
		);
	}
}

Question.propTypes = propTypes;

Question.defaultProps = defaultProps;

export default Question;
