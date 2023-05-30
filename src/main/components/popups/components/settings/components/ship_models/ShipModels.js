import React, { Fragment, PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

import Settings from 'main/logic/Settings';

import Title from 'main/components/ui/title';
import Text from 'main/components/ui/text';
import Radio from 'main/components/ui/misc/radio';

import styles from './ShipModels.less';

const propTypes = {
	//from ui
	shipModels: PropTypes.oneOf(['classic', 'modern']),
};

const defaultProps = {
	//from ui
	shipModels: 'classic',
};

const uiProps = ownProps => {
	return {
		Settings: {
			shipModels: 'shipModels',
		},
	};
};

class ShipModels extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { shipModels } = this.props;

		return (
			<Fragment>
				<Title>
					<Text name="ship_models" />
				</Title>
				<div
					className={styles['model-select']}
					onClick={() => {
						Settings.setItem('shipModels', 'classic');
					}}>
					<Radio active={shipModels === 'classic'} />
					<div style={{ width: 5 }} />
					<span className={styles['text']}>
						<Text name="classic" />
					</span>
					<div style={{ width: 5 }} />
					<div className={styles['ship-div']} />
				</div>
				<div
					className={styles['model-select']}
					onClick={() => {
						Settings.setItem('shipModels', 'modern');
					}}>
					<Radio active={shipModels === 'modern'} />
					<div style={{ width: 5 }} />
					<span className={styles['text']}>
						<Text name="modern" />
					</span>
					<div style={{ width: 5 }} />
					<img
						className={styles['ship-image']}
						src="/img/ships/horizontal_3.png"
					/>
				</div>
			</Fragment>
		);
	}
}

ShipModels.propTypes = propTypes;

ShipModels.defaultProps = defaultProps;

ShipModels = WithUi(uiProps)(ShipModels);

export default ShipModels;
