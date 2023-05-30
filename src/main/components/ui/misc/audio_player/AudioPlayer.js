import { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

import WithUi from 'hoc/store/ui';

const propTypes = {
	//from ui
	soundEnabled: PropTypes.bool,
};

const defaultProps = {
	//from ui
	soundEnabled: false,
};

const uiProps = ownProps => {
	return {
		Settings: {
			sound: 'soundEnabled',
		},
	};
};

class AudioPlayer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//<editor-fold defaultstate="collapsed" desc="componentDidMount">
		ee.on(events.audio.play, this.onAudioPlay);
		//</editor-fold>
	}

	componentWillUnmount() {
		//<editor-fold defaultstate="collapsed" desc="componentWillUnmount">
		ee.off(events.audio.play, this.onAudioPlay);
		//</editor-fold>
	}

	onAudioPlay = name => {
		//<editor-fold defaultstate="collapsed" desc="onAudioPlay">
		const { soundEnabled } = this.props;

		if (!soundEnabled) {
			return;
		}

		const audio = new Audio(`/sounds/${name}.mp3`);

		if (name === 'shot') {
			audio.volume = 0.3;
		}

		audio.play();
		//</editor-fold>
	};

	render() {
		return null;
	}
}

AudioPlayer.propTypes = propTypes;

AudioPlayer.defaultProps = defaultProps;

AudioPlayer = WithUi(uiProps)(AudioPlayer);

export default AudioPlayer;
