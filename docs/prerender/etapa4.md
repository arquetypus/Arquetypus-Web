# Etapa 4 — HTML por rota e hidratação

Implementação em `prerender`, em 05/10/2026. Etapa 4 concluída: aceite local, publicação e validação do preview aprovados. Código `6fa0b4c715c6f7b9035daba1d0a0cc3bad2b5a37`; [check Vercel success](https://vercel.com/saniella/arquetypus-parfum/Bu9vJcRh8wgUWFFYXkBqLdWsXVNr). Produção preservada.

## Implementação

- Pipeline: TypeScript → cliente/manifest → servidor privado → smoke SSR → geração estática → verificador de artefatos. Sem nova dependência ou alteração de framework/lockfile.
- Gerador lê template uma vez, usa marcadores explícitos de root/head, gera `index.html`, 17 arquivos por rota e `404.html`. `data-rota` identifica somente páginas conhecidas. 404 tem noindex, sem canonical fictício e sem marcador de rota hidratável.
- Rotas derivadas dos mesmos dados, compartilhadas em `publicRoutes.ts`. Duplicatas, destinos inseguros, colisões de arquivos e marcadores inválidos interrompem geração. Conjunto inteiro e recursos são validados antes de sobrescrever qualquer HTML.
- Head preserva título, descrição, canonical, OG/Twitter e schemas existentes. Escapes de atributos/title, JSON-LD protegido contra `</script>` e substituições literais de `$&`/`$1`. GTM, consentimento, fontes, ícones e tema preservados.
- `main.tsx` usa `hydrateRoot` somente com HTML e rota/estado compatíveis. Dev/root vazio, 404 genérica, HTML de outra rota e histórico de pop-up usam `createRoot`. Erro recuperável e componentStack são registrados no console, sem SDK externo.
- Histórico persistido do pop-up comprovado: bootstrap no head oculta árvore incompatível antes da pintura; montagem síncrona libera ocultação após árvore cliente correta estar pronta. Não limpa histórico nem converte modal em PDP no reload. Falha de script ou teto de 2 s libera conteúdo; matriz completa de JS lento/falha pertence à Etapa 5.
- Servidor e template original permanecem privados. Somente `dist/` é publicado. Smoke SSR pode ser repetido depois do build usando template privado original.

## Validação local

| Critério | Resultado |
| --- | --- |
| Artefatos | 18 páginas + 404; 82 recursos resolvidos; sitemap com mesmas 18 canonicals |
| HTML bruto | Head único/correto, H1/conteúdo no main, preço nas nove PDPs, JSON válido, sem códigos internos/CookieBanner |
| Hidratação | 18 URLs no QA local: H1 original preservado, zero erros/warnings; 404 monta cliente sem mismatch |
| Pop-up | Reload preserva home/modal em desktop/móvel; frames não mostram PDP visível antes do modal; histórico/fechamento/página completa preservados |
| Query/hash | PDP com UTM/âncora hidrata sem erro e preserva H1 |
| Build limpo | Dois builds, mesmos 19 HTMLs byte a byte e inventário/metadados iguais; arquivo obsoleto semeado foi removido |
| Contratos | Escapes e JSON-LD seguros; rotas/markers inválidos, head errado e asset ausente reprovam gate |
| Desenvolvimento | Vite com root vazio usa montagem cliente; PDP/galeria interativas, sem marcador SSR ou erro de console |

`lastmod` do sitemap vem da data corrente: comparar rotas/canonicals semanticamente entre dias. Captura da galeria deve aguardar fim da dica de arrasto (1,8 s); frame intermediário não indica mudança de layout.

Lint: zero erros, dois avisos existentes de exports de build na entrada SSR. Build mantém warning anterior de chunk acima de 500 kB. Cinco avisos de `Navigate` em testes negativos SSR são esperados; redirects não são pré-renderizados.

## Limite do preview

`vercel.json` preserva rewrite SPA, conforme separação do plano. Esta etapa valida arquivos `.html` publicados e funcionamento do app. Entrega definitiva nas URLs sem extensão, status 404 e redirects pertence à Etapa 6. HTTP confirmou HTML próprio em `/` e fallback home nas outras 17 URLs limpas; fallback funcional via JS não comprova SEO completo. Não publicar esta configuração intermediária em produção.

## Validação do preview

- 19 HTMLs publicados idênticos ao build local, antes de executar JS: title, description, H1, conteúdo principal e preço nas nove PDPs já presentes nos arquivos. 82 recursos e três arquivos SEO idênticos; header `X-Robots-Tag: noindex` no preview.
- 18 URLs reais no navegador: title/description/canonical/OG únicos, JSON-LD igual ao SSR, H1/conteúdo/preços/imagens corretos, tema preservado e console sem erro/warning. Páginas usam fallback de montagem cliente quando rewrite entrega HTML de outra rota; hidratação das 18 árvores corretas foi comprovada no QA local.
- 16 cenários aprovados: head do pop-up, reload desktop/móvel, galeria, back/forward, fechamento, página completa/reload, menu móvel, query/hash, caminho codificado, noindex na 404 e remoção na home, FAQ.
- Bundle cliente `/assets/index-DKt_0S1i.js`; CSS preservado. Entrada SSR, template privado e caminho-fonte testado não expostos. Produção continua com bundles originais `/assets/index-CEBNf12q.js` e `/assets/index-C9zeGloN.css`.
- Capturas desktop/móvel revisadas visualmente. Menu deve estabilizar animação de abertura antes de clicar; galeria móvel deve concluir animação/rolagem antes da captura.

## Evidências e reprodução

- [Artefatos](evidence/etapa4-artifacts.json), [dois builds](evidence/etapa4-build-repeat.json), [contratos](evidence/etapa4-contracts.json).
- [Hidratação/pop-up](evidence/etapa4-browser-local.json), [desktop](evidence/etapa4-local-zeus-desktop.jpg), [móvel](evidence/etapa4-local-zeus-mobile.jpg).
- [Dev](evidence/etapa4-dev.json), [deploy](evidence/etapa4-deploy.json), [HTTP](evidence/etapa4-preview-http.json), [navegador](evidence/etapa4-preview-metadata.json), [aceite](evidence/etapa4-preview-validation.json).
- Capturas do preview: [desktop](evidence/etapa4-preview-zeus-desktop.jpg), [móvel](evidence/etapa4-preview-zeus-mobile.jpg).
- `node docs/prerender/tools/etapa4-serve.mjs`: QA de URLs limpas. Instrumenta preservação de nós, frames e console somente na resposta local, sem analytics externos; não modifica build público.

```sh
npx tsc -b
npm run build
node docs/prerender/tools/etapa4-contracts.mjs
node docs/prerender/tools/etapa4-preview-check.mjs <sha>
node docs/prerender/tools/etapa4-preview-browser-check.mjs
```

Referências: [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot), [configuração Vercel](https://vercel.com/docs/project-configuration/vercel-json).
