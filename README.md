# Obsidian LLM Session Launcher

ObsidianからClaude CodeなどのLLMセッションを素早く起動するプラグイン。

## 機能

- **ワンクリック起動**: リボンアイコンまたはコマンドパレットからLLMセッションを起動
- **ディレクトリ指定**: 編集中のファイルのディレクトリ、または任意のディレクトリを指定可能
- **外部ターミナル連携**: iTerm2 / Terminal.appでセッションを起動
- **セッション管理**: 既存セッションがあれば、そのターミナルにフォーカス

## インストール

1. このリポジトリをクローン
2. `npm install` で依存関係をインストール
3. `npm run build` でビルド
4. `main.js`, `manifest.json`, `styles.css` をVaultの `.obsidian/plugins/obsidian-llm-session/` にコピー

または `./deploy.sh` を実行してビルド＆デプロイを一括実行。

## 使い方

1. Obsidianでプラグインを有効化
2. リボンのターミナルアイコンをクリック、または `Cmd+P` → "Launch LLM Session"
3. モーダルでディレクトリを確認・編集
4. 「Launch Session」で外部ターミナルが起動

## 設定

| 設定項目 | 説明 | デフォルト |
|----------|------|------------|
| Launch Command | 起動するコマンド | `claude` |
| Terminal Application | 使用するターミナル | iTerm2 |
| Default Directory | デフォルトのディレクトリ | (現在のファイルのディレクトリ) |

## 対応環境

- macOS (iTerm2 / Terminal.app)
- Linux / Windows は今後対応予定

## 開発

```bash
npm install       # 依存関係インストール
npm run dev       # 開発モード（ウォッチ）
npm run build     # プロダクションビルド
./deploy.sh       # ビルド＆デプロイ
```

## ライセンス

MIT
