import { exec } from 'child_process';
import { promisify } from 'util';
import { TerminalApp } from './Settings';

const execAsync = promisify(exec);

// Track active sessions by directory path
const activeSessions: Map<string, { terminalApp: TerminalApp; windowId?: string }> = new Map();

export class TerminalLauncher {

    /**
     * Launch or focus a terminal session for the given directory
     */
    static async launchOrFocus(
        directory: string,
        command: string,
        terminalApp: TerminalApp
    ): Promise<void> {
        const existingSession = activeSessions.get(directory);

        if (existingSession) {
            // Try to focus existing session
            const focused = await this.focusSession(directory, existingSession.terminalApp);
            if (focused) {
                return;
            }
            // If focus failed, session might be closed - remove from tracking
            activeSessions.delete(directory);
        }

        // Launch new session
        await this.launchNew(directory, command, terminalApp);
        activeSessions.set(directory, { terminalApp });
    }

    /**
     * Launch a new terminal session
     */
    private static async launchNew(
        directory: string,
        command: string,
        terminalApp: TerminalApp
    ): Promise<void> {
        if (process.platform !== 'darwin') {
            throw new Error('Currently only macOS is supported');
        }

        const escapedDir = directory.replace(/'/g, "'\\''");
        const escapedCmd = command.replace(/'/g, "'\\''");

        let script: string;

        if (terminalApp === 'iterm') {
            script = `
                tell application "iTerm"
                    activate
                    set newWindow to (create window with default profile)
                    tell current session of newWindow
                        write text "cd '${escapedDir}' && ${escapedCmd}"
                    end tell
                end tell
            `;
        } else {
            // Terminal.app
            script = `
                tell application "Terminal"
                    activate
                    do script "cd '${escapedDir}' && ${escapedCmd}"
                end tell
            `;
        }

        await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
    }

    /**
     * Try to focus an existing terminal session
     * Returns true if successful, false if the session no longer exists
     */
    private static async focusSession(
        directory: string,
        terminalApp: TerminalApp
    ): Promise<boolean> {
        if (process.platform !== 'darwin') {
            return false;
        }

        try {
            // For now, we just activate the terminal app
            // A more sophisticated implementation would track window IDs
            // and focus the specific window/tab
            const appName = terminalApp === 'iterm' ? 'iTerm' : 'Terminal';

            const script = `
                tell application "${appName}"
                    activate
                end tell
            `;

            await execAsync(`osascript -e '${script}'`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if a session exists for the given directory
     */
    static hasSession(directory: string): boolean {
        return activeSessions.has(directory);
    }

    /**
     * Clear session tracking (e.g., when plugin unloads)
     */
    static clearSessions(): void {
        activeSessions.clear();
    }
}
