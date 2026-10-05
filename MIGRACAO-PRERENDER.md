# Migração: pré-renderização no build

Plano consolidado em **04/10/2026**, incorporando a revisão Sol High e a segunda revisão
técnica independente, ambas confrontadas com o código existente.
Execução futura: **uma etapa por vez**, com evidências de aceite e um commit por etapa de código.

**Recomendação:** manter Vite, React, React Router e Vercel; gerar HTML estático no build
e hidratar o aplicativo existente. Não há necessidade demonstrada de SSR por requisição,
Next.js, mudança de hospedagem ou biblioteca de pré-renderização.

**Veredito:** aprovado com ajustes incorporados neste documento.
**Estado da validação:** TypeScript e build passaram na primeira revisão; não foram
reexecutados na segunda revisão nem na consolidação documental. Não confundir esses
resultados da SPA com validação de SSR/SSG ainda não implementado.
A migração ainda não foi implementada. Hidratação, paridade visual e roteamento na Vercel
só poderão ser aprovados depois dos testes das etapas correspondentes.

**Etapa 0 executada em 04/10/2026:** baseline local e preview da branch validados; checks e reprodução limpa
aprovados; artefatos públicos correspondem aos locais, com acréscimo de feedback Vercel no HTML da home do preview.
Usuário informou Node Vercel `24.x` e forneceu prints da produção atual `8a02e4a`, URL específica
e histórico anterior `3833162`. Disponibilidade/permissão de rollback ainda não comprovada pelos prints;
confirmar junto do ambiente efetivo do build antes da publicação. **Produção somente ao final do plano,
conforme determinação do usuário.** Evidências em [baseline](docs/prerender/baseline.md).

## 1. Necessidade, benefícios e limites

Hoje `index.html` contém um `root` vazio; `main.tsx` usa `createRoot`; `vercel.json`
reescreve todas as rotas para a home. `useSeo` só atualiza o head depois que o JS executa.
Isso funciona para navegação humana com JS, mas não entrega conteúdo e metadados próprios
de cada página na resposta inicial.

| Resultado | O que a migração entrega | Limite |
|---|---|---|
| HTML por URL | Texto, produto, preço exibido, links e imagens na resposta inicial | Conteúdo muda quando houver novo build/deploy |
| SEO técnico | Title, description, canonical e dados estruturados disponíveis sem executar JS | Não garante indexação nem posição no Google |
| Compartilhamento | Metadados próprios da PDP para robôs de prévia | Imagem continua a existente; plataformas podem manter cache |
| Primeira apresentação | Conteúdo pode aparecer antes de baixar/executar React | Melhoria de FCP/LCP depende de medição; JS não diminui automaticamente |
| Hospedagem | HTML estático servido pela CDN, sem servidor React por requisição | Não implementa backend, checkout ou persistência |
| Erros de URL | Status HTTP correto e página 404 própria | Deve preservar tratamento atual de produto inexistente |
| Robustez | Conteúdo e links disponíveis sem JS | Filtros, pop-ups, carrosséis automáticos e formulários continuam dependendo de JS |

Dados e rotas são conhecidos no build; SSG é compatível com esse cenário.
Essa conclusão é uma aplicação da [orientação de pré-renderização do Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg)
ao código encontrado neste repositório.

### Comparação de abordagens

| Abordagem | Avaliação neste projeto |
|---|---|
| Permanecer SPA | Mantém funcionamento, mas conserva HTML inicial vazio e prévias genéricas |
| SSG próprio com Vite + React | Recomendado: 18 rotas, dados locais e stack preservada |
| SSR por requisição | Complexidade sem benefício demonstrado para dados atuais; reavaliar com conteúdo dinâmico |
| Trocar para framework | Desnecessário para resolver este problema; ampliaria risco e escopo |
| Capturar páginas com navegador no build | Não recomendado: efeitos, consentimento, tracking e timers tornam captura mais frágil |

