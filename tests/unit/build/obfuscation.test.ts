import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(__dirname, '../../../dist');

function read(file: string) {
  return fs.readFileSync(path.join(dist, file), 'utf8');
}

function isObfuscated(code: string): boolean {
  // Heuristics: look for typical obfuscator patterns
  const patterns = [
    /_0x[0-9a-f]{4,}/i,
    /while\(!!\[\]\)/,
    /\bstringArray\b/,
    /\bselfDefending\b/,
  ];
  return patterns.some((re) => re.test(code));
}

describe('build obfuscation', () => {
  it('should obfuscate main bundles', () => {
    const esm = read('index.js');
    const cjs = read('index.cjs');
    expect(isObfuscated(esm) || isObfuscated(cjs)).toBe(true);
  });

  it('should obfuscate core modules', () => {
    const sm2 = read('core/sm2.js');
    const sm3 = read('core/sm3.js');
    expect(isObfuscated(sm2) || isObfuscated(sm3)).toBe(true);
  });
});

