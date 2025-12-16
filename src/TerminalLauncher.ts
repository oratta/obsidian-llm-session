import { exec } from 'child_process';
import { promisify } from 'util';
import { TerminalApp } from './Settings';

const execAsync = promisify(exec);

// Track active sessions by directory path (store window ID for reliable focus)
const activeSessions: Map<string, { terminalApp: TerminalApp; windowId: number }> = new Map();

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
            // Try to focus existing session by window ID
            const focused = await this.focusSession(existingSession.windowId, existingSession.terminalApp);
            if (focused) {
                return;
            }
            // If focus failed, session might be closed - remove from tracking
            activeSessions.delete(directory);
        }

        // Launch new session and get window ID
        const windowId = await this.launchNew(directory, command, terminalApp);
        if (windowId !== null) {
            activeSessions.set(directory, { terminalApp, windowId });
        }
    }

    /**
     * Launch a new terminal session and return the window ID
     */
    private static async launchNew(
        directory: string,
        command: string,
        terminalApp: TerminalApp
    ): Promise<number | null> {
        if (process.platform !== 'darwin') {
            throw new Error('Currently only macOS is supported');
        }

        const escapedDir = directory.replace(/"/g, '\\"');
        const escapedCmd = command.replace(/"/g, '\\"');

        let script: string;

        if (terminalApp === 'iterm') {
            // iTerm2: Create window and return its ID
            script = `
                tell application "iTerm"
                    activate
                    set newWindow to (create window with default profile)
                    tell current session of newWindow
                        write text "cd \\"${escapedDir}\\" && ${escapedCmd}"
                    end tell
                    return id of newWindow
                end tell
            `;
        } else {
            // Terminal.app: Create window and return its ID
            script = `
                tell application "Terminal"
                    activate
                    do script "cd \\"${escapedDir}\\" && ${escapedCmd}"
                    return id of front window
                end tell
            `;
        }

        try {
            const result = await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
            const windowId = parseInt(result.stdout.trim(), 10);
            console.log('ObsidianLLM: Created window with ID:', windowId);
            return isNaN(windowId) ? null : windowId;
        } catch (error) {
            console.error('ObsidianLLM: Failed to create window:', error);
            // Still try to launch even if we can't get the ID
            await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`).catch(() => {});
            return null;
        }
    }

    /**
     * Try to focus an existing terminal session by window ID
     * Returns true if successful, false if the session no longer exists
     */
    private static async focusSession(
        windowId: number,
        terminalApp: TerminalApp
    ): Promise<boolean> {
        if (process.platform !== 'darwin') {
            return false;
        }

        console.log('ObsidianLLM: Trying to focus window ID:', windowId);

        try {
            let script: string;

            if (terminalApp === 'iterm') {
                // iTerm2: Find and focus window by ID
                script = `
                    tell application "iTerm"
                        set targetWindow to missing value
                        repeat with w in windows
                            if id of w is ${windowId} then
                                set targetWindow to w
                                exit repeat
                            end if
                        end repeat
                        if targetWindow is not missing value then
                            select targetWindow
                            activate
                            return true
                        else
                            return false
                        end if
                    end tell
                `;
            } else {
                // Terminal.app: Find and focus window by ID
                script = `
                    tell application "Terminal"
                        set targetWindow to missing value
                        repeat with w in windows
                            if id of w is ${windowId} then
                                set targetWindow to w
                                exit repeat
                            end if
                        end repeat
                        if targetWindow is not missing value then
                            set frontmost of targetWindow to true
                            activate
                            return true
                        else
                            return false
                        end if
                    end tell
                `;
            }

            const result = await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
            const success = result.stdout.trim() === 'true';
            console.log('ObsidianLLM: Focus result:', success);
            return success;
        } catch (error) {
            console.error('ObsidianLLM: Focus error:', error);
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
