# Product Requirements Document (PRD): Obsidian LLM Session Launcher

## 1. 製品概要

ObsidianからClaude CodeなどのLLMセッションを素早く起動するランチャープラグイン。
ファイル編集中のコンテキスト（ディレクトリ）を保持したまま、外部ターミナルでLLMセッションを開始できる。

## 2. 目的・解決する課題

- **課題**: LLMセッション（Claude Code等）を起動する際、毎回ターミナルを開いて目的のディレクトリに移動するのが手間。
- **目的**: Obsidianで作業中のファイルのディレクトリを自動認識し、ワンクリックでLLMセッションを起動できるようにする。

## 3. ターゲットユーザー

- Obsidianを用いて複数のプロジェクト（開発、執筆、研究など）を管理しているユーザー
- Claude Code、Aider、CodexなどのターミナルベースLLMツールを使用するエンジニア

## 4. 機能要件

### 4.1. コア機能

- **ランチャーモーダル**:
    - リボンアイコンまたはコマンドパレットから起動
    - 現在編集中のファイルのディレクトリを自動検出
    - ディレクトリは編集可能（別のディレクトリを指定可能）
    - 「Launch Session」ボタンで外部ターミナルを起動

- **外部ターミナル連携**:
    - macOS: iTerm2 / Terminal.app をサポート
    - 指定したディレクトリで指定したコマンドを実行
    - AppleScriptを使用してターミナルを制御

- **セッション管理**:
    - 起動済みセッションを追跡
    - 同じディレクトリで再度起動すると、既存ターミナルにフォーカス

### 4.2. 設定

- **Launch Command**: 起動するコマンド（デフォルト: `claude`）
- **Terminal Application**: 使用するターミナルアプリ（iTerm2 / Terminal.app）
- **Default Directory**: デフォルトのディレクトリ（空欄で現在のファイルのディレクトリを使用）

## 5. 技術仕様

### 5.1. アーキテクチャ

```
main.ts                 # プラグインエントリポイント
src/
  Settings.ts           # 設定管理
  LaunchModal.ts        # ランチャーモーダルUI
  TerminalLauncher.ts   # 外部ターミナル起動ロジック
```

### 5.2. 外部ターミナル起動（macOS）

- **iTerm2**: AppleScript経由で新規ウィンドウを作成し、コマンドを実行
- **Terminal.app**: AppleScript経由で`do script`を実行

### 5.3. 制約

- 現在macOSのみ対応（Linux/Windowsは今後対応予定）
- セッション追跡はメモリ内のみ（Obsidian再起動でリセット）

## 6. 設計変更履歴

### v0.1.0 → v0.2.0

**変更理由**:
- ターミナルエミュレーション（xterm.js + child_process）ではPTYなしでClaude Codeのようなインタラクティブツールが正常動作しない
- node-ptyはObsidianプラグインでの使用に技術的制約がある

**変更内容**:
- ターミナルエミュレーション方式から「ランチャー方式」に変更
- Obsidian内でのターミナル表示を廃止
- 外部ターミナル（iTerm2/Terminal.app）でセッションを起動する方式に変更
- コードベースを大幅に軽量化（290KB → 5KB）

## 7. 今後の拡張案

- Linux/Windows対応（gnome-terminal, Windows Terminal等）
- セッション履歴の永続化
- ノート/選択範囲からの右クリック起動
- カスタムコマンドテンプレート（プロジェクトごとに異なるコマンド）
