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

		containerEl.createEl('h2', {text: 'LLM Session Launcher Settings'});

		new Setting(containerEl)
			.setName('Launch Command')
			.setDesc('Command to run in terminal (e.g., claude, aider, cursor)')
			.addText(text => text
				.setPlaceholder('claude')
				.setValue(this.plugin.settings.launchCommand)
				.onChange(async (value) => {
					this.plugin.settings.launchCommand = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default Directory')
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
