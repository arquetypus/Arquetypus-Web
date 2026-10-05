# Etapa 6 — investigação de TBT do Zeus

Data: 05/10/2026. Navegador principal: Google Chrome. Aplicação e deployments intactos.

Fechamento técnico global realizado posteriormente em [revisão final](etapa6-fechamento.md).
Este relatório concede somente o aceite comparativo de desempenho do Zeus.

## Conclusão

**O gate comparativo de LCP/TBT/CLS do Zeus foi atendido na investigação ampliada.**
A regressão de TBT de +40,6% da primeira série não se mostrou consistente: cinco novos
pares alternados deram −50,9%, e o conjunto dos onze pares deu −13,4%. O limite de
10% do plano foi preservado. Nenhuma amostra bem-sucedida foi descartada, incluindo
o preview com TBT de 297 ms. Não houve ajuste de GTM, consentimento, renderização ou mídia.

Esse aceite se limita ao gate observado do Zeus. **Não comprova custo zero de hidratação,
não identifica completamente a causa de cada tarefa e não aprova a Etapa 6 inteira.**
As auditorias de tarefas do Lighthouse não substituem um trace completo com call stacks.
Publicação em produção continua dependente da revisão final da etapa e autorização.

## Métodos e integridade

- Produção: `https://www.arquetypus.com.br/loja/zeus`, baseline `main` / `8a02e4a`.
- Preview: `https://arquetypus-parfum-git-prerender-saniella.vercel.app/loja/zeus`,
  bundle `index-Cd29iwMJ.js`; nenhum novo deploy durante esta investigação.
- PageSpeed Insights oficial operado no Chrome; celular, Moto G Power emulado,
  4G lento, carregamento inicial, Lighthouse 13.5.0 e HeadlessChromium 153.0.8010.36.
- Cinco novos pares foram fixados antes da segunda medição: preview seguido de produção.
  Execuções remotas sequenciais, sem análises Lighthouse concorrentes.
- Medições exatas extraídas do link público da calculadora, evitando arredondamento da UI.
- Desconexão do Chrome interrompeu leitura do quarto baseline. Mesmo relatório foi
  reaberto após reconexão para ler tarefas; nenhuma medição foi substituída por outra.
- [Prova dos artefatos](evidence/etapa6-tbt-artifact-proof.json): HTML das duas origens
  corresponde aos builds locais após normalizar CR e remover eventual toolbar;
  JS/CSS conferidos byte a byte por SHA-256. Experimento local usa o HTML remoto.
- Snippets de Consent Mode e GTM são idênticos entre builds; a lógica executável de
  `RouteTracker` também é igual ao commit estável (só comentários mudaram).
  Isso não congela os arquivos remotos do Google nem garante execução idêntica de tags.
- As origens têm hostnames diferentes; PSI não fornece aqui prova exportada do estado
  de consentimento de cada execução. O bootstrap nas duas versões nega tudo por padrão.
  Estes limites impedem atribuição causal absoluta à hidratação ou a terceiros.

## Resultados — medianas

| Série | Pares | FCP baseline / SSG (ms) | LCP baseline / SSG (ms) | TBT baseline / SSG (ms) | CLS |
|---|---:|---:|---:|---:|---:|
| Original | 6 | 3336 / 3334 | 8257,5 / 6061 | 64 / 90 | 0 / 0 |
| Nova investigação | 5 | 3324 / 3341 | 8304 / 6396 | 171 / 84 | 0 / 0 |
| Todas as amostras | 11 | 3328 / 3337 | 8260 / 6366 | 97 / 84 | 0 / 0 |

Conjunto completo: FCP +0,27%; LCP −22,93%; TBT −13,40%; sem novo CLS.
Esse conjunto preserva a série original; ela continua documentada como resultado histórico.
Não interpretar o ganho agregado como melhora em toda execução individual.

| Novo par | TBT baseline (ms) | TBT SSG (ms) | LCP baseline (ms) | LCP SSG (ms) |
|---|---:|---:|---:|---:|
| 1 | 238 | 40 | 8332 | 6208 |
| 2 | 171 | 84 | 8308 | 6806 |
| 3 | 257 | 191 | 8304 | 6396 |
| 4 | 121 | 47 | 7776 | 6366 |
| 5 | 65 | 297 | 8003 | 6466 |

Quatro pares novos favorecem o preview; o quinto favorece a produção em TBT.
A variabilidade permanece alta nas duas versões. Uma mediana isolada da série inicial
não sustenta diagnóstico de regressão persistente após a série complementar.

## Origem das tarefas longas

