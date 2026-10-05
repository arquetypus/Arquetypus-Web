# Etapa 1 — segurança SSR e apresentação inicial

Implementação na branch `prerender`, sobre `e0e829f`. Produção continua em `main`.
Validação local concluída; validação do novo preview ainda pendente neste registro inicial.

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

Pendente: push do código, conclusão do deploy Vercel do novo commit e validação HTTP/UI.
Atualizar esta seção com resultado observado, identificação do commit e comparação de assets.

## Limites

Etapa 2 não iniciada. Site publicado nesta etapa continua SPA; HTML de rotas públicas ainda
tem root vazio e head genérico. Isso é comportamento esperado até a Etapa 4, não aceite de SSG.
Disponibilidade de rollback de produção deve ser confirmada antes da publicação final (Etapa 7).
