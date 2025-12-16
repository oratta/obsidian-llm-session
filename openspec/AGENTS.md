# OpenSpec プロジェクトコンテキスト

## プロジェクト概要

**プロジェクト名:** Obsidian LLM Session Launcher
**バージョン:** 0.2.0
**言語:** TypeScript
**プラットフォーム:** Obsidian Plugin (Electron/macOS)

## 目的

ObsidianからClaude CodeなどのLLMセッションを素早く起動するランチャープラグイン。
ファイル編集中のコンテキスト（ディレクトリ）を保持したまま、外部ターミナルでLLMセッションを開始できる。

## 主要機能

1. **ランチャーモーダル** - ディレクトリ確認・編集後に起動
2. **外部ターミナル連携** - Terminal.app でセッション起動
3. **セッション管理** - ウィンドウIDで追跡し、既存セッションにフォーカス
4. **Enterキー起動** - モーダルでEnterを押すだけで即座に起動

## アーキテクチャ

```
main.ts                    # プラグインエントリポイント
src/
├── Settings.ts            # 設定管理
├── LaunchModal.ts         # モーダルUI
└── TerminalLauncher.ts    # 外部ターミナル起動（AppleScript）
```

## 技術スタック

- **フレームワーク:** Obsidian Plugin API
- **言語:** TypeScript
- **ビルド:** esbuild
- **ターミナル制御:** AppleScript (osascript)
- **対応OS:** macOS (Terminal.app)

## 設定項目

| 設定 | 型 | デフォルト | 説明 |
|------|-----|-----------|------|
| launchCommand | string | `claude` | 起動するコマンド |
| defaultDirectory | string | (空) | デフォルトディレクトリ |

## 既知の制限

- macOSのみ対応（Linux/Windowsは未対応）
- セッション追跡はメモリ内のみ（Obsidian再起動でリセット）

## 関連ドキュメント

- [PRD](docs/contexts/prd.md) - 製品要件定義書
- [README](README.md) - プラグイン説明
- [AGENTS.md](AGENTS.md) - Obsidianプラグイン開発ガイド

## OpenSpec運用ルール

1. **すべてのドキュメントは日本語で作成**
2. **大きな機能追加・変更はproposal.mdから開始**
3. **コード調査にはSerena MCPを優先使用**
4. **実装完了後はarchiveへ移動**

## 今後の拡張候補

- Linux/Windows対応
- セッション履歴の永続化
- ノート/選択範囲からの右クリック起動
- カスタムコマンドテンプレート
