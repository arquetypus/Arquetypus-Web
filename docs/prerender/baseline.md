# Baseline — Etapa 0 da pré-renderização

Coleta em 04/10/2026. **Baseline local e preview da branch validados; confirmação administrativa de produção pendente.**
Nenhuma implementação de SSR/SSG, alteração do aplicativo ou dependência do projeto.
Documentação enviada na branch `prerender`; preview informado pelo usuário validado posteriormente.

## Origem e ambiente

| Item | Valor verificado |
|---|---|
| Commit do código | `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2` |
| Data do commit | 04/10/2026, 18:58:25 -03:00 |
| Branch inicial / de trabalho | `main` → `prerender` |
| Estado inicial | Somente `MIGRACAO-PRERENDER.md` não rastreado; preservado |
| Node / npm local | 24.19.0 / 12.0.2; Windows x64 |
| React / React DOM | 19.2.8 / 19.2.8 |
| React Router DOM | 7.18.2 |
| Vite / TypeScript / Tailwind | 8.2.1 / 6.0.3 / 4.3.3 |
| Node requerido por Vite | `^20.19.0 || >=22.12.0`; Node local atende |
| Lockfile SHA-256 | `2d8e945866d6a4594de425084a6d54eec73ad93d35ac69f7b9f623fd3b9352d6` |
| Node efetivo na Vercel | Pendente; dashboard exigiu login |
| Build local servido | `http://127.0.0.1:4173/`, Vite preview do build de produção |

Regras de `AGENTS.md` e `CLAUDE.md` lidas. Adiamento histórico de pré-renderização em
`CLAUDE.md` foi superado somente para esta preparação pelo pedido de executar Etapa 0.
Rewrite SPA permanece intacto. Ver [ambiente completo](evidence/environment.json).

## Verificações de build e reprodução limpa

| Check | Resultado | Evidência |
|---|---|---|
| `npx tsc -b` | Exit 0 | [Log](evidence/tsc.txt) |
| `npm run build` | Exit 0; 178 módulos | [Log](evidence/build.txt) |
| `npm ci --offline --no-audit --no-fund` em pasta temporária isolada | Exit 0; 48 pacotes | [Log](evidence/npm-ci.txt) |
| Build do `git archive HEAD` nessa instalação limpa | Exit 0 | [Log](evidence/clean-build.txt) |
| JS/CSS da reprodução limpa versus workspace | SHA-256 idênticos | [Hashes](evidence/clean-build-hashes.json) |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Gerados; sitemap com 18 URLs | Saída atual de `dist/`; inventário em [HTTP](evidence/http-baseline.json) |

Node via NVM precisou de execução fora do sandbox; PATH foi ajustado somente para os
processos da tarefa. Criação da branch também precisou desse acesso. Nenhuma versão foi atualizada.
Logs PowerShell incluem avisos npm em stderr representados como `NativeCommandError`;
os códigos de saída acima são 0, sem erros de TypeScript ou Vite.

Warning existente: chunk minificado acima de 500 kB. JS `index-CEBNf12q.js`:
**628.636 bytes**, gzip informado pelo Vite 158,64 kB. CSS `index-C9zeGloN.css`:
**159.720 bytes**, gzip 26,68 kB. Não alterar limite para ocultar warning.

HTML do build isolado difere em bytes por CR/LF: 94 caracteres CR adicionais;
demais caracteres idênticos. Essa diferença foi diagnosticada, não ignorada por suposição.
Ver [comparação](evidence/template-line-endings.json) e [primeira diferença](evidence/template-difference.json).
Não transportar essa normalização para esconder divergência de hidratação na migração.

## Produção pública e limites da identificação

Entrada pública: <https://arquetypus.com.br/>. Destino observado:
<https://www.arquetypus.com.br/>. Todas as 18 rotas passaram por **308 de domínio → 200**.
Canonical atual aponta para domínio **sem www**; registrar essa divergência antes de
definir normalização na Etapa 6. Nenhum domínio/canonical foi alterado nesta etapa.

Comparação pública versus build do workspace:

