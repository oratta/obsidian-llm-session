# Tasks: simplify-terminal-support

## 実装タスク

### 1. 設定周りの簡素化
- [ ] `src/Settings.ts`: `TerminalApp`型を削除
- [ ] `src/Settings.ts`: `ObsidianLLMSessionSettings`インターフェースから`terminalApp`プロパティを削除
- [ ] `src/Settings.ts`: `DEFAULT_SETTINGS`から`terminalApp`を削除
- [ ] `src/Settings.ts`: 設定画面のターミナル選択ドロップダウンを削除

### 2. ターミナルランチャーの簡素化
- [ ] `src/TerminalLauncher.ts`: `launchNew`メソッドからiTerm2分岐を削除
- [ ] `src/TerminalLauncher.ts`: `focusSession`メソッドからiTerm2分岐を削除
- [ ] `src/TerminalLauncher.ts`: メソッドシグネチャから`terminalApp`パラメータを削除
- [ ] `src/TerminalLauncher.ts`: `TerminalApp`のimportを削除

### 3. 呼び出し元の更新
- [ ] `src/LaunchModal.ts`: `launchOrFocus`呼び出しから`terminalApp`引数を削除

### 4. ドキュメント更新
- [ ] `openspec/AGENTS.md`: 設定項目から`terminalApp`を削除
- [ ] `README.md`: Terminal.appのみ対応と明記（必要に応じて）

### 5. 検証
- [ ] TypeScriptビルドが通ることを確認
- [ ] Terminal.appでセッション起動が動作することを確認
- [ ] 既存セッションへのフォーカスが動作することを確認

## 依存関係

- タスク1,2は並行実施可能
- タスク3はタスク2の完了後
- タスク4,5は最後に実施

## 注意事項

- 既存ユーザーの`terminalApp`設定は無視される（マイグレーション不要、設定は単に読み込まれなくなる）
