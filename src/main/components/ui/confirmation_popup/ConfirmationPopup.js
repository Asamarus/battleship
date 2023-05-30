import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import Popup from 'main/components/ui/popup';
import Header from 'main/components/ui/popup_header';
import Content from 'main/components/ui/popup_content';
import Button from 'main/components/ui/controls/button';

import styles from './ConfirmationPopup.less';

export const settings = {
	name: 'confirmation',
	inUrl: false,
	level: 15,
};

const defaultSettings = {
	level: settings.level,
	verticalAlign: 'top',
	maxWidth: '400px',
	openAnimation: '',
	closeAnimation: '',
	PopupProps: {},
	//content
	ContentProps: {},
};

const propTypes = {
	data: PropTypes.object,
	settings: PropTypes.object,
};

const defaultProps = {
	data: {},
	settings: {},
};

class ConfirmationPopup extends Component {
	constructor(props) {
		super(props);
	}

	onConfirm = () => {
		//<editor-fold defaultstate="collapsed" desc="onConfirm">
		const onConfirm = _.get(this.props.data, 'onConfirm');

		if (_.isFunction(onConfirm)) {
			onConfirm();
		}

		//</editor-fold>
	};

	onClose = () => {
		//<editor-fold defaultstate="collapsed" desc="onClose">
		const onCancel = _.get(this.props.data, 'onCancel');

		if (_.isFunction(onCancel)) {
			onCancel();
		}
		//</editor-fold>
	};

	render() {
		const classNames = _g.getClassNames(
			styles,
			_.get(this.props.data, 'classNames', {}),
		);

		const { settings } = this.props;
		const options = _.defaults(settings, defaultSettings);

		const {
			level,
			verticalAlign,
			maxWidth,
			openAnimation,
			closeAnimation,
			PopupProps,
			ContentProps,
		} = options;

		const title = _.get(this.props.data, 'title', 'Confirm action');
		const text = _.get(this.props.data, 'text', 'Are you sure?');
		const theme = _.get(this.props.data, 'theme', 'danger');
		const confirm = _.get(this.props.data, 'confirm', 'Confirm');
		const cancel = _.get(this.props.data, 'cancel', 'Cancel');

		return (
			<Popup
				{...PopupProps}
				name={settings.name}
				level={level}
				verticalAlign={verticalAlign}
				//onOverlayClick={this.onClose}
				showCloseControl={false}
				contentWrapStyle={{
					maxWidth: maxWidth,
				}}
				openAnimation={openAnimation}
				closeAnimation={closeAnimation}>
				<Header
					theme={theme}
					title={title}
					showCloseControl={true}
					onClose={this.onClose}
				/>
				<Content
					{...ContentProps}
					classNames={{ wrapper: classNames['wrapper'] }}>
					<div className={classNames['text']}>{text}</div>
					<div className={classNames['footer']}>
						<span className={classNames['cancel']} onClick={this.onClose}>
							{cancel}
						</span>
						<Button
							theme={theme}
							title={confirm}
							onClick={this.onConfirm}
							fullWidth={false}
						/>
					</div>
				</Content>
			</Popup>
		);
	}
}

ConfirmationPopup.propTypes = propTypes;

ConfirmationPopup.defaultProps = defaultProps;

export default ConfirmationPopup;
