import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import BattleField from 'main/components/ui/battle_field';
import DragEventListener from 'main/components/logic/drag_event_listener';
import GameState from './components/game_state';
import RightField from './components/right_field';
import Fleet from 'main/components/ui/battle_field/components/fleet';
import ReplayBottomControls from 'main/components/ui/replay/bottom_controls';

import styles from './Playground.less';

const propTypes = {
	//from ui
	showReplay: PropTypes.bool,
};

const defaultProps = {
	//from ui
	showReplay: false,
};

const uiProps = ownProps => {
	return {
		Replay: {
			show: 'showReplay',
		},
	};
};

class Playground extends PureComponent {
	constructor(props) {
		super(props);
		this._onScroll = _.debounce(this.onScroll, 400);
	}

	onScroll = e => {
		//<editor-fold defaultstate="collapsed" desc="onScroll">
		ee.trigger(events.playground.onScroll, e);
		//</editor-fold>
	};

	targetIdentifier = e => {
		//<editor-fold defaultstate="collapsed" desc="targetIdentifier">
		const target = $(e.target);

		let shipId;

		if (target.closest('[data-type="ship-drag-area"]').length > 0) {
			shipId = target
				.closest('[data-type="ship-drag-area"]')
				.attr('data-ship-id');
			return `ship-drag-area-${shipId}`;
		}

		return null;
		//</editor-fold>
	};

	render() {
		const { showReplay } = this.props;

		return (
			<DragEventListener
				className={styles['wrapper']}
				targetIdentifier={this.targetIdentifier}>
				<GameState />
				<div
					className={styles['battle-fields']}
					data-name="battle-fields"
					onScroll={this._onScroll}>
					<div className={styles['battle-fields_inner']}>
						<div className={styles['battle-fields_margin']} />
						<BattleField name="left" />
						<div className={styles['battle-fields_divider']} />
						<RightField />
						<div className={styles['battle-fields_margin']} />
					</div>
				</div>
				<div className={styles['extra-ui']}>
					<div className={styles['battle-fields_inner']}>
						<div className={styles['battle-fields_margin']} />
						<div className={styles['field-placeholder']}>
							<Fleet name="left" />
						</div>
						<div className={styles['battle-fields_divider']} />
						<div className={styles['field-placeholder']}>
							<Fleet name="right" />
						</div>
						<div className={styles['battle-fields_margin']} />
					</div>
				</div>
				{showReplay && <ReplayBottomControls />}
			</DragEventListener>
		);
	}
}

Playground.propTypes = propTypes;

Playground.defaultProps = defaultProps;

Playground = WithUi(uiProps)(Playground);

export default Playground;
