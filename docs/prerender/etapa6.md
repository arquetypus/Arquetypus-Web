# Etapa 6 — roteamento Vercel e preview

## Estado

Implementação, commit, push e validação HTTP remota concluídos. Navegador remoto,
interações, Schema.org, Rich Results e prévias sociais agora têm evidências.
**Aceite completo pendente** de desempenho, cenários adicionais e rollback. Build local aprovado (19 HTMLs,
91 recursos, 18 canonicals), matcher validado em 139 casos.

Código enviado em `a0f211dcb7409f2accdb392dd021c7c946c61242`, incluindo commit local
da Etapa 5 `59724cd`. Check Vercel `success`, deployment
[AqYmeBN9n2hHY6Hi97Dx1qRYH4LG](https://vercel.com/saniella/arquetypus-parfum/AqYmeBN9n2hHY6Hi97Dx1qRYH4LG).
Preview: <https://arquetypus-parfum-git-prerender-saniella.vercel.app/>.
Toolbar da home informa o mesmo ID com prefixo `dpl_`.

`git ls-remote` confirmou `main` preservada em `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2`.
Nenhum merge, promoção ou configuração de produção executado. Etapa 7 não autorizada.

## Configuração

`scripts/configure-vercel.mjs` carrega `ARCHETYPES` pelo Vite existente e materializa
`vercel.json` antes do commit. `verify:vercel`, primeiro gate do build, detecta drift
sem tentar corrigir configuração depois de ela ser lida pela Vercel. Sem dependência nova.

Preset Vite, comando completo e saída `dist` ficam explícitos no arquivo versionado.
`cleanUrls`/`trailingSlash` substituem rewrite SPA. Matcher preserva nove IDs válidos,
incluindo percent-encoding, barra e extensão; rejeita prefixos/sufixos, IDs maiúsculos
e nomes herdados. Segmento adicional não é tratado como produto inválido: recebe 404.

`404.html` é o mecanismo estático nativo documentado pela
[Vercel](https://vercel.com/kb/guide/custom-404-page); status 404 e corpo próprio
comprovados no deployment. Não há catch-all 200 nem configuração `routes` legado.

README e CLAUDE descrevem pipeline e novo roteamento. Regras de produto preservadas.

## HTTP remoto aprovado

[Relatório](evidence/etapa6-http.json), [HTML bruto recebido](evidence/etapa6-html),
[build](evidence/etapa6-build-output.txt), [script reproduzível](tools/etapa6-http.mjs).
HTMLs de evidência preservam bytes/espaços originais; atributo Git restrito à pasta
impede conversão de fim de linha e aceita whitespace já presente no template recebido.

- **306 verificações de rotas**: 153 caminhos por GET e HEAD, sem seguir redirects
  implicitamente; status, Location, query, Content-Type, corpo e cache registrados.
- **18 páginas públicas 200 + 404 própria**: head e conteúdo do build local idênticos
  ao recebido. Única diferença permitida: script de toolbar Vercel na home. Sem
  executar JavaScript, gate confirma title, description, canonical, OG, H1, conteúdo
  principal e JSON-LD; nove PDPs também têm preço e descrição na seção de compra.
- **94 recursos por GET e HEAD**: bytes iguais ao build local, MIME correto, corpo
  HEAD vazio e ETag coerente. Inclui JS/CSS, fotos, fontes, ícones, robots, sitemap e
  llms. Única variação permitida no sitemap é `lastmod`, já existente e dependente do build.
- Todas as nove URLs `.html`/com barra normalizam por 308; todas as nove legadas
  `/arquetipos/:id` preservam UTM ao redirecionar por 308. Kit e IDs inválidos usam
  307; prefixos, nomes herdados e caixa inválida não capturam produto válido.
- Nove IDs percent-encoded entregam PDP correta. Segmento adicional, `/trocas`,
  `/termos`, caminho desconhecido e asset ausente respondem 404 própria, sem home 200.
  Extensão `.html` após ID codificado normaliza por 308; hex pode ser capitalizado
  na Location sem alterar ID decodificado. Dot `%2e` antes de `html` não é extensão
  normalizada pela plataforma e retorna 404; não é URL pública do catálogo.
  Produto inválido com barra final primeiro recebe 308 para URL sem barra, depois
  307 para home; destinos já testados, sem loop.
- Preview tem header `X-Robots-Tag: noindex`; HTML válido não embute esse noindex.
  Canonicals/URLs estruturadas permanecem oficiais. HTML e recursos examinados usam
  `public, max-age=0, must-revalidate`, sem cache imutável prolongado. Padrões mantidos.
- Preset/comando/saída explícitos conforme
  [configuração Vercel](https://vercel.com/docs/project-configuration/vercel-json).
  Conteúdo remoto/recursos iguais ao pipeline local comprovam saída SSG efetiva;
  leitura administrativa do dashboard/log completo ainda não foi realizada nesta execução.

Reprodução: Node 24.x, `npm run build`, depois
`node docs/prerender/tools/etapa6-http.mjs`. Ferramenta não executa scripts do site,
não modifica deployment, não envia formulários ou mensagens.

## Navegador remoto — continuação de 05/10/2026

Edge conectado, HTML e scripts reais do preview, sem substituir GTM nessa coleta.
Aplicação permaneceu no código `a0f211d`; QA executado sobre deployment documental
`3c03eef` / `AbsewHyULcjgiuNhV8ho5WLmBTL6`. Nenhum arquivo de `src`, `public`, build
ou configuração de produção foi alterado nesta continuação.

| Verificação | Resultado / evidência |
|---|---|
| 18 rotas × consentimento ausente/recusado/aceito | 54 casos aprovados; head, H1/conteúdo, preço de PDP, imagens e console de hidratação em [navegador](evidence/etapa6-browser.json) |
| Confirmação após interação React | 18 rotas: abrir Gerenciar cookies e recusar; exatamente um title/description/canonical e IDs JSON-LD únicos em [hidratação interativa](evidence/etapa6-post-hydration.json) |
| Sem scripts / storage lança erro | 18 rotas por modo, 36 resultados finais aprovados em [frames](evidence/etapa6-frames.json) |
| Nove PDPs | Foto 2/indicador, notas, acordeão, dez details, preço e duas ações comerciais disabled em [UI](evidence/etapa6-pdp-ui.json) |
| Pop-up / navegação | Home→modal, reload com estado de fundo, voltar/avançar, página completa, X desktop/mobile, drawer→FAQ, filtros, 404→home, URL codificada e query em [fluxos](evidence/etapa6-browser.json) |
| Formulários sem scripts | Home: campos/submit disabled; criadores: campos sem names e submit disabled, [DOM](evidence/etapa6-forms-off.json). Nenhum cadastro externo enviado |
| Responsivo | Produção/preview × home/Zeus × 390×844, 768×900, 1024×900 e 1440×900; 16 casos sem overflow/imagem quebrada. [Medidas/capturas](evidence/etapa6-responsive-scaled.json) |
| Análise reproduzível | [Script](tools/etapa6-analyze.mjs), [resultado](evidence/etapa6-analysis.json); não transforma pendências em aprovação |

Fixture [etapa6-frame.mjs](tools/etapa6-frame.mjs) atende somente loopback 4178 e
embute URL real do preview/produção, sem proxy ou alteração do HTML recebido.
`off` usa sandbox sem scripts; `blocked` usa origem opaca, causando erro de storage;
`normal` mantém scripts e origem. Esses modos não representam todas as políticas de
todos os navegadores. Cookies do iframe podem ter partição diferente da aba principal.

Override de viewport apresentou aplicação inconsistente na sessão. Largura CSS do
iframe foi confirmada no DOM; `fit=1` escala somente apresentação da fixture para
capturar larguras maiores, preservando viewport CSS do site. Capturas amplas inicialmente
recortadas foram substituídas pelas `etapa6-fit-*`. Não constituem emulação integral de
celular. Fontes/dimensões da PDP coincidem nas medidas; vídeo/animação e scrollbar
podem estar em momentos diferentes nas capturas. Não há certificado de identidade de pixels.

Dois primeiros casos de storage foram lidos antes do efeito de cookies; repetidos
aguardando região visível, passaram. Contagem inicial de filtro duplicava links de
imagem/Comprar; corrigida para produtos únicos. Drawer teve confirmação adicional por
pathname/H1 da FAQ, pois seu H2 já existia na PDP. Histórico bruto dessas observações
foi preservado, separado dos resultados finais pelo analisador.

## Validadores e prévia social

Schema.org recebeu HTML bruto completo de home, Zeus e FAQ: **zero erros e avisos**;
WebSite/Organization, Product/BreadcrumbList e FAQPage com 21 perguntas reconhecidos.
[Relatório](evidence/etapa6-schema.json), [captura Zeus](evidence/etapa6-schema-zeus.png).
Demais PDPs compartilham modelo já confrontado com dados no gate e HTTP; não foram
enviadas individualmente ao validador externo.

Google Rich Results recebeu HTML bruto de Zeus: Breadcrumb válido; Product não
elegível por falta de `offers`, `review` ou `aggregateRating`.
[Resultado](evidence/etapa6-rich-results-summary.txt), [motivo](evidence/etapa6-rich-results-product.txt).
Não declarar Product aprovado para rich results. Essa restrição já estava prevista no
plano: compras continuam desativadas; não inventar oferta ou avaliações para eliminar aviso.

OpenGraph.xyz leu home e Zeus remotamente: título específico e imagem pública de
1200×630 carregados; zero erros. [Home](evidence/etapa6-opengraph-home.txt),
[Zeus](evidence/etapa6-opengraph-zeus.txt), [card](evidence/etapa6-opengraph-zeus.png).
Avisos de comprimento/CTA são heurísticas editoriais da ferramenta, não defeitos SSG.
Imagem compartilhada existente foi preservada. A simulação social não comprova cache
ou exibição em todos os aplicativos; nenhum WhatsApp/mensagem foi enviado.

## PageSpeed remoto — desempenho ainda não aceito

API pública havia retornado [429](evidence/etapa6-pagespeed-access.json); interface web
oficial funcionou nesta continuação. Medições alternadas, URLs públicas reais, Moto G Power,
4G lento, Lighthouse 13.5.0 / HeadlessChromium 153.0.8010.36, carregamento inicial.
Produção SPA estável comparada com preview SSG. Não misturar com benchmark loopback
da Etapa 5. Não há dados CrUX. SEO Lighthouse **100** em home/Zeus medidos; não comprova
indexação, demais rotas ou elegibilidade de Product. Header noindex do preview mantido.

| Série / variante | Amostras | FCP mediano ms | LCP mediano ms | TBT mediano ms | CLS |
|---|---:|---:|---:|---:|---:|
| Home baseline | 3 | 3322 | 9430 | 280 | 0 |
| Home SSG | 3 | 3608 | 8780 | 168 | 0 |
| Zeus baseline, série inicial | 3 | 3355 | 8260 | 72 | 0 |
| Zeus SSG, série inicial | 3 | 3337 | 6959 | 112 | 0 |
| Zeus baseline, série complementar | 3 | 2732 | 8001 | 56 | 0 |
| Zeus SSG, série complementar | 3 | 3324 | 5890 | 68 | 0 |
| Zeus baseline, conjunto completo | 6 | 3336 | 8257,5 | 64 | 0 |
| Zeus SSG, conjunto completo | 6 | 3334 | 6061 | 90 | 0 |

[18 relatórios/URLs individuais](evidence/etapa6-pagespeed.json),
[medianas calculadas](evidence/etapa6-analysis.json). Três pares complementares foram
coletados para investigar TBT, sem descartar ou selecionar amostras. Home: LCP −6,9%,
TBT −40%; Zeus no conjunto: LCP −26,6%, **TBT +40,6% (+26 ms)**. FCP da série complementar
varia mais, embora mediana do conjunto permaneça próxima. Ganho de LCP observado não
significa ganho uniforme nem elimina o gate de TBT >10%.

Na amostra Zeus 3, [SSG](evidence/etapa6-tbt-ssg-zeus3.txt) tem GA4 158 ms, GTM 74 ms,
entry própria 54 ms; [baseline](evidence/etapa6-tbt-baseline-zeus3.txt) tem GA4 99 ms,
GTM 74 ms, entry própria 63 ms. Terceiros predominam nessa amostra e custo da entry
própria não aumenta. Isso **não isola causa** nem autoriza atribuir toda regressão à rede.
TBT só inclui tarefas na janela FCP→TTI; não somar excessos arbitrariamente.
Domínios, toolbar e execução dos tags podem influenciar comparação. Nenhum GTM/GA4,
consentimento ou mídia foi alterado para obter nota artificialmente melhor.

## Pendências para aceite completo

1. Investigar diferença consistente de TBT da PDP acima do gate de 10%, com trace e
   condições equivalentes de consentimento/tags. Não mudar comportamento comercial
   ou adiar tracking sem causa comprovada. Performance permanece não aceita.
2. Completar cenários da matriz da Etapa 5 ainda não repetidos no remoto: consentimento
   expirado, bundle lento/bloqueado, observer ausente/reduced motion, gestos antes da
   hidratação, formulário por Enter e sequência completa de tracking. Bytes locais/remotos
   já coincidem; isso dá confiança no QA local, mas não equivale a repetir tais cenários
   no preview. Coleta atual não certifica pacotes/eventos reais de analytics.
3. Dashboard/log completo e disponibilidade/permissão de rollback. Aba do deployment
   ficou em **Log in to Vercel**; solicitado login manual, ainda não recebido.
   Produção estável `8a02e4a` identificada; elegibilidade administrativa não comprovada.
   [Procedimento oficial](https://vercel.com/docs/instant-rollback), sem executar rollback.

Etapa 6 **não está 100%**. Etapa 7 permanece pendente e não autorizada. Servidor QA e
overrides temporários são encerrados após coleta; evidências/pendências versionadas
na branch `prerender`, sem publicação em produção.
