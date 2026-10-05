# Etapa 5 — verificação local e preservação das interações

Executada em 05/10/2026, branch `prerender`, sobre `d4fe6cc` (implementação da Etapa 4 em
`6fa0b4c`). Baseline comercial: código `8a02e4a`, compilado separadamente com as dependências
já instaladas. Nenhuma dependência, framework, URL pública, conteúdo comercial ou configuração
Vercel foi alterada. Commit desta etapa: `Valida artefatos e paridade da pré-renderização`.

**Resultado: QA local concluído, com ressalva de desempenho para investigação na Etapa 6.**
Não constitui aprovação de deploy ou produção. A configuração Vercel ainda contém rewrite
SPA; as URLs limpas remotas não estão certificadas como HTML específico de cada rota.
Push, roteamento definitivo, tags reais do GTM e aceite remoto pertencem à Etapa 6.

## Correções verificadas

| Regressão reproduzida com bundle atrasado 45 s | Correção mínima | Evidência antes/depois |
|---|---|---|
| Visitante rolava antes do JS; efeito de montagem voltava ao topo | `Layout` distingue montagem de mudança real de pathname | [Antes](evidence/etapa5-slow-before-fix.json), [depois](evidence/etapa5-slow-scroll.json): 1800 → 1800 |
| Carrossel recebido do HTML já havia sido movido; hidratação recentralizava | Primeira conexão lê scroll nativo; filtros continuam centralizando normalmente | [Antes](evidence/etapa5-slow-carousel-before-fix.json), [depois](evidence/etapa5-slow-carousel.json): 1291 preservado |
| Segunda foto escolhida antes do JS; indicador ainda dizia primeira foto | `ProductGallery` acompanha posição inicial do trilho e não inicia dica sobre gesto anterior | [Antes](evidence/etapa5-slow-gallery-before-fix.json), [depois](evidence/etapa5-slow-gallery.json): foto 2 confirmada |
| Fragmento nativo em `DOMContentLoaded` e correção tardia da âncora desfaziam rolagem anterior | Captura antes de `hydrateRoot`, restauração no próximo RAF; correção da âncora cancela diante de nova interação | [Antes](evidence/etapa5-slow-hash-before-fix.json), [depois](evidence/etapa5-slow-hash.json): 7833 preservado; visita normal à âncora mantém destino |

As mudanças ocorrem em efeitos/entrada cliente. Não modificam a primeira árvore React nem
inserem atributos no HTML para esconder divergência. `main` continua comparado byte a byte
com SSR novo no gate do build. No ensaio da âncora, a sonda de QA registra um ponto transitório
no RAF antes da restauração, no mesmo ciclo; o resultado final mantém a posição capturada.
A visita direta sem gesto a `/#catalogo` alinhou seção ao header de 56 px.

## Verificações e evidências