| Artefato | Resultado |
|---|---|
| Documento inicial | Byte a byte idêntico ao `dist/index.html` local |
| `/assets/index-CEBNf12q.js` | 200; 628.636 bytes; SHA-256 `8dd28071ec6d13cef6a12f9c2165a39222d353541ca851b4ab840cd1a99ff5e7` |
| `/assets/index-C9zeGloN.css` | 200; 159.720 bytes; SHA-256 `b4d18dd42e53e96610a5ee60c688a94f7e6fb38e4bca08412c13317de05583af` |

**Isso comprova equivalência desses artefatos, não identidade do deployment, seu SHA ou
configuração de build.** ID/URL imutável do deployment ativo, SHA administrativo,
Node configurado e deployment anterior para rollback continuam pendentes.
`https://vercel.com/dashboard` redirecionou para login; não havia sessão autenticada.
Informações solicitadas ao usuário durante a coleta, sem impedir verificações locais.

O endpoint público respondeu, mas nenhum rollback foi testado, nenhum deployment foi
promovido e nenhum acesso administrativo foi confirmado. Publicação futura exige resolver
essas pendências. `x-vercel-id` nas respostas identifica requisição, não deployment.

Ver [status, redirects, headers e hashes por rota](evidence/http-baseline.json) e
[HTML bruto público](evidence/production-index.html).

### Acesso ao preview da branch

Preview informado pelo usuário:
<https://arquetypus-parfum-git-prerender-saniella.vercel.app/>.
Inicialmente, home, `/loja/zeus` e `/robots.txt` responderam HTTP 302 para login Vercel.
Após o usuário reenviar a URL, acesso público respondeu 200 e validação foi concluída.
Nenhuma proteção foi alterada pelo agente. [Registro inicial preservado](evidence/preview-access.json).

As 18 rotas, nove produtos, metadados cliente e navegação examinada correspondem ao baseline.
JS/CSS, robots, sitemap e llms são idênticos aos artefatos locais. Todas as 24 respostas HTML
testadas têm `X-Robots-Tag: noindex`. A home tem acréscimo diagnosticado do feedback Vercel;
restante do documento é idêntico. HTML continua SPA com root vazio, conforme esperado na Etapa 0.

Ver [relatório do preview](preview.md), [resumo objetivo](evidence/preview-validation.json),
[HTTP por rota](evidence/preview-http-baseline.json) e [metadados comparados](evidence/preview-metadata-client.json).
Isso não aprova a migração nem resolve identificação administrativa de produção/rollback.

## Inventário das 18 rotas e conteúdo cliente

Todas entregam inicialmente mesmo documento: root vazio, **zero H1 bruto**, title e
canonical da home. JS monta conteúdo e altera head depois. As descrições completas,
canonicals, OG, H1 segmentado, trechos de conteúdo e JSON-LD de cada rota estão em
[metadata-client.json](evidence/metadata-client.json), coletado no navegador sobre build local.
HTML/JS/CSS locais correspondem aos públicos conforme comparação acima.

