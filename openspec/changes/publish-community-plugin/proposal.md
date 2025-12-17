# Proposal: publish-community-plugin

## Summary

ObsidianコミュニティプラグインディレクトリにLLM Session Launcherを公開するための準備と申請を行う。

## Why

- プラグインの基本機能が完成し、公開可能な状態になった
- より多くのユーザーに使ってもらうためにはコミュニティプラグインとしての公開が必要
- Obsidianの設定画面から直接インストールできるようになる

## What Changes

### 公開に必要な準備（Context7調査結果より）

#### 1. 必須ファイルの確認・更新

| ファイル | 状態 | 必要な作業 |
|----------|------|-----------|
| `manifest.json` | ✅ 存在 | `authorUrl`の追加、`description`の確認 |
| `main.js` | ✅ 存在 | ビルド済み |
| `styles.css` | ✅ 存在 | - |
| `README.md` | ✅ 存在 | 英語での説明充実化 |
| `LICENSE` | ✅ 存在 (MIT) | - |

#### 2. GitHub Actionsワークフロー

`.github/workflows/release.yml`を追加し、タグプッシュ時に自動リリースを作成:
- main.js, manifest.json, styles.cssをリリースアセットとして添付
- ドラフトリリースとして作成

#### 3. 公開申請プロセス

1. GitHubリポジトリを公開（public）にする
2. タグを作成してGitHubリリースを作成
3. `obsidianmd/obsidian-releases`リポジトリをフォーク
4. `community-plugins.json`にエントリを追加
5. PRを作成（タイトル: "Add plugin: LLM Session Launcher"）
6. ボット検証→チームレビューを待つ

### Obsidianプラグインガイドライン準拠確認

| 項目 | 状態 | 対応 |
|------|------|------|
| プラグイン名に"Obsidian"を含まない | ✅ | - |
| 説明文250文字以内 | ✅ | 現在91文字 |
| サンプルコードの削除 | ✅ | 不要なコードなし |
| ネットワークアクセスなし | ✅ | ローカルのみ |
| Vault外へのアクセス | ⚠️ | 外部ターミナル起動（要開示） |

## Impact

- `.github/workflows/release.yml` - 新規作成
- `manifest.json` - authorUrl追加
- `README.md` - 英語説明の充実化
- 外部リポジトリ: `obsidianmd/obsidian-releases`へのPR

## Success Criteria

- GitHub Actionsでリリースが自動作成される
- obsidian-releasesリポジトリへのPRが作成される
- ボット検証（Validation）をパスする