| Grupo | Resultado | Evidência |
|---|---|---|
| Build completo/TypeScript/SSR | 18 rotas + 404; gate sem erro | [Build](evidence/etapa5-build-output.txt), [fontes/artefatos](evidence/etapa5-build.json); `dist-server/verify-prerender.json` gerado localmente |
| Recursos e sitemap | 19 documentos, 91 recursos locais, 18 canonicals correspondentes ao sitemap | Gate ampliado em `scripts/prerender-utils.mjs` |
| GET bruto local | 38 GETs: URLs limpas e respectivos `.html`; 94 recursos incluindo robots/sitemap/llms | [HTTP](evidence/etapa5-http.json) |
| DOMParser inerte | 19/19 aprovados; texto de scripts/JSON-LD/noscript excluído das asserções | [HTML bruto](evidence/etapa5-dom.json) |
| Nome/preço/foto comercial | Nove produtos confrontados com `ARCHETYPES`; preço no bloco principal, não no ritual ou JSON-LD | Mesmo relatório; controle negativo mantém preço no ritual e insere preço falso em scripts/noscript: rejeitado |
| JS e consentimento | 19 documentos × JS ligado/desligado × ausente/aceito/recusado/expirado/storage bloqueado = 190 aprovados | [Matriz](evidence/etapa5-matrix.json) |
| Hidratação final | 95/95 no build final, console limpo, H1 SSR preservado nas rotas conhecidas; 404 entra pelo fallback cliente esperado | [Hidratação](evidence/etapa5-hydration-final.json) |
| Bundle bloqueado / observer ausente / redução de movimento | 19 × 3 = 57 aprovados; conteúdo liberado, sem permanecer invisível | [Falhas](evidence/etapa5-failure.json) |
| Mídia com JS lento | Vídeo pausado em 0 e barra em 0 antes do JS; ambos começam após hidratação; primeiro slide muda após 11415 ms | [Timer/vídeo/slide](evidence/etapa5-slow-media.json) |
| URLs | Direta, reload, UTM, fragmento e barra final: 89 casos; mais 10 URLs antigas/inválidas | [URLs](evidence/etapa5-urls.json), [legadas](evidence/etapa5-legacy.json) |
| Nove PDPs | Duas fotos de cada produto, indicador, notas, ritual, dez acordeões e ações comerciais desativadas | [UI](evidence/etapa5-ui.json) |
| Pop-up e navegação | X, Esc, fundo, arraste nativo mobile, página completa, reload, histórico, head PDP→PDP/FAQ/home e 404→home | Mesmo relatório; [desktop](evidence/etapa5-popup-desktop.png), [mobile](evidence/etapa5-popup-mobile.png) |
| Home/global | Destaque, carrossel, filtros com totais derivados dos dados, âncora, drawer, rodapé, cookies e persistência | Mesmo relatório |
| Formulários | Home/criadores por Enter/clique com JS off, bloqueado e lento; sem envio nativo de campos. Após JS, comportamento igual ao baseline | [Estáticos](evidence/etapa5-forms-static.json), [recuperação](evidence/etapa5-forms-slow-after.json), [UI](evidence/etapa5-ui.json), [requisições sem vazamento](evidence/etapa5-form-requests.json) |
| Sem JS | Link nativo home→PDP e `details` abrem conteúdo; formulário home desativado, criadores sem names e submit desativado | [Estáticos](evidence/etapa5-forms-static.json) |
| Tracking | Uma sequência SPA produz sete eventos esperados, títulos corretos; pop-up→página completa na mesma URL não duplica | [Tracking](evidence/etapa5-tracking.json) |
| Consentimento/GTM | Default antes do marcador GTM; update aceito/recusado também antes dele, nos 95 casos finais | [Hidratação](evidence/etapa5-hydration-final.json) |
| Responsivo | Baseline/SSG × home/Zeus × 390×844, 1440×900, 768×900 e 1024×900: 16 capturas; sem overflow horizontal novo | [Responsivo](evidence/etapa5-responsive.json) |

Matriz inicial/falhas foi coletada antes das correções dos gestos; os 95 casos de hidratação,
URLs e HTML bruto foram repetidos no build final. Casos com atraso têm provas próprias após
as respectivas correções. H1 deixa de ser o mesmo nó quando autoplay troca slide: para
comprovar hidratação, a comparação usa a primeira confirmação, não identidade após autoplay.

Capturas com fontes carregadas, consentimento aceito e primeiro slide. Frames do vídeo/barra
podem variar; texto, recorte, posição e dimensões foram inspecionados. Home em 1024 px também
foi reconfirmada no Edge após desconexão do Chrome: fonte e retângulo do H1 idênticos.

## Desempenho e waterfall

Três medições por variante/rota, após aquecimento excluído das medianas. Edge, viewport 390×844,
loopback, sem throttling, `no-store`, janela de 4 s e cache de fontes compartilhado. Fontes
carregadas nas 12 medições. GTM externo substituído por marcador local; não representa custo
dos scripts reais de terceiros. Coleta leve evita clonar DOM a cada frame. Servidor QA atende
`Range` de vídeo; resultados anteriores sem Range/coleta leve foram descartados como benchmark.

| Rota / variante | FCP mediano (ms) | LCP mediano (ms) | CLS | Bloqueio observado (ms) |
|---|---:|---:|---:|---:|
| Home baseline | 356 | 556 | 0 | 155 |
| Home SSG | 360 | 500 | 0 | 48 |
| Zeus baseline | 120 | 300 | 0 | 0 |
| Zeus SSG | 252 | 352 | 0 | 0 |

