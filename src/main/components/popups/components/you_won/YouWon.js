import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import gameEvents from 'main/gameEvents';

import Text from 'main/components/ui/text';
import ConfirmationPopup from 'main/components/ui/confirmation_popup';

const propTypes = {};

const defaultProps = {};

class YouWon extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const data = {
			title: <Text name="you_won" />,
			text: <Text name="start_new_game" />,
			confirm: <Text name="yes" />,
			cancel: <Text name="no" />,
			theme: 'success',
			onConfirm: () => {
				ee.trigger(events.gameEvent, { event: gameEvents.game.newGame });
				uiStore.set('Popups.you_won', false);
			},
			onCancel: () => {
				uiStore.set('Popups.you_won', false);
			},
		};

		return <ConfirmationPopup data={data} />;
	}
}

YouWon.propTypes = propTypes;

YouWon.defaultProps = defaultProps;

export default YouWon;
