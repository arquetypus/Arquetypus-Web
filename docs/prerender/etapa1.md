# Etapa 1 — segurança SSR e apresentação inicial

Implementação na branch `prerender`, sobre `e0e829f`. Produção continua em `main`.
Etapa 1 concluída: build, contratos locais, push e validação do novo preview aprovados.
Código enviado em `6422a93cb85d81b2876b90b52fb3fe3317f140d2`.

## Alterações e contrato

- Tema: importação sem DOM, snapshot padrão estável e `getServerSnapshot`. Atributos
  `data-estrutura`, `data-paleta` e `data-estilo` derivados do mesmo snapshot são inseridos
  pelo `transformIndexHtml` do Vite, inclusive em desenvolvimento. Switcher permanece desligado.
- CookieBanner: servidor e primeiro cliente renderizam `null`. Efeito consulta consentimento;
  chave, versão, TTL, Consent Mode antes do GTM e evento de reabertura permanecem iguais.
- Reveal: HTML/CSS sem scripts fica visível. Bootstrap só reserva animação quando há observer
  e movimento normal. Prontidão é sinalizada após instalação dos observers; cancela timer/listeners.
  Falha de módulo, observer ausente/com erro ou espera excedida liberam conteúdo. Estado liberado
  não é rearmado por React tardio. Duração de entrada permanece 0,5 s, `ease-out`.
- Limite de ocultação: 2 s após bootstrap. É orçamento de espera por conteúdo, não atraso imposto
  ao app, autoplay ou animação. Caso normal do ensaio confirma prontidão antes desse teto;
  caso lento espera 2,5 s antes de hidratar e comprova visibilidade anterior e posterior.
  Sob CPU congestionada, timers seguem a disponibilidade do event loop; não existe garantia
  de prazo em tempo real quando a thread do navegador está bloqueada.
- Cupom: ambos os inputs e botão submit começam desabilitados e são habilitados após montagem.
  Layout e `preventDefault()` mantidos, sem backend. Clique nativo e Enter antes do app não
  expõem email/WhatsApp na URL; após montagem, envio continua prevenido.
- Cinema: HTML inicial tem poster, sem autoplay, barra parada e sem timer React. No commit
  que habilita apresentação, layout effect solicita `video.play()` e agenda timer; barra CSS
  é habilitada nesse mesmo commit. Primeira duração continua 11.450 ms; demais, 4.000 ms.
  Solicitação de playback e agendamento medidos em poucos milissegundos no ensaio. Decodificação
  de vídeo depende de rede/navegador; não se promete sincronismo frame a frame. Rejeição de play
  mantém poster e navegação. Em hidratação tardia, primeira copy já visível não é reocultada.
- Galeria: dica só começa após montagem do listener; mantém 0,7 s de espera + 1,1 s de animação,
  curva, cancelamento por toque e navegação. Sem movimento, não depende de `animationend` para
  visibilidade; classe pode permanecer até interação sem animar.
- SEO: três arquivos continuam no build cliente/dev; plugin deixa de escrevê-los no build SSR.
  Roteamento Vercel, metadados, preços, conteúdo e entrada `createRoot` permanecem atuais.

## Verificação local

`npm run build` passa (inclui `tsc -b`). Warning de chunk >500 kB já existia.
Lint dos arquivos alterados passa sem erros. Quatro avisos `set-state-in-effect` correspondem
às transições deliberadas após montagem; três avisos de refs em HomePage já existiam.
Não foram suprimidos nem motivaram refatoração fora de escopo.

Contratos reexecutáveis, sem instalar dependências:

```powershell
node docs/prerender/tools/etapa1-check.mjs
node docs/prerender/tools/etapa1-serve.mjs
```

O segundo comando abre servidor QA em `http://127.0.0.1:4174/qa?case=normal`.
Ensaio renderiza componentes reais e os hidrata com StrictMode e captura de erros recuperáveis.
Casos: `normal`, `slow`, `blocked`, `accepted`, `refused`, `missing-io`, `throwing-io`,
`reduced`, `no-scripts`, `no-app`, `bundle-failed`. A simulação `reduced` substitui condições
de mídia do CSS compilado e `matchMedia` somente no ensaio; não muda configuração do computador.
`no-scripts` entrega documento sem qualquer script. Os outros casos de falha exercitam bootstrap.

