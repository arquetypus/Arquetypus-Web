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

Entrada de build: `src/entry-server.tsx`, com `renderToString` e `StaticRouter`.
Entrada cliente: `src/main.tsx`, com `hydrateRoot` para HTML compatível e renderização
cliente para estados de histórico/rotas que exigem outra árvore. Preservar esse contrato;
a primeira renderização não deve depender de storage, relógio ou APIs do navegador.
Mudanças de conteúdo, preço, metadados ou catálogo exigem novo build/deploy.

## Fluxo Git

Pré-renderização integrada e publicada no domínio principal. Trabalho corrente
diretamente na `main`, conforme decisão do usuário. A branch `prerender` foi integrada
e removida local e remotamente. Não há mais etapas de migração a executar; scripts
de pré-renderização e validação continuam fazendo parte do build permanente.

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

`npm run build` executa os gates permanentes de SSR, HTML, head, recursos e roteamento.
Relatórios locais ficam em `dist-server`, fora da saída publicada. Planos, capturas e
ferramentas temporárias da migração foram removidos; versões anteriores permanecem no Git.

Nomes comerciais visíveis vêm de `nome` e `sobrenome`. `nomeOficial` contém o nome
cadastrado no GTIN, reservado para identificação estruturada em SEO/integrações.
`Product.name` e `Product.gtin13` são gerados pelo modelo compartilhado. O build valida
formato, dígito verificador, unicidade e correspondência com o produto. Google Shopping
exige integração própria; o cadastro desses campos não publica um feed.
Fonte e regras do cadastro: [Identidade dos produtos](docs/produtos.md).

Antes de publicar, validar preview e confirmar deployment de retorno disponível.
Push em `main` aciona a integração Git existente; conferir HTML bruto e navegação no
domínio principal após o deploy. Acesso administrativo à Vercel é manual pelo usuário.
Testes funcionais usam Google Chrome como navegador principal, conforme `AGENTS.md`.
Preservar proteção `noindex` do preview sem contaminar páginas válidas em produção.
Conferir recebimento externo de analytics e acompanhar erros após a publicação.
