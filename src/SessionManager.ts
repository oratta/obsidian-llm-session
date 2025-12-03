import { App, FileSystemAdapter } from 'obsidian';
import * as path from 'path';
import * as fs from 'fs';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { ObsidianLLMSessionSettings } from './Settings';

export class SessionManager {
    private sessions: Map<string, ChildProcessWithoutNullStreams> = new Map();
    private app: App;
    private settings: ObsidianLLMSessionSettings;

    constructor(app: App, settings: ObsidianLLMSessionSettings) {
        this.app = app;
        this.settings = settings;
    }

    public createSession(directory: string, onData: (data: string) => void): ChildProcessWithoutNullStreams {
        if (this.sessions.has(directory)) {
            const session = this.sessions.get(directory)!;
            this.attachListeners(session, onData);
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

        let command = shell;
        let args: string[] = [];

        // Use python3 pty module to emulate PTY on macOS/Linux
        // This is more robust than 'script' and works over pipes
        if (process.platform === 'darwin' || process.platform === 'linux') {
            command = 'python3';
            // import pty; pty.spawn(shell)
            args = ['-c', `import pty; pty.spawn("${shell}")`];
        }

        const subprocess = spawn(command, args, {
            cwd: cwd,
            env: { ...process.env, TERM: 'xterm-256color' }
        });

        this.attachListeners(subprocess, onData);

        subprocess.on('exit', () => {
            this.sessions.delete(directory);
            onData('\r\n[Process exited]\r\n');
        });

        this.sessions.set(directory, subprocess);
        return subprocess;
    }

    private attachListeners(subprocess: ChildProcessWithoutNullStreams, onData: (data: string) => void) {
        // Remove old listeners to avoid duplication if re-attaching (simplified logic)
        subprocess.stdout.removeAllListeners('data');
        subprocess.stderr.removeAllListeners('data');

        subprocess.stdout.on('data', (data) => {
            onData(data.toString());
        });

        subprocess.stderr.on('data', (data) => {
            onData(data.toString());
        });
    }

    public getSession(directory: string): ChildProcessWithoutNullStreams | undefined {
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
        // child_process cannot be resized like a PTY. 
        // We silently ignore this or could try to set COLUMNS/LINES env vars if we restarted the process, 
        // but for a running process it's not easily possible without PTY.
    }

    public writeToSession(directory: string, data: string) {
        const session = this.sessions.get(directory);
        if (session) {
            session.stdin.write(data);
        }
    }

    private initializeContext(cwd: string) {
        // Create contexts directory if it doesn't exist
        const contextsDir = path.join(cwd, 'contexts');
        if (!fs.existsSync(contextsDir)) {
            fs.mkdirSync(contextsDir);
        }

        // Copy rule file if it exists in root
        const vaultRoot = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
        const ruleFileSource = path.join(vaultRoot, 'llm-rules.md');
        const ruleFileDest = path.join(cwd, 'llm-rules.md');

        if (fs.existsSync(ruleFileSource) && !fs.existsSync(ruleFileDest)) {
            fs.copyFileSync(ruleFileSource, ruleFileDest);
        }
    }
}
