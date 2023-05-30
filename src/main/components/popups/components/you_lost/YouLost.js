import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import gameEvents from 'main/gameEvents';

import Text from 'main/components/ui/text';
import ConfirmationPopup from 'main/components/ui/confirmation_popup';

const propTypes = {};

const defaultProps = {};

class YouLost extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const data = {
			title: <Text name="you_lost" />,
			text: <Text name="start_new_game" />,
			confirm: <Text name="yes" />,
			cancel: <Text name="no" />,
			theme: 'danger',
			onConfirm: () => {
				ee.trigger(events.gameEvent, { event: gameEvents.game.newGame });
				uiStore.set('Popups.you_lost', false);
			},
			onCancel: () => {
				uiStore.set('Popups.you_lost', false);
			},
		};

		return <ConfirmationPopup data={data} />;
	}
}

YouLost.propTypes = propTypes;

YouLost.defaultProps = defaultProps;

export default YouLost;
