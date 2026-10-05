# Etapa 2 — modelo SEO compartilhado e ciclo de vida do head

Estado: implementação e aceite local aprovados; publicação e validação do preview pendentes.

Escopo: somente Etapa 2 de `MIGRACAO-PRERENDER.md`, na branch `prerender`, partindo de `6a9906b`.
Produção e `main` ficam preservadas. O aplicativo publicado ainda é SPA; HTML inicial por rota entra na Etapa 4.

## Implementação

- `data/rotas.ts` reúne os metadados das nove páginas públicas. Textos extraídos sem alteração e comparados com a baseline da Etapa 1.
- `lib/seoModel.ts` resolve o descritor puro pela URL real. Query/hash não entram no canonical; barra final e caixa das páginas seguem o contrato existente. IDs de produto permanecem sensíveis a caixa.
- `RouteSeo` fica dentro do Router e fora dos dois conjuntos de Routes. Páginas/LegalPage/FAQ/404 deixam de disputar o head. O pop-up recebe title, description, canonical e dados estruturados do produto, preservando sua interface.
- O aplicativo reconcilia scripts por IDs `arq-seo-*`, adota nós existentes, compara JSON estável e remove apenas os IDs de scripts pertencentes ao app. Scripts de terceiros e robots externos permanecem intactos. O noindex da 404 tem proprietário e ID próprios.
- Organization/WebSite aparecem na home; Product/BreadcrumbList na PDP/pop-up; FAQPage somente na URL da FAQ. A FAQ mantém o JSON anterior integralmente. Offer, avaliações, disponibilidade e códigos internos ficam omitidos conforme o plano.
- `data/productMedia.ts` compartilha os mesmos globs de fotos da PDP com galeria e SEO. OG continua usando a arte padrão, incluindo width/height/alt; og:type passa para product na PDP e volta para website ao sair.
- O descritor da 404 genérica pode omitir canonical/og:url, sem URL fictícia de build. JSON-LD escapa `<` sem alterar o conteúdo parseado.
- RouteTracker mantém seu evento e envio assíncrono. A ordem foi testada no navegador; nenhum novo tracker ou dependência foi introduzido.

## Aceite local

Ambiente mantido: Node 24.19.0 / npm 12.0.2. Dependências, lockfile, roteamento Vercel e inicialização cliente não foram alterados.

Comandos, com Node do NVM no PATH:

```powershell
npm run build
node docs/prerender/tools/etapa2-check.mjs
node docs/prerender/tools/etapa2-serve.mjs
```

- TypeScript/build aprovados; warning já conhecido de bundle acima de 500 kB permanece.
- Lint do escopo: zero erros; cinco warnings preexistentes (export `brl` em ProductPurchase, três acessos a refs e habilitação pós-montagem do formulário em HomePage). Módulos SEO novos sem warnings.
- Contratos puros: 18 títulos/descrições/canonicals iguais à baseline, nove Products/Breadcrumbs coerentes, fotos compartilhadas, FAQ exata, canonical sem query e sem contaminação entre chamadas.
- Fixture local usa App/RouteSeo/RouteTracker reais, MemoryRouter, SSR do ensaio e hydrateRoot em StrictMode. 27 passos, 26 page_view esperados; repetir URL inicial ou mudar somente hash não duplica tracking. Cada envio já observa title/canonical corretos. Nenhum GTM externo é carregado nesta fixture.
- FAQ → PDP → home, 404 → home e pop-up aprovados; tags únicas, scripts exatos, noindex removido ao sair. Hidratação sem erros recuperáveis e console sem warnings/erros.
- Documento isolado comprova adoção por ID e identidade dos nós existentes, preservação de JSON-LD/GTM/robots externos e remoção de canonical/og:url na 404 genérica.
- A fixture aguarda commit efetivo da navegação, com limite de oito segundos. Esse prazo pertence apenas ao QA; não muda timers, animações ou tracking do site.

Evidências: [contratos puros](evidence/etapa2-contracts.json), [navegador local](evidence/etapa2-browser-local.json).

As referências oficiais consultadas foram [efeitos React](https://react.dev/reference/react/useEffect) e [Product no Schema.org](https://schema.org/Product). Comportamento foi comprovado com a versão instalada no projeto.

## Preview Vercel

Pendente após commit/push. Aceite exige status Vercel success associado ao SHA, JS/CSS iguais ao build local, 18 rotas e navegação com o head esperado.

## Limites

Esta etapa prepara SEO compartilhado; não torna o HTML bruto de cada rota pré-renderizado ainda. Não inicia Etapa 3 nem publica em produção. Auditoria de elegibilidade de rich results e desempenho completo permanece nas etapas previstas; ausência de Offer é deliberada, sem promessa de rich result de produto.
