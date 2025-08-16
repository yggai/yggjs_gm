/**
 * SM3 摘要算法（简洁实现）
 */

function rotl(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function P0(x: number): number {
  return (x ^ rotl(x, 9) ^ rotl(x, 17)) >>> 0;
}
function P1(x: number): number {
  return (x ^ rotl(x, 15) ^ rotl(x, 23)) >>> 0;
}

const IV = new Uint32Array([
  0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e,
]);

function T(j: number): number {
  return j <= 15 ? 0x79cc4519 : 0x7a879d8a;
}

function FF(x: number, y: number, z: number, j: number): number {
  return (j <= 15 ? x ^ y ^ z : (x & y) | (x & z) | (y & z)) >>> 0;
}

function GG(x: number, y: number, z: number, j: number): number {
  return (j <= 15 ? x ^ y ^ z : (x & y) | (~x & z)) >>> 0;
}

function toUint32ArrayBE(bytes: Uint8Array): Uint32Array {
  const len = Math.ceil(bytes.length / 4);
  const out = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    out[i] =
      ((bytes[i * 4] ?? 0) << 24) |
      ((bytes[i * 4 + 1] ?? 0) << 16) |
      ((bytes[i * 4 + 2] ?? 0) << 8) |
      ((bytes[i * 4 + 3] ?? 0) << 0);
  }
  return out;
}

function fromUint32ArrayBE(words: ArrayLike<number>): Uint8Array {
  const out = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    const w = words[i] ?? 0;
    out[i * 4] = (w >>> 24) & 0xff;
    out[i * 4 + 1] = (w >>> 16) & 0xff;
    out[i * 4 + 2] = (w >>> 8) & 0xff;
    out[i * 4 + 3] = w & 0xff;
  }
  return out;
}

function sm3Compress(v: Uint32Array, block: Uint8Array): Uint32Array {
  const w = new Uint32Array(68);
  const wp = new Uint32Array(64);
  const b = toUint32ArrayBE(block);
  for (let i = 0; i < 16; i++) w[i] = (b[i] ?? 0) >>> 0;
  for (let i = 16; i < 68; i++) {
    const tmp = ((w[i - 16] ?? 0) ^ (w[i - 9] ?? 0) ^ rotl(w[i - 3] ?? 0, 15)) >>> 0;
    w[i] = (P1(tmp) ^ rotl(w[i - 13] ?? 0, 7) ^ (w[i - 6] ?? 0)) >>> 0;
  }
  for (let i = 0; i < 64; i++) wp[i] = ((w[i] ?? 0) ^ (w[i + 4] ?? 0)) >>> 0;

  let a = v[0]!,
    b1 = v[1]!,
    c = v[2]!,
    d = v[3]!,
    e = v[4]!,
    f = v[5]!,
    g = v[6]!,
    h = v[7]!;
  for (let j = 0; j < 64; j++) {
    const ss1 = rotl(((rotl(a, 12) + e + rotl(T(j), j)) >>> 0) >>> 0, 7);
    const ss2 = (ss1 ^ rotl(a, 12)) >>> 0;
    const tt1 = (FF(a, b1, c, j) + d + ss2 + (wp[j] ?? 0)) >>> 0;
    const tt2 = (GG(e, f, g, j) + h + ss1 + (w[j] ?? 0)) >>> 0;
    d = c;
    c = rotl(b1, 9);
    b1 = a;
    a = tt1 >>> 0;
    h = g;
    g = rotl(f, 19);
    f = e;
    e = P0(tt2);
  }
  return new Uint32Array([
    ((v[0]! ^ a) >>> 0) >>> 0,
    ((v[1]! ^ b1) >>> 0) >>> 0,
    ((v[2]! ^ c) >>> 0) >>> 0,
    ((v[3]! ^ d) >>> 0) >>> 0,
    ((v[4]! ^ e) >>> 0) >>> 0,
    ((v[5]! ^ f) >>> 0) >>> 0,
    ((v[6]! ^ g) >>> 0) >>> 0,
    ((v[7]! ^ h) >>> 0) >>> 0,
  ]);
}

function sm3Pad(msg: Uint8Array): Uint8Array {
  const bitLen = BigInt(msg.length) * 8n;
  const kPad = (448 - ((msg.length * 8 + 1) % 512) + 512) % 512; // 使得总长≡448 mod 512
  const padLen = 1 + Math.ceil(kPad / 8) + 8; // 0x80 + k 个 0 + 64bit 长度
  const out = new Uint8Array(msg.length + padLen);
  out.set(msg, 0);
  out[msg.length] = 0x80;
  // 末尾写入 64-bit 大端长度
  const lenOffset = out.length - 8;
  let tmp = bitLen;
  for (let i = 7; i >= 0; i--) {
    out[lenOffset + i] = Number(tmp & 0xffn);
    tmp >>= 8n;
  }
  return out;
}

export function digest(data: Uint8Array): Uint8Array {
  let v: Uint32Array = new Uint32Array(IV);
  const m = sm3Pad(data);
  for (let i = 0; i < m.length; i += 64) {
    v = sm3Compress(v, m.subarray(i, i + 64));
  }
  return fromUint32ArrayBE(v);
}

export function digestMultiple(dataBlocks: Uint8Array[]): Uint8Array {
  // 简单拼接后计算（满足当前需求）
  const total = new Uint8Array(dataBlocks.reduce((s, b) => s + b.length, 0));
  let off = 0;
  for (const b of dataBlocks) {
    total.set(b, off);
    off += b.length;
  }
  return digest(total);
}