Foram expandidas e salvas as dez auditorias novas de tarefas longas, com URL, início
e duração. Os mesmos IDs GTM `GTM-5DTMCZW8` e GA4 `G-W81SRZ3K7J` aparecem nas duas versões.

| Novo par | Duração somada de tarefas longas próprias baseline / SSG (ms) | GTM/GA4 baseline / SSG (ms) |
|---|---:|---:|
| 1 | 168 / 0 | 373 / 152 |
| 2 | 98 / 109 | 313 / 214 |
| 3 | 186 / 80 | 411 / 369 |
| 4 | 64 / 0 | 233 / 155 |
| 5 | 50 / 222 | 165 / 495 |

Zero significa ausência de tarefa própria acima de 50 ms na auditoria, não custo zero
de JavaScript. Essas durações **não são TBT**: a métrica só contabiliza a porção bloqueante
das tarefas na janela de medição após FCP. Não somar durações para reconstruí-la sem trace.

Na amostra original 3, o baseline pintou em 5245 ms, depois da tarefa própria iniciada
em 5046 ms. O SSG pintou em 3337 ms, antes de sua tarefa própria em 6204 ms.
Portanto, o trabalho pode entrar em janelas distintas mesmo sem aumentar sua duração.
GA4 também durou 99 ms no baseline e 158 ms no SSG daquela amostra.

**Inferência sustentada:** variação do ambiente, execução de tags e posição das tarefas
em relação ao FCP influenciam a diferença observada. As tarefas de terceiros predominam
nas dez auditorias novas. Não há evidência de aumento consistente das tarefas próprias
nessa série, mas uma tarefa própria de 222 ms no quinto preview permanece registrada.
Não afirmar que toda diferença vem de rede, que GTM é o único responsável ou que
hidratação nunca acrescenta trabalho.

## Experimento local — diagnóstico, sem aceite de TBT

Quinze amostras no Chrome, cinco trios baseline / SSG / CSR com o mesmo bundle atual.
Servidor exclusivo `127.0.0.1:4179`, iframe 390×844, cache HTTP `no-store`, escolha de
consentimento ausente e GTM substituído por marcador somente nas respostas de QA.
Google Fonts permaneceu real; testes não representam isolamento total de terceiros.
Arquivos de aplicação, `dist` e deployments não foram modificados.

Todas as quinze amostras chegaram ao `page_view`, sem erros JavaScript e sem recursos
GTM/GA4/toolbar. Entretanto, treze não registraram FCP; os últimos SSG/CSR apresentaram
tempos muito maiores. A origem exata dessas variações não foi isolada.
**Não usar essa série como benchmark Lighthouse nem como prova causal de regressão.**
Preservada em [resultado local](evidence/etapa6-tbt-local.json), incluindo todas as anomalias.

Primeira tentativa parcial preservada separadamente: o extrator do root da variante
CSR assumia que o módulo Vite ficava no body; ele está no head. Corrigido apenas na
ferramenta de QA. A série posterior completa não mistura essa tentativa inicial.
Servidor encerrado e porta 4179 sem listener após coleta.

## Ajustes e continuidade

Não há ajuste de aplicação justificado para resolver uma regressão consistente de TBT
com base nestas medições. Não atrasar analytics, remover consentimento, enfraquecer
o gate nem mudar framework para melhorar nota.

Revalidar no domínio oficial após publicação autorizada, com baseline e rollback
preservados. Se reaparecer regressão consistente, coletar traces completos de Chrome
DevTools em condições equivalentes e identificar call stacks antes de alterar código.
Melhorias de imagens, fontes e divisão do bundle podem ser avaliadas separadamente;
não são correções obrigatórias comprovadas por esta investigação.

## Evidências e reprodução

- [Dez novos relatórios e auditorias](evidence/etapa6-tbt-retest-pagespeed.json).
- [Análise verificável e hashes de tracking](evidence/etapa6-tbt-investigation-analysis.json).
- [Série original](evidence/etapa6-pagespeed.json).
- [Ferramenta local](tools/etapa6-tbt-serve.mjs) e [analisador](tools/etapa6-tbt-analyze.mjs).

```powershell
node docs/prerender/tools/etapa6-tbt-analyze.mjs
```

O analisador exige cinco pares completos, dez auditorias, configuração mobile/Lighthouse
equivalente, tracking idêntico e quinze amostras locais preservadas. Produz aceite
específico `zeusPerformanceComparisonAccepted`, mantendo `phase6FullyAccepted: false`.
Artefatos históricos das coletas anteriores conservam seus resultados; não são sobrescritos.

Referências: [definição de TBT](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)
e [variabilidade Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).
