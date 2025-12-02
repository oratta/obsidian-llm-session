import { App, PluginSettingTab, Setting } from 'obsidian';
import ObsidianLLMSessionPlugin from '../main';

export interface ObsidianLLMSessionSettings {
	shellPath: string;
	rootDirectory: string;
	excludeDirectories: string[];
}

export const DEFAULT_SETTINGS: ObsidianLLMSessionSettings = {
	shellPath: '/bin/zsh',
	rootDirectory: '',
	excludeDirectories: ['node_modules', '.git', '.obsidian']
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

		containerEl.createEl('h2', {text: 'Obsidian LLM Session Settings'});

		new Setting(containerEl)
			.setName('Shell Path')
			.setDesc('Path to the shell executable (e.g. /bin/zsh, /bin/bash)')
			.addText(text => text
				.setPlaceholder('/bin/zsh')
				.setValue(this.plugin.settings.shellPath)
				.onChange(async (value) => {
					this.plugin.settings.shellPath = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
			.setName('Root Directory')
			.setDesc('Root directory for the plugin to operate in (relative to vault root). Leave empty for vault root.')
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.rootDirectory)
				.onChange(async (value) => {
					this.plugin.settings.rootDirectory = value;
					await this.plugin.saveSettings();
				}));
                
        new Setting(containerEl)
            .setName('Exclude Directories')
            .setDesc('Comma separated list of directories to exclude from context')
            .addText(text => text
                .setPlaceholder('node_modules, .git')
                .setValue(this.plugin.settings.excludeDirectories.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.excludeDirectories = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    await this.plugin.saveSettings();
                }));
	}
}
