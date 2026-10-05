# Etapa 6 — revisão final e aceite técnico

Data: 05/10/2026. **Veredito: aprovada com limitações documentadas.**

Não há defeito bloqueante identificado nos requisitos da migração. A Etapa 6 está
tecnicamente encerrada para avançar ao fluxo de autorização da Etapa 7. Isso não
autoriza merge, publicação, promoção ou rollback e não significa certificação de
100% das combinações em todos os dispositivos e serviços externos.

## Identidade e escopo

- Branch e HEAD local/remoto no momento da coleta: `prerender` / `67d66d35c4535f121cd0c4179e5f531acee52012`.
- Código da aplicação: `a0f211dcb7409f2accdb392dd021c7c946c61242`.
- Preview: <https://arquetypus-parfum-git-prerender-saniella.vercel.app/>;
  deployment documental identificado na coleta: `dpl_89SSTyW7scpYwRyuv7LrDDK4zUge`.
- Produção e `main`: `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2`, preservada.
  SHAs de ambas as branches reconferidos por `git ls-remote` neste fechamento.
- Consulta administrativa de build/rollback feita manualmente pelo usuário;
  [registro das evidências](vercel-validacao-manual.md). Nenhum painel automatizado.
- Nenhuma mudança em aplicação, dependências ou configuração nesta revisão. A coleta
  e a revisão ocorreram sem commit/push/deploy. O versionamento posterior das provas,
  ferramentas de QA e documentação foi solicitado pelo usuário; produção permanece
  fora do escopo desse envio à branch `prerender`.

## Decisão por requisito

| Requisito | Resultado e prova | Decisão |
|---|---|---|
| Configuração e build | `verify:vercel`: nove produtos, 139 casos. `verify:prerender`: 19 HTMLs, 91 recursos, 18 canonicals. Logs manuais confirmam TypeScript e pipeline completo Vite/Node 24.x/dist | Atendido |
| HTTP, redirects, 404 e cache | Nova execução de [HTTP remoto](evidence/etapa6-http.json): 306 verificações de rotas e 94 pares de recursos; zero falhas, corpos próprios e tipos corretos | Atendido |
| HTML inicial e SEO | 18 páginas públicas + 404 confrontadas com build, sem JS: title, description, canonical, OG, H1, corpo específico, nove preços/descrições e JSON-LD. Preview noindex em header, não no artefato público | Atendido |
| Hidratação e head | [Chrome](etapa6-chrome.md): 19 visitas com JS, 95 hidratações/consentimentos instrumentados e console sem mismatch. Novo fechamento: head único nas nove PDPs e fluxos SPA; aceite/recusa persistem no preview intacto após reload | Atendido pela cobertura combinada |
| Falhas e sem JS | 19 documentos remotos sem scripts; 57 casos instrumentados de entry bloqueada/observer ausente/movimento reduzido. Links/details e formulários sem scripts também comprovados com bytes conferidos | Atendido pelo método descrito abaixo |
| Home e pop-up | [Nova coleta](evidence/etapa6-final-chrome.json): quatro filtros de gênero, cinco famílias, slides por teclado, fundo desktop, X/Escape móveis, arraste por mouse, reload, histórico e página completa na mesma URL | Atendido |
| Produtos | Nove PDPs no preview intacto, 18 fotos selecionadas, 90 acordeões abertos, ritual marcado e duas ações comerciais desativadas por PDP. Notas/preços também têm [prova Chrome anterior](evidence/etapa6-chrome-pdp-ui.json) | Atendido |
| Navegação global e formulários | Drawer móvel→FAQ, rodapé, PDP→PDP/home, 404→home e cookies no preview. Oito casos de formulários e três ensaios de gestos antes da hidratação em [Chrome](etapa6-chrome.md), sem cadastro externo | Atendido pela cobertura combinada |
| Tracking | Sete `page_view` com títulos corretos e sem duplicação na mesma URL; Consent Mode antes de GTM. Snippets e lógica executável RouteTracker comparados com baseline. GTM/GA4 reais presentes no preview | Contrato atendido; entrega externa não certificada |
| Responsivo e layout | 16 casos reais no Chrome: baseline/preview × home/Zeus × 390×844, 768×900, 1024×900 e 1440×900. Sem overflow/imagem quebrada; fontes/dimensões de H1, main e galeria coincidem | Atendido; sem identidade de pixels |
| Desempenho | Home: três pares, LCP −6,9%, TBT −40%, CLS zero. [Zeus](etapa6-tbt.md): onze pares, LCP −22,9%, TBT −13,4%, CLS zero. Nenhuma amostra excluída, limite de 10% preservado | Atendido |
| Schema e social | Schema.org de home/Zeus/FAQ sem erros/avisos; Breadcrumb válido; cards de home/Zeus com imagem pública. Product sem Offer permanece inelegível conforme plano | Atendido no escopo previsto |
| Recuperação e manutenção | Logs/configurações e diálogo Instant Rollback comprovados pelo usuário. Destino estável de recuperação após futura migração: `8a02e4a`. README/CLAUDE já descrevem pipeline/contrato | Preparação atendida; operação não executada |