| Rota | Title após JavaScript | H1 visual |
|---|---|---|
| `/` | Arquetypus \| Body Splash Premium e Perfumaria de Arquétipos | Qual versão de você quer expressar hoje? — primeiro slide |
| `/criadores` | Programa de Criadores \| Arquétypus Parfum | Um arquétipo. / O seu, de verdade. |
| `/sobre` | Sobre Nós: Perfumaria de Arquétipos \| Arquétypus Parfum | Sobre a Arquétypus |
| `/perguntas-frequentes` | Perguntas Frequentes \| Arquétypus Parfum | Perguntas frequentes |
| `/entrega-e-frete` | Entrega e Frete \| Arquétypus Parfum | Política de Entrega e Frete |
| `/trocas-e-devolucoes` | Trocas e Devoluções \| Arquétypus Parfum | Política de Trocas e Devoluções |
| `/regras-do-site` | Regras de Compra \| Arquétypus Parfum | Regras do Site |
| `/privacidade` | Política de Privacidade \| Arquétypus Parfum | Política de Privacidade |
| `/termos-de-uso` | Termos de Uso \| Arquétypus Parfum | Termos de Uso |
| `/loja/afrodite` | Afrodite First Kiss – Body Splash Premium \| Arquétypus Parfum | Afrodite / First Kiss |
| `/loja/imperatriz` | Imperatriz Velvet Dynasty – Body Splash Premium \| Arquétypus Parfum | Imperatriz / Velvet Dynasty |
| `/loja/cleopatra` | Cleópatra Nile Rose – Body Splash Premium \| Arquétypus Parfum | Cleópatra / Nile Rose |
| `/loja/fada` | Fada Pure Light – Body Splash Premium \| Arquétypus Parfum | Fada / Pure Light |
| `/loja/sereia` | Sereia Ocean Breeze – Body Splash Premium \| Arquétypus Parfum | Sereia / Ocean Breeze |
| `/loja/zeus` | Zeus Stormbreak – Body Splash Premium \| Arquétypus Parfum | Zeus / Stormbreak |
| `/loja/guerreiro` | Guerreiro Steel Blue – Body Splash Premium \| Arquétypus Parfum | Guerreiro / Steel Blue |
| `/loja/imperador` | Imperador Red Empire – Body Splash Premium \| Arquétypus Parfum | Imperador / Red Empire |
| `/loja/fenix` | Fênix Amber Burn – Body Splash Premium \| Arquétypus Parfum | Fênix / Amber Burn |

Nove PDPs exibem R$ 79,90, preço cheio R$ 99,90, Pix R$ 75,91 e 6x R$ 13,32.
Botão “Em breve” desabilitado; mensagem de estoque existente preservada. Não corrigir
copy/comportamento comercial na Etapa 0. H1 com spans pode ter `textContent` concatenado
sem espaço; JSON preserva segmentos, não inventa separadores para aprovar hidratação.

## Navegação, histórico e URLs inválidas

| Caso observado | Resultado atual |
|---|---|
| Link do catálogo para Zeus | URL `/loja/zeus`; modal “Comprar Zeus” sobre home |
| Reload desse modal | Modal e home continuam, em desktop e mobile |
| Voltar / avançar após reload | Home / modal restaurados, em desktop e mobile |
| Fechar pelo ✕ em abertura fresca | Volta à home; modal removido |
| Escape após restauração | Volta à home; modal removido |
| “Ver página completa” | Mesma URL, PDP completa sem modal; reload mantém PDP |
| Title/canonical com modal | Ainda home, apesar da URL de produto; problema já previsto para Etapa 2 |
| `/loja/nao-existe` | HTTP 200 após redirect de domínio; JS navega para `/` |
| `/arquetipos/zeus` | HTTP 200 após redirect de domínio; JS navega para `/loja/zeus` |
| `/kit-descoberta` | HTTP 200 após redirect de domínio; JS navega para `/` |
| `/qualquer-coisa`, `/trocas`, `/termos` | HTTP 200 após redirect de domínio; JS mostra 404 e robots noindex |

As URLs sem www inicialmente respondem 308 para www, inclusive os casos inválidos.
Não confundir esse redirect de domínio com redirects de aplicação, que hoje dependem de JS.
Houve timeout da ferramenta ao aguardar fechamento por ✕ após back/forward; estado foi
inspecionado, Escape fechou e nova abertura confirmou ✕ funcional. Não há prova suficiente
para atribuir defeito ao site; repetir esse caso no QA futuro.

Não foi acessado `history.state` interno pela ferramenta: preservação foi comprovada pelo
modal/home visíveis após reload/back/forward, coerente com leitura de `backgroundLocation`
no código. Ver [sequência de estados](evidence/navigation.json).

## Capturas verificadas

Capturas de viewport, não página inteira. **Cookies recusados pela interface local**, banner
ausente, fontes carregadas. Hero no primeiro slide, topo do container; tempo do vídeo mobile
registrado em [capturas](evidence/captures.json). Não exigir igualdade de pixels entre frames
de vídeo diferentes. Demais páginas no topo. Oito imagens inspecionadas visualmente.

