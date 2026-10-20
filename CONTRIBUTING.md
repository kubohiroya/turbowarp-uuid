# 開発・検証ガイド

作業は [Issue #35](https://github.com/kubohiroya/turbowarp-extension-template/issues/35) に対応します。
ブランチは `feat/uuid/v4-v7` です。依存はテンプレートのTypeScript / Vite / manifest基盤です。

## 構成

- `src/uuid.ts`: UUID生成と形式判定。実行時依存ライブラリなし。
- `src/block-definitions.json`: ブロックの正本。
- `src/config.ts`: 拡張IDとmetadataの正本。
- `src/extension.ts`: TurboWarp APIへの接続。
- `dist/`: コミット対象の非minify bundleと決定的manifest。
- `docs/index.html`: 全ブロックの日本語説明と固定アンカー。

## 検証

`pnpm install --frozen-lockfile` で開発環境を用意します。変更した契約に応じて検証を限定します。
初回は `pnpm run build` を実行してから `pnpm run test` を実行します。テストはRFCのv7例、timestamp境界、version/variant、乱数不在、不正文字列、生成bundleの登録・日本語表示を確認します。
TypeScript変更はtypecheckと対象lintも実行します。ブロック変更時は `pnpm run docs` でREADMEを生成し、日本語READMEとHTML説明を更新します。
生成物の再現性は `pnpm run check:dist` で確認します。リリース時は `pnpm run check` を実行します。

コード内コメントは英語で書きます。拡張ID、opcode、引数IDを変更する場合は保存済みプロジェクトとの互換性を説明してください。

## ロールバック

この機能は拡張を読み込んだ場合だけ有効です。切り戻しは拡張の読み込み解除です。
UUIDは通常の文字列として変数等に保存されるため、既に生成した値を外部サービスから削除する手順はありません。
テンプレート本体は変更していません。

## 外部公開

新規GitHub repository、push、PR、Issue更新、Pages設定・公開、npm公開は、対象と操作についてユーザーの明示承認を得てから実行します。
初版のpublic repository作成・mainへのpush・Pages設定と公開は2026-10-21に承認されました。Issueの追加更新、PR作成、npm公開は別の明示指示に従います。
Pagesの公開前に全アンカーとリンクを検証し、Pages APIの `build_type: workflow` で設定し、公開後のHTTP応答・内容・deployment commitを確認します。

## Pages workflow

CIが成功したmainのコミットだけを公開します。Pages側は対象SHAのCI成功とmainの先端をAPIで確認してからcheckoutし、`docs/` と `dist/` を同一artifactにまとめます。
手動の再公開も同じCI確認を行います。実行中の公開は自動キャンセルしません。
公開不具合時は直前の正常コミットへ文書を戻してpushし、そのSHAでCIとPagesが成功することを確認します。初回公開には直前の公開がないため、必要ならPages workflowの停止・サイト削除について承認を得ます。
