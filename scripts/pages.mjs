// Utilitários partilhados pelas verificações: lista as páginas geradas em dist/
// e serve essa pasta localmente, respeitando o BASE_PATH da publicação.
import { readdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
export const BASE = ('/' + (process.env.BASE_PATH || '/').replace(/^\/|\/$/g, '') + '/').replace('//', '/');

export async function htmlFiles(dir = DIST) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Caminho público de um ficheiro de dist/ (ex.: dist/arquivo/index.html → /arquivo/). */
export function publicPath(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  return BASE + rel.replace(/(^|\/)index\.html$/, '$1');
}

/** Ficheiro em dist/ que corresponde a um caminho público, ou null se não existir. */
export async function resolvePath(pathname) {
  if (!pathname.startsWith(BASE)) return null;
  let rel;
  try {
    rel = decodeURIComponent(pathname.slice(BASE.length));
  } catch {
    return null; // '%' inválido no caminho
  }
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const file = join(DIST, rel);
  if (!file.startsWith(DIST)) return null; // '..' a sair de dist/
  try {
    return (await stat(file)).isFile() ? file : null;
  } catch {
    return null;
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

export function serve() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const file = await resolvePath(new URL(req.url, 'http://x').pathname);
      if (!file) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}