| Página | 390 × 844 | 1440 × 900 |
|---|---|---|
| Home | [Mobile](screenshots/home-390x844.jpg) | [Desktop](screenshots/home-1440x900.jpg) |
| Zeus | [Mobile](screenshots/zeus-390x844.jpg) | [Desktop](screenshots/zeus-1440x900.jpg) |
| FAQ | [Mobile](screenshots/faq-390x844.jpg) | [Desktop](screenshots/faq-1440x900.jpg) |
| 404 | [Mobile](screenshots/404-390x844.jpg) | [Desktop](screenshots/404-1440x900.jpg) |

Evidências adicionais: [modal desktop](screenshots/modal-desktop.jpg),
[modal mobile](screenshots/modal-mobile.jpg). Consentimento ausente foi observado antes de
recusar; cenários aceito/expirado/storage bloqueado pertencem à matriz das etapas futuras.

## Desempenho de laboratório

Lighthouse **13.5.0**, Chrome headless **154.0.0.0**, build local, viewport mobile
**390 × 844**, DPR 1. Throttling simulado: RTT 150 ms, throughput 1638,4 Kbps,
CPU slowdown 4. Três navegações por URL, perfil de auditoria novo, reset de storage/cache
habilitado; sem consentimento salvo, banner inicial presente. Nenhum warning de auditoria.
Browser de QA teve atividades durante parte da coleta; máquina não estava isolada de outras
atividades. Usar mesmas condições e investigar variância antes de atribuir regressões.

| URL | FCP mediano | LCP mediano | CLS mediano | TBT mediano |
|---|---:|---:|---:|---:|
| `/` | 2.601 ms | 12.852 ms | 0 | 721 ms |
| `/loja/zeus` | 2.610 ms | 9.234 ms | 0 | 718 ms |

Transferência mediana por tipo, **incluindo recursos de terceiros**:

| URL | HTML | JS | CSS |
|---|---:|---:|---:|
| `/` | 2.437 bytes | 467.401 bytes | 121.011 bytes |
| `/loja/zeus` | 2.437 bytes | 467.401 bytes | 121.011 bytes |

Esses totais de rede não são tamanho bruto do bundle. LCP elevado é referência para comparação,
não causa diagnosticada nem autorização para otimizar o site nesta etapa. TBT não é INP.
Medidas locais não substituem desempenho real de produção/CDN.

Ver [resumo com todas as execuções e configurações](evidence/performance-summary.json).
Relatórios originais: [home 1](evidence/lighthouse-home-1.json), [home 2](evidence/lighthouse-home-2.json),
[home 3](evidence/lighthouse-home-3.json), [Zeus 1](evidence/lighthouse-zeus-1.json),
[Zeus 2](evidence/lighthouse-zeus-2.json), [Zeus 3](evidence/lighthouse-zeus-3.json).

## Reprodução e próximos gates

No workspace, com Node/NVM no PATH:

```powershell
npx tsc -b
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
# Em outro terminal:
node docs/prerender/tools/collect-http.mjs
node docs/prerender/tools/collect-environment.mjs
powershell -File docs/prerender/tools/measure.ps1
```

Ferramenta Lighthouse executada via cache externo do npm, sem dependência/lockfile do projeto.
Reprodução das métricas fixa versão 13.5.0. Scripts de coleta são ferramentas de baseline,
não entrada SSR, gerador de HTML ou verificador final de SSG. Antes de repetir, preservar
este conjunto de evidências: scripts substituem arquivos de resultados.

Para repetir instalação limpa: criar pasta temporária, copiar package/lock, executar
`npm ci`, extrair `git archive HEAD` nela e rodar build; comparar assets. Pasta usada nesta
coleta está em [registro local](evidence/clean-install-path.txt); `node_modules` do workspace
não foi substituído. Não usar esse caminho temporário como artefato de publicação.

**Gate local:** aprovado para preparação da Etapa 1 quando solicitada explicitamente.
**Gate de publicação:** pendente de ID/URL e SHA do deployment ativo, Node Vercel e
deployment anterior/permissão de rollback. Nenhuma etapa posterior foi executada.