React 19 também oferece [`prerender`](https://react.dev/reference/react-dom/static/prerender),
voltado à geração estática e capaz de aguardar suspensão. É alternativa opcional;
`renderToString` atende à árvore síncrona atual. Pré-renderização nativa do React Router
exige [Framework Mode](https://reactrouter.com/7.18.4/start/framework/rendering), diferente
do modo declarativo usado aqui. Não migrar de modo/framework para resolver este escopo.

## 2. Diagnóstico confirmado e correções do plano anterior

Base inspecionada: commit `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2`, branch `main`.
Versões instaladas: React/React DOM **19.2.8**, React Router DOM **7.18.2**, Vite **8.2.1**.
Node usado na validação: **24.19.0**.

| Item | Evidência atual | Ação necessária |
|---|---|---|
| Rotas | 9 entradas em `PAGINAS_PUBLICAS` + 9 produtos de `ARCHETYPES` | Gerar 18 páginas e 404, sem outra lista manual |
| Dados | Conteúdo local; nenhuma busca de API necessária para montar páginas atuais | Renderizar no build; publicar novamente quando dados mudarem |
| Tema | `aplicar()` acessa `document` durante import; store sem `getServerSnapshot` | Guardas de ambiente e snapshot padrão estável |
| Direção visual | Boutique + Âmbar + Elegant; switcher desligado | Atributos corretos no HTML antes da primeira pintura |
| Cookies | Inicializador de estado consulta storage | Primeira renderização neutra; leitura em efeito |
| Formulário de cupom | `onSubmit` bloqueia envio; campos `email`/`whatsapp`, sem method/action | Desabilitar controles e envio até hidratação; impedir GET com dados pessoais |
| Hero e galeria | Vídeo/CSS podem iniciar antes dos efeitos e listeners React | Testar e sincronizar mídia, barra, timers e eventos de animação |
| Consulta de produto | `getArchetype` acessa objeto comum sem verificar propriedade própria | Validar associação real ao catálogo; testar `constructor`, `toString` e `__proto__` |
| Reveal | CSS esconde `.reveal-init` sem depender de JS | Conteúdo visível sem JS e recuperação se bundle falhar |
| Carrossel infinito | `useLayoutEffect`; `activeIndex` inicia em `count`, não em zero | Verificar pintura inicial/centralização; não reescrever hook preventivamente |
| Head | Metadados, FAQPage e noindex dependem de efeitos | Modelo puro compartilhado pelo build e pelo cliente |
| Produtos | `status: 'ok'`, mas botão de compra desativado, texto “Em breve” e sem checkout | Não inferir oferta comprável somente de `status` |
| Pop-up | `backgroundLocation` vem de estado do histórico | Testar reload/restauração; pathname sozinho não garante hidratação compatível |
| Produto inexistente | `ProductPage` usa `<Navigate to="/" replace />` | Preservar destino home; não trocar silenciosamente por página 404 |
| 404 geral | Página própria, mas resposta SPA 200 | Entregar página equivalente com HTTP 404 no acesso direto |
| Bundle | JS atual 628,63 kB minificado; aviso acima de 500 kB | Registrar baseline; otimização de bundle fica separada |

Validação registrada na primeira revisão: `tsc -b` e `npm run build` passaram; `dist/` continha os três
arquivos SEO gerados. O aviso de tamanho de chunk já existe e não será escondido aumentando
o limite. Tentativa de leitura do domínio público pela ferramenta web falhou; esta revisão
não certifica que o deploy atual corresponda exatamente ao commit local.

### Defeitos removidos do plano anterior

1. Proibição de merge antes do aceite final contradizia liberação antecipada da Etapa 1.
   Agora toda implementação fica na branch até o aceite completo.
2. Usar um objeto padrão calculado uma vez, igual no servidor e na primeira hidratação.
   Com switcher desligado, `atual` não é necessariamente instável; snapshot padrão explícito
   torna o contrato verificável. Não refatorar presets/direções desligadas preventivamente.
3. Assets do SSR não devem ser presumidos iguais aos do cliente: comparar URLs e arquivos.
4. `og:type` de produto precisa voltar a `website` ao navegar para outras páginas.
   Aplicar estado completo do head a cada navegação, inclusive limpeza de JSON-LD e noindex.
5. Preço de aceite deve vir dos dados, não de um literal “79,90”. Valores e NBSP
   de `Intl.NumberFormat` podem variar de representação sem alterar preço.
6. Produto inválido não pode receber novo comportamento visual sem decisão explícita.
7. “Escapar `<` como `<`” não protege JSON-LD. Usar escape literal `\u003c`.
8. React recuperar uma divergência não é garantia de segurança. Mismatch bloqueia publicação;
   não usar `suppressHydrationWarning` nem remontagem geral para ocultar defeitos.
9. FAQPage não deve ser requisito de rich result do Google: recurso foi encerrado em
   maio/2026, conforme [atualizações oficiais](https://developers.google.com/search/updates).
10. `PreOrder` significa produto disponível para encomenda antecipada, não lista de espera,
    conforme [Schema.org](https://schema.org/PreOrder). Não fazer esse mapeamento.

### Riscos da segunda revisão e tratamento obrigatório

Nenhum risco crítico identificado. Classificações abaixo indicam prioridade antes de publicar.

| Nível | Risco | Tratamento / etapa |
|---|---|---|
| Alto | Formulário expõe email/WhatsApp na URL antes de JS | Controles desabilitados no servidor e primeiro cliente; testar Enter/clique — 1, 4 e 5 |
| Alto | Tema, cookies ou histórico produzem árvores diferentes | Snapshot e contrato de hidratação; testar restauração do modal — 1, 3 a 5 |
| Alto | Rewrite entrega home nas rotas ou head fica genérico/duplicado | Verificar documento por GET e proprietário único de SEO — 2, 4 e 6 |
| Médio | Autoplay, CSS e timers começam em momentos diferentes | Definir início coerente; teste com hidratação lenta — 1 e 5 |
| Médio | HTML antecipado aumenta disputa por recursos | Inspecionar preloads, vídeo e waterfall; não otimizar sem evidência — 5 e 6 |
| Médio | Slug herdado de Object.prototype é tratado como produto | Verificação de propriedade própria/allowlist derivada — 3 a 6 |
| Médio | Reveal oculta conteúdo ou hidratação altera scroll/interação | Falha recuperável, sem reocultar; testes antes da hidratação — 1 e 5 |
| Médio | Redirect de produto inexistente muda semântica HTTP | Documentar compromisso e testar separadamente de 404 geral — 0 e 6 |

O formulário atual depende de `preventDefault()` em React. Sem JS, o método padrão é GET
e campos nomeados podem ir para URL, histórico e logs, conforme
[HTML form](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form).
Proteger a interação inicial é parte necessária da migração, sem implementar envio/backend.

## 3. Contrato de transparência e limites de escopo

### Invariantes

- Preservar layout, copy, H1, ordem das seções, preços, imagens, fontes, cores e duração
  das animações; `Reveal` continua com 0,5 s no fluxo normal.
- Preservar pop-up por rota, estados de filtros, fechar/voltar/avançar, scroll do container,
  links compartilhados, âncoras e comportamento de sacola existente.
- Preservar Consent Mode antes do GTM, chave/versão/validade do consentimento e eventos atuais.
- Não ativar checkout, busca, quiz, kit, seções desligadas, persistência ou formulários de backend.
- Não atualizar dependências nem lockfile nesta migração. Sem nova dependência de runtime/build.
- Não adicionar Playwright/Puppeteer ao projeto; usar ferramentas já disponíveis ou QA manual.
- Não publicar códigos internos `cod`/`ARQ-…`, `aggregateRating`, reviews ou GTIN não confirmados.
- Manter `PAGINAS_PUBLICAS` e `ARCHETYPES` como fontes das URLs; registro derivado é permitido.
- Manter geração de `robots.txt`, `sitemap.xml` e `llms.txt`; não criar cópias manuais em `public/`.
- Manter `og-image.jpg` atual como padrão. Artes sociais novas e títulos com volume ficam fora
  desta migração, como já decidido em `CLAUDE.md`.
- Ler `AGENTS.md` e `CLAUDE.md` antes de cada execução; registrar conflitos novos antes de avançar.

“Transparente” significa **sem regressão para visitante**, não bytes iguais nem mesma espera
até a primeira pintura. Mostrar conteúdo mais cedo é parte do benefício. CookieBanner só
pode ser exibido após consulta ao storage; atraso e animações precisam de QA sob rede lenta.

### Contrato de URLs

| URL / situação | Comportamento esperado |
|---|---|
| `/` e outras 17 URLs públicas | HTTP 200, HTML da própria rota, canonical oficial |
| `/loja/<id>` com acesso direto sem estado de pop-up | PDP completa, hidratação |
| `/loja/<id>` aberta pelo catálogo | Pop-up sobre fundo atual, sem reload de documento |
| Reload/restauração com `backgroundLocation` | Preservar comportamento observado na baseline; não hidratar árvore diferente |
| `/arquetipos/<id>` | Redirect HTTP 308 para `/loja/<id>` no acesso direto; comportamento SPA mantido |
| `/kit-descoberta` | Redirect HTTP 307 para `/`; não reativar kit |
| `/loja/<id-inexistente>` | Preservar destino home; redirect HTTP 307 no acesso direto |
| `/qualquer-coisa` ou caminho desconhecido não coberto por redirect | HTTP 404, página própria com noindex |
| URL válida com query de campanha | Mesmo conteúdo/canonical sem query; query preservada na navegação e tracking |
| URL válida com barra final | Normalização para URL sem barra, exceto `/` |

**Inventário canônico confirmado:** `/`, `/criadores`, `/sobre`, `/perguntas-frequentes`,
`/entrega-e-frete`, `/trocas-e-devolucoes`, `/regras-do-site`, `/privacidade`, `/termos-de-uso`;
mais `/loja/` com `afrodite`, `imperatriz`, `cleopatra`, `fada`, `sereia`, `zeus`,
`guerreiro`, `imperador`, `fenix`. Esta enumeração documenta o diagnóstico; implementação
deve derivar rotas dos dados. `/trocas` e `/termos` não existem: não criar aliases silenciosamente.

O 307 de produto inexistente é compromisso para preservar destino home. Hoje há resposta
SPA 200 seguida de navegação cliente: o novo status altera semântica HTTP. Não o apresentar
como preservação byte a byte ou benefício SEO. Um 404 seria semanticamente mais adequado
para recurso inexistente, mas depende de decisão explícita de mudar esse contrato.

Inventariar também variantes de capitalização aceitas pelo Router atual. Páginas públicas
que já abrem com caixa diferente devem normalizar para canonical; IDs de produto seguem
regra atual de `getArchetype`. Não presumir equivalência entre matching do Router e filesystem.

404 real é propriedade da resposta HTTP inicial. Navegação interna da SPA não emite nova
resposta de documento; verificar também abertura direta e reload.

## 4. Arquitetura recomendada

### 4.1 Renderizar aplicativo existente

Entrada de servidor com `renderToString`, `StaticRouter`, `App` e mesmos providers do cliente.
Não importar CSS da entrada de servidor; usar CSS produzido pelo build cliente.
Não usar `renderToStaticMarkup`, porque o resultado precisa ser hidratado.

Hoje não há `lazy`/`Suspense` no caminho renderizado. Se isso mudar, reavaliar renderer:
`renderToString` não aguarda suspensão, conforme [React](https://react.dev/reference/react-dom/server/renderToString).
Não introduzir code splitting de rotas durante esta migração.

### 4.2 Head por modelo puro compartilhado

Preferir **funções puras e dados compartilhados** a um coletor mutável preenchido durante render.
Build e navegador usam o mesmo resolvedor por URL; efeitos só aplicam resultado ao DOM.
Isso evita depender da ordem de renderização, de efeitos SSR inexistentes ou de callbacks duplicados.

- Criar módulo puro, por exemplo `src/lib/seoModel.ts`, com `SITE`, marca, tipos,
  formatadores e resolvedor do head. Não importar páginas, Node ou renderer nesse módulo.
- Compartilhar metadados institucionais existentes, preservando strings integralmente.
  Colocá-los em `PAGINAS_PUBLICAS` é opção organizacional, não requisito; evitar duplicação.
- Compartilhar fórmula atual de título/descrição da PDP com o build; preservar `SEO_HOME`.
- Centralizar aplicação em um componente `RouteSeo`, dentro do Router, fora dos dois
  conjuntos de `Routes`, considerando **URL real**, inclusive pop-up.
- Remover aplicações concorrentes de SEO das páginas/`LegalPage`; manter seus títulos e
  conteúdo visível. Migrar efeitos de FAQPage/noindex para o mesmo proprietário do head.
  O hook `useSeo` pode continuar como mecanismo de aplicação do modelo compartilhado.
  Metadados nativos do React 19 são opcionais; não misturar dois proprietários das tags.
- JSON-LD deve ter IDs estáveis e um registro de scripts pertencentes ao app; atualizar,
  adotar scripts do HTML inicial e remover os que deixarem de valer. Não apagar scripts GTM.
- Cada atualização define title, description, canonical, OG completo e robots; transições
  PDP → home, FAQ → PDP e 404 → home não podem deixar dados da página anterior.

Como o pop-up pode manter a home montada, scripts não podem ser controlados somente pelo
unmount da home. Descritor da URL resolve esse caso sem depender de qual árvore permaneceu aberta.

### 4.3 Assets e saída estática

- Cliente produz `dist/`, manifest e assets; servidor produz `dist-server/` privado.
- Mesma configuração de `base`, nomes de assets e limites de inline nos dois builds.
- Começar com resolução padrão do Vite. Resolver customizado só se comparação demonstrar
  divergência concreta; não criar remapeamento preventivamente.
- Validar cada URL local emitida no HTML/JSON-LD, inclusive `srcset`, poster, preload, CSS,
  scripts e recursos de `public/`. Não copiar assets SSR indiscriminadamente para esconder mismatch.
- Se nomes divergem, resolver imports pelo manifest **do cliente** antes de renderizar;
  não alterar só o HTML e deixar a primeira árvore cliente com URLs diferentes.
- Começar com `dist/index.html` para `/`, `dist/sobre.html`, `dist/loja/zeus.html` etc.
  e `dist/404.html`. `cleanUrls` mapeia `.html` para URL sem extensão; escolha evita alternar
  formatos no meio do plano. Comportamento final deve ser comprovado no preview.
- Manifest é referência de build, não uma nova lista de rotas.

O Vite prevê [manifest de assets e builds não cliente](https://vite.dev/config/build-options.html#build-manifest);
emissão SSR é desativada por padrão. A Vercel documenta [cleanUrls e normalização](https://vercel.com/docs/project-configuration/vercel-json).

### 4.4 Dados estruturados: publicar somente fatos

- Organization e WebSite: dados reais de `EMPRESA`/`CONTATOS`, logo com URL absoluta,
  `@id` estável e `inLanguage: pt-BR`. Não inventar endereço comercial adicional ou SearchAction.
- PDP: Product e BreadcrumbList com nome/sobrenome, descrição existente, foto real da PDP,
  marca, tipo e `sku: a.id`; sem código interno. `@id` baseado na URL canonical.
- Extrair mapas da galeria para módulo compartilhado de mídia, por exemplo
  `src/data/productMedia.ts`; SEO não deve importar componente `ProductPurchase` para acessar imagem.
- **Neste estado do site, omitir Offer:** compra está desativada, indica “Em breve” e
  conflita com mensagem de estoque. Ausência de checkout, isoladamente, não define validade
  de uma oferta; informações comerciais verdadeiras e consistentes são o critério.
  Não converter `status: 'ok'` sozinho em oferta ativa, nem `wait` em `PreOrder`.
- Quando venda real estiver habilitada e validada, ligar Offer ao Product por `offers`
  aninhado ou referência `@id`, com preço atual de `a.preco`, BRL, condição e disponibilidade
  reais. Não usar preço riscado como preço de venda nem inventar validade de promoção.
- GTIN futuro pertence ao Product; não ao Offer. Sem reviews/aggregateRating até validação dos dados.
- Preservar FAQPage existente exclusivamente na FAQ, com tokens convertidos em texto
  pelo mesmo conteúdo atual; validar em Schema.org, sem exigir rich result de FAQ.

Product sem Offer/review/aggregateRating pode ser semanticamente válido sem elegibilidade
para product snippets. Essa restrição vem do [Google](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
Completar benefício comercial depende de venda real; não deve bloquear a geração de HTML.

## 5. Execução passo a passo

**Regra de avanço:** implementar apenas etapa solicitada, verificar aceite, registrar evidências,
fazer commit quando autorizado no fluxo de execução e parar. Falha impede próxima etapa.
Nada desta revisão autoriza executar etapas ou publicar agora.

### Etapa 0 — baseline e preparação

1. Conferir `git status`, regras locais e commit que realmente está em produção.
   Preservar alterações do usuário; não resetar, sobrescrever nem trocar branch com conflito.
2. Criar/usar branch `prerender`. Nenhuma etapa de implementação entra antecipadamente em `main`.
3. Confirmar Node/npm usados localmente e na Vercel; usar lockfile com `npm ci` na reprodução
   limpa, sem atualizar versões. Preferir patch atual suportado do mesmo major, sem upgrade incidental.
4. Rodar `npx tsc -b`, `npm run build` e registrar warning já conhecido.
5. Guardar baseline durável em `docs/prerender/baseline.md`: SHA, comandos, versões,
   18 URLs, metadados por rota, comportamento de URL inválida e URLs dos deploys.
6. Capturar home, uma PDP, FAQ e 404 a 390 × 844 e 1440 × 900; guardar capturas antes/depois
   fora de `dist/`, que é apagado no build. Registrar consentimento e instante do carrossel.
7. Verificar reload do pop-up, voltar/avançar e restauração do histórico. `BrowserRouter`
   lê `history.state.usr` na versão instalada; não presumir que reload elimina estado.
8. Medir home e PDP com mesma ferramenta/configuração, três execuções por URL: mediana de
   FCP, LCP, CLS, TBT e bytes HTML/JS/CSS. Registrar cache e viewport. Não confundir TBT com INP real.
9. Registrar deploy de produção estável e acesso disponível para rollback.

**Aceite:** baseline reproduzível, visual e navegação registrados, ambiente compatível.
Se produção não puder ser lida, marcar pendência e manter bloqueio de publicação, não de análise local.
Commit, se houver arquivos de evidência: `Documenta baseline para a pré-renderização`.

### Etapa 1 — segurança SSR e apresentação inicial

Arquivos: `theme.ts`, `CookieBanner.tsx`, `Reveal.tsx`/`useInView.ts`, `index.css`,
formulário de `HomePage.tsx`, hero `Cinema.tsx`, `ProductGallery.tsx` se necessário,
`index.html` quando necessário e plugin `arquivosSeo` em `vite.config.ts`.

1. Proteger `aplicar()` com guarda de `document` e inicialização contra ausência de `window`.
   Não ampliar trabalho para caminhos desligados do switcher sem bloqueio reproduzido.
2. Criar snapshot padrão resolvido uma vez, referencialmente estável; passá-lo como terceiro
   argumento de `useSyncExternalStore`. Exportar atributos padrão do HTML da mesma resolução.
   Snapshot servidor e primeira hidratação devem coincidir, conforme
   [React](https://react.dev/reference/react/useSyncExternalStore).
3. CookieBanner começa invisível em servidor e primeira renderização cliente; efeito consulta
   consentimento e decide exibição. Preservar evento de reabrir preferências.
4. Tornar Reveal visível sem JS. A marca de JS/habilitação das animações precisa de mecanismo
   de liberação se inicialização falhar ou observer não existir; classe `.js` permanente no
   head, sozinha, não basta. Definir estratégia mínima a partir da pintura inicial e dos
   testes de falha; watchdog é opção, sem prazo arbitrário obrigatório de quatro segundos.
   Confirmar prontidão quando observadores estiverem instalados. Após fallback, não reocultar conteúdo
   quando JS atrasado chegar. Preservar duração/curva e evitar flash após primeira pintura.
   Demonstrar JS normal, desativado, lento e bundle bloqueado; cancelar eventual watchdog ao confirmar
   inicialização, sem alterar autoplay. Se estratégia falhar em QA, revisar antes de avançar.
5. No plugin SEO, guardar `!!c.build.ssr` em `configResolved` e não gerar arquivos no build SSR.
   Preservar geração no cliente e comportamento de desenvolvimento.
6. Não alterar `useLayoutEffect` do carrossel somente por existir; a rotina depende de medidas.
   Ajustar apenas se ensaio mostrar problema, mantendo centralização e gestos.
7. No formulário de cupom, desabilitar controles e envio no servidor e na primeira renderização
   cliente; habilitar somente após hidratação. `fieldset disabled` é uma opção. Testar Enter
   e clique; não depender apenas de `onSubmit`, classe JS ou troca do tipo do botão.
   Preservar comportamento atual após hidratação; não implementar envio ou backend.
8. Definir início coerente para vídeo autoplay, barra CSS e timer React do hero. Vídeo/CSS
   podem avançar antes do efeito; não presumir sincronismo por terem mesma duração.
   Preservar durações e autoplay normal, com alteração mínima demonstrada por QA.
   Verificar também animação de dica da galeria e eventos que possam terminar antes de
   listeners existirem. Não modificar carrosséis sem problema reproduzido.

**Aceite:** TypeScript/build passam; site SPA continua equivalente; cookies aceitos/recusados,
storage bloqueado, Reveal e movimento reduzido funcionam; três arquivos SEO continuam no cliente.
Formulário permanece seguro antes da hidratação; início de mídia/animações tem contrato definido.
Testes de HTML pré-renderizado sem JS serão completados na Etapa 4.
Commit: `Prepara tema, consentimento e animações para renderização no build`.

### Etapa 2 — modelo SEO compartilhado e ciclo de vida do head

1. Implementar arquitetura da seção 4.2; extrair metadados atuais sem reescrever strings.
2. Criar construtores puros de Organization/WebSite, Product/BreadcrumbList e FAQPage.
   Compartilhar mídia conforme seção 4.4; Offer fica omitido no estado atual.
3. `RouteSeo` aplica head uma vez por URL real. Deve existir antes do envio assíncrono
   de `page_view`; verificar ordem efetiva no navegador, não presumir pela ordem do JSX.
4. Manter OG image padrão e seus width/height/alt; definir/resetar `og:type`.
   Não inventar Twitter title/description diferentes: se adicionados, usar mesmo descritor.
5. Fazer adoção e reconciliação por IDs dos scripts SEO; atualizar por conteúdo estável,
   sem ciclos causados por objetos novos e sem apagar scripts de terceiros.
6. 404 fica noindex; ao sair, remover noindex de propriedade do app.
   No arquivo 404 genérico, não gerar canonical/og:url para a URL fictícia usada no build.
7. Fazer testes pequenos de contratos reais: mesmos títulos/descrições anteriores,
   canonical sem query, dados estruturados por URL e transições sem dados residuais.

**Aceite:** TypeScript/build passam; todas as URLs têm metadados iguais aos atuais quando
aplicável; pop-up ganha metadados do produto sem alterar interface; FAQ → PDP → home e
404 → home deixam exatamente head esperado; tracking não duplica.
Commit: `Compartilha metadados entre o navegador e a pré-renderização`.

### Etapa 3 — entrada de servidor e prova de compatibilidade

1. Criar `src/entry-server.tsx`, usando `StaticRouter` e `renderToString`.
   Exportar rotas derivadas, atributos de tema e função `render(url)` que retorna HTML
   e descritor puro do head. Não usar contexto global mutável para acumular SEO.
2. Criar script de smoke SSR: renderizar as 18 rotas e uma URL inexistente, sem entregar
   esse ensaio ao navegador ainda. Falhar diante de erro ou render inesperadamente vazio.
3. Fazer build cliente com manifest e build SSR em diretórios distintos. A entrada SSR
   deve usar `NODE_ENV=production` ao executar; alinhar modo de render e build.
4. Comparar todas as referências locais com saída cliente; incluir globs de fotos e nomes
   com mesmo basename em pastas diferentes. Comparar conteúdo/URL, não só basename.
5. Renderizar duas rotas seguidas e repetir primeira; head não pode vazar entre renderizações.
6. Registrar warnings SSR e conferir export `StaticRouter` na versão instalada.
   Não usar caminho antigo `react-router-dom/server` sem verificar exports.
7. Validar slug por associação real a `ARCHETYPES`, incluindo propriedade própria na consulta
   usada por `getArchetype`. Testar os nove válidos e `constructor`, `toString`, `__proto__`.
   Corrigir esse limite de lookup sem refatorar catálogo; valores herdados não são produtos.

**Aceite:** 18 renders completos + 404, tema padrão consistente, nenhum acesso indevido ao DOM,
referências de assets resolvidas e metadados sem contaminação. TypeScript/build atuais passam.
Ainda não alterar roteamento Vercel nem inicialização cliente.
Commit: `Adiciona entrada de servidor e valida renderização das rotas`.

### Etapa 4 — geração de páginas e hidratação

1. Criar `scripts/prerender.mjs`. Ler template cliente uma vez antes de sobrescrever home.
   Injetar HTML em marcador explícito e head em pontos controlados. Regex pontual é aceitável
   para template conhecido, com contagem de correspondências; não tentar parser HTML genérico.
2. Validar rotas únicas, ausência de `..`/query/hash, destinos dentro de `dist` e colisões
   com assets públicos. Garantir um único root preenchido e um único conjunto de metadados.
3. Gerar arquivos no formato da seção 4.3, com `data-rota` somente nas páginas conhecidas.
   Não marcar arquivo 404 com URL fictícia como rota hidratável.
4. Escapar atributos/title com entidades HTML; serializar JSON-LD com proteção de script:

   ```js
   const json = JSON.stringify(data).replace(/</g, '\\u003c')
   ```

   Não aplicar escape de entidades HTML ao JSON inteiro. Testar texto contendo `</script>`.
   Inserir strings com função de substituição para evitar interpretação de `$&`/`$1`.
5. Não publicar template parcial: qualquer rota/asset/head inválido faz processo sair com
   erro. Validar conjunto completo antes de considerar `dist` publicável.
   Criar já nesta etapa versão inicial de `scripts/verify-prerender.mjs`, com total de rotas,
   head obrigatório, JSON parse e existência de recursos; pipeline não pode referenciar
   script que só será criado na etapa seguinte.
6. `main.tsx`: `hydrateRoot` apenas quando rota e estado inicial são compatíveis.
   Dev com root vazio usa `createRoot`; 404 genérica usa caminho cliente compatível com URL atual.
   Query/hash não entram na chave de HTML quando não alteram primeira árvore.
7. Inspecionar `backgroundLocation` persistido. Na ocorrência comprovada, fallback explícito
   de `createRoot` pode preservar montagem de pop-up atual; testar ausência de flash PDP → modal.
   Não limpar histórico nem impor PDP completa no reload para facilitar hidratação.
   Se não houver paridade, resolver antes de avançar; fallback não dispensa QA.
8. Passar `onRecoverableError` à hidratação para registrar erro e componentStack no console;
   usar monitoramento existente se houver, sem adicionar SDK/envio externo.
   Qualquer mismatch em URL válida sem estado excepcional bloqueia aceite.
9. Definir comandos separados, com execução sequencial:

   ```json
   {
     "build:client": "vite build --manifest",
     "build:server": "vite build --ssr src/entry-server.tsx --outDir dist-server",
     "prerender": "node scripts/prerender.mjs",
     "verify:prerender": "node scripts/verify-prerender.mjs",
     "build": "tsc -b && npm run build:client && npm run build:server && npm run prerender && npm run verify:prerender"
   }
   ```

   Configurar ambiente production do renderer de modo portátil Windows/Linux dentro do
   script, antes da importação dinâmica de React/entrada SSR; imports estáticos são antecipados.
   Resolver arquivos em relação a `import.meta.url` e usar `pathToFileURL` quando importar
   caminho absoluto do disco, inclusive Windows. Não adicionar `cross-env` só para isso.
10. Ignorar `dist-server/`; publicar somente `dist/`. Não expor fontes SSR nem arquivo de fallback SPA
    indexável. Desenvolvimento continua `vite`, sem servidor React por requisição.
11. Confirmar limpeza da saída cliente antes de gerar rotas; HTML de produto removido não
    pode sobreviver. Repetir build limpo com mesmas fontes e comparar inventário, referências
    de assets e metadados semânticos. Campos temporais existentes, como `lastmod`, devem ser
    identificados; não exigir igualdade binária falsa nem ocultar divergências de conteúdo.

**Aceite:** build gera 18 páginas + 404; sitemap tem mesmas 18 canonicals; todos os recursos
locais existem; title/canonical/JSON-LD corretos no HTML bruto; sem `ARQ-…` e sem CookieBanner
no HTML. Hidratação passa em todas as rotas conhecidas.
Commit: `Gera HTML estático por rota e hidrata o aplicativo existente`.

### Etapa 5 — verificação local completa

1. Ampliar `verify-prerender.mjs` criado na Etapa 4, sem dependência nova, derivando URLs
   das mesmas fontes exportadas pelo build. Verificar total, duplicatas, head, tema,
   JSON parse, ausência de conteúdo interno e todos os tipos de referências de assets.
2. Comparar preço/nome de cada produto com dados, dentro de H1 e seção de compra; normalizar
   entidades/NBSP somente nas asserções semânticas. Não normalizar diferenças para aprovar
   hidratação: HTML servidor e primeira árvore cliente precisam coincidir.
   Checar que JSON-LD não inventa Offer e mantém foto/nome corretos.
   Usar parser HTML disponível em ferramentas de QA ou DOMParser sobre resposta bruta no
   navegador, sem executar scripts do documento analisado. Busca de substring em todo HTML
   não comprova conteúdo: ignorar script/JSON-LD/noscript nas asserções de texto principal.
3. Testar todos os HTMLs, inclusive 404, com JS ligado/desligado, consentimento ausente,
   aceito/recusado/expirado e storage bloqueado. Não editar fixtures de produção para isso.
4. Como saída usa `.html` com cleanUrls, configurar preview local específico ou servidor estático
   de QA para mapear URLs sem extensão e emitir 404. `vite preview` padrão não certifica
   regras Vercel; também abrir arquivos `.html` correspondentes para inspecionar resposta bruta.
5. Bloquear bundle JS e verificar textos/imagens acessíveis após recuperação de Reveal.
   Testar JS lento, observer indisponível e `prefers-reduced-motion`.
   No carrossel infinito, conferir também itens visíveis antes de JS centralizar scroll.
   `activeIndex = count` sozinho não prova blur/ocultação inicial; verificar pintura real. Se necessário,
   aplicar fallback somente sem JS/na falha, sem alterar carrossel no funcionamento normal.
6. Comparar capturas com baseline. Sincronizar slide, consentimento, fontes carregadas e instante;
   observar primeira pintura e hidratação além da captura final. Não exigir pixels de frames
   diferentes nem mascarar regressões de layout como animação.
7. Inspecionar waterfall antes/depois: React 19 pode emitir preloads de imagens; vídeo com
   `preload="auto"` ou mídia escondida por CSS pode disputar rede. Verificar recursos realmente
   baixados, prioridades e duplicação antes de adicionar preloads/otimizações.
8. Bloquear/atrasar JS e testar formulário por clique e Enter, sem dados pessoais reais:
   nenhuma navegação/requisição pode incluir campos do formulário. Após hidratação,
   comportamento continua igual ao baseline. Repetir para outros formulários existentes.
9. Testar barra/vídeo/slide, dica da galeria, scroll e hash com hidratação lenta; iniciar
   scroll/interação antes de JS terminar. Efeitos não podem desfazer interação do visitante.
10. Executar matriz abaixo e critérios de HTML bruto a seguir. TypeScript e build completo
    precisam passar; inspecionar console além de `onRecoverableError`, pois divergências
    de atributos também podem aparecer como warnings.

| Grupo | Casos mínimos |
|---|---|
| URLs | 18 diretas, reload, query UTM, âncora, barra final e URLs antigas |
| Head | PDP → PDP, PDP → home, home → pop-up, FAQ → PDP, 404 → home |
| Hidratação | Console sem erro/warning de mismatch em visita fria e consentimento salvo |
| Pop-up | Abrir/fechar por ✕, Esc, fundo, arraste; ver página completa; reload; back/forward |
| Home | Hero, destaque, carrossel infinito, filtros gênero/família, âncoras e scroll |
| PDP | Todas as fotos, notas, acordeões, ritual; botões desativados continuam desativados |
| Global | Drawer, rodapé, gerenciar cookies e formulários com comportamento existente |
| Tracking | Um `page_view` por navegação esperada, título correto, consentimento antes do GTM |
| Sem JS | Conteúdo visível, links de navegação nativos e acordeões; sem exigir ações JS |
| Falha JS | Conteúdo não permanece oculto; recursos públicos carregam; sem erro novo normal |
| Antes da hidratação | Formulário sem envio nativo; scroll/hash preservados; vídeo/barra/slide coerentes |
| Viewports | 390 × 844 e 1440 × 900; conferir também 768 px e borda do breakpoint 1024 px |

#### Critérios de HTML bruto por rota

Executar GET direto para cada uma das 18 URLs no preview; registrar primeiro status sem
seguir redirects automaticamente, headers e corpo. Repetir inspeção nos artefatos locais.
HEAD sozinho não comprova conteúdo. O verificador deve registrar aprovado/reprovado por URL.

| Elemento | Asserção objetiva |
|---|---|
| Documento canônico | HTTP 200 e HTML daquela rota, não fallback home |
| Head | Exatamente um title, description e canonical, com valores do modelo esperado |
| H1 | Identidade esperada dentro do conteúdo principal, fora de scripts |
| Corpo | Trechos principais específicos da rota fora de scripts/JSON-LD/noscript |
| Nove PDPs | Nome/sobrenome no H1, preço de `a.preco` na compra, descrição e conteúdo do produto correto |
| Assets | Referências públicas válidas, sem `/src`, caminhos locais ou bundle servidor |
| Navegação | Links internos e URLs canônicas preservados |

Asserções mínimas para páginas destacadas, preservando copy atual:

| Rota | H1 / identidade esperada e corpo |
|---|---|
| `/` | “Qual versão de você quer expressar hoje?” no primeiro slide e conteúdo principal |
| `/criadores` | “Um arquétipo.” e “O seu, de verdade.”, considerando quebra de linha |
| `/privacidade` | “Política de Privacidade” e corpo da política |
| `/trocas-e-devolucoes` | “Política de Trocas e Devoluções” e corpo da política |
| `/termos-de-uso` | “Termos de Uso” e corpo dos termos |

Aplicar mesmas verificações às quatro institucionais restantes e a cada um dos nove slugs.
Preço atual é R$ 79,90 para os nove, mas expectativa deve vir dos dados. Preço não é requisito
de páginas institucionais. Separação entre spans/br pode exigir comparação por segmentos;
isso não autoriza ignorar divergência de hidratação. Comparar conteúdo comercial bruto e
conteúdo após hidratação. Produto presente somente em JSON-LD não satisfaz este aceite.

**Aceite:** artefatos, capturas e resultados em `docs/prerender/`; nenhum defeito de hidratação,
recurso ausente ou diferença funcional nova. Medianas de desempenho registradas.
Commit: `Valida artefatos e paridade da pré-renderização`.

### Etapa 6 — roteamento Vercel e preview

1. Atualizar `vercel.json` com schema, `cleanUrls: true`, `trailingSlash: false` e redirects
   do contrato. Remover rewrite genérico somente quando todas as páginas já estiverem geradas.
2. Derivar matcher de IDs válidos de `ARCHETYPES` para redirect de produto inexistente,
   com escaping e testes. Não escrever segunda lista manual. Se configuração ficar materializada
   em `vercel.json`, gerá-la antes do deploy e verificar drift no build; não contar com edição
   tardia do arquivo após a plataforma já ter lido configuração.
3. Validar matcher contra todos os IDs válidos, IDs desconhecidos, prefixos, segmentos extras,
   query, barra final, `.html`, codificação de URL e capitalização. Incluir `constructor`,
   `toString` e `__proto__`. Evitar redirect que capture produto válido ou crie loop.
4. Confirmar Framework Preset Vite, Build Command completo e Output Directory `dist`.
   Overrides no dashboard não podem deixar deploy executando apenas `vite build`.
5. Push/preview somente na execução autorizada da etapa. Verificar preview protegido:
   autenticação pode impedir bots e validadores; não desativar proteção automaticamente.
6. Confirmar preview não indexável por proteção/header da plataforma. Canonicals e URLs
   estruturadas continuam apontando domínio oficial. Não embutir noindex de preview no
   artefato que será publicado em produção.
7. Fazer GET e HEAD, registrar status, Location, Content-Type e corpo quando aplicável:

| Requisição | Resultado |
|---|---|
| Cada URL pública sem extensão | 200, HTML correto |
| `/loja/zeus/` | 308 para `/loja/zeus`, sem loop |
| `/loja/zeus.html` | 308 para URL limpa |
| `/arquetipos/zeus` | 308 para PDP; query de campanha preservada |
| `/kit-descoberta` | 307 para `/` |
| `/loja/nao-existe` e nomes herdados inválidos | 307 para `/`; preserva destino, altera status HTTP atual |
| `/trocas` e `/termos` | 404; aliases não fazem parte do escopo |
| `/qualquer-coisa` e `/loja/zeus/extra` | 404 com página própria e noindex |
| Arquivo asset inexistente | 404; não retornar home com Content-Type HTML e status 200 |
| robots, sitemap, llms, fontes, fotos, favicon | 200 e tipo de conteúdo adequado |

8. Testar **corpo e status** da 404. Não assumir que basta existir `404.html`; se preview não
   entregar página/status corretos, ajustar mecanismo Vercel suportado e retestar. Nunca
   resolver com rewrite catch-all 200. Configuração alternativa deve preservar normalização
   e redirects; não misturar `routes` legado com propriedades incompatíveis.
9. Repetir matriz da Etapa 5 no preview. Validar Schema.org com HTML; Rich Results Test só
   para tipos elegíveis. Limitações de proteção e ausência de Offer não são falhas de SSG.
10. Medir desempenho em três execuções equivalentes por URL, sem misturar local/produção
    ou dispositivos. Meta de SEO Lighthouse ≥95 é indicador, não prova de indexação.
    Bloquear regressão consistente acima de 10% em LCP/TBT, novo CLS relevante (>0,02)
    ou perda funcional; investigar variação de rede antes de atribuir causa.
11. Prévia social pode ser inspecionada por ferramenta de debug/leitura sem envio a pessoas.
    Não enviar mensagens de WhatsApp para testar. Proteção de preview pode exigir validação
    final no domínio oficial após publicação, com rollback pronto.
12. Atualizar `CLAUDE.md` e README para descrever SSG, build, restrições e novo roteamento.
    Regra de não remover rewrite passa a explicar quando e por que foi substituído.
13. Conferir cache efetivo: HTML não deve receber cache imutável prolongado; assets com hash
    podem usar cache imutável. Não sobrescrever padrões da plataforma sem necessidade.
    Confirmar que HTML e assets pertencem ao mesmo build/deployment, inclusive após promover.

**Aceite:** todas as rotas, redirects, 404, assets e paridade aprovados no deploy Vercel;
SHA/build/deploy conferidos, pendências documentadas e rollback disponível.
Commit: `Configura rotas estáticas e valida preview na Vercel`.

### Etapa 7 — publicação controlada, smoke e rollback

1. Entregar relatório final de aceite com SHAs, URLs, capturas, metadados e métricas.
   Obter autorização de publicação nesse fluxo futuro, caso ainda não exista.
2. Identificar deployment estável anterior e confirmar mecanismo de retorno antes do merge.
3. Merge em `main` apenas após Etapa 6 aprovada. Conferir que deploy usa commit aprovado
   e pipeline completo; promover artefato validado quando fluxo da Vercel permitir.
   Publicar HTML e assets juntos no mesmo deployment; não copiar HTML isoladamente sobre
   assets de outra versão. Se houver novo build na promoção, repetir validação dos artefatos.
4. Smoke em produção: home, 9 PDPs, institucionais, redirects, 404, assets, noindex ausente
   das URLs válidas, GTM/consentimento e metadados sociais.
5. Observar erros JS/hidratação, 404 inesperadas e tracking após liberação. Agendar/verificar
   acompanhamento em 24–48 h e depois dados de indexação quando disponíveis.
   Não criar automação, conta ou nova telemetria sem autorização.
6. Search Console, se acesso já disponível: inspeção de home/PDP e sitemap. Não iniciar
   “mudança de endereço”: domínio e URLs canonicals permanecem os mesmos.

**Rollback:** página válida com 404, asset quebrado, mismatch, perda de navegação ou tracking
relevante exige retorno ao deployment estável e investigação na branch. A
[Vercel documenta rollback de deployment](https://vercel.com/docs/instant-rollback);
conferir permissões e disponibilidade no projeto. Reverter commits é alternativa posterior,
pois depende de outro build; não é a única resposta para incidente imediato.

**Aceite final:** produção aprovada no smoke, evidências preservadas, nenhum defeito novo e
responsável pelo acompanhamento definido. Não marcar concluído somente porque merge terminou.

## 6. Melhorias recomendadas depois da migração

Estas melhorias dependem de medição ou decisões já adiadas; não são pré-requisitos para SSG.

| Melhoria | Quando fazer |
|---|---|
| Reduzir JS das direções visuais desligadas | Medir bundle; etapa separada para não introduzir suspensão na migração |
| Otimizar fotos/LCP e fontes | Após baseline; preservar recorte e qualidade, preload só de recurso crítico comprovado |
| Ajustar `lastmod` do sitemap | Usar data real de alteração significativa ou omitir quando não houver fonte; não inventar datas por build |
| `prerender` ou metadados nativos React 19 | Somente se simplificarem solução comprovadamente; não são pré-requisitos |
| OG 1200 × 630 por produto | Quando artes aprovadas existirem; alterar image/alt/dimensões no mesmo modelo SEO |
| Offer completo | Após condições reais de oferta e disponibilidade confirmadas e coerentes com interface |
| GTIN no Product | Após códigos oficiais fornecidos e validados |
| Avaliações estruturadas | Após autenticidade e elegibilidade confirmadas |
| Backend, carrinho persistente, quiz, kit | Projetos próprios; não ligar recursos durante SSG |

`llms.txt` é preservado como recurso existente, sem tratá-lo como garantia de ranking ou
presença em respostas de IA. Google esclarece seu uso nas
[atualizações oficiais](https://developers.google.com/search/updates).

Para `lastmod`, seguir [orientação Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap):
data de mudança significativa, não data automática de cada build. Melhoria separada não
bloqueia SSG; registrar comportamento atual na comparação entre builds.

## 7. Registro de execução

Preencher a cada etapa; evidência ausente significa **pendente**, nunca “aprovado por suposição”.

| Etapa | Estado | Commit / deploy | Evidências |
|---|---|---|---|
| Revisão inicial Sol High | Concluída; tsc/build da SPA passaram nessa revisão | Base `8a02e4a` | Inspeção local e fontes oficiais; sem implementação |
| Segunda revisão independente | Aprovado com ajustes | Mesma base inspecionada | Riscos de formulário, mídia, slugs, recursos e contrato HTTP incorporados |
| Consolidação documental | Concluída; somente este plano alterado | Sem implementação | Ajustes obrigatórios/opcionais e critérios por rota integrados; build não reexecutado |
| 0 — Baseline | Local e preview validados; produção identificada; disponibilidade de rollback pendente | Branch `prerender`, código-base/produção `8a02e4a`; documentação enviada em `db5790e` e `e0e829f` | [Baseline](docs/prerender/baseline.md) e [preview](docs/prerender/preview.md); 18 rotas, capturas, 6 auditorias locais; Node configurado `24.x` informado; prints de produção registrados; confirmar rollback antes de publicação final |
| 1 — Segurança SSR | Concluída; build, contratos locais e preview aprovados | Código `6422a93` na branch `prerender`; check Vercel success; preview publicado | [Etapa 1](docs/prerender/etapa1.md); oito hidratações isoladas, três cenários estáticos/falha, 18 rotas/SEO/preços, navegação e capturas desktop/móvel; arquivos SEO cliente/dev preservados |
| 2 — SEO compartilhado | Implementação e aceite local aprovados; preview pendente | Branch `prerender`; aguardando commit/push | [Etapa 2](docs/prerender/etapa2.md); 18 descritores, nove Products/Breadcrumbs, FAQ exata, 27 passos/26 page_view e hidratação sem erros |
| 3 — Ensaio SSR | Pendente | — | — |
| 4 — SSG e hidratação | Pendente | — | — |
| 5 — QA local | Pendente | — | — |
| 6 — Vercel/preview | Pendente | — | — |
| 7 — Produção/rollback | Pendente | — | — |

Para iniciar: **“Execute somente a Etapa 0 de MIGRACAO-PRERENDER.md e pare após registrar
as evidências.”** Para continuar, solicitar explicitamente a próxima etapa; não agrupar etapas
nem interpretar revisão deste documento como autorização de migração/publicação.
