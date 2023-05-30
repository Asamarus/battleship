import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import getScrollBarWidth from 'main/core/helpers/getScrollBarWidth';

import Menu from './components/menu';
import YouWon from './components/you_won';
import YouLost from './components/you_lost';
import Cheats from './components/cheats';
import Question from './components/question';
import Rules from './components/rules';
import Settings from './components/settings';
import Statistics from './components/statistics';

const propTypes = {
	//from ui
	menuOpened: PropTypes.bool,
	youWonOpened: PropTypes.bool,
	youLostOpened: PropTypes.bool,
	cheatsOpened: PropTypes.bool,
	questionOpened: PropTypes.bool,
	rulesOpened: PropTypes.bool,
	settingsOpened: PropTypes.bool,
	statisticsOpened: PropTypes.bool,
};

const defaultProps = {
	//from ui
	menuOpened: false,
	youWonOpened: false,
	youLostOpened: false,
	cheatsOpened: false,
	questionOpened: false,
	rulesOpened: false,
	settingsOpened: false,
	statisticsOpened: false,
};

const uiProps = ownProps => {
	return {
		Popups: {
			you_won: 'youWonOpened',
			you_lost: 'youLostOpened',
			cheats: 'cheatsOpened',
			question: 'questionOpened',
			rules: 'rulesOpened',
			settings: 'settingsOpened',
			statistics: 'statisticsOpened',
		},
		Menu: {
			opened: 'menuOpened',
		},
	};
};

class Popups extends Component {
	constructor(props) {
		super(props);

		this.scrollBarWidth = getScrollBarWidth();
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		this.updateOverflow();
		//</editor-fold>
	}

	componentDidUpdate(prevProps) {
		//<editor-fold defaultstate="collapsed" desc="componentDidUpdate">
		let update = false;

		_.forEach(
			[
				'menuOpened',
				'youWonOpened',
				'youLostOpened',
				'cheatsOpened',
				'questionOpened',
				'rulesOpened',
				'settingsOpened',
				'statisticsOpened',
			],
			key => {
				if (prevProps[key] !== this.props[key]) {
					update = true;
				}
			},
		);

		if (update) {
			this.updateOverflow();
		}
		//</editor-fold>
	}

	updateOverflow = () => {
		//<editor-fold defaultstate="collapsed" desc="updateOverflow">
		const {
			menuOpened,
			youWonOpened,
			youLostOpened,
			cheatsOpened,
			questionOpened,
			rulesOpened,
			settingsOpened,
			statisticsOpened,
		} = this.props;

		const setUpdateOverflow = _.some([
			menuOpened,
			youWonOpened,
			youLostOpened,
			cheatsOpened,
			questionOpened,
			rulesOpened,
			settingsOpened,
			statisticsOpened,
		]);

		if (setUpdateOverflow) {
			$('body').css('margin-right', this.scrollBarWidth + 'px');
			$("[data-name='header']").css('margin-right', this.scrollBarWidth + 'px');
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
			$("[data-name='header']").css('margin-right', '');
			$('body').css('margin-right', '');
		}
		//</editor-fold>
	};

	renderMenu = () => {
		//<editor-fold defaultstate="collapsed" desc="renderMenu">
		const { menuOpened } = this.props;

		if (!menuOpened) {
			return null;
		}

		return <Menu />;
		//</editor-fold>
	};

	renderYouWon = () => {
		//<editor-fold defaultstate="collapsed" desc="renderYouWon">
		const { youWonOpened } = this.props;

		if (!youWonOpened) {
			return null;
		}

		return <YouWon />;
		//</editor-fold>
	};

	renderYouLost = () => {
		//<editor-fold defaultstate="collapsed" desc="renderYouLost">
		const { youLostOpened } = this.props;

		if (!youLostOpened) {
			return null;
		}

		return <YouLost />;
		//</editor-fold>
	};

	renderCheats = () => {
		//<editor-fold defaultstate="collapsed" desc="renderCheats">
		const { cheatsOpened } = this.props;

		if (!cheatsOpened) {
			return null;
		}

		return <Cheats />;
		//</editor-fold>
	};

	renderQuestion = () => {
		//<editor-fold defaultstate="collapsed" desc="renderQuestion">
		const { questionOpened } = this.props;

		if (!questionOpened) {
			return null;
		}

		return <Question />;
		//</editor-fold>
	};

	renderRules = () => {
		//<editor-fold defaultstate="collapsed" desc="renderRules">
		const { rulesOpened } = this.props;

		if (!rulesOpened) {
			return null;
		}

		return <Rules />;
		//</editor-fold>
	};

	renderSettings = () => {
		//<editor-fold defaultstate="collapsed" desc="renderSettings">
		const { settingsOpened } = this.props;

		if (!settingsOpened) {
			return null;
		}

		return <Settings />;
		//</editor-fold>
	};

	renderStatistics = () => {
		//<editor-fold defaultstate="collapsed" desc="renderSettings">
		const { statisticsOpened } = this.props;

		if (!statisticsOpened) {
			return null;
		}

		return <Statistics />;
		//</editor-fold>
	};

	render() {
		return (
			<Fragment>
				{this.renderMenu()}
				{this.renderYouWon()}
				{this.renderYouLost()}
				{this.renderCheats()}
				{this.renderQuestion()}
				{this.renderRules()}
				{this.renderSettings()}
				{this.renderStatistics()}
			</Fragment>
		);
	}
}

Popups.propTypes = propTypes;

Popups.defaultProps = defaultProps;

Popups = WithUi(uiProps)(Popups);

export default Popups;
