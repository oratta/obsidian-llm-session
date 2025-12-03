import { ItemView, WorkspaceLeaf, DropdownComponent, ButtonComponent, FileSystemAdapter } from 'obsidian';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SessionManager } from './SessionManager';
import ObsidianLLMSessionPlugin from '../main';
import * as path from 'path';
import * as fs from 'fs';

export const VIEW_TYPE_TERMINAL = 'obsidian-llm-session-terminal';

export class TerminalView extends ItemView {
    plugin: ObsidianLLMSessionPlugin;
    sessionManager: SessionManager;
    terminal: Terminal;
    fitAddon: FitAddon;
    currentDirectory: string;
    container: HTMLElement;

    constructor(leaf: WorkspaceLeaf, plugin: ObsidianLLMSessionPlugin, sessionManager: SessionManager) {
        super(leaf);
        this.plugin = plugin;
        this.sessionManager = sessionManager;
        this.currentDirectory = plugin.settings.rootDirectory || '';
    }

    getViewType() {
        return VIEW_TYPE_TERMINAL;
    }

    getDisplayText() {
        return 'LLM Session Terminal';
    }

    async onOpen() {
        this.container = this.contentEl;
        this.container.empty();
        this.container.addClass('llm-session-terminal-view');

        // Toolbar
        const toolbar = this.container.createDiv({ cls: 'llm-session-toolbar' });

        // Directory Selector
        const dirSelect = new DropdownComponent(toolbar);
        this.populateDirectorySelector(dirSelect);
        dirSelect.onChange(async (value) => {
            this.currentDirectory = value;
            this.refreshTerminal();
        });

        // Refresh Button
        new ButtonComponent(toolbar)
            .setIcon('refresh-cw')
            .setTooltip('Refresh Directories')
            .onClick(() => {
                this.populateDirectorySelector(dirSelect);
            });

        // Terminal Container
        const terminalContainer = this.container.createDiv({ cls: 'llm-session-terminal-container' });

        // Initialize xterm.js
        this.terminal = new Terminal({
            cursorBlink: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff'
            }
        });

        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(terminalContainer);
        this.fitAddon.fit();

        // Handle resize
        this.registerDomEvent(window, 'resize', () => {
            this.fitAddon.fit();
            if (this.currentDirectory) {
                this.sessionManager.resizeSession(this.currentDirectory, this.terminal.cols, this.terminal.rows);
            }
        });

        // Initial session
        this.refreshTerminal();
    }

    populateDirectorySelector(dropdown: DropdownComponent) {
        dropdown.selectEl.empty();
        const vaultRoot = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
        const dirs = this.getDirectories(vaultRoot);

        // Add root option if configured
        dropdown.addOption('', '(Root)');

        dirs.forEach(dir => {
            dropdown.addOption(dir, dir);
        });

        dropdown.setValue(this.currentDirectory);
    }

    getDirectories(source: string): string[] {
        const directories: string[] = [];
        const items = fs.readdirSync(source, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                if (this.plugin.settings.excludeDirectories.includes(item.name)) {
                    continue;
                }
                directories.push(item.name);
                // Recursive? Maybe not for MVP, just top level or 1 level deep
            }
        }
        return directories;
    }

    refreshTerminal() {
        this.terminal.reset();

        // Detach old listeners if any (simplified for now, ideally we manage disposables)
        // In this simple implementation, we just create a new session or attach to existing

        const session = this.sessionManager.createSession(this.currentDirectory, (data) => {
            this.terminal.write(data);
        });

        this.terminal.onData((data) => {
            this.sessionManager.writeToSession(this.currentDirectory, data);
        });

        this.fitAddon.fit();
        this.sessionManager.resizeSession(this.currentDirectory, this.terminal.cols, this.terminal.rows);
    }

    async onClose() {
        // We don't kill the session on close, so it persists
    }
}
