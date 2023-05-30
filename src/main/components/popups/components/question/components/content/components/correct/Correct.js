import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import gameEvents from 'main/gameEvents';

import Text from 'main/components/ui/text';

import styles from './Correct.less';

const propTypes = {};

const defaultProps = {};

class Correct extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		setTimeout(() => {
			ee.trigger(events.gameEvent, {
				event: gameEvents.game.answerQuestion,
			});
		}, 2000);
		//</editor-fold>
	}

	render() {
		return (
			<div className={styles['wrapper']}>
				<div className={styles['icon-wrapper']}>
					<i className={`${styles['icon']} mdi mdi-checkbox-marked-circle`} />
				</div>
				<div style={{ height: 20 }} />
				<div className={styles['text']}>
					<Text name="correct_answer" />
				</div>
			</div>
		);
	}
}

Correct.propTypes = propTypes;

Correct.defaultProps = defaultProps;

export default Correct;
