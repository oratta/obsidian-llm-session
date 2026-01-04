import { App, PluginSettingTab, Setting } from 'obsidian';
import ObsidianLLMSessionPlugin from '../main';

export interface ObsidianLLMSessionSettings {
	launchCommand: string;
	defaultDirectory: string;
}

export const DEFAULT_SETTINGS: ObsidianLLMSessionSettings = {
	launchCommand: 'claude',
	defaultDirectory: ''
}

export class ObsidianLLMSessionSettingTab extends PluginSettingTab {
	plugin: ObsidianLLMSessionPlugin;

	constructor(app: App, plugin: ObsidianLLMSessionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Launch command')
			.setDesc('Command to run in terminal')
			.addText(text => text
				.setPlaceholder('Enter command')
				.setValue(this.plugin.settings.launchCommand)
				.onChange(async (value) => {
					this.plugin.settings.launchCommand = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default directory')
			.setDesc('Default directory for new sessions (relative to vault root). Leave empty to use current file\'s directory.')
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.defaultDirectory)
				.onChange(async (value) => {
					this.plugin.settings.defaultDirectory = value;
					await this.plugin.saveSettings();
				}));
	}
}
