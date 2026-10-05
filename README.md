# Arquétypus Parfum

React 19, React Router, TypeScript, Tailwind CSS 4 e Vite, com pré-renderização
estática no build e hidratação no navegador. Sem servidor React em runtime.

## Desenvolvimento e build

Node 24.x (mesma versão configurada na Vercel), dependências do lockfile:

```sh
npm ci
npm run dev
npm run build
```

Build verifica `vercel.json`, compila TypeScript, gera cliente e renderer privado,
testa SSR, pré-renderiza e verifica os artefatos. `dist` contém 18 páginas públicas
e `404.html`; `dist-server` contém renderer, template e relatórios privados e não
deve ser publicado. `npm run build:client` isolado não produz o site SSG completo.

Rotas e conteúdo vêm de `src/data/rotas.ts` e `src/data/archetypes.ts`.
SEO compartilhado em `src/lib/seoModel.ts`; servidor e cliente usam a mesma árvore
React. Home contém estado inicial e preços; cada PDP contém nome, H1, preço,
descrição, imagem e metadados próprios antes do JavaScript.

## Vercel

`vercel.json` versionado define preset Vite, `npm run build`, saída `dist`, URLs sem
`.html` e sem barra final. Rewrite SPA substituído por arquivos reais: não
restaurar catch-all para `index.html`, pois serviria home em todas as páginas.

- `/arquetipos/:id` → `/loja/:id` (308).
- `/kit-descoberta` e produto inexistente → `/` (307).
- URLs desconhecidas, segmentos extras e aliases `/trocas` e `/termos` → 404 própria.
- URLs institucionais reais: `/trocas-e-devolucoes` e `/termos-de-uso`.

Matcher de produto gerado dos dados, sem lista manual duplicada. Após alterar
IDs ou contrato de roteamento:

```sh
npm run configure:vercel
npm run build
```

Revisar e versionar `vercel.json` **antes** do push; build apenas verifica drift,
não altera configuração depois da leitura pela plataforma. Preservar query de campanha,
canonical oficial e cache padrão. `vite preview` não certifica redirects ou headers Vercel.

## Validação e publicação

Plano e registros: [MIGRACAO-PRERENDER.md](MIGRACAO-PRERENDER.md) e
[docs/prerender](docs/prerender). Ferramentas e evidências de QA ficam fora de `dist`.
Preview da branch `prerender` é isolado da produção; header Vercel `noindex` deve
proteger preview sem contaminar HTMLs válidos destinados à produção.

Publicação em `main` pertence à Etapa 7, após aceite do preview, autorização e
confirmação do deployment estável/permissão de rollback. Configuração nesta branch
não implica produção migrada. Não ativar compra, kit, quiz ou persistência durante SSG.