## Revisão dos limites que impediam o fechamento

**Não foi repetida literalmente toda a matriz no preview intacto.** A decisão de
aceite considera a cobertura combinada, e não transforma essa afirmação em verdadeira:

1. Falhas de bundle, observer, storage e consentimento expirado são induzidas em
   loopback com HTML/assets remotos previamente conferidos. Isso testa o mesmo código
   da migração. Origem e GTM substituído limitam conclusões sobre cookies de terceiros
   e serviços Google. Visitas normais, navegação, head, PDPs e consentimento salvo também
   foram testados no preview intacto, cobrindo a integração com Vercel.
2. A matriz exige eventos/títulos e ordem do consentimento. Esse contrato está provado.
   Recebimento de cada evento pelo GA4/GTM não é atestado de pré-renderização e não foi
   certificado. Continua como verificação do smoke no domínio oficial na Etapa 7,
   com participação manual do usuário se exigir painel Google/Vercel.
3. Override de viewport funcionou nesta coleta na aba ativa. As quatro larguras agora
   possuem medidas e capturas próprias no Chrome, além das provas antigas de iframe.
   Arraste do pop-up por mouse não substitui touch físico. Teste em aparelho real é
   complementar; não ampliar silenciosamente escopo para todos os dispositivos.
4. TBT variável não foi atribuído integralmente a terceiros. Série ampliada atende
   comparação prevista; trace completo não é necessário para aceitar ausência de
   regressão consistente nessa amostra. LCP absoluto ainda é alto: aproximadamente
   8,78 s na home e 6,37 s no Zeus, nos ensaios mobile. Não declarar Core Web Vitals
   aprovados nem iniciar otimizações invasivas para fechar este plano.
5. Rollback disponível significa preparação administrativa observada, não operação
   ensaiada. A publicação deve reconferir destino elegível e preservar `8a02e4a`.

Esses limites não demonstram defeito novo da migração. A revisão aceita o método
de QA para os requisitos da Etapa 6 e conserva os limites nos relatórios.

## Capturas e correções de coleta

Capturas de PDP: `evidence/etapa6-final-{baseline|ssg}-zeus-{390|768|1024|1440}.png`.
Home final: `evidence/etapa6-final-{baseline|ssg}-home-{largura}-top.png`.
Os oito arquivos da home final registram visita direta, primeiro slide e `scrollTop`
do container igual a zero antes/depois da captura; fontes carregadas. Pares inspecionados
visualmente. Vídeo, zoom, page-fade e dica de galeria podem estar em frames diferentes;
fontes, dimensões e composição coincidem, sem certificado de identidade de pixels.

[Pop-up móvel](evidence/etapa6-final-popup-390.png) capturado após entrada animada.
As imagens anteriores da home sem sufixo `-top` ficam preservadas como tentativas;
algumas tinham rolagem automática causada pelo foco nos controles. Não fundamentam
comparação de posição vertical. Dois ensaios de 768 px aplicaram override à aba errada;
foram marcados inválidos e repetidos na aba ativa, sem contabilização duplicada.

Primeira leitura de foto antecedeu o fim da rolagem suave. Novo teste aguarda
`aria-current=true`. Lote interrompido de PDPs não foi contabilizado e coleta posterior
foi salva por produto. Fundo desktop foi acionado por região livre observada em captura;
clique no centro do backdrop ficava sob o card. Retorno da 404 foi relido após montagem
da home. Clique de hero durante transição atingiu outro link; três registros excluídos
do aceite, mantendo observações. Visita direta e Enter confirmaram os três slides.
Nenhuma dessas correções alterou a aplicação.

## Verificação reproduzível e próximo passo

[Decisão de revisão](evidence/etapa6-final-review.json),
[consolidação com hashes](evidence/etapa6-final-analysis.json),
[analisador](tools/etapa6-final-analyze.mjs).
JSONs anteriores com `phase6FullyAccepted: false` registram escopos/coletas anteriores;
não foram reescritos para apagar pendências históricas. A decisão vigente está neste
relatório e na consolidação final. O analisador valida provas e o registro de revisão;
não substitui julgamento técnico nem consulta administrativa manual.

```powershell
npm run verify:vercel
npm run verify:prerender
node docs/prerender/tools/etapa6-chrome-analyze.mjs
node docs/prerender/tools/etapa6-tbt-analyze.mjs
node docs/prerender/tools/etapa6-final-analyze.mjs
# Para nova conferência das respostas públicas do preview:
node docs/prerender/tools/etapa6-http.mjs
```

Reanálises atualizam timestamps/hashes; executar consolidação final depois delas.
Servidores de QA não foram iniciados neste fechamento; abas criadas foram fechadas
e override temporário de viewport restaurado.

**Próximo passo: Etapa 7, mediante autorização específica.** Revalidar commit/build se
houver novo deployment ou rebuild; smoke no domínio oficial, noindex, tracking,
recuperação e acompanhamento conforme plano. Nenhuma publicação foi executada.
