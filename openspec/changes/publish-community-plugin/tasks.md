# Tasks: publish-community-plugin

## 実装タスク

### Phase 1: リポジトリ準備

#### 1.1 manifest.jsonの更新
- [x] `authorUrl`を追加（GitHubプロフィールURL等）
- [x] `description`が250文字以内であることを確認
- [x] `minAppVersion`が適切か確認

#### 1.2 README.mdの充実化
- [x] 英語での機能説明を充実させる
- [x] インストール方法を記載
- [x] 使用方法を記載
- [ ] スクリーンショットの追加（任意）
- [x] macOSのみ対応であることを明記

#### 1.3 GitHub Actionsワークフロー作成
- [x] `.github/workflows/release.yml`を作成
- [x] タグプッシュ時の自動リリースを設定
- [x] main.js, manifest.json, styles.cssをアセットに含める

### Phase 2: リリース作成

#### 2.1 初回リリースの準備
- [x] コードが最新であることを確認
- [x] `npm run build`でビルド成功を確認
- [x] バージョン番号を確認（0.2.0で公開）

#### 2.2 GitHubリリースの作成
- [x] リポジトリを公開（public）にする
- [x] タグを作成: `git tag -a 0.2.0 -m "0.2.0"`
- [x] タグをプッシュ: `git push origin 0.2.0`
- [x] GitHub Actionsでリリースが作成されることを確認
- [x] ドラフトリリースを公開

### Phase 3: コミュニティプラグイン申請

#### 3.1 obsidian-releasesへのPR作成
- [x] `obsidianmd/obsidian-releases`リポジトリをフォーク
- [x] `community-plugins.json`にエントリを追加:
  ```json
  {
    "id": "obsidian-llm-session",
    "name": "LLM Session Launcher",
    "author": "Oratta",
    "description": "Launch LLM sessions (Claude Code, etc.) in external terminal from Obsidian.",
    "repo": "oratta/obsidian-llm-session"
  }
  ```
- [x] PRを作成（タイトル: "Add plugin: LLM Session Launcher"）
- [x] Community Pluginテンプレートに従ってPR説明を記入

**PR**: https://github.com/obsidianmd/obsidian-releases/pull/8991

#### 3.2 レビュー対応
- [ ] ボット検証（Validation）結果を確認
- [ ] "Ready for review"ラベルが付くまで修正
- [ ] レビューコメントへの対応（必要に応じて）

## 依存関係

```
Phase 1.1 ─┐
Phase 1.2 ─┼─→ Phase 2.1 → Phase 2.2 → Phase 3.1 → Phase 3.2
Phase 1.3 ─┘
```

- Phase 1の3タスクは並行実施可能
- Phase 2はPhase 1完了後
- Phase 3はPhase 2完了後

## 注意事項

### Obsidianプラグインガイドライン

1. **プラグイン名**: "Obsidian"を含めない ✅
2. **コマンド名**: プラグインIDをプレフィックスにしない（Obsidianが自動追加）
3. **説明文**: 250文字以内、絵文字不可
4. **ネットワーク**: 使用する場合は開示必須（本プラグインは不使用）
5. **Vault外アクセス**: 外部ターミナル起動について開示が必要

### 外部ターミナル起動の開示

README.mdに以下を明記:
> This plugin launches an external terminal application (Terminal.app on macOS) to start LLM sessions. It does not access files outside the vault, but it does interact with external applications.

## 参考リンク

- [Submit your plugin - Obsidian Developer Docs](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Plugin guidelines - Obsidian Developer Docs](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases)
