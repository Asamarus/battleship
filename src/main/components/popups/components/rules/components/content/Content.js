import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Text from 'main/components/ui/text';
import Title from 'main/components/ui/title';

import extras from 'main/logic/data/extras';

import styles from './Content.less';

const propTypes = {};

const defaultProps = {};

class Content extends Component {
	constructor(props) {
		super(props);
	}

	renderRules = () => {
		//<editor-fold defaultstate="collapsed" desc="renderRules">
		return (
			<div className={styles['text']}>
				<Text name="game_rules_text" />
			</div>
		);
		//</editor-fold>
	};

	renderExtra = ({ name }) => {
		//<editor-fold defaultstate="collapsed" desc="renderExtra">
		return (
			<div key={name} className={styles['item']}>
				<div className={styles['item-icon-wrapper']}>
					<img
						className={styles['icon-image']}
						src={`/img/icons/${name}.png`}
					/>
				</div>
				<div style={{ width: 10 }} />
				<span className={styles['text']}>
					<Text name={`${name}_description`} />
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

	render() {
		return (
			<Fragment>
				{this.renderRules()}
				<div style={{ height: 20 }} />
				<Title>
					<Text name="bonuses" />
				</Title>
				{this.renderBonuses()}
				<div style={{ height: 20 }} />
				<Title>
					<Text name="penalties" />
				</Title>
				{this.renderPenalties()}
			</Fragment>
		);
	}
}

Content.propTypes = propTypes;

Content.defaultProps = defaultProps;

export default Content;
