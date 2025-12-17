# Spec Delta: plugin-release

## ADDED Requirements

### Requirement: GitHub Actions workflow MUST automate release creation

The repository MUST include a GitHub Actions workflow that automatically creates a GitHub release when a version tag is pushed.

#### Scenario: タグプッシュ時の自動リリース作成
- **Given:** `.github/workflows/release.yml`が設定されている
- **When:** バージョンタグ（例: `1.0.0`）をプッシュする
- **Then:** GitHub Actionsが実行され、main.js, manifest.json, styles.cssを含むドラフトリリースが作成される

### Requirement: README MUST document plugin functionality in English

The README.md file MUST contain clear English documentation including plugin description, installation instructions, usage guide, and platform requirements.

#### Scenario: README.mdの英語ドキュメント
- **Given:** README.mdファイルが存在する
- **When:** ユーザーがGitHubリポジトリを閲覧する
- **Then:** 以下の情報が英語で記載されている：
  - プラグインの概要と目的
  - インストール方法
  - 使用方法
  - 対応プラットフォーム（macOSのみ）

### Requirement: Manifest MUST include complete author information

The manifest.json file MUST include all required fields and authorUrl for proper attribution in the Obsidian community plugin directory.

#### Scenario: manifest.jsonの完全な情報
- **Given:** manifest.jsonファイルが存在する
- **When:** Obsidianがプラグイン情報を表示する
- **Then:** 以下のフィールドが正しく設定されている：
  - id（ユニーク、"obsidian"を含まない）
  - name
  - version
  - minAppVersion
  - description（250文字以内）
  - author
  - authorUrl
  - isDesktopOnly

### Requirement: Repository MUST be publicly accessible

The GitHub repository MUST be public to allow Obsidian team to review the plugin source code and users to verify the plugin behavior.

#### Scenario: リポジトリの公開設定
- **Given:** プラグインのGitHubリポジトリが存在する
- **When:** 外部ユーザーがリポジトリURLにアクセスする
- **Then:** ソースコードとリリースが閲覧可能である
