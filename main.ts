import { Plugin, WorkspaceLeaf } from 'obsidian';
import { ObsidianLLMSessionSettings, ObsidianLLMSessionSettingTab, DEFAULT_SETTINGS } from './src/Settings';
import { SessionManager } from './src/SessionManager';
import { TerminalView, VIEW_TYPE_TERMINAL } from './src/TerminalView';

export default class ObsidianLLMSessionPlugin extends Plugin {
	settings: ObsidianLLMSessionSettings;
	sessionManager: SessionManager;

	async onload() {
		await this.loadSettings();

		this.sessionManager = new SessionManager(this.app, this.settings);

		this.registerView(
			VIEW_TYPE_TERMINAL,
			(leaf) => new TerminalView(leaf, this, this.sessionManager)
		);

		this.addCommand({
			id: 'open-llm-session-terminal',
			name: 'Open Terminal',
			callback: () => {
				this.activateView();
			}
		});

		this.addSettingTab(new ObsidianLLMSessionSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_TERMINAL);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_TERMINAL, active: true });
			}
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() {
		// Clean up sessions
		// Ideally we should iterate and kill all sessions, but SessionManager handles process exit
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
