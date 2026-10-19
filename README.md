# O Genérico

Plataforma de arquivo e análise de genéricos do cinema português.
Projeto de dissertação do Mestrado em Design e Multimédia (FCTUC, 2026/2027), com o apoio da Cinemateca Portuguesa – Museu do Cinema.

Construído com [Astro](https://astro.build). O plano de construção por fases está em `plano/construcao-website-fases.md`, na pasta do projeto.

## Correr localmente

É preciso Node.js 22.22 ou mais recente.

```sh
npm install
npm run dev        # http://localhost:4321/
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com atualização automática |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve a versão gerada em `dist/` |
| `npm run check` | Corre todas as verificações: tipos, build, links internos e acessibilidade |
| `npm run check:links` | Só os links internos (depois de `build`) |
| `npm run check:a11y` | Só a acessibilidade, com axe-core e regras WCAG 2.2 AA (depois de `build`) |

A verificação de acessibilidade usa o Chromium do Playwright (`npx playwright install chromium`). Para usar outro Chromium já instalado, define `CHROMIUM_PATH`.

## Estrutura

```
src/
  pages/          uma pasta por secção do site (cada ficheiro é uma página)
  layouts/        estrutura comum das páginas (Base.astro)
  components/     componentes reutilizáveis (cabeçalho, rodapé…)
  styles/         global.css com os tokens visuais
  lib/            utilitários (navegação, links internos)
public/           ficheiros servidos tal como estão (favicon, imagens fixas)
scripts/          verificações automáticas de links e acessibilidade
.github/workflows/site.yml   verificação e publicação no GitHub Pages
```

Os links internos usam sempre `url('/caminho/')` (de `src/lib/url.ts`), para o site funcionar tanto na raiz de um domínio como num subcaminho do GitHub Pages.

## Publicação

O workflow `.github/workflows/site.yml` verifica o site em cada *pull request* e publica-o no GitHub Pages a cada alteração no ramo `main`. Para o ativar, vai às definições do repositório, em **Settings → Pages**, e escolhe **Source: GitHub Actions**.

## Estado

**Fase 0 (Fundações):** estrutura do projeto, página-esqueleto com cabeçalho, navegação e rodapé, páginas provisórias das secções e verificações automáticas. A identidade visual é provisória: entra na Fase 2.
