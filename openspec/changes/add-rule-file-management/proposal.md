# Proposal: add-rule-file-management

## Summary

Claude Codeセッション起動時に、ルールファイル（CLAUDE.md）を自動配置する機能を追加する。3層構造のルール管理により、Vault共通ルール・プロジェクト固有ルールを柔軟に管理できるようにする。

## Why

- Claude Codeは`CLAUDE.md`ファイルでプロジェクト固有の指示を読み込む
- 各ディレクトリで別のClaude Codeセッションを開くため、ディレクトリごとに設定が必要
- 毎回手動でルールファイルを作成するのは手間
- Vault全体で共通するルールを一元管理したい
- Obsidianの特性（MDファイル編集）を活かしたルール管理が望ましい

## What Changes

### 3層ルール構造

| 層 | 場所 | 説明 | 編集方法 |
|---|---|---|---|
| **ベースルール** | プラグイン内蔵 | Claude Code + Obsidian最適化済みテンプレート | プラグイン更新 |
| **Vault共通ルール** | `{vault}/.obsidian/llm-session/user-rules.md` | Vault内の全プロジェクトに適用 | Obsidianで編集 |
| **プロジェクトルール** | `{project}/CLAUDE.md` | ディレクトリ固有の指示 | 自動生成 or 手動編集 |

### 自動配置の動作

1. セッション起動時に対象ディレクトリの`CLAUDE.md`をチェック
2. 存在しない場合:
   - ベースルール + Vault共通ルールを結合
   - `CLAUDE.md`として自動生成・配置
3. 存在する場合:
   - 何もしない（既存ファイルを尊重）

### ベースルールの内容（案）

```markdown
# Project Rules

## Claude Code Settings
- 日本語で応答
- コード変更前に確認を求める
- テスト実行後に結果を報告

## Obsidian Context
- このプロジェクトはObsidianから起動されています
- Vault共通ルールが適用されています

## Custom Rules
<!-- Vault共通ルールがここに挿入される -->
```

### 設定項目の追加

| 設定 | 型 | デフォルト | 説明 |
|---|---|---|---|
| autoCreateRuleFile | boolean | `true` | CLAUDE.mdを自動作成するか |
| baseRuleTemplate | string | (内蔵) | ベースルールのテンプレート |

## Impact

- `src/Settings.ts` - 新しい設定項目を追加
- `src/TerminalLauncher.ts` - セッション起動前にルールファイルをチェック・作成
- `src/RuleFileManager.ts` - 新規: ルールファイル管理クラス
- `.obsidian/llm-session/` - Vault共通ルール保存先

## Success Criteria

- CLAUDE.mdが存在しないディレクトリでセッション起動時、自動でファイルが作成される
- Vault共通ルール（user-rules.md）をObsidianで編集できる
- 既存のCLAUDE.mdがある場合は上書きしない
- 設定で自動作成をオフにできる
