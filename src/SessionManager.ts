import * as pty from 'node-pty';
import { IPty } from 'node-pty';
import { App, FileSystemAdapter } from 'obsidian';
import * as path from 'path';
import * as fs from 'fs';
import { ObsidianLLMSessionSettings } from './Settings';

export class SessionManager {
    private sessions: Map<string, IPty> = new Map();
    private app: App;
    private settings: ObsidianLLMSessionSettings;

    constructor(app: App, settings: ObsidianLLMSessionSettings) {
        this.app = app;
        this.settings = settings;
    }

    public createSession(directory: string, onData: (data: string) => void): IPty {
        if (this.sessions.has(directory)) {
            const session = this.sessions.get(directory)!;
            session.onData(onData);
            return session;
        }

        const vaultRoot = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
        const cwd = path.join(vaultRoot, directory);

        // Ensure directory exists
        if (!fs.existsSync(cwd)) {
            throw new Error(`Directory does not exist: ${cwd}`);
        }

        // Initialize context (copy rules, etc.)
        this.initializeContext(cwd);

        const shell = this.settings.shellPath;
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: cwd,
            env: process.env
        });

        ptyProcess.onData(onData);

        ptyProcess.onExit(() => {
            this.sessions.delete(directory);
        });

        this.sessions.set(directory, ptyProcess);
        return ptyProcess;
    }

    public getSession(directory: string): IPty | undefined {
        return this.sessions.get(directory);
    }

    public killSession(directory: string) {
        const session = this.sessions.get(directory);
        if (session) {
            session.kill();
            this.sessions.delete(directory);
        }
    }

    public resizeSession(directory: string, cols: number, rows: number) {
        const session = this.sessions.get(directory);
        if (session) {
            session.resize(cols, rows);
        }
    }

    private initializeContext(cwd: string) {
        // Create contexts directory if it doesn't exist
        const contextsDir = path.join(cwd, 'contexts');
        if (!fs.existsSync(contextsDir)) {
            fs.mkdirSync(contextsDir);
        }

        // Copy rule file if it exists in root
        // TODO: Make rule file path configurable or standard
        const vaultRoot = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
        const ruleFileSource = path.join(vaultRoot, 'llm-rules.md');
        const ruleFileDest = path.join(cwd, 'llm-rules.md');

        if (fs.existsSync(ruleFileSource) && !fs.existsSync(ruleFileDest)) {
            fs.copyFileSync(ruleFileSource, ruleFileDest);
        }
    }
}
