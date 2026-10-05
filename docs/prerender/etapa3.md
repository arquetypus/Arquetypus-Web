# Etapa 3 — entrada de servidor e ensaio SSR

Implementação em `prerender`, em 05/10/2026. Validação local aprovada; publicação e aceite do preview pendentes.

## Implementação

- `src/entry-server.tsx`: `StaticRouter` exportado pela raiz de `react-router-dom` 7.18.2, `renderToString`, `StrictMode` e o mesmo `App`/providers do cliente. Exporta as 18 rotas derivadas dos dados, atributos do tema e `render(url)`, retornando HTML e descritor puro do head. Não importa CSS nem usa coletor global de SEO.
- `getArchetype`: consulta somente propriedades próprias do catálogo. Os nove IDs válidos continuam iguais; `constructor`, `toString`, `__proto__`, `nao-existe` e `ZEUS` não são produtos.
- `npm run build`: TypeScript → cliente com manifest em `dist/` → servidor privado em `dist-server/` → `verify:ssr`. `NODE_ENV=production` é definido no script antes dos imports dinâmicos de React/renderer, funcionando em Windows e Linux. `dist-server/` está no `.gitignore`.
- Ensaio em `scripts/smoke-ssr.mjs`, sem dependência nova. Falha diante de conteúdo, head, asset, tema, lookup ou warning inesperado. Os 19 fragmentos HTML e relatório são gravados somente em `dist-server/smoke/` e `dist-server/smoke-ssr.json`.
- `main.tsx`, `index.html`, `vite.config.ts`, layout, catálogo, URLs e `vercel.json` permanecem preservados. A saída pública continua SPA; geração de HTML/head por URL e hidratação pública pertencem à Etapa 4.

## Validação local

Evidência: [etapa3-ssr.json](evidence/etapa3-ssr.json).

| Critério | Resultado |
| --- | --- |
| 18 rotas + uma URL inexistente | HTML não vazio, `main`, H1 e conteúdo principal presentes; 404 com `noindex` |
| Nove páginas de produto | H1, preço, fotos de frasco/lifestyle e Product/Breadcrumb coerentes com manifest cliente |
| Metadados | Título, descrição e canonical preservados em relação ao preview aprovado da Etapa 2; JSON-LD válido |
| Head isolado | Zeus → FAQ → Zeus retorna exatamente o mesmo HTML e head |
| Tema | `boutique` / `ambar` / `elegant`, iguais ao template cliente |
| Assets | 80 arquivos comparados byte a byte com suas fontes; 88 referências locais resolvidas; nove grupos com basename repetido |
| Cobertura | Imports/globs, `src`, `srcset`, `poster`, preloads, CSS, fotos e recursos de `public/` |
| Segurança SSR | Sem browser globals e sem warnings nas 18 rotas publicáveis + 404; CookieBanner e códigos internos ausentes dos fragmentos |
| Build | TypeScript, cliente, servidor e smoke aprovados; sem alteração no lockfile |

O Vite instalado produz URLs SSR compatíveis com a saída cliente. Nenhum plugin de remapeamento ou cópia de assets SSR foi necessário. A auditoria confronta manifest, caminho original, URL e bytes; verifica também as referências do bundle, inclusive imports que o compilador incorporou diretamente em objetos. O campo `sourceRegionMapped` distingue esses casos. Um arquivo eliminado do servidor por tree shaking pode existir somente no cliente; não é divergência de URL. A leitura das regiões usa o formato não minificado do Vite/Rolldown instalado e falha explicitamente se esse formato mudar para uma região existente.

Cinco testes negativos geram o aviso esperado de `Navigate` em `StaticRouter`: navegação não acontece durante SSR. Avisos estão em `redirectWarnings`, separados dos renders publicáveis, sem supressão. Essas URLs não são pré-renderizadas. Redirecionamento HTTP fica para a etapa de roteamento; no cliente o comportamento atual de voltar à home deve ser validado no preview.

Lint dos arquivos alterados: zero erros; dois avisos `react/only-export-components` na entrada de servidor, que exporta funções/dados para build e não participa do Fast Refresh. Build cliente mantém o aviso existente de chunk acima de 500 kB.

## Publicação e preview

Pendente. Executar `node docs/prerender/tools/etapa3-preview-check.mjs <sha> --http-only`, coletar 18 páginas no navegador e cenários de regressão, depois executar com `--browser-only`. Registrar SHA/deployment/evidências antes do aceite final.

## Limite deste aceite

Os fragmentos SSR já contêm H1, preço e conteúdo principal sem JS. O head é retornado como descritor separado. Ainda não está inserido no HTML público de cada rota: no preview, root vazio e metadados iniciais da home são esperados nesta etapa. HTML público completo e hidratação serão implementados e aceitos na Etapa 4.

Referências verificadas: [SSR nativo do Vite](https://vite.dev/guide/ssr.html), [manifest e opções de build](https://vite.dev/config/build-options.html#build-manifest), [StaticRouter](https://reactrouter.com/api/declarative-routers/StaticRouter).
