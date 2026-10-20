const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const MAX_TIMESTAMP = 0xffffffffffff;

function randomBytes(): Uint8Array {
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure random generation is unavailable in this browser.');
  }
  return globalThis.crypto.getRandomValues(new Uint8Array(16));
}

function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUuidV4(): string {
  const bytes = randomBytes();
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return formatUuid(bytes);
}

export function generateUuidV7(timestamp = Date.now()): string {
  if (!Number.isInteger(timestamp) || timestamp < 0 || timestamp > MAX_TIMESTAMP) {
    throw new RangeError('UUID v7 requires an integer timestamp between 0 and 281474976710655 milliseconds.');
  }

  const bytes = randomBytes();
  // Encode all 48 timestamp bits without truncating to JavaScript's 32-bit bitwise integers.
  let remaining = timestamp;
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = remaining % 256;
    remaining = Math.floor(remaining / 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return formatUuid(bytes);
}

export function isUuid(value: string): boolean {
  if (value.length !== 36) return false;
  return UUID_PATTERN.test(value) || value === NIL_UUID || value.toLowerCase() === MAX_UUID;
}
