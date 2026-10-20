import {afterEach, describe, expect, it, vi} from 'vitest';
import {generateUuidV4, generateUuidV7, isUuid} from '../src/uuid.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function mockRandom(hex: string) {
  const source = Uint8Array.from(hex.match(/../g)!, (pair) => Number.parseInt(pair, 16));
  const getRandomValues = vi.fn((target: Uint8Array) => {
    target.set(source);
    return target;
  });
  vi.stubGlobal('crypto', {getRandomValues});
  return getRandomValues;
}

describe('UUID generation', () => {
  it('applies the v4 version and RFC variant without losing other random bits', () => {
    const random = mockRandom('919108f752d132205bacf847db4148a8');
    expect(generateUuidV4()).toBe('919108f7-52d1-4220-9bac-f847db4148a8');
    expect(random).toHaveBeenCalledOnce();
    expect(random.mock.calls[0]![0]).toHaveLength(16);
  });

  it('matches the RFC 9562 Appendix A.6 v7 test vector', () => {
    mockRandom('0000000000000cc358c4dc0c0c07398f');
    expect(generateUuidV7(1645557742000)).toBe('017f22e2-79b0-7cc3-98c4-dc0c0c07398f');
  });

  it.each([0, 1, 0xffffffff, 0x100000000, 0xffffffffffff])('preserves the full v7 timestamp %s', (timestamp) => {
    mockRandom('ffffffffffffffffffffffffffffffff');
    const uuid = generateUuidV7(timestamp);
    expect(Number.parseInt(uuid.replaceAll('-', '').slice(0, 12), 16)).toBe(timestamp);
    expect(uuid.slice(14, 18)).toBe('7fff');
    expect(uuid[19]).toBe('b');
    expect(isUuid(uuid)).toBe(true);
  });

  it.each([-1, 0x1000000000000, 1.5, NaN, Infinity])('rejects invalid v7 timestamps %s', (timestamp) => {
    expect(() => generateUuidV7(timestamp)).toThrow(RangeError);
  });

  it('uses the current millisecond time by default', () => {
    mockRandom('00000000000000000000000000000000');
    vi.spyOn(Date, 'now').mockReturnValue(1645557742000);
    expect(generateUuidV7()).toBe('017f22e2-79b0-7000-8000-000000000000');
  });

  it('sorts v7 UUIDs by distinct increasing timestamps regardless of random bytes', () => {
    mockRandom('ffffffffffffffffffffffffffffffff');
    const first = generateUuidV7(1645557742000);
    mockRandom('00000000000000000000000000000000');
    expect(first < generateUuidV7(1645557742001)).toBe(true);
  });

  it.each([undefined, {}])('fails without secure randomness (%s)', (crypto) => {
    vi.stubGlobal('crypto', crypto);
    expect(() => generateUuidV4()).toThrow('Secure random generation');
    expect(() => generateUuidV7()).toThrow('Secure random generation');
  });

  it('propagates random source failure instead of returning a weak identifier', () => {
    vi.stubGlobal('crypto', {getRandomValues: () => {throw new Error('random source failed');}});
    expect(() => generateUuidV4()).toThrow('random source failed');
    expect(() => generateUuidV7()).toThrow('random source failed');
  });

  it.each([4, 7])('produces fresh, lowercase v%s UUIDs with the real random source', (version) => {
    const create = version === 4 ? generateUuidV4 : () => generateUuidV7(1645557742000);
    const results = Array.from({length: 256}, () => create());
    expect(new Set(results).size).toBe(results.length);
    for (const uuid of results) {
      expect(isUuid(uuid)).toBe(true);
      expect(uuid).toBe(uuid.toLowerCase());
      expect(uuid[14]).toBe(String(version));
    }
  });
});

describe('UUID format validation', () => {
  it.each([
    '919108f7-52d1-4220-9bac-f847db4148a8',
    '017F22E2-79B0-7CC3-98C4-DC0C0C07398F',
    '00000000-0000-0000-0000-000000000000',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
    ...Array.from({length: 8}, (_, index) => `12345678-1234-${index + 1}234-8234-123456789abc`),
    ...['8', '9', 'a', 'b'].map((variant) => `12345678-1234-4234-${variant}234-123456789abc`)
  ])('accepts %s', (uuid) => {
    expect(isUuid(uuid)).toBe(true);
  });

  it.each([
    '', 'not a UUID', '017f22e279b07cc398c4dc0c0c07398f',
    ' 017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    '017f22e2-79b0-7cc3-98c4-dc0c0c07398f ',
    '017f22e2-79b0-7cc3-98c4-dc0c0c07398f\n',
    '{017f22e2-79b0-7cc3-98c4-dc0c0c07398f}',
    'urn:uuid:017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    'g17f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    '017f22e2-79b0-0cc3-98c4-dc0c0c07398f',
    '017f22e2-79b0-9cc3-98c4-dc0c0c07398f',
    ...['0', '7', 'c', 'f'].map((variant) => `12345678-1234-4234-${variant}234-123456789abc`)
  ])('rejects %j', (uuid) => {
    expect(isUuid(uuid)).toBe(false);
  });
});
