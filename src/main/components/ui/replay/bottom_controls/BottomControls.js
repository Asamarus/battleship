import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import RangeInput from 'main/components/ui/inputs/range_input';

import styles from './BottomControls.less';

const propTypes = {
	//from ui
	items: PropTypes.array,
};

const defaultProps = {
	//from ui
	items: [],
};

const uiProps = ownProps => {
	return {
		Statistics: {
			history: 'items',
		},
	};
};

class BottomControls extends Component {
	constructor(props) {
		super(props);

		this.mounted = false;

		this.session = _g.generateShortId();

		this.current = 0;
		this.isPlaying = true;
		this.state = {
			play: true,
			current: 0,
		};
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.mounted = true;

		this.play();
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		this.mounted = false;
		//</editor-fold>
	}

	delayedTask = (callback, timeout) => {
		//<editor-fold defaultstate="collapsed" desc="delayedTask">
		setTimeout(
			(function(self, localSession) {
				return () => {
					if (localSession !== self.session) {
						//console.error('Replay session has changed!');
						return;
					}

					if (self.mounted) {
						callback();
					}
				};
			})(this, this.session),
			timeout,
		);
		//</editor-fold>
	};

	play = () => {
		//<editor-fold defaultstate="collapsed" desc="play">
		this.isPlaying = true;

		if (this.mounted) {
			this.setState({
				play: true,
			});
		}

		this.applyHistoryItem(this.current, true);
		//</editor-fold>
	};

	pause = () => {
		//<editor-fold defaultstate="collapsed" desc="pause">
		this.session = _g.generateShortId();
		this.isPlaying = false;
		if (this.mounted) {
			this.setState({
				play: false,
			});
		}
		//</editor-fold>
	};

	applyHistoryItem = (index, noDelay = false) => {
		//<editor-fold defaultstate="collapsed" desc="applyHistoryItem">
		const { items } = this.props;

		const item = _.get(items, index);

		if (_g.isEmpty(item)) {
			return;
		}

		const { data, sound, highlight, delay } = item;

		const callback = () => {
			if (!_g.isEmpty(highlight)) {
				ee.trigger(events.cell.highlight, highlight);
			}

			if (this.mounted) {
				this.setState({
					current: index,
				});
			}

			uiStore.batch({
				set: [
					{
						path: 'BattleField.left',
						value: data.left,
					},
					{
						path: 'BattleField.right',
						value: data.right,
					},
				],
			});

			if (!_g.isEmpty(sound)) {
				ee.trigger(events.audio.play, sound);
			}

			if (this.isPlaying) {
				this.next();
			}
		};

		if (noDelay) {
			callback();
		} else {
			this.delayedTask(callback, delay);
		}
		//</editor-fold>
	};

	next = () => {
		//<editor-fold defaultstate="collapsed" desc="next">
		const { items } = this.props;

		if (_.size(items) - 1 === this.current) {
			this.pause();
		} else {
			this.current++;
			this.applyHistoryItem(this.current);
		}
		//</editor-fold>
	};

	onRangechangeCompleted = ({ value }) => {
		//<editor-fold defaultstate="collapsed" desc="onRangechangeCompleted">
		this.pause();
		this.current = _.toInteger(value);
		this.applyHistoryItem(this.current, true);
		//</editor-fold>
	};

	onChange = ({ value }) => {
		//<editor-fold defaultstate="collapsed" desc="onChange">
		this.setState({ current: _.toInteger(value) });
		//</editor-fold>
	};

	onToggleClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onToggleClick">
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
		//</editor-fold>
	};

	onLeftClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onLeftClick">
		if (this.current === 0) {
			return;
		}

		this.pause();

		this.current--;
		this.applyHistoryItem(this.current, true);
		//</editor-fold>
	};

	onRightClick = () => {
		//<editor-fold defaultstate="collapsed" desc="onRightClick">
		const { items } = this.props;

		if (_.size(items) - 1 === this.current) {
			return;
		}

		this.pause();

		this.current++;
		this.applyHistoryItem(this.current, true);
		//</editor-fold>
	};

	render() {
		const { items } = this.props;
		const { current, play } = this.state;

		const total = _.size(items);

		const leftIconClassName = _g.classNames(styles['icon-wrapper'], {
			[styles['icon-wrapper_disabled']]: current === 0,
		});

		const rightIconClassName = _g.classNames(styles['icon-wrapper'], {
			[styles['icon-wrapper_disabled']]: current === total - 1,
		});

		return (
			<div className={styles['container']}>
				<div className={styles['wrapper']}>
					<div className={styles['icon-wrapper']} onClick={this.onToggleClick}>
						<i
							className={`${styles['icon']} mdi mdi-${play ? 'pause' : 'play'}`}
						/>
					</div>
					<div className={styles['range-wrapper']}>
						<RangeInput
							className={styles['range']}
							value={current}
							max={total - 1}
							controlled={true}
							onChange={this.onChange}
							onChangeCompleted={this.onRangechangeCompleted}
						/>
					</div>
					<div className={leftIconClassName} onClick={this.onLeftClick}>
						<i className={`${styles['icon']} mdi mdi-chevron-left`} />
					</div>
					<div className={rightIconClassName} onClick={this.onRightClick}>
						<i className={`${styles['icon']} mdi mdi-chevron-right`} />
					</div>
				</div>
			</div>
		);
	}
}

BottomControls.propTypes = propTypes;

BottomControls.defaultProps = defaultProps;

BottomControls = WithUi(uiProps)(BottomControls);

export default BottomControls;
