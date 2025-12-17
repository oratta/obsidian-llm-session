import { Plugin } from 'obsidian';
import { ObsidianLLMSessionSettings, ObsidianLLMSessionSettingTab, DEFAULT_SETTINGS } from './src/Settings';
import { LaunchModal } from './src/LaunchModal';
import { TerminalLauncher } from './src/TerminalLauncher';
import * as path from 'path';

export default class ObsidianLLMSessionPlugin extends Plugin {
	settings: ObsidianLLMSessionSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		this.addRibbonIcon('terminal', 'Launch LLM session', () => {
			this.openLaunchModal();
		});

		// Add command
		this.addCommand({
			id: 'launch-llm-session',
			name: 'Launch LLM session',
			callback: () => {
				this.openLaunchModal();
			}
		});

		// Add settings tab
		this.addSettingTab(new ObsidianLLMSessionSettingTab(this.app, this));
	}

	private openLaunchModal() {
		// Determine initial directory from current file or settings
		let initialDirectory = this.settings.defaultDirectory;

		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile && !initialDirectory) {
			// Use the directory of the current file
			initialDirectory = path.dirname(activeFile.path);
			if (initialDirectory === '.') {
				initialDirectory = '';
			}
		}

		new LaunchModal(this.app, this.settings, initialDirectory).open();
	}

	onunload() {
		TerminalLauncher.clearSessions();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
