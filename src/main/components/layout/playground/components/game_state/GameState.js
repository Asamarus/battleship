import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Text from 'main/components/ui/text';
import ReplayTopControls from 'main/components/ui/replay/top_controls';

import styles from './GameState.less';

const propTypes = {
	//from ui
	state: PropTypes.string,
	showReplay: PropTypes.bool,
};

const defaultProps = {
	//from ui
	showReplay: false,
};

const uiProps = ownProps => {
	return {
		Game: {
			state: 'state',
		},
		Replay: {
			show: 'showReplay',
		},
	};
};

class GameState extends Component {
	constructor(props) {
		super(props);
	}

	renderState = () => {
		//<editor-fold defaultstate="collapsed" desc="renderState">
		const { state } = this.props;

		if (_g.isEmpty(state)) {
			return null;
		}

		const className = _g.classNames(
			styles['text'],
			{ [styles['text_green']]: _g.inArray(state, ['your_turn', 'you_won']) },
			{ [styles['text_red']]: _g.inArray(state, ['enemys_turn', 'you_lost']) },
		);

		return (
			<span className={className}>
				<Text name={state} />
			</span>
		);
		//</editor-fold>
	};

	render() {
		const { showReplay } = this.props;

		return (
			<div className={styles['wrapper']}>
				<div className={styles['container']}>
					{this.renderState()}
					{showReplay && <ReplayTopControls />}
				</div>
			</div>
		);
	}
}

GameState.propTypes = propTypes;

GameState.defaultProps = defaultProps;

GameState = WithUi(uiProps)(GameState);

export default GameState;