Home: LCP −10,1%; PDP: LCP +17,3% (+52 ms), com um outlier baseline de 3360 ms e variação
entre pares. FCP da PDP também aumentou. **Não há fundamento para declarar ganho uniforme de
performance.** Na Etapa 6, repetir três execuções equivalentes no preview, investigar waterfall
e bloquear aceite se regressão consistente >10% em LCP/TBT persistir, conforme plano. Não
comparar estas medidas com Lighthouse da Etapa 0: dispositivo, rede e método são diferentes.
`blockingObserved` soma excessos de long tasks sobre 50 ms; não é Lighthouse TBT nem INP.

[Medições completas](evidence/etapa5-performance.json) e [análise reproduzível](evidence/etapa5-analysis.json):

- SSG antecipou imagens: 19 requisições iniciadas por preload na home e oito na PDP; baseline
  iniciou essas imagens pelo cliente. Não foi adicionado preload manual.
- Nas 12 amostras finais, sem requisição duplicada de imagem por URL; repetições observadas
  foram de fonte local e também ocorrem no baseline. Uma entrada MP4 por visita mobile à home,
  aproximadamente 2,17 MB; múltiplas entradas Range não provam download integral duplicado.
- Vídeo com `preload="auto"` também baixa enquanto `display:none` no desktop. Comportamento
  existente, mantido nesta migração. [Prova desktop](evidence/etapa5-desktop-media.json).
- Resource Timing registra início, duração e bytes. Declarações `fetchpriority`, preload e
  fontes foram inspecionadas; prioridade efetiva do escalonador não é exposta pela API usada.
  Confirmar prioridades/contenção de rede em DevTools/Lighthouse no preview antes de otimizar.

Não foi alterada mídia ou criado carregamento condicional para obter nota artificialmente melhor.

## Reprodução e limites

Executar com Node 24.x, na raiz do repositório:

```powershell
npm run build
node docs/prerender/tools/etapa5-serve.mjs
# Em outro terminal:
node docs/prerender/tools/etapa5-http.mjs
# Após recolher novamente evidências de navegador:
node docs/prerender/tools/etapa5-analyze.mjs
```

Servidor usa apenas `127.0.0.1:4177`. Ferramentas ficam fora de `src`/`public`, não entram no
deploy. `dist` permanece intacto. Rotas de QA:

- `/__qa/raw`: DOMParser sobre arquivos originais, sem executar scripts analisados.
- `/<rota>?consent=absent|accepted|refused|expired|blocked`: cenários de storage/consentimento.
- `/<rota>?bundle=blocked`: falha do módulo; `?noObserver=1` remove somente IntersectionObserver.
- `/<rota>?reduce=1`: emulação de reduced motion; não altera preferência do sistema.
- `/__qa/off?route=%2Floja%2Fzeus&consent=absent`: iframe sem permissão de scripts; `blocked`
  usa origem opaca, que também impede storage. Não equivale a todas as políticas de storage
  de todos os navegadores, mas cobre o fallback quando acesso ao storage lança erro.
- `/__qa/slow?route=%2F%23catalogo`: botão inicia documento com módulo atrasado 45 s; interagir
  antes de terminar. `#qa-slow` expõe amostras de scroll/carrossel/vídeo/barra.
- `?performance=lean`: relatório leve aos intervalos, sem clone de DOM por frame.
- `?baseline=1`: baseline privado em `node_modules/.tmp/etapa5-baseline/dist`, obtido por
  `git archive 8a02e4a` e compilado com Vite e dependências existentes, separado de `dist` atual.

Em todos os modos instrumentados, bootstrap original de consentimento permanece na ordem
original. Apenas carregamento externo GTM é substituído por marcador, evitando poluir analytics.
Formulários usam dados sintéticos locais. Nenhuma aplicação, mensagem ou cadastro externo enviado.

Servidor local modela URL limpa e 404 para ensaio, mas não certifica redirects, cache, headers,
normalização nem proteção Vercel. `/arquetipos/:id`, kit e produtos inválidos foram testados
como navegação cliente; status HTTP e preservação de query dos redirects ficam na Etapa 6.

## Continuidade

Próxima etapa: **6 — roteamento Vercel e preview**. Remover rewrite SPA somente nessa etapa,
publicar na branch autorizada e validar HTML bruto remoto, redirects, 404, cache e regressão
de desempenho. Produção/`main` continuam na versão estável. Rollback/disponibilidade segue
pendente antes da publicação final, conforme registros anteriores.
