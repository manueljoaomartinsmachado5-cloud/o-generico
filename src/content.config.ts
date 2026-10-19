import { readdirSync } from 'node:fs';
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Vocabulários controlados (provisórios): a lista definitiva sai dos critérios de análise.
// Para acrescentar um valor, basta juntá-lo à lista respetiva.
const GENEROS = ['drama', 'comédia', 'documentário', 'animação', 'thriller', 'fantástico', 'musical', 'experimental', 'histórico'] as const;
const FUNCOES = ['design do genérico', 'realização do genérico', 'animação', 'tipografia', 'fotografia', 'montagem', 'música', 'som'] as const;
const TECNICAS = ['tipografia sobre fundo', 'tipografia sobre imagem', 'tipografia animada', 'animação 2D', 'animação 3D', 'stop-motion', 'imagem real', 'colagem', 'ilustração'] as const;
const TIPOGRAFIA = ['serifada', 'sem serifa', 'manuscrita', 'desenhada à mão', 'monoespaçada', 'decorativa'] as const;
const COR = ['preto e branco', 'cor', 'monocromático'] as const;
const SOM = ['música original', 'música pré-existente', 'silêncio', 'diálogo', 'efeitos sonoros', 'voz off'] as const;

// reference() não confirma que a pessoa existe; isto faz o build falhar se o id estiver errado.
// Lê a pasta a cada validação (funciona em `astro dev` sem reiniciar) e exige ids em minúsculas
// com hífenes, para coincidirem com os ids que o Astro gera a partir dos nomes dos ficheiros.
const PESSOAS_DIR = './src/content/pessoas';
const pessoa = reference('pessoas').refine(
  (p) => /^[a-z0-9-]+$/.test(p.id) && readdirSync(new URL('./content/pessoas/', import.meta.url)).includes(`${p.id}.yaml`),
  { error: (iss) => `Pessoa "${(iss.input as { id: string }).id}" não existe: tem de haver ${PESSOAS_DIR}/<id>.yaml, com o nome em minúsculas e hífenes` },
);

const pessoas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: PESSOAS_DIR }),
  schema: z.strictObject({
    nome: z.string(),
    tipo: z.enum(['pessoa', 'estúdio']).default('pessoa'),
    nota: z.string().optional(),
  }),
});

const genericos = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/genericos' }),
  schema: z.strictObject({
    titulo: z.string(),
    ano: z.number().int().min(1896).max(2100),
    realizacao: z.array(pessoa).min(1),
    generos: z.array(z.enum(GENEROS)).min(1),
    // Só quem fez o genérico, não a equipa do filme (a realização do filme vai em `realizacao`).
    creditos: z.array(z.object({ pessoa, funcao: z.enum(FUNCOES) })).default([]),
    duracao: z.number().positive().optional(), // segundos
    tecnicas: z.array(z.enum(TECNICAS)).default([]),
    tipografia: z.array(z.enum(TIPOGRAFIA)).default([]),
    cor: z.enum(COR).optional(),
    som: z.array(z.enum(SOM)).default([]),
    video: z.httpUrl().optional(),
    analise: z.string().optional(),
    fontes: z.array(z.string()).default([]),
  }),
});

export const collections = { pessoas, genericos };
