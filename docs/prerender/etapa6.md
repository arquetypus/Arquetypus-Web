# Etapa 6 — roteamento Vercel e preview

## Estado

Implementação, commit, push e validação HTTP remota concluídos. **Aceite completo
pendente** de navegador, desempenho e rollback. Build local aprovado (19 HTMLs,
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

## Pendências para aceite completo

- Repetir paridade/hidratação e cenários funcionais da Etapa 5 no preview.
- Três medidas equivalentes por URL e investigação do LCP da PDP; Lighthouse SEO.
- Validador externo Schema.org/Rich Results e prévia social; head/JSON-LD já passaram
  gate estrutural local aplicado aos HTMLs remotos, mas isso não equivale a ferramenta externa.
- Dashboard/log de build e disponibilidade/permissão de rollback antes de produção.
  Deployment estável identificado anteriormente; acesso/elegibilidade administrativos
  ainda não comprovados. Procedimento em
  [Instant Rollback](https://vercel.com/docs/instant-rollback), sem executar rollback.

Navegador conectado indisponível (`cua.getState`: sem browsers). Tentativa pelo plugin
Computer Use de abrir Edge terminou em `Computer Use app approval timed out`; usuário
foi informado para abrir navegador conectado. Nenhuma captura ou hidratação remota
foi certificada nesta execução. QA local da Etapa 5 continua válido, mas não substitui
repetição no preview.

Tentativa alternativa pela [API pública PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started)
retornou HTTP 429, quota excedida: [resposta](evidence/etapa6-pagespeed-access.json).
Não foi criada chave/conta nem repetida chamada indiscriminadamente. Portanto, **LCP
local da PDP +17,3% continua pendência**, sem medida remota ou ganho declarado.
Não alterar proteção do preview para melhorar nota SEO: header noindex é intencional.
Etapa 6 não deve ser marcada 100% nem autorizar Etapa 7 enquanto estas pendências persistirem.
