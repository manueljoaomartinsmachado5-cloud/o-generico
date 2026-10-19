// Verificação automática de acessibilidade (axe-core, regras WCAG 2.2 A e AA)
// em todas as páginas geradas. Correr depois de `npm run build`.
// Não substitui testes manuais: deteta só uma parte dos problemas possíveis.
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { htmlFiles, publicPath, serve } from './pages.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}`;
// CHROMIUM_PATH permite usar um Chromium já instalado em vez do do Playwright.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const context = await browser.newContext();
const page = await context.newPage();

let total = 0;
const paths = (await htmlFiles()).map(publicPath).sort();
for (const path of paths) {
  await page.goto(origin + path);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  total += violations.length;
  for (const v of violations) {
    console.error(`✗ ${path}  [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) console.error('    ' + node.target.join(' '));
  }
}

await browser.close();
server.close();

if (total) {
  console.error(`✗ Acessibilidade: ${total} problema(s) em ${paths.length} páginas.`);
  process.exit(1);
}
console.log(`✓ Acessibilidade: ${paths.length} páginas sem problemas detetados (${TAGS.join(', ')}).`);
