#!/bin/bash

# Obsidian LLM Session Plugin Deploy Script
# Builds and deploys the plugin to the Obsidian plugins directory

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="obsidian-llm-session"
DEST_DIR="/Users/oratta/Dropbox/アプリ/Obsidian/oratta2025/.obsidian/plugins/${PLUGIN_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Obsidian LLM Session Plugin Deploy ===${NC}"

# Build
echo -e "${YELLOW}Building...${NC}"
cd "$SCRIPT_DIR"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Build successful!${NC}"

# Create destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    echo -e "${YELLOW}Creating plugin directory...${NC}"
    mkdir -p "$DEST_DIR"
fi

# Copy files
echo -e "${YELLOW}Deploying to ${DEST_DIR}...${NC}"

cp "$SCRIPT_DIR/main.js" "$DEST_DIR/"
cp "$SCRIPT_DIR/manifest.json" "$DEST_DIR/"
cp "$SCRIPT_DIR/styles.css" "$DEST_DIR/"

echo -e "${GREEN}=== Deploy complete! ===${NC}"
echo -e "Deployed files:"
ls -la "$DEST_DIR"

echo ""
echo -e "${YELLOW}Please reload Obsidian or disable/enable the plugin to apply changes.${NC}"
