# Design: add-rule-file-management

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                    Obsidian Vault                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  .obsidian/llm-session/                               │  │
│  │  ├── user-rules.md      ← Vault共通ルール（編集可能）    │  │
│  │  └── base-rules.md      ← ベースルール（参照用コピー）    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────┐  ┌───────────────────┐              │
│  │  ProjectA/        │  │  ProjectB/        │              │
│  │  └── CLAUDE.md ←──┼──┼── 自動生成        │              │
│  └───────────────────┘  └───────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## ファイル構成

### 1. ベースルール（プラグイン内蔵）

`src/templates/base-rules.md` として内蔵:

```markdown
# Claude Code Rules

## 基本設定
- 日本語で応答してください
- コードを変更する前に、変更内容を説明してください
- エラーが発生した場合は、原因と解決策を提示してください

## Obsidian連携
- このセッションはObsidian LLM Session Launcherから起動されています
- プロジェクトのコンテキストを維持してください

---
<!-- USER_RULES_PLACEHOLDER -->
---

## プロジェクト固有のルール
<!-- このセクションを編集してプロジェクト固有のルールを追加してください -->
```

### 2. Vault共通ルール

場所: `{vault}/.obsidian/llm-session/user-rules.md`

- Obsidianで直接編集可能
- 初回起動時に空のテンプレートを作成
- すべてのプロジェクトのCLAUDE.md生成時に挿入される

### 3. 生成されるCLAUDE.md

```markdown
# Claude Code Rules

## 基本設定
- 日本語で応答してください
...（ベースルール）

---
## Vault共通ルール
...（user-rules.mdの内容）
---

## プロジェクト固有のルール
<!-- このセクションを編集してプロジェクト固有のルールを追加してください -->
```

## クラス設計

### RuleFileManager

```typescript
class RuleFileManager {
  private vault: Vault;
  private settings: ObsidianLLMSessionSettings;

  // Vault共通ルールのパス
  getUserRulesPath(): string;

  // ベースルールを取得（内蔵テンプレート）
  getBaseRules(): string;

  // Vault共通ルールを読み込み
  async getUserRules(): Promise<string>;

  // CLAUDE.mdを生成
  async generateClaudeFile(projectDir: string): Promise<string>;

  // 対象ディレクトリにCLAUDE.mdが存在するかチェック
  async hasClaudeFile(projectDir: string): Promise<boolean>;

  // CLAUDE.mdを配置（存在しない場合のみ）
  async ensureClaudeFile(projectDir: string): Promise<void>;

  // Vault共通ルールファイルを初期化
  async initUserRulesFile(): Promise<void>;
}
```

## 処理フロー

### セッション起動時

```
1. LaunchModal.launch() 呼び出し
   │
2. RuleFileManager.ensureClaudeFile(projectDir)
   │
   ├─ CLAUDE.md存在する → 何もしない
   │
   └─ CLAUDE.md存在しない
      │
      ├─ ベースルール取得
      ├─ Vault共通ルール取得
      ├─ 結合してCLAUDE.md生成
      └─ ファイル書き込み
   │
3. TerminalLauncher.launchOrFocus() 実行
```

### 初回プラグイン起動時

```
1. onload()
   │
2. RuleFileManager.initUserRulesFile()
   │
   └─ .obsidian/llm-session/ 作成
   └─ user-rules.md が存在しない場合、テンプレート作成
```

## 設定項目

```typescript
interface ObsidianLLMSessionSettings {
  launchCommand: string;
  defaultDirectory: string;
  // 新規追加
  autoCreateRuleFile: boolean;  // デフォルト: true
}
```

## ファイルパス

| 項目 | パス |
|------|------|
| Vault共通ルール | `{vault}/.obsidian/llm-session/user-rules.md` |
| プロジェクトルール | `{projectDir}/CLAUDE.md` |

## 考慮事項

### なぜ`.obsidian/llm-session/`に配置するか

1. Obsidianのプラグイン設定は`.obsidian/`以下が慣例
2. Vault同期時に含まれる（iCloud, Dropbox等）
3. Vault内の通常ノートと分離できる

### 既存CLAUDE.mdの尊重

- ユーザーが手動で作成・編集したCLAUDE.mdは上書きしない
- 再生成したい場合は手動で削除してもらう

### エラーハンドリング

- ファイル書き込み失敗時はコンソールログのみ（セッション起動は続行）
- Vault共通ルールが存在しない場合は空文字として扱う
