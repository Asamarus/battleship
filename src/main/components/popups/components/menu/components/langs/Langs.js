import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Settings from 'main/logic/Settings';

import Sound from '../sound';

import styles from './Langs.less';

const propTypes = {
	//from ui
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

const langs = ['en', 'lv', 'ru'];

class Langs extends PureComponent {
	renderLang = lang => {
		//<editor-fold defaultstate="collapsed" desc="renderLang">

		const { currentLang } = this.props;

		const className = _g.classNames(
			styles['lang'],
			{ [styles['lang_active']]: lang === currentLang },
			{ [styles['lang_clickable']]: lang !== currentLang },
		);

		const extra = {};

		if (lang !== currentLang) {
			extra.onClick = () => {
				Settings.setItem('language', lang);
			};
		}

		return (
			<img
				key={lang}
				className={className}
				src={`/img/flags/${lang}.svg`}
				alt={lang}
				{...extra}
			/>
		);
		//</editor-fold>
	};

	render() {
		return (
			<div className={styles['wrapper']}>
				<Sound />
				{_.map(langs, this.renderLang)}
			</div>
		);
	}
}

Langs.propTypes = propTypes;

Langs.defaultProps = defaultProps;

Langs = WithUi(uiProps)(Langs);

export default Langs;
