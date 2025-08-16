import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const configPath = path.join(projectRoot, 'obfuscator.config.json');

async function readJSON(p) {
  const s = await fs.readFile(p, 'utf8');
  return JSON.parse(s);
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function shouldProcess(file) {
  if (!/\.(js|cjs)$/i.test(file)) return false;
  if (/\.d\.ts$/i.test(file)) return false;
  if (/\.map$/i.test(file)) return false;
  return true;
}

async function main() {
  const config = await readJSON(configPath).catch(() => ({}));
  let count = 0;
  for await (const file of walk(distDir)) {
    if (!shouldProcess(file)) continue;
    const code = await fs.readFile(file, 'utf8');
    // Skip if seems already obfuscated (heuristic)
    if (/(_0x[0-9a-f]{4,}|while\(!!\[\]\)|\bselfDefending\b)/i.test(code)) continue;
    const result = JavaScriptObfuscator.obfuscate(code, config);
    await fs.writeFile(file, result.getObfuscatedCode(), 'utf8');
    count++;
  }
  console.log(`[obfuscate] Processed ${count} file(s) in ${distDir}`);
}

main().catch((err) => {
  console.error('[obfuscate] Failed:', err);
  process.exitCode = 1;
});

