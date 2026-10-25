# TurboWarp-UUID

<img src="assets/block-icon.svg" alt="" width="48" height="48">

English | [日本語](README.ja.md)

Generate UUID v4/v7 and validate UUID strings in TurboWarp.

## What it does

- Generates UUID v4 using 122 random bits.
- Generates UUID v7 using the current Unix millisecond timestamp and 74 random bits.
- Checks canonical UUID strings, including uppercase input, versions 1–8 with the RFC variant, and Nil/Max UUIDs.
- Runs locally with no network requests, runtime dependencies, storage, or unsandboxed privileges.

## Requirements and safety

Use a current TurboWarp browser or desktop environment with `crypto.getRandomValues`.
Generation fails explicitly when secure randomness is unavailable; it never falls back to `Math.random`.
The validator still works when the random source is unavailable.

UUIDs are identifiers, not passwords or proof of authenticity. UUID v7 exposes its creation timestamp.
Its ordering follows the system clock; it does not guarantee generation order within one millisecond or after a clock rollback.
Collisions are very unlikely, but global uniqueness cannot be proven by a format check.

## Load the extension

1. Open TurboWarp and choose **Add Extension → Custom Extension → URL**.
2. Enter `https://kubohiroya.github.io/turbowarp-uuid/dist/turbowarp-uuid.js`. Unsandboxed mode is unnecessary.
3. Store a generated UUID in a variable before using it in multiple places. Every evaluation generates a new value.

You can also download [the extension JavaScript](https://kubohiroya.github.io/turbowarp-uuid/dist/turbowarp-uuid.js) and load it from a local file.

The extension uses English or Japanese block labels according to TurboWarp's language.
The generator reporters have monitors disabled to avoid continuous generation.

## Block reference

<!-- BEGIN GENERATED BLOCKS -->

### `generate UUID v4`

Returns a new lowercase UUID v4 using cryptographically secure random bytes. Store the result in a variable to reuse it.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `generateV4` |

### `generate UUID v7`

Returns a new lowercase UUID v7 containing the current Unix time in milliseconds and secure random bits. Ordering within a millisecond or after a clock rollback is not guaranteed.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `generateV7` |

### `[UUID] is a UUID?`

Checks a complete, hyphenated UUID string, case-insensitively. Accepts versions 1–8 with the RFC variant, plus Nil and Max UUIDs. Rejects spaces, braces, URN prefixes and missing hyphens. This checks format only, not uniqueness or authenticity.

| Property | Value |
|---|---|
| Type | Boolean |
| Opcode | `isUuid` |
| `UUID` | String, default: `017f22e2-79b0-7cc3-98c4-dc0c0c07398f` |

<!-- END GENERATED BLOCKS -->

## Development

Requires Node.js >=22.18.0 and pnpm 11.11.0.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run build
pnpm run test
pnpm run typecheck
pnpm run lint
```

`pnpm run docs` updates this block reference. `pnpm run docs:check` checks it without modifying it.
`pnpm run check:dist` rebuilds and compares the distribution files. `pnpm run check` runs the project checks.
Tests execute the generated bundle, so build before running tests from a clean checkout.

The package [`@kubohiroya/turbowarp-uuid@0.1.0`](https://www.npmjs.com/package/@kubohiroya/turbowarp-uuid/v/0.1.0) is published on npm with public access.

```bash
pnpm add --save-exact @kubohiroya/turbowarp-uuid@0.1.0
```

The build produces one self-contained `dist/turbowarp-uuid.js` and `dist/extension-manifest.json`.
The extension ID is `kubohiroyauuid`; opcodes and argument IDs are saved-project compatibility contracts.

## Documentation

Read the [published block guide](https://kubohiroya.github.io/turbowarp-uuid/) or its [local source](docs/index.html).
Its stable anchors are `#block-generateV4`, `#block-generateV7`, and `#block-isUuid`.
The extension's `docsURI` opens that guide.
GitHub Pages deploys the main commit only after its CI succeeds, and serves the documentation and the committed distribution files together.
The GitHub repository and npm package are public.

The implementation is tracked in [template issue #35](https://github.com/kubohiroya/turbowarp-extension-template/issues/35).
It derives from template commit `033ae362af3d4ae28af122f143dd9831fff65316`.
See [the contribution guide](CONTRIBUTING.md) for verification and rollback.
The layouts follow [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html).

## License

SPDX-License-Identifier: MPL-2.0. See [LICENSE](LICENSE).
