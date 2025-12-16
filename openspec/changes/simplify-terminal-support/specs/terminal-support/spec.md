# Spec Delta: terminal-support

## REMOVED Requirements

### Requirement: iTerm2 session launch support
削除理由: プラグイン公開に向けて動作保証範囲を縮小し、macOS標準のTerminal.appのみをサポートする。

#### Scenario: iTerm2でのセッション起動
- **Given:** ユーザーがiTerm2をターミナルアプリとして設定している
- **When:** セッション起動を実行する
- **Then:** iTerm2で新規ウィンドウが開き、指定コマンドが実行される

### Requirement: iTerm2 session focus support
削除理由: iTerm2サポート削除に伴い不要。

#### Scenario: iTerm2セッションへのフォーカス
- **Given:** iTerm2で起動したセッションが存在する
- **When:** 同じディレクトリでセッション起動を実行する
- **Then:** 既存のiTerm2ウィンドウにフォーカスが移る

### Requirement: Terminal app selection setting
削除理由: iTerm2サポート削除に伴い、選択肢が不要になる。

#### Scenario: ターミナルアプリの選択UI
- **Given:** ユーザーが設定画面を開いている
- **When:** 設定を確認する
- **Then:** ターミナルアプリ選択ドロップダウンが存在し、iTermまたはterminalを選択できる

## MODIFIED Requirements

### Requirement: Settings UI MUST display only essential options

The settings UI MUST display only Launch Command and Default Directory settings. Terminal Application setting MUST NOT be displayed.

#### Scenario: 設定画面の表示項目
- **Given:** ユーザーがプラグイン設定画面を開く
- **When:** LLM Session Launcher設定を表示する
- **Then:** 以下の設定項目のみが表示される：
  - Launch Command（起動コマンド）
  - Default Directory（デフォルトディレクトリ）
- **Note:** Terminal Application設定は表示されない（削除済み）
