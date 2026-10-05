# Etapa 7 — publicação controlada

Iniciada em 05/10/2026, por autorização explícita do usuário. **Merge realizado e smoke
técnico em produção aprovado; encerramento operacional pendente.** Acesso administrativo
à Vercel é manual, conforme [AGENTS.md](../../AGENTS.md). Não declarar Fase 7 integralmente
concluída antes das confirmações administrativas e do acompanhamento previsto.

## Resultado da publicação — 05/10/2026

- Fast-forward `prerender` → `main` e push concluídos em
  `7e86dc69833ba62d8d9f6ecb7a77db4cdd43442b`; [referências remotas confirmadas](evidence/etapa7-git-release.json).
- SSG observado em <https://www.arquetypus.com.br/> às **15:27 BRT**, em 05/10/2026.
  [Espera pública registrada](evidence/etapa7-publication-wait.json): home/Zeus passaram
  a corresponder ao build local na quarta consulta. SHA/ID administrativo não pode ser
  inferido apenas desses bytes; confirmação manual permanece pendente.
- [HTTP de produção](evidence/etapa7-production-http.json): 306 verificações de rotas,
  19 HTMLs e 92 recursos passaram na primeira tentativa. Dois recursos tiveram falha
  de transporte; [repetição GET/HEAD](evidence/etapa7-production-retest.json) passou com
  bytes, MIME e ETag corretos, completando 94 recursos. Tentativas originais preservadas.
- Todos os HTMLs iniciais correspondem ao build: title, description, H1, conteúdo,
  nove preços/descrições e JSON-LD sem depender de JavaScript. Páginas válidas sem
  `noindex`/`none` em meta/header, incluindo HEAD. Redirects/query, 404 própria, tipos
  e cache aprovados. HTML e recursos comparados com o mesmo build local.
- [Chrome em produção](evidence/etapa7-production-chrome.json): 18 páginas públicas,
  head único, nove PDPs/preços, 13 observações funcionais de modal/página completa,
  foto/notas, aceite/recusa persistidos, FAQ, 404→home, reload do pop-up, voltar/avançar
  e fechar. Console sem erros/avisos observados; nenhum mismatch identificado.
  [Captura do pop-up](evidence/etapa7-production-popup.png) inspecionada visualmente.
- Scripts GTM/gtag presentes; entrega de eventos aos serviços externos ainda não
  certificada. Preferência final do navegador de QA ficou em recusa, após testar ambas.
- [Host canonical](evidence/etapa7-canonical-host.json): URLs sem www redirecionam 308
  para www preservando caminho. Canonicals mantêm host anterior sem www, conforme
  decisão de preservar SEO/URLs existentes; eventual alinhamento de host fica separado.
- [Consolidação reproduzível](evidence/etapa7-production-analysis.json), por
  `node docs/prerender/tools/etapa7-analyze.mjs`, passou. Nenhuma correção na aplicação
  foi necessária. Provas pós-deploy ficam em `prerender`; `main` mantém release validada.
- Nenhuma operação administrativa Vercel, alteração de configuração ou rollback
  foi automatizada. Base anterior `8a02e4a` permanece referência de recuperação.

Pendências operacionais: logs/Ready/Current/SHA/ID administrativos, elegibilidade
atual de retorno, recebimento real GA4, responsável e acompanhamento em 24–48 h.
Janela proposta de revisão: **06/10/2026 15:27 a 07/10/2026 15:27 BRT**. Nenhuma tarefa
automática foi criada. Acompanhamento será realizado quando acionado pelo usuário.

## Preparação anterior ao merge — histórico

- Candidato enviado: `fa31acc0f4312c9a676de366ba11470c4cb9d98d`, branch `prerender`.
- Base estável reconferida no remoto: `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2`, `main`.
- `main` é ancestral do candidato; 17 commits à frente, nenhum exclusivo em `main`.
  Fast-forward possível na conferência atual. Nenhum merge/push em `main` foi feito.
- Aplicação aceita na [revisão final da Etapa 6](etapa6-fechamento.md), com limitações
  preservadas. As mudanças desta preparação são ferramentas de QA e documentação.
- Novo `npm run build` completo passou: configuração Vercel/139 casos, TypeScript,
  cliente, servidor, smoke SSR, pré-renderização e verificação de 19 HTMLs/91 recursos.
  Warning de chunk >500 kB e cinco avisos de Navigate nos testes negativos preservados;
  nenhuma falha nas rotas publicáveis. Reprodução utiliza instalação existente e
  lockfile preservado; não equivale a nova instalação limpa por `npm ci`.
- Preview público reconferido em [HTTP](evidence/etapa7-preview-http.json): 306
  verificações de rotas e 19 documentos aprovados, 93 recursos aprovados na tentativa
  inicial. GET de `/icon-512.png` passou com bytes corretos; HEAD teve falha de
  transporte. [Repetição isolada](evidence/etapa7-preview-retest.json) passou GET/HEAD,
  tipo, hash e ETag; 94 recursos aceitos após repetição. Tentativa inicial preservada.
- Toolbar identifica `dpl_CmmVpH6mm8rL4y6K3cGaHoaHPpPr`. Correlação desse deployment
  com SHA, estado Ready e logs depende da confirmação manual solicitada ao usuário.
