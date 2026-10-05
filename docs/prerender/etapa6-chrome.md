# Etapa 6 — complemento funcional no Google Chrome

**Estado vigente:** aceite técnico concedido posteriormente em
[revisão final](etapa6-fechamento.md). Este documento preserva a coleta funcional e
suas limitações; os campos pendentes abaixo representam o estado anterior ao fechamento.

Em 05/10/2026, os cenários funcionais restantes foram cobertos no **Google Chrome**.
As evidências anteriores do Edge ficam como complemento de compatibilidade.
As duas regras permanentes estão registradas em [AGENTS.md](../../AGENTS.md).
Aplicação, dependências, build e configuração de deploy não foram alterados nesta coleta.

## Resultado e origem das provas

| Grupo | Resultado | Evidência |
|---|---|---|
| Preview original com JS | 18 rotas + 404, cookies acionados/recusados, head sem duplicação, conteúdo/preços visíveis, console limpo | [Preview](evidence/etapa6-chrome-preview.json) |
| Preview original sem scripts | 18 rotas + 404 em sandbox, conteúdo visível, nenhum reveal escondido, nove preços presentes; CSS 390×844 sem overflow | [Sem JS](evidence/etapa6-chrome-no-js.json) |
| Hidratação/consentimento | 19 páginas × ausente/aceito/recusado/expirado/storage bloqueado = 95; default antes de GTM, updates persistidos antes de GTM; sem erro de hidratação | [Matriz](evidence/etapa6-chrome-functional.json) |
| Falhas/fallbacks | 19 páginas × entry bloqueada/observer ausente/movimento reduzido = 57; conteúdo liberado | Mesma matriz |
| Nove PDPs no preview original | Foto 2 e indicador, notas, todos os 10 acordeões abertos, preço e duas ações comerciais desativadas | [PDPs](evidence/etapa6-chrome-pdp-ui.json) |
| Gestos anteriores à hidratação | Rolagem 2071→2071, carrossel 383→383, hash 1085→1085, galeria 490→490 em três ensaios; entry atrasada 45 s | [Gestos](evidence/etapa6-chrome-gestures.json) |
| Formulários | Oito casos: off/bloqueado/lento nas duas páginas, recuperação após JS; Enter em criadores não provoca envio antes do JS; home impede foco pelos inputs disabled | [Formulários](evidence/etapa6-chrome-forms.json) |
| Tracking SPA | Sete page_view esperados com títulos corretos; pop-up→página completa na mesma URL não duplica evento | [Tracking](evidence/etapa6-chrome-tracking.json) |
| Fluxos móveis no preview original | X, Escape, página completa e menu→FAQ; iframe CSS 390×844 verificado | [Móvel](evidence/etapa6-chrome-mobile.json), [captura](evidence/etapa6-chrome-popup-mobile.png) |
| Controles sem scripts do site | Home→Zeus por Enter, details nativo e Enter em criadores sem envio; zero scripts executáveis do site nas páginas | [Controles nativos](evidence/etapa6-chrome-native-no-scripts.json) |
| Integridade/requisições | 95 respostas remotas conferidas contra build validado antes de instrumentar; nenhum campo sintético em URL e nenhum POST | [Hashes](evidence/etapa6-chrome-remote-proof.json), [requisições](evidence/etapa6-chrome-requests.json), [prova sem scripts](evidence/etapa6-chrome-native-remote-proof.json) |

Último deployment identificado no HTML: `dpl_89SSTyW7scpYwRyuv7LrDDK4zUge`.
Código da aplicação já validado: `a0f211d`; commit documental esperado: `67d66d3`.
SHA/status/build administrativo ainda serão conferidos manualmente pelo usuário.

## Limites e correções de coleta

Falhas e estados de consentimento foram induzidos pelo servidor QA em loopback usando
**bytes reais do preview**, comparados ao build local antes de qualquer transformação.
O servidor substitui GTM por marcador, remove toolbar e injeta observações no DOM.
Origem e instrumentação diferem do preview original. Esses testes comprovam comportamento
do código e contrato do dataLayer; **não certificam entrega de pacotes/eventos GA4/GTM**
nem equivalem à repetição literal de toda a matriz da Etapa 5 no preview intacto.

