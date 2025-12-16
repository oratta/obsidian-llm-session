# Spec Delta: rule-file-management

## ADDED Requirements

### Requirement: Rule file auto-creation MUST deploy CLAUDE.md when missing

The plugin MUST automatically create a CLAUDE.md file in the target project directory when it does not exist, before launching a Claude Code session.

#### Scenario: CLAUDE.mdが存在しないディレクトリでセッション起動
- **Given:** 対象ディレクトリにCLAUDE.mdが存在しない
- **When:** セッション起動を実行する
- **Then:** CLAUDE.mdが自動生成され、その後セッションが起動される

#### Scenario: CLAUDE.mdが既に存在するディレクトリでセッション起動
- **Given:** 対象ディレクトリにCLAUDE.mdが既に存在する
- **When:** セッション起動を実行する
- **Then:** 既存のCLAUDE.mdは変更されず、セッションが起動される

### Requirement: Generated CLAUDE.md MUST include base rules and user rules

The generated CLAUDE.md file MUST contain both the built-in base rules template and the user-defined vault-wide rules.

#### Scenario: ベースルールとVault共通ルールの結合
- **Given:** Vault共通ルール（user-rules.md）にカスタムルールが記述されている
- **When:** CLAUDE.mdが自動生成される
- **Then:** 生成されたCLAUDE.mdにはベースルールとVault共通ルールの両方が含まれる

#### Scenario: Vault共通ルールが空の場合
- **Given:** Vault共通ルール（user-rules.md）が空または存在しない
- **When:** CLAUDE.mdが自動生成される
- **Then:** 生成されたCLAUDE.mdにはベースルールのみが含まれる

### Requirement: User rules file MUST be editable within Obsidian

The vault-wide user rules file MUST be stored as a markdown file within the vault, allowing users to edit it using Obsidian's editor.

#### Scenario: Vault共通ルールファイルの初期化
- **Given:** プラグインが初めて起動される
- **When:** プラグインの初期化処理が実行される
- **Then:** `.obsidian/llm-session/user-rules.md`が作成される（存在しない場合）

#### Scenario: Vault共通ルールのObsidianでの編集
- **Given:** user-rules.mdが存在する
- **When:** ユーザーがObsidianでファイルを開く
- **Then:** 通常のマークダウンファイルとして編集できる

### Requirement: Auto-creation setting MUST be configurable

The plugin MUST provide a setting to enable or disable automatic CLAUDE.md file creation.

#### Scenario: 自動作成を無効化
- **Given:** 設定で「自動作成」がオフになっている
- **When:** CLAUDE.mdが存在しないディレクトリでセッション起動
- **Then:** CLAUDE.mdは作成されず、セッションのみ起動される

#### Scenario: 自動作成のデフォルト値
- **Given:** プラグインを新規インストール
- **When:** 設定画面を開く
- **Then:** 「自動作成」はデフォルトでオンになっている
