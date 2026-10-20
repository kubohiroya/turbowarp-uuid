import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {UuidExtension} from '../src/extension.js';
import definitions from '../src/block-definitions.json';

beforeEach(() => {
  vi.stubGlobal('Scratch', {
    BlockType: {REPORTER: 'reporter', BOOLEAN: 'Boolean'},
    ArgumentType: {STRING: 'string'},
    Cast: {toString: (value: unknown) => value === null || value === undefined ? '' : String(value)},
    translate: vi.fn((message: string) => message)
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('UuidExtension', () => {
  it('registers the canonical three blocks and suppresses generator monitors', () => {
    const info = new UuidExtension().getInfo() as {
      id: string; docsURI: string;
      blocks: Array<{opcode: string; text: string; blockType: string; disableMonitor?: boolean}>;
    };
    expect(info.id).toBe('kubohiroyauuid');
    expect(info.docsURI).toBe('https://kubohiroya.github.io/turbowarp-uuid/');
    expect(info.blocks.map((block) => block.opcode)).toEqual(definitions.blocks.map((block) => block.opcode));
    expect(info.blocks.map((block) => block.blockType)).toEqual(['reporter', 'reporter', 'Boolean']);
    expect(info.blocks.slice(0, 2).every((block) => block.disableMonitor)).toBe(true);
    for (const block of definitions.blocks) expect(Scratch.translate).toHaveBeenCalledWith(block.text);
  });

  it('generates both versions and passes generated values through validation', () => {
    const extension = new UuidExtension();
    const v4 = extension.generateV4();
    const v7 = extension.generateV7();
    expect(v4[14]).toBe('4');
    expect(v7[14]).toBe('7');
    expect(extension.isUuid({UUID: v4})).toBe(true);
    expect(extension.isUuid({UUID: v7})).toBe(true);
  });

  it.each([null, undefined, 123, true, {}, 'invalid'])('casts block input %s without throwing', (value) => {
    expect(new UuidExtension().isUuid({UUID: value})).toBe(false);
  });
});
