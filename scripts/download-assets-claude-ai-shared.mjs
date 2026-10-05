// Download shared Claude.ai assets (fonts, favicons) into the site namespace.
// Usage: node scripts/download-assets-claude-ai-shared.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'public/sites/claude-ai-5502a6be/shared');

const ASSETS = [
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/cc27851ad-DDVos-BJ.woff2', file: 'fonts/anthropic-sans-variable.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c9d3a3a49-CJtkx3-S.woff2', file: 'fonts/anthropic-sans-variable-italic.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c66fc489e-2VcCjn5t.woff2', file: 'fonts/anthropic-serif-variable.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/cc410af59-Dcb-9NUS.woff2', file: 'fonts/anthropic-serif-variable-italic.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c5dbe0935-CQcSkHaI.woff2', file: 'fonts/anthropic-mono-variable.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c2f08283e-CZqJpOsc.woff2', file: 'fonts/anthropic-mono-variable-italic.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c0f671921-CGC1mOMa.woff2', file: 'fonts/anthropicons-variable.woff2' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/cd02a42d9-Vq_H3mgS.svg', file: 'seo/favicon.svg' },
  { url: 'https://assets-proxy.anthropic.com/claude-ai/v2/assets/v1/c129d018a-0ZbJsTbu.png', file: 'seo/apple-touch-icon.png' },
];

await mkdir(path.join(OUT, 'fonts'), { recursive: true });
await mkdir(path.join(OUT, 'seo'), { recursive: true });

let ok = 0;
let fail = 0;
const batch = ASSETS.slice();
const worker = async () => {
  while (batch.length) {
    const asset = batch.shift();
    try {
      const res = await fetch(asset.url, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(OUT, asset.file), buf);
      console.log(`OK  ${asset.file} (${(buf.length / 1024).toFixed(1)} KB)`);
      ok++;
    } catch (err) {
      console.error(`FAIL ${asset.file}: ${err.message}`);
      fail++;
    }
  }
};
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`Done. ok=${ok} fail=${fail}`);
if (fail > 0) process.exit(1);
