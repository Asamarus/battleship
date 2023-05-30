import localforage from 'localforage';

import extras from 'main/logic/data/extras';

class Settings {
	static getDefaults() {
		//<editor-fold defaultstate="collapsed" desc="getDefaults">
		const defaultSettings = {};

		defaultSettings['language'] = 'en';
		defaultSettings['shipModels'] = 'classic';
		defaultSettings['sound'] = false;
		defaultSettings['cheats'] = false;

		for (let i = 0; i < extras.length; i++) {
			const extra = extras[i];

			const active = extra.name !== 'penalty_question';
			defaultSettings[extra.name] = active;
		}

		return defaultSettings;
		//</editor-fold>
	}

	static async getSettings() {
		//<editor-fold defaultstate="collapsed" desc="getSettings">
		const savedSettings = await localforage.getItem('settings');

		return _.defaultsDeep(savedSettings, this.getDefaults());
		//</editor-fold>
	}

	static async setItem(key, value) {
		//<editor-fold defaultstate="collapsed" desc="setItem">
		const savedSettings = await localforage.getItem('settings');

		const settings = _.defaultsDeep(savedSettings, this.getDefaults());

		settings[key] = value;

		uiStore.set('Settings', _g.cloneDeep(settings));

		await localforage.setItem('settings', settings);
		//</editor-fold>
	}
}

export default Settings;
