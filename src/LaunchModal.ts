import { App, Modal, Setting, Notice, FileSystemAdapter } from 'obsidian';
import { TerminalLauncher } from './TerminalLauncher';
import { ObsidianLLMSessionSettings } from './Settings';
import * as path from 'path';

export class LaunchModal extends Modal {
    private settings: ObsidianLLMSessionSettings;
    private directory: string;
    private vaultRoot: string;

    constructor(app: App, settings: ObsidianLLMSessionSettings, initialDirectory: string) {
        super(app);
        this.settings = settings;
        this.directory = initialDirectory;
        this.vaultRoot = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.createEl('h2', { text: 'Launch LLM Session' });

        // Show if session already exists
        const fullPath = path.join(this.vaultRoot, this.directory);
        if (TerminalLauncher.hasSession(fullPath)) {
            contentEl.createEl('p', {
                text: 'A session already exists for this directory. Launching will focus the existing terminal.',
                cls: 'llm-session-notice'
            });
        }

        // Directory input
        new Setting(contentEl)
            .setName('Directory')
            .setDesc('Directory to launch the session in (relative to vault root)')
            .addText(text => text
                .setValue(this.directory)
                .onChange((value) => {
                    this.directory = value;
                }));

        // Command preview
        const commandPreview = contentEl.createEl('div', { cls: 'llm-session-command-preview' });
        commandPreview.createEl('span', { text: 'Command: ' });
        commandPreview.createEl('code', { text: this.settings.launchCommand });

        // Buttons
        const buttonContainer = contentEl.createEl('div', { cls: 'llm-session-button-container' });

        const launchButton = buttonContainer.createEl('button', {
            text: 'Launch Session',
            cls: 'mod-cta'
        });
        launchButton.addEventListener('click', () => this.launch());

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => this.close());
    }

    private async launch() {
        const fullPath = path.join(this.vaultRoot, this.directory);

        try {
            await TerminalLauncher.launchOrFocus(
                fullPath,
                this.settings.launchCommand,
                this.settings.terminalApp
            );
            new Notice(`LLM Session launched in ${this.directory || 'vault root'}`);
            this.close();
        } catch (error) {
            new Notice(`Failed to launch: ${error.message}`);
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
