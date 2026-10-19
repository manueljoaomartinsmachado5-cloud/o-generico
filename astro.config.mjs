// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL e BASE_PATH são definidos na publicação (ver .github/workflows/site.yml).
// Localmente o site corre na raiz: http://localhost:4321/
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
