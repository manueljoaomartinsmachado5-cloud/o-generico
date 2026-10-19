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
const PESSOAS_DIR = './src/content/pessoas';
const pessoaIds = new Set(readdirSync(PESSOAS_DIR).filter((f) => f.endsWith('.yaml')).map((f) => f.slice(0, -5)));
const pessoa = reference('pessoas').refine((p) => pessoaIds.has(p.id), {
  error: (iss) => `Pessoa "${(iss.input as { id: string }).id}" não existe em ${PESSOAS_DIR}/`,
});

const pessoas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: PESSOAS_DIR }),
  schema: z.object({
    nome: z.string(),
    tipo: z.enum(['pessoa', 'estúdio']).default('pessoa'),
    nota: z.string().optional(),
  }),
});

const genericos = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/genericos' }),
  schema: z.object({
    titulo: z.string(),
    ano: z.number().int().min(1896).max(2100),
    realizacao: z.array(pessoa).min(1),
    generos: z.array(z.enum(GENEROS)).min(1),
    creditos: z.array(z.object({ pessoa, funcao: z.enum(FUNCOES) })).default([]),
    duracao: z.number().positive().optional(), // segundos
    tecnicas: z.array(z.enum(TECNICAS)).default([]),
    tipografia: z.array(z.enum(TIPOGRAFIA)).default([]),
    cor: z.enum(COR).optional(),
    som: z.array(z.enum(SOM)).default([]),
    video: z.url().optional(),
    analise: z.string().optional(),
    fontes: z.array(z.string()).default([]),
  }),
});

export const collections = { pessoas, genericos };
