import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';
import Button from 'main/components/ui/controls/button';
import Radio from 'main/components/ui/misc/radio';
import Correct from './components/correct';
import Wrong from './components/wrong';

import styles from './Content.less';

const propTypes = {
	//from ui
	currentLang: PropTypes.string,
	question: PropTypes.object,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Settings: {
			language: 'currentLang',
		},
		Question: 'question',
	};
};

class Content extends Component {
	constructor(props) {
		super(props);
	}

	renderQuestion = () => {
		//<editor-fold defaultstate="collapsed" desc="renderQuestion">
		const { question, currentLang } = this.props;

		const text = _.get(question, `question.${currentLang}`);

		return <div className={styles['question']}>{text}</div>;
		//</editor-fold>
	};

	renderVariants = () => {
		//<editor-fold defaultstate="collapsed" desc="renderVariants">
		const { question, currentLang } = this.props;

		const variants = _.get(question, `variants.${currentLang}`);

		return _.map(variants, this.renderVariant);
		//</editor-fold>
	};

	renderVariant = (text, index) => {
		//<editor-fold defaultstate="collapsed" desc="renderVariant">
		const { question } = this.props;

		const userAnswer = _.get(question, 'userAnswer');

		return (
			<div
				key={index}
				className={styles['variant']}
				onClick={() => {
					uiStore.set('Question.userAnswer', index);
				}}>
				<Radio active={userAnswer === index} />
				<div style={{ width: 5 }} />
				<span className={styles['variant-text']}>{text}</span>
			</div>
		);
		//</editor-fold>
	};

	renderButton = () => {
		//<editor-fold defaultstate="collapsed" desc="renderButton">
		const { question } = this.props;

		const userAnswer = _.get(question, 'userAnswer');

		return (
			<Button
				title={<Text name="answer" />}
				disabled={_.isUndefined(userAnswer)}
				onClick={() => {
					uiStore.set('Question.userAnswered', true);
				}}
			/>
		);
		//</editor-fold>
	};

	render() {
		const { question } = this.props;

		const userAnswer = _.get(question, 'userAnswer');
		const userAnswered = _.get(question, 'userAnswered', false);
		const answer = _.get(question, 'answer');

		if (!_.isUndefined(userAnswer) && userAnswered) {
			if (userAnswer === answer) {
				return <Correct />;
			}

			return <Wrong />;
		}

		return (
			<Fragment>
				{this.renderQuestion()}
				<div style={{ height: 20 }} />
				{this.renderVariants()}
				<div style={{ height: 20 }} />
				{this.renderButton()}
			</Fragment>
		);
	}
}

Content.propTypes = propTypes;

Content.defaultProps = defaultProps;

Content = WithUi(uiProps)(Content);

export default Content;
