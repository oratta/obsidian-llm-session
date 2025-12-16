# Proposal: simplify-terminal-support

## Summary

プラグイン公開に向けて、動作保証範囲を簡素化する。iTerm2のサポートを削除し、macOS標準のTerminal.appのみに絞ることで、メンテナンスコストを削減し、初回リリースの品質を確保する。

## Why

- 現在、ターミナルアプリとして`iterm`と`terminal`の2つを選択可能だが、開発者はTerminal.appのみを使用している
- iTerm2は追加インストールが必要なサードパーティアプリであり、動作保証が困難
- プラグイン公開において、動作保証の範囲を明確にする必要がある
- 開発者は現在Claude Codeを使用しており、他のLLMツール（aider等）のテストは不要

## What Changes

### 削除するもの
1. **iTerm2サポート** - `terminalApp`設定からiterm選択肢を削除
2. **ターミナル選択UI** - 設定画面のドロップダウンを削除

### 維持するもの
1. **コマンド指定機能** - `launchCommand`設定は維持（ユーザーがカスタムコマンドを使用できるように）
2. **Terminal.appでの起動** - macOS標準ターミナルのみサポート

### 変更しないもの
- macOSのみ対応（Linux/Windowsは将来対応候補のまま）
- セッション管理機能（ウィンドウIDによる追跡）
- ランチャーモーダルの基本機能

## Impact

- `src/Settings.ts` - TerminalApp型の削除、設定UIの簡素化
- `src/TerminalLauncher.ts` - iTerm2用AppleScript分岐の削除
- `openspec/AGENTS.md` - 設定項目の更新
- README.md - ドキュメント更新

## Success Criteria

- Terminal.appのみでセッション起動・フォーカスが正常動作する
- 設定画面からターミナル選択が消えている
- コマンド設定は引き続き変更可能
