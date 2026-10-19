// Verifica se todos os links e recursos internos das páginas geradas existem.
// Correr depois de `npm run build`.
import { readFile } from 'node:fs/promises';
import { BASE, htmlFiles, publicPath, resolvePath } from './pages.mjs';

// ponytail: não lê srcset nem descodifica entidades HTML (&amp;, &#39;) nos caminhos.
// Chega enquanto os slugs forem ASCII e os srcset vierem só do Astro.
const ATTR = /\s(?:href|src|poster)="([^"]+)"/gi;
const files = await htmlFiles();
const broken = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const from = publicPath(file);
  for (const [, raw] of html.matchAll(ATTR)) {
    if (/^(?:[a-z]+:|#|\/\/)/i.test(raw)) continue; // externos, âncoras, mailto:, data:
    const target = new URL(raw, 'http://x' + from).pathname;
    if (!(await resolvePath(target))) broken.push(`${from} → ${raw}`);
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} link(s) interno(s) partido(s):`);
  for (const line of broken) console.error('  ' + line);
  process.exit(1);
}
console.log(`✓ Links internos: ${files.length} páginas verificadas (base ${BASE}).`);
