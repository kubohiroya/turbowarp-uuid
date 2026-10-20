import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {describe, expect, it} from 'vitest';
import definitions from '../src/block-definitions.json';
import {extensionConfig} from '../src/config.js';
import {isUuid} from '../src/uuid.js';
import type {UuidExtension} from '../src/extension.js';

const bundle = readFileSync(new URL('../dist/turbowarp-uuid.js', import.meta.url), 'utf8');

function loadBundle(locale: 'ja' | 'en', unsandboxed: boolean, crypto: unknown = webcrypto) {
  const registered: UuidExtension[] = [];
  let dictionary: Record<string, string> = {};
  const translate = Object.assign((message: string) => dictionary[`_${message}`] ?? message, {
    setup: (translations: Record<string, Record<string, string>>) => {
      dictionary = translations[locale] ?? {};
    }
  });
  const context = {
    crypto,
    Scratch: {
      extensions: {unsandboxed, register: (extension: UuidExtension) => registered.push(extension)},
      BlockType: {REPORTER: 'reporter', BOOLEAN: 'Boolean'},
      ArgumentType: {STRING: 'string'},
      Cast: {toString: (value: unknown) => String(value)},
      translate
    }
  };
  // No window, document, module loader or network APIs: exercise worker-compatible registration.
  runInNewContext(bundle, context, {timeout: 1000});
  expect(registered).toHaveLength(1);
  return registered[0]!;
}

describe('distribution bundle', () => {
  it.each([false, true])('registers and runs all three blocks (unsandboxed: %s)', (unsandboxed) => {
    const extension = loadBundle('en', unsandboxed);
    const v4 = extension.generateV4();
    const v7 = extension.generateV7();
    expect(isUuid(v4)).toBe(true);
    expect(isUuid(v7)).toBe(true);
    expect(v4[14]).toBe('4');
    expect(v7[14]).toBe('7');
    expect(extension.isUuid({UUID: v7.toUpperCase()})).toBe(true);
    expect(extension.isUuid({UUID: `${v4}\n`})).toBe(false);
  });

  it('shows Japanese block labels with the TurboWarp translation ID convention', () => {
    const info = loadBundle('ja', false).getInfo() as {blocks: Array<{text: string}>};
    expect(info.blocks.map((block) => block.text)).toEqual([
      'UUID v4を生成する', 'UUID v7を生成する', '[UUID] はUUID？'
    ]);
  });

  it('registers and validates UUIDs even without a random source', () => {
    const extension = loadBundle('en', false, null);
    expect(extension.isUuid({UUID: '00000000-0000-0000-0000-000000000000'})).toBe(true);
    expect(() => extension.generateV4()).toThrow('Secure random generation');
    expect(() => extension.generateV7()).toThrow('Secure random generation');
  });

  it('ships matching API metadata and documentation anchors for every block', () => {
    const manifest = JSON.parse(readFileSync(new URL('../dist/extension-manifest.json', import.meta.url), 'utf8'));
    const html = readFileSync(new URL('../docs/index.html', import.meta.url), 'utf8');
    expect(manifest.id).toBe(extensionConfig.id);
    expect(manifest.blocks.map((block: {opcode: string}) => block.opcode)).toEqual(
      definitions.blocks.map((block) => block.opcode).sort()
    );
    for (const block of definitions.blocks) {
      expect(html).toContain(`id="block-${block.opcode}"`);
      expect(html).toContain(`href="#block-${block.opcode}"`);
    }
    const ids = new Set(Array.from(html.matchAll(/id="([^"]+)"/g), (match) => match[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) expect(ids.has(match[1])).toBe(true);
  });
});
