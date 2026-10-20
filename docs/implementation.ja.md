# UUID v4/v7 初版の実装記録

- 対応Issue: https://github.com/kubohiroya/turbowarp-extension-template/issues/35
- 作業ブランチ: `feat/uuid/v4-v7`
- 依存: extension-template commit `033ae362af3d4ae28af122f143dd9831fff65316` のビルド・検査基盤
- 2026-10-21 start: Issue作成と実装の承認を受け、Issue #35を作成して担当者を設定。
- 2026-10-21 done（ローカル）: v4/v7生成・形式判定の3ブロック、日英表示、日英README、全ブロックのHTML説明、manifestと単一JS bundleを作成。
- 2026-10-21 blocked（初期検証）: sandbox内のpnpm launcherがregistryへの接続制限で自身の署名検証を完了できなかった。固定版pnpmとプロジェクト専用の依存環境を使って再実行し解消。オフライン導入時のstore不足も専用環境への導入で解消。
- 2026-10-21 done（検証）: `pnpm run check`、`pnpm run check:dist` が成功。4ファイル・66テストが成功。型検査、lint、ビルド、README整合性、repository policy、package dry-run、生成物の再現性を確認。

検証はプロジェクト固有の依存関係をインストールした配置先で実施した。既存テンプレートの追跡済みファイルには差分なし。ブラウザGUIの手動操作は未実施。配布bundleはworker相当のVMコンテキストで登録・実行・日本語表示を検証した。

## 動作上の境界

v7の同一ミリ秒内の生成順、時計の巻き戻しに対する単調増加は保証しない。形式判定は一意性・真正性を保証しない。乱数APIがない場合、生成は明示的に失敗し、形式判定は継続する。

## 生成物のSHA-256

- `dist/turbowarp-uuid.js`: `edf5316401781a3a926f0d9241a10dd3e3c7600a1d3feed953cd08127022c0a7`
- `dist/extension-manifest.json`: `3896cea650def8104d94642ee1b26d8f5d7387ece0d5e1ba202b49275a1897a7`

## 初版ローカル実装時点の外部状態

作成したIssueの本文には、3ブロックの実装範囲、ブランチ、依存・順序、受け入れ基準、切り戻し、着手ログを公開した。Issueの追加編集・コメント・closeは行っていない。完了チェックとIssueの運用ログ更新は公開承認待ちである。

GitHub repository作成・push・PR・Pages設定/公開・npm公開は未実施。local Git remoteも未設定。ファイルはローカルの未コミット状態で保持している。docsURIは公開予定URLのため、文書ボタンはPages公開後に利用可能となる。

## ロールバック

TurboWarpで拡張の読み込みを解除する。テンプレート本体の切り戻しは不要。

## 公開への移行

2026-10-21に、`kubohiroya/turbowarp-uuid` のpublic作成、push、Pages APIによる設定と公開が追加承認されました。
初回公開では作業ブランチの内容を初期コミットとし、同じコミットをmainへpushします。PagesはそのmainコミットのCI成功を待って公開します。
現在の公開先と導入手順はREADMEとブロックガイドを参照してください。CI/deploymentのID・SHA・HTTP応答・配信ファイルhashは、ローカルGit管理領域の `publication-evidence/` に保存します。
Issueの追加編集・closeとnpm公開はこの公開作業に含めません。
