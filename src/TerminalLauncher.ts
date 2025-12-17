import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Track active sessions by directory path (store window ID for reliable focus)
const activeSessions: Map<string, number> = new Map();

export class TerminalLauncher {

    /**
     * Launch or focus a terminal session for the given directory
     */
    static async launchOrFocus(
        directory: string,
        command: string
    ): Promise<void> {
        const existingWindowId = activeSessions.get(directory);

        if (existingWindowId !== undefined) {
            // Try to focus existing session by window ID
            const focused = await this.focusSession(existingWindowId);
            if (focused) {
                return;
            }
            // If focus failed, session might be closed - remove from tracking
            activeSessions.delete(directory);
        }

        // Launch new session and get window ID
        const windowId = await this.launchNew(directory, command);
        if (windowId !== null) {
            activeSessions.set(directory, windowId);
        }
    }

    /**
     * Launch a new terminal session and return the window ID
     */
    private static async launchNew(
        directory: string,
        command: string
    ): Promise<number | null> {
        if (process.platform !== 'darwin') {
            throw new Error('Currently only macOS is supported');
        }

        const escapedDir = directory.replace(/"/g, '\\"');
        const escapedCmd = command.replace(/"/g, '\\"');

        // Terminal.app: Create window and return its ID
        const script = `
            tell application "Terminal"
                activate
                do script "cd \\"${escapedDir}\\" && ${escapedCmd}"
                return id of front window
            end tell
        `;

        try {
            const result = await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
            const windowId = parseInt(result.stdout.trim(), 10);
            console.debug('ObsidianLLM: Created window with ID:', windowId);
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
    private static async focusSession(windowId: number): Promise<boolean> {
        if (process.platform !== 'darwin') {
            return false;
        }

        console.debug('ObsidianLLM: Trying to focus window ID:', windowId);

        try {
            // Terminal.app: Find and focus window by ID
            const script = `
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

            const result = await execAsync(`osascript -e '${script.replace(/'/g, "'\"'\"'")}'`);
            const success = result.stdout.trim() === 'true';
            console.debug('ObsidianLLM: Focus result:', success);
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