- Chrome: home → pop-up Zeus → página completa → reload, head único, preço, recusa de
  cookies persistida, FAQ/acordeão, 404 → home e console sem erros/avisos observados.
  [Coleta](evidence/etapa7-chrome-preview.json). Leitura de `window.dataLayer` não
  comprova eventos neste adaptador; entrega externa não foi certificada nesta coleta.
  [Captura final da home](evidence/etapa7-preview-home.png) preservada; aba QA fechada.
- [Produção antes da publicação](evidence/etapa7-production-before.json): home e Zeus
  continuam com root vazio; URL inexistente responde 200. É retrato da SPA anterior,
  não aprovação nem regressão da release ainda não publicada.

## Fluxo atual autorizado: merge e validação após deploy

Em 05/10/2026, o usuário informou que o site ainda não foi lançado e autorizou
explicitamente merge em `main` e validação após o deploy no domínio principal.
Essa instrução substitui a proposta anterior de build Staged e de desligar atribuição
automática de domínios. Não é necessário mudar configurações da Vercel para esse fluxo.

1. Agente reconfere remoto, preserva documentação/evidências da preparação e integra
   `prerender` em `main`, sem force-push. Se `main` tiver avançado, revisar diferenças
   e retestar antes da integração.
2. Push em `main` aciona a integração Git existente. Agente aguarda mudança do HTML
   público no domínio principal e verifica HTML/assets do mesmo build. Não opera
   painel Vercel, configurações, promoção ou rollback.
3. Agente executa smoke HTTP/Chrome em produção. Estado Ready/Current, SHA, URL/ID e
   logs administrativos são confirmados manualmente pelo usuário, quando necessários.
   HTML público sozinho não prova SHA administrativo do deployment.
4. Se o domínio não mudar porque atribuição automática estiver desligada, usuário
   realiza promoção manual do deployment correto. Não reativar configuração por conta
   do agente. Não presumir que autorização de merge permite automatizar painel.

Build de produção é reconferido após deploy, incluindo ausência de noindex nas URLs
válidas. Não presumir identidade com preview. Referência de funcionamento da integração
Git e promoção: [documentação Vercel](https://vercel.com/docs/deployments/promoting-a-deployment).

## Verificações prontas para build Staged e domínio oficial

Ferramenta existente foi ampliada somente para QA. Preserva padrão da Etapa 6 e permite
saídas separadas, sem sobrescrever histórico. Faz GET/HEAD, redirects, query, 404, HTML
bruto, preços/descrições, JSON-LD, recursos/ETag/cache e comparação com build local.
Modo `production` também impede `noindex`/`none` em headers GET/HEAD de páginas válidas
e nas meta tags de robôs. HTTP 404 continua noindex. A comparação ignora somente
toolbar de preview e `lastmod` volátil do sitemap, conforme ferramenta anterior.

```powershell
# Substituir URL abaixo pela URL específica recebida do build Staged:
node docs/prerender/tools/etapa6-http.mjs https://URL-DO-STAGED.vercel.app docs/prerender/evidence/etapa7-staged staged

# Executar depois de o deploy autorizado chegar ao domínio principal:
node docs/prerender/tools/etapa6-http.mjs https://www.arquetypus.com.br docs/prerender/evidence/etapa7-production production
```

Modo de produção executado e aprovado no domínio oficial nesta coleta.
Rebuild diferente exige reconstrução local do commit efetivo, sem relaxar comparação
de HTML/assets para fazer o teste passar. A ferramenta não acessa painel administrativo.

Smoke Chrome após publicação: home, nove PDPs, páginas institucionais, modal/reload/
histórico, FAQ, cookies/consentimento e console; head/meta social sem duplicação,
preços/links/fotos corretos. Recebimento de analytics deve ser conferido pelo usuário
no painel Google existente, se disponível, sem enviar eventos sintéticos de compra.

## Retorno e acompanhamento

Critérios de retorno: 404 em página válida, asset quebrado, mismatch de hidratação,
perda de navegação ou tracking relevante. Usuário executa **Instant Rollback** para
deployment estável `8a02e4a` após conferir elegibilidade; agente verifica domínio no
Chrome e HTTP. Não confundir rollback do domínio com reversão da branch `main`.
Referência: [Instant Rollback](https://vercel.com/docs/instant-rollback).

Responsável proposto pelo acompanhamento administrativo: usuário; agente realiza
checagens quando acionado. Confirmar responsável e horário de publicação. Revisar
24–48 h após liberação: erros/hidratação, rotas/assets e analytics. Inspeção de home,
PDP e sitemap no Search Console é manual, se acesso existir; indexação exige tempo.
Nenhuma automação de acompanhamento ou telemetria nova foi criada.

## Pendências para encerramento

- [ ] Identidade/logs do preview candidato e destino de retorno reconfirmados.
- [x] Usuário autorizou merge e validação posterior; build Staged dispensado.
- [x] Release integrada em `main`; deployment público identificado pelos artefatos.
- [x] Domínio principal entrega build novo; HTML/assets reconferidos.
- [x] Smoke HTTP/Chrome em produção aprovado, incluindo indexabilidade técnica.
- [ ] Tracking externo/consentimento conferidos e responsável/horário registrados.
- [ ] Acompanhamento 24–48 h previsto e evidências finais preservadas.

Não marcar Etapa 7 concluída por autorização, commit, merge ou estado Ready isolados.
