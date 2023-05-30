import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Settings from 'main/logic/Settings';

import Title from 'main/components/ui/title';
import Text from 'main/components/ui/text';
import Switch from 'main/components/ui/misc/switch';

import extras from 'main/logic/data/extras';

import styles from './Extras.less';

const propTypes = {
	//from ui
	settings: PropTypes.object,
};

const defaultProps = {};

const uiProps = ownProps => {
	return {
		Settings: 'settings',
	};
};

class Extras extends Component {
	constructor(props) {
		super(props);
	}

	renderExtra = ({ name }) => {
		//<editor-fold defaultstate="collapsed" desc="renderExtra">
		const { settings } = this.props;

		const active = _.get(settings, name, false);

		return (
			<div
				key={name}
				className={styles['item']}
				onClick={() => {
					Settings.setItem(name, !active);
				}}>
				<div className={styles['item-icon-wrapper']}>
					<img
						className={styles['icon-image']}
						src={`/img/icons/${name}.png`}
					/>
				</div>
				<div style={{ width: 5 }} />
				<Switch active={active} theme="primary" />
				<div style={{ width: 5 }} />
				<span className={styles['text']}>
					<Text name={name} />
				</span>
			</div>
		);
		//</editor-fold>
	};

	renderBonuses = () => {
		//<editor-fold defaultstate="collapsed" desc="renderBonuses">
		const bonuses = _.filter(extras, e => e.type === 'bonus');

		return _.map(bonuses, this.renderExtra);
		//</editor-fold>
	};

	renderPenalties = () => {
		//<editor-fold defaultstate="collapsed" desc="renderPenalties">
		const penalties = _.filter(extras, e => e.type === 'penalty');

		return _.map(penalties, this.renderExtra);
		//</editor-fold>
	};

	renderMiscellaneous = () => {
		//<editor-fold defaultstate="collapsed" desc="renderMiscellaneous">
		const { settings } = this.props;

		const cheats = _.get(settings, 'cheats', false);

		return (
			<div
				className={styles['item']}
				onClick={() => {
					Settings.setItem('cheats', !cheats);
				}}>
				<div className={styles['item-icon-wrapper']}>
					<i className={`${styles['cheats-icon']} mdi mdi-ninja`} />
				</div>
				<div style={{ width: 5 }} />
				<Switch active={cheats} theme="primary" />
				<div style={{ width: 5 }} />
				<span className={styles['text']}>
					<Text name="cheats" />
				</span>
			</div>
		);
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				<Title>
					<Text name="bonuses" />
				</Title>
				{this.renderBonuses()}
				<div style={{ height: 20 }} />
				<Title>
					<Text name="penalties" />
				</Title>
				{this.renderPenalties()}
				<div style={{ height: 20 }} />
				<Title>
					<Text name="miscellaneous" />
				</Title>
				{this.renderMiscellaneous()}
			</Fragment>
		);
	}
}

Extras.propTypes = propTypes;

Extras.defaultProps = defaultProps;

Extras = WithUi(uiProps)(Extras);

export default Extras;