O ensaio não é entrada SSR da aplicação, não gera rotas nem é entregue pelo deployment.
Pré-renderização real e aceite do HTML das 18 rotas continuam nas Etapas 3 e 4.

Evidências: [contratos](evidence/etapa1-contracts.json),
[HTML do ensaio](evidence/etapa1-fixture-ssr.html), [QA navegador](evidence/etapa1-browser-local.json).

## Preview

[Preview validado](https://arquetypus-parfum-git-prerender-saniella.vercel.app/).
GitHub registrou check Vercel `success` para o commit de código; [deployment](https://vercel.com/saniella/arquetypus-parfum/GZdUH5FGjeD6Rt4cZd9fGmUCoy9h).

- 18 rotas públicas HTTP 200, com `x-robots-tag: noindex` de Preview.
- JS `index-BgVQipSh.js` (629.484 bytes) e CSS `index-DuMrFA1J.css` (159.991 bytes)
  idênticos byte a byte ao build local. Incrementos sobre baseline: 848 e 271 bytes.
- HTML da home coincide com build local, acrescido somente do feedback da Vercel;
  outras rotas coincidem com template SPA esperado nesta etapa.
- Title, description, canonical, OG, JSON-LD e H1 das 18 rotas iguais à baseline.
  Preços dos nove produtos verificados a partir de `ARCHETYPES`, sem literal de preço no teste.
- Sem erros/warnings de console nem imagens visíveis quebradas nas inspeções.
- Pop-up Zeus, reload com estado de fundo, fechar, voltar/avançar, link de página completa,
  galeria desktop/móvel, fim da dica móvel, cupom por Enter/clique, reabrir/recusar cookies,
  filtro Fênix/Todos, menu/FAQ, 404 cliente e produto inválido aprovados.
- Playback mudo e avanço de `currentTime` observados no desktop e celular. Capturas da home
  mostram slides Afrodite (desktop) e Guerreiro (móvel); autoplay mantém variação da baseline.
- `robots.txt`, `sitemap.xml`, `llms.txt` publicados, HTTP 200 e bytes iguais ao build.
- Dev real também verificado: atributos iniciais corretos e três arquivos SEO HTTP 200.
  Vite iniciado diretamente porque npm 12/PowerShell não repassou flags de `npm run dev -- …`.
- `main` remoto permanece `8a02e4a`; leitura do domínio de produção confirmou assets da baseline.
  [Verificação de ambiente](evidence/etapa1-environment-check.json).

Evidências: [deployment](evidence/etapa1-deploy.json),
[HTTP](evidence/etapa1-preview-http-baseline.json), [metadados](evidence/etapa1-preview-metadata.json),
[navegação](evidence/etapa1-preview-ui.json), [aceite objetivo](evidence/etapa1-preview-validation.json).
Reexecutar comparação após coletar evidências novas:

```powershell
node docs/prerender/tools/collect-http.mjs https://arquetypus-parfum-git-prerender-saniella.vercel.app etapa1-preview
node docs/prerender/tools/etapa1-preview-check.mjs
```

Capturas: [home desktop](evidence/etapa1-preview-home-desktop.jpg),
[home móvel](evidence/etapa1-preview-home-mobile.jpg), [Zeus desktop](evidence/etapa1-preview-zeus-desktop.jpg),
[Zeus móvel](evidence/etapa1-preview-zeus-mobile.jpg). Validação de layout por inspeção visual,
sem alegar comparação automatizada pixel a pixel.

## Limites

Etapa 2 não iniciada. Site publicado nesta etapa continua SPA; HTML de rotas públicas ainda
tem root vazio e head genérico. Isso é comportamento esperado até a Etapa 4, não aceite de SSG.
Disponibilidade de rollback de produção deve ser confirmada antes da publicação final (Etapa 7).
