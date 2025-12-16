import { exec } from 'child_process';
import { promisify } from 'util';
import { TerminalApp } from './Settings';

const execAsync = promisify(exec);

// Track active sessions by directory path
const activeSessions: Map<string, { terminalApp: TerminalApp; windowName: string }> = new Map();

export class TerminalLauncher {

    /**
     * Generate a unique window name for the session
     */
    private static generateWindowName(directory: string): string {
        // Use directory name as window name for easy identification
        const dirName = directory.split('/').filter(s => s).pop() || 'root';
        return `LLM:${dirName}`;
    }

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
            // Try to focus existing session by window name
            const focused = await this.focusSession(existingSession.windowName, existingSession.terminalApp);
            if (focused) {
                return;
            }
            // If focus failed, session might be closed - remove from tracking
            activeSessions.delete(directory);
        }

        // Launch new session
        const windowName = this.generateWindowName(directory);
        await this.launchNew(directory, command, terminalApp, windowName);
        activeSessions.set(directory, { terminalApp, windowName });
    }

    /**
     * Launch a new terminal session
     */
    private static async launchNew(
        directory: string,
        command: string,
        terminalApp: TerminalApp,
        windowName: string
    ): Promise<void> {
        if (process.platform !== 'darwin') {
            throw new Error('Currently only macOS is supported');
        }

        const escapedDir = directory.replace(/'/g, "'\\''");
        const escapedCmd = command.replace(/'/g, "'\\''");
        const escapedName = windowName.replace(/'/g, "'\\''");

        let script: string;

        if (terminalApp === 'iterm') {
            // iTerm2: Create window with specific name
            script = `
                tell application "iTerm"
                    activate
                    set newWindow to (create window with default profile)
                    tell newWindow
                        set name to "${escapedName}"
                    end tell
                    tell current session of newWindow
                        write text "cd '${escapedDir}' && ${escapedCmd}"
                    end tell
                end tell
            `;
        } else {
            // Terminal.app: Create window and set custom title
            script = `
                tell application "Terminal"
                    activate
                    do script "cd '${escapedDir}' && ${escapedCmd}"
                    set custom title of front window to "${escapedName}"
                end tell
            `;
        }

        await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
    }

    /**
     * Try to focus an existing terminal session by window name
     * Returns true if successful, false if the session no longer exists
     */
    private static async focusSession(
        windowName: string,
        terminalApp: TerminalApp
    ): Promise<boolean> {
        if (process.platform !== 'darwin') {
            return false;
        }

        const escapedName = windowName.replace(/'/g, "'\\''");

        try {
            let script: string;

            if (terminalApp === 'iterm') {
                // iTerm2: Find and focus window by name
                script = `
                    tell application "iTerm"
                        activate
                        set found to false
                        repeat with w in windows
                            if name of w contains "${escapedName}" then
                                select w
                                set found to true
                                exit repeat
                            end if
                        end repeat
                        return found
                    end tell
                `;
            } else {
                // Terminal.app: Find and focus window by custom title
                script = `
                    tell application "Terminal"
                        activate
                        set found to false
                        repeat with w in windows
                            if custom title of w contains "${escapedName}" then
                                set frontmost of w to true
                                set index of w to 1
                                set found to true
                                exit repeat
                            end if
                        end repeat
                        return found
                    end tell
                `;
            }

            const result = await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
            return result.stdout.trim() === 'true';
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
