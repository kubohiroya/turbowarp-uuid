# TurboWarp-UUID

<img src="assets/block-icon.svg" alt="" width="48" height="48">

[English](README.md) | 日本語

TurboWarpでUUID v4/v7を生成し、文字列がUUID形式か判定する拡張機能です。

## 実行できるサンプル

[**TurboWarp Editorでデモを開く**](https://turbowarp.org/editor?project_url=https%3A%2F%2Fkubohiroya.github.io%2Fturbowarp-uuid%2Fsamples%2Fgenerate-and-check-uuid.sb3) · [SB3をダウンロード](https://kubohiroya.github.io/turbowarp-uuid/samples/generate-and-check-uuid.sb3)

**Allow**で読み込みを許可し、緑の旗を押します。
`generateV4`・`generateV7`を変数に保存し、`isUuid`が両方trueになることを表示。サンプルの元データと期待結果は[`samples/README.md`](samples/README.md)に記載しています。

`pnpm run samples:build`でSB3を再生成し、`pnpm run samples:check`で更新漏れと生成処理を確認します。

## できること

- 暗号学的乱数を使ったUUID v4の生成
- 現在のUnix時刻（ミリ秒）と暗号学的乱数を使ったUUID v7の生成
- UUID形式の判定（大文字・小文字、RFC variantのv1〜v8、Nil/Maxに対応）
- 外部通信、実行時依存ライブラリ、永続化なし。unsandboxed指定不要

## 読み込み方

1. TurboWarpの「拡張機能を追加」から「カスタム拡張機能」を開きます。
2. URL欄に `https://kubohiroya.github.io/turbowarp-uuid/dist/turbowarp-uuid.js` を指定します。unsandboxed指定は不要です。
3. 生成したUUIDを変数に保存して使います。同じUUIDを使い回す場合は、生成ブロックを繰り返し実行しないでください。

[拡張JSをダウンロード](https://kubohiroya.github.io/turbowarp-uuid/dist/turbowarp-uuid.js) してファイルから読み込む方法も使えます。

ブラウザの `crypto.getRandomValues` が必要です。利用できない環境では生成時にエラーとなり、弱い乱数へ切り替えません。形式判定は乱数APIがなくても動作します。
TurboWarpの言語設定に合わせて日本語・英語でブロックを表示します。生成ブロックのモニター表示は無効です。

## ブロック

| 表示 | 種類 / opcode | 動作 |
|---|---|---|
| UUID v4を生成する | 値 / `generateV4` | 122ビットの乱数を使い、小文字・ハイフン付きの新しいUUIDを返します。引数はありません。 |
| UUID v7を生成する | 値 / `generateV7` | 48ビットの現在時刻と74ビットの乱数を使い、小文字・ハイフン付きの新しいUUIDを返します。引数はありません。 |
| [UUID] はUUID？ | 真偽 / `isUuid` | 文字列引数 `UUID` の形式を判定します。既定値は `017f22e2-79b0-7cc3-98c4-dc0c0c07398f` です。 |

形式判定は、36文字の `8-4-4-4-12` 形式、version、variantを確認します。大文字も受け付けます。前後の空白や改行、波括弧、`urn:uuid:` 接頭辞、ハイフン省略は拒否します。
UUIDの一意性や真正性を証明するものではありません。

v7には生成時刻が含まれます。同一ミリ秒内の生成順や、時計が巻き戻った場合の単調増加は保証しません。認証用の秘密値として使わないでください。

全ブロックの説明と使用例は [公開ブロックガイド](https://kubohiroya.github.io/turbowarp-uuid/) にあります。[ローカルHTML](docs/index.html) も参照できます。

## 開発

Node.js >=24、pnpm 11.28.8を使用します。

```bash
npm install --global corepack@latest
corepack enable
pnpm install --frozen-lockfile
pnpm run build
pnpm run test
pnpm run typecheck
pnpm run lint
```

`pnpm run docs` は英語READMEのブロック参照を更新します。`pnpm run docs:check` は変更せずに整合性を検査します。
`pnpm run check:dist` は配布ファイルを再ビルドして比較します。`pnpm run check` はプロジェクトの検査を実行します。
テストは生成済みbundleも実行するため、初回はbuildを先に実行してください。

[`@kubohiroya/turbowarp-uuid@0.3.0`](https://www.npmjs.com/package/@kubohiroya/turbowarp-uuid/v/0.2.0) はnpmにpublicで公開済みです。

```bash
pnpm add --save-exact @kubohiroya/turbowarp-uuid@0.3.0
```

生成物は単一JavaScriptの `dist/turbowarp-uuid.js` と `dist/extension-manifest.json` です。
拡張ID `kubohiroyauuid`、opcode、引数IDは保存済みプロジェクトの互換性契約として扱います。

## 公開と文書

GitHub repositoryはpublicで、GitHub Pagesのブロックガイドは `https://kubohiroya.github.io/turbowarp-uuid/` です。
拡張の文書ボタンは、このブロックガイドを開きます。全ブロックの固定アンカーを用意しています。
mainの同じコミットでCIが成功した後に、説明HTMLと配布用JS・manifestをまとめて公開します。
PR作成は行っていません。

作業の正本は [テンプレートのIssue #35](https://github.com/kubohiroya/turbowarp-extension-template/issues/35) です。
テンプレートのcommit `033ae362af3d4ae28af122f143dd9831fff65316` を基に独立プロジェクトを作成しました。
検証・切り戻しは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
UUIDの形式は [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html) に基づきます。

## ライセンス

SPDX-License-Identifier: MPL-2.0。[LICENSE](LICENSE) を参照してください。