Sem scripts no preview foi comprovado por iframe sandbox. O coletor não confirmou
ativação do link nesse sandbox; essa tentativa não foi contabilizada como navegação.
Para controles nativos, `--no-app-scripts` removeu scripts executáveis somente nas
respostas QA, preservando JSON-LD. O navegador manteve JS disponível para automação,
mas o site executou **zero scripts**, inclusive React/bootstrap/GTM. Navegação, details
e formulário passaram nessa condição. Nenhum arquivo em `dist` foi reescrito.

Viewport override do Chrome não aplicou 390×844 (DOM continuou com 1704×1241) e foi
resetado. O ensaio móvel usa iframe do preview real com viewport CSS medido de 390×844.
Não certifica touch, arraste por dedo ou dispositivo físico. Evidências antigas de
quatro tamanhos no Edge não foram reclassificadas como medições Chrome.

Correções do coletor, sem alterar aplicação:

- 404 usa fallback cliente previsto; identidade do H1 SSR não deve ser exigida nessa rota.
- Na home, autoplay troca H1 depois da hidratação; prova usa primeira confirmação.
- FAQ foi lida antes do commit que fechava cookies; repetição confirmou banner fechado.
- Texto da 404 tem menos de 200 caracteres; critério exige H1/noindex e conteúdo real.
- Hash teve uma amostra transitória do salto nativo antes da restauração RAF; critério
  compara posição estável antes do módulo com posição final, mantendo amostras originais.
- Tracking foi lido inicialmente antes da atualização periódica da fixture; releitura
  confirmou sete eventos. Lotes interrompidos foram retomados com salvamento por rota.
- Página completa móvel foi confirmada por Enter após tentativa de clique sem transição
  confirmada pelo coletor. X/Escape e menu foram comprovados por interação direta.

## Reproduzir e conferir

Node 24, artefatos locais correspondentes ao preview e Chrome conectado são necessários.

```powershell
node docs/prerender/tools/etapa5-serve.mjs --remote-preview
node docs/prerender/tools/etapa6-frame.mjs
# Após encerrar o primeiro servidor, controles com zero scripts do site:
node docs/prerender/tools/etapa5-serve.mjs --remote-preview --no-app-scripts
# Analisa provas salvas; não automatiza navegador nem painel Vercel:
node docs/prerender/tools/etapa6-chrome-analyze.mjs
```

Servidores restritos a loopback; falhas são parâmetros de QA. Conteúdo remoto divergente
do build causa erro, impedindo teste silencioso de outro código. Não usar esses servidores
como hospedagem ou medição de desempenho. Servidores e abas QA encerrados após coleta.

## Estado histórico após esta coleta

**Etapa 6 permanece sem aceite completo.** TBT Zeus continua acima do gate do plano:
+40,6% (+26 ms) no conjunto remoto de seis pares. Nenhuma nova medição ou mudança de
tracking foi feita para apagar esse resultado. Investigação causal permanece pendente.

Build/configuração efetivos e disponibilidade/permissão de rollback aguardam evidência
manual da Vercel, conforme [passos para o usuário](vercel-validacao-manual.md).
Nenhum painel acessado, push, novo deploy, promoção, rollback ou publicação em produção
foi executado nesta coleta. Alterações locais limitadas a regras, ferramentas QA e provas.

[Análise verificável](evidence/etapa6-chrome-analysis.json) conserva campos de performance,
rollback e aceite completo como `false`. Etapa 7 permanece pendente.

### Atualização posterior — investigação de TBT e evidência manual

Os parágrafos acima registram o estado na data da coleta funcional. Em 05/10/2026,
o usuário forneceu logs/prints que fecharam build/configuração e preparação de rollback.
A [investigação ampliada de TBT](etapa6-tbt.md) completou cinco novos pares: no conjunto
de onze pares, TBT Zeus −13,4%, LCP −22,9%, CLS zero. Gate comparativo atendido sem
alterar aplicação. O JSON desta coleta funcional permanece como evidência histórica;
a análise atual específica está em `etapa6-tbt-investigation-analysis.json`.
Aceite global da etapa e publicação não foram realizados nesta investigação.
