# LLM Session Launcher

Launch LLM sessions (Claude Code, etc.) in an external terminal directly from Obsidian.

## Features

- **One-Click Launch**: Start LLM sessions from the ribbon icon or command palette
- **Directory Selection**: Launch from the current file's directory or specify a custom path
- **External Terminal Integration**: Opens sessions in Terminal.app (macOS)
- **Session Management**: Focus existing sessions instead of creating duplicates

## Platform Support

**macOS only** - This plugin uses AppleScript to interact with Terminal.app.

> **Note**: This plugin launches an external terminal application (Terminal.app on macOS) to start LLM sessions. It does not access files outside the vault, but it does interact with external applications.

## Installation

### From Community Plugins (Recommended)

1. Open Obsidian Settings
2. Go to Community plugins
3. Click "Browse" and search for "LLM Session Launcher"
4. Click Install, then Enable

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/oratta/obsidian-llm-session/releases)
2. Create a folder named `obsidian-llm-session` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into the folder
4. Restart Obsidian and enable the plugin in Settings > Community plugins

## Usage

1. Enable the plugin in Obsidian's Community plugins settings
2. Click the terminal icon in the ribbon, or use Command Palette (`Cmd+P`) and search for "Launch LLM Session"
3. Review and edit the working directory in the modal
4. Click "Launch Session" to open the external terminal

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Launch Command | Command to execute in the terminal | `claude` |
| Default Directory | Default working directory | (current file's directory) |

## Development

```bash
npm install       # Install dependencies
npm run dev       # Development mode (watch)
npm run build     # Production build
```

## License

MIT
