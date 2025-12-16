# Tasks: add-rule-file-management

## 実装タスク

### 1. ベースルールテンプレートの作成
- [ ] `src/templates/base-rules.ts`: ベースルールテンプレートを定数として定義
- [ ] Claude Code + Obsidian最適化済みのルール内容を作成

### 2. RuleFileManagerクラスの実装
- [ ] `src/RuleFileManager.ts`: 新規ファイル作成
- [ ] `getUserRulesPath()`: Vault共通ルールのパス取得
- [ ] `getBaseRules()`: ベースルール取得
- [ ] `getUserRules()`: Vault共通ルール読み込み
- [ ] `generateClaudeFile()`: CLAUDE.md内容生成
- [ ] `hasClaudeFile()`: CLAUDE.md存在チェック
- [ ] `ensureClaudeFile()`: CLAUDE.md配置（存在しない場合のみ）
- [ ] `initUserRulesFile()`: Vault共通ルールファイル初期化

### 3. 設定項目の追加
- [ ] `src/Settings.ts`: `autoCreateRuleFile`設定を追加
- [ ] 設定画面にトグルを追加

### 4. LaunchModalとの統合
- [ ] `src/LaunchModal.ts`: セッション起動前に`ensureClaudeFile()`を呼び出し

### 5. プラグイン初期化処理
- [ ] `main.ts`: `onload()`で`initUserRulesFile()`を呼び出し

### 6. 検証
- [ ] TypeScriptビルドが通ることを確認
- [ ] CLAUDE.mdが存在しないディレクトリで自動作成されることを確認
- [ ] 既存CLAUDE.mdが上書きされないことを確認
- [ ] Vault共通ルール（user-rules.md）がCLAUDE.mdに反映されることを確認
- [ ] 設定でautoCreateRuleFile=falseの場合、自動作成されないことを確認

## 依存関係

- タスク1,2は並行実施可能
- タスク3はタスク2の後
- タスク4,5はタスク2,3の後
- タスク6は最後

## ファイル作成/変更一覧

| ファイル | 種別 | 内容 |
|----------|------|------|
| `src/templates/base-rules.ts` | 新規 | ベースルールテンプレート |
| `src/RuleFileManager.ts` | 新規 | ルールファイル管理 |
| `src/Settings.ts` | 変更 | autoCreateRuleFile設定追加 |
| `src/LaunchModal.ts` | 変更 | ensureClaudeFile()呼び出し追加 |
| `main.ts` | 変更 | initUserRulesFile()呼び出し追加 |
