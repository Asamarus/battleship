import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'main/components/ui/controls/button';
import Text from 'main/components/ui/text';

import gameEvents from 'main/gameEvents';

const propTypes = {};

const defaultProps = {};

class Content extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Fragment>
				<Button
					title={<Text name="show_enemy_ships" />}
					onClick={() => {
						ee.trigger(events.gameEvent, {
							event: gameEvents.cheats.showEnemyShips,
						});
					}}
				/>
				<div style={{ height: 20 }} />
				<Button
					title={<Text name="bonus_laser_horizontal" />}
					onClick={() => {
						ee.trigger(events.gameEvent, {
							event: gameEvents.cheats.horizontalLaser,
						});
					}}
				/>
				<div style={{ height: 20 }} />
				<Button
					title={<Text name="bonus_laser_vertical" />}
					onClick={() => {
						ee.trigger(events.gameEvent, {
							event: gameEvents.cheats.verticalLaser,
						});
					}}
				/>
				<div style={{ height: 20 }} />
				<Button
					title={<Text name="bonus_superblast" />}
					onClick={() => {
						ee.trigger(events.gameEvent, {
							event: gameEvents.cheats.superblast,
						});
					}}
				/>
				<div style={{ height: 20 }} />
				<Button
					title={<Text name="bonus_radar" />}
					onClick={() => {
						ee.trigger(events.gameEvent, {
							event: gameEvents.cheats.radar,
						});
					}}
				/>
			</Fragment>
		);
	}
}

Content.propTypes = propTypes;

Content.defaultProps = defaultProps;

export default Content;
