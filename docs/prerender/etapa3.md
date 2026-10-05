# Etapa 3 — entrada de servidor e ensaio SSR

Etapa concluída e validada em `prerender`, em 05/10/2026. Código: `1b2b317bf5929b35d25688df8fb4f269e0a052ad`. Build local, check Vercel e preview aprovados. Produção permanece preservada.

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

Deployment do código: [Vercel — check success](https://vercel.com/saniella/arquetypus-parfum/4bhCU8vhjgbsFjmFhZdjVTjPGhq5). Preview: https://arquetypus-parfum-git-prerender-saniella.vercel.app/.

Validação HTTP: 24 rotas/variantes retornam o template SPA esperado, com `X-Robots-Tag: noindex` do preview. As 88 referências locais e os três arquivos SEO têm bytes idênticos ao build local. Os caminhos do bundle/relatório/fontes SSR retornam fallback HTML, sem expor esses artefatos. Produção continua com `/assets/index-CEBNf12q.js` e `/assets/index-C9zeGloN.css`; `main` continua em `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2`.

Validação no navegador: 18 títulos/descrições/canonicals, tema, H1, JSON-LD e conteúdo principal confrontados com contratos SSR; nove PDPs com preço e foto primária corretos; nenhuma imagem visível quebrada ou warning/erro de console. Os cinco slugs negativos voltam à home sem crash ou schema de produto residual.

Quinze cenários de regressão aprovados: slugs inválidos, head do pop-up, galeria do pop-up, página completa, reload, voltar/avançar, fechar pop-up e restaurar head da home, 404/noindex, saída da 404, query/canonical, caminho codificado, galeria móvel, menu móvel e acordeão FAQ. O link de página completa conserva `replace`: voltar retorna à home, conforme implementação existente. Capturas verificadas em desktop 1440×900 e móvel 390×844; viewport restaurado após o teste.

| Evidência | Conteúdo |
| --- | --- |
| [etapa3-deploy.json](evidence/etapa3-deploy.json) | SHA e check Vercel do código |
| [etapa3-preview-http.json](evidence/etapa3-preview-http.json) | Rotas, recursos, SEO e produção |
| [etapa3-preview-metadata.json](evidence/etapa3-preview-metadata.json) | Metadados e conteúdo das 18 páginas reais |
| [etapa3-preview-ui.json](evidence/etapa3-preview-ui.json) | Quinze cenários e slugs negativos |
| [etapa3-preview-validation.json](evidence/etapa3-preview-validation.json) | Aceite agregado |
| [Desktop](evidence/etapa3-preview-zeus-desktop.jpg) / [Móvel](evidence/etapa3-preview-zeus-mobile.jpg) | Layout da PDP Zeus |

Comandos de verificação:

```sh
npx tsc -b
npm run build
node docs/prerender/tools/etapa3-preview-check.mjs 1b2b317bf5929b35d25688df8fb4f269e0a052ad --http-only
node docs/prerender/tools/etapa3-preview-check.mjs 1b2b317bf5929b35d25688df8fb4f269e0a052ad --browser-only
```

O segundo comando de preview valida os arquivos de coleta do navegador, vinculados ao SHA. Uma nova versão exige nova coleta; não reutilizar snapshots como comprovação de um código diferente.

## Limite deste aceite

Os fragmentos SSR já contêm H1, preço e conteúdo principal sem JS. O head é retornado como descritor separado. Ainda não está inserido no HTML público de cada rota: no preview, root vazio e metadados iniciais da home são esperados nesta etapa. HTML público completo e hidratação serão implementados e aceitos na Etapa 4.

Referências verificadas: [SSR nativo do Vite](https://vite.dev/guide/ssr.html), [manifest e opções de build](https://vite.dev/config/build-options.html#build-manifest), [StaticRouter](https://reactrouter.com/api/declarative-routers/StaticRouter).
