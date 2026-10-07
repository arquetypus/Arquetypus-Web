# ARQUETYPUS — e-commerce D2C

Perfumaria de arquétipos, 9 fragrâncias, Brasil, mobile-first. Conceito: "Você
não escolhe um perfume. Você reconhece o seu." Quiz determina o
arquétipo dominante e secundário do cliente entre os 9; cada um tem
página própria de conteúdo (não é vitrine).

Fonte da verdade de estrutura, copy e raciocínio de produto:
`../arquetypus-prototipo-v6.html` (protótipo estático com camada
BLUEPRINT — abrir no navegador e ligar "mostrar blueprint" pra ver
anotação de objetivo/origem/tracking em cada seção). Este repo é a
implementação real; o HTML nunca é a fonte de verdade de código.

**A partir de agora todo trabalho novo acontece só aqui, no app.** O
protótipo HTML parou de receber blocos novos — ele fica só como
referência de copy/estrutura já existente. Se uma tarefa pedir algo
que o v6 ainda não tem, resolver direto no app (com os dados em
`data/`, avisando quando for preciso inventar copy).

## Stack

Vite + React + TypeScript + Tailwind CSS v4 (config CSS-first em
`src/index.css`, sem `tailwind.config.js`) + React Router.

Seções com `bg-noite` (dark, ver `--color-noite` em `index.css`):
`Eyebrow` sem override herda `text-latao`, que funciona bem sobre
fundo escuro — não trocar por `text-tinta-3` (cinza médio) numa seção
dark, fica quase ilegível. Alternativa aceitável é `text-papel-inv/50`
pra texto secundário.

## Estrutura

```
src/
  types/archetype.ts     tipos: Archetype, QuizQuestion, QuizResult
  data/archetypes.ts      os 9 arquétipos — conteúdo, não lógica
  data/quiz.ts             as 5 perguntas do quiz — conteúdo, não lógica
  lib/quizEngine.ts        pontuação e segmentação — lógica, não conteúdo
  pages/                   uma página por rota
  components/              compartilhado entre páginas
```

Conteúdo (textos, preços, notas olfativas) fica em `data/`, nunca
hardcoded em componente. Isso é o que o v6 chama de "template
preenchido por dados" — a PDP (`/body-splash/:slug`) e o pop-up de compra usam
o mesmo `ProductPurchase` lendo `Archetype` diferente. A antiga página de
arquétipo foi descartada; `/arquetipos/:id` e `/loja/:id` redirecionam (308) pra PDP.

## Regras que não podem ser violadas

Herdadas do protótipo (v2 a v6) — não são preferência de estilo, são
decisão de produto já tomada:

1. **Cada resposta do quiz pontua dois arquétipos, nunca um.** Garante
   que o secundário sempre tem lastro (layering deixa de ser
   arbitrário) e que nenhuma pergunta isolada decide o resultado.
2. **Nenhuma pergunta do quiz menciona nota olfativa.** O teste é
   sobre identidade, não sobre preferência de cheiro.
3. **O passo de segmentação filtra o pool antes de pontuar.** O teste
   nunca pode devolver uma fragrância que a pessoa não compraria (ex.: pool
   masculino nunca inclui Afrodite).
4. **Nenhum claim de efeito fisiológico ou terapêutico.** "Despertar"
   é identidade de marca, não promessa de produto.
5. **Os 9 são body splash: 200 ml feminino, 220 ml masculino/unissex**
   (Fênix incluso). O Imperador era perfume 50 ml até set/2026 e foi
   padronizado; `tipo: 'Perfume'` segue no tipo só pra uso futuro.
6. **Cada arquétipo tem URL própria renderizada no servidor:**
   `/body-splash/{slug}` (out/2026, ex.: `/body-splash/imperador-red-empire`),
   a URL definitiva, usada em todo o site, canonical e sitemap. Endereços
   antigos `/loja/:id` e `/arquetipos/:id` redirecionam pra ela (308). Nunca só um
   modal ou tab client-side sem rota — o pop-up de compra é essa mesma
   rota aberta por cima da home.
7. **Preço, parcelamento e Pix sempre visíveis junto ao produto** —
   nunca atrás de accordion ou clique extra. Exceção decidida pelo usuário
   (out/2026): o card do catálogo da home mostra só preço e "6x … sem juros",
   sem o Pix; o Pix segue no pop-up de compra e na PDP.
8. **Arquétipo com `status: 'wait'` nunca vende.** Se o quiz devolve
   um deles como dominante, a tela mostra lista de espera e empurra o
   secundário como oferta — nunca esconde o resultado nem substitui
   silenciosamente o arquétipo. (Era o caso do Zeus; desde set/2026 os
   9 lançam juntos e nenhum está em `wait` — o mecanismo fica pra uso
   futuro.)

## Pendências técnicas conhecidas

- **Drawer funcional** (`components/Drawer.tsx`, aberto pelo botão de menu do
  header no celular, em `Layout`). Busca e sacola do header do celular são só
  visuais (sem busca nem checkout ainda) — ligar quando existirem.
  Itens sem página real (Diário olfativo) ficam visíveis mas
  desabilitados com rótulo "Em breve" em vez de link morto ou rota
  inventada — quando essas páginas existirem, trocar por `Link` de
  verdade em `Drawer.tsx`.
- **Pop-up de compra = rota, só pelo "olhinho" (out/2026, como no site da Saniella).** Na home, todo link de produto
  (card do catálogo, comunidade, destaque, hero) vai pra página completa; o pop-up só abre pelo botão de olho
  (`components/ui/EspiarProduto.tsx`) no canto da foto dos cards do catálogo — no desktop aparece no hover do card,
  no celular fica sempre à vista. Ele leva a `/body-splash/:slug` com `state.backgroundLocation`; `App.tsx` renderiza a home por baixo e
  `ProductSheet`/`KitSheet` (casca comum em `PurchaseSheet`) por cima.
  Acesso direto à URL abre a página completa — não trocar por modal sem
  rota (regra 6). As seções de compra são `ProductPurchase` e
  `KitPurchase`, compartilhadas entre pop-up e página.
- **Direções visuais pra discussão** (`components/ThemeSwitcher.tsx`,
  `lib/theme.ts`): botão flutuante que abre uma sidebar à direita com cinco
  parâmetros independentes, "Copiar link" da combinação e **Predefinições**
  (combinações com nome salvas no localStorage, `lib/presets.ts` — só neste
  navegador; pra compartilhar, link), inspirada nas
  direções de lab-fabio.vercel.app/arquetypus-lp ("Pulso" foi descartada: não
  combina com a Arquétypus):
  - **Estrutura** (`THEMES`, `?tema=`): o layout da home.
    Editorial = home padrão. **Ateliê** (revista) e **Boutique** (loja:
    grade de produtos, rótulos novos "A partir de"/"Comprar {nome}")
    trocam hero, catálogo, destaque, comunidade, diário e rodapé
    (`components/atelie/`, `components/boutique/`). **Oráculo, Galeria,
    Manifesto, Cinema, Herbário, Laboratório, Riviera, Zen** desenham a home
    inteira (`components/directions/*Page.tsx`,
    ligadas em `DIRECTION_PAGES` no `HomePage`) — tarô / museu / cartaz / noir / arquivo botânico / ficha técnica / verão
    mediterrâneo / wabi-sabi,
    referências da Behance anotadas em cada arquivo. Os textos das seções vêm de
    `HOME_COPY` em `data/home.ts` (o `HomePage` padrão ainda tem os mesmos
    textos escritos direto no JSX — ao mudar copy, mudar nos dois).
  - **Paleta** (`PALETAS`, `html[data-paleta]`): só cores, + granulado e logo
    claro nas escuras. As 8 originais (Editorial a Mármore — Esmeralda, Ametista,
    Safira e Mármore saem da paleta de cores de arquétipos da marca) e as peles
    das outras estruturas.
  - **Estilo** (`ESTILOS`, `html[data-estilo]`): fonte dos títulos + cantos.
  - **Hero** e **Catálogo** (`HEROES`/`CATALOGS`): peças trocáveis entre
    estruturas.
  **Direção decidida (out/2026):** Boutique + paleta Âmbar + estilo Elegant +
  hero do Cinema — viraram os padrões da Boutique em `THEMES`, e `PADRAO` (em
  `lib/theme.ts`) abre a Boutique quando URL/storage não dizem nada. Do Cinema
  também ficou o hover dos cards de gênero (desde out/2026 versão sutil: 90% de brilho e de cor parado, hover com zoom e moldura — também nas famílias; só `lg:`; no
  celular sempre acesos). O card "Arquétipo em destaque" usa o da Editorial também na
  Boutique (out/2026); `FeaturedBoutique` fica no repo sem uso.
  Cada estrutura tem padrões pros outros quatro; escolher em "Misturar" fixa a
  peça (vai pra URL: `?paleta=`, `?estilo=`, `?hero=`, `?catalogo=`) e ela
  continua valendo ao trocar de estrutura, até "usar padrão" / "Restaurar
  padrões". `[data-paleta]`/`[data-estilo]` valem em qualquer elemento (não só
  no `<html>`) — é assim que a sidebar mostra as amostras. Links antigos
  (`?tema=noite`, `?tema=boutique-ambar`…) são traduzidos em `LEGADO`. CSS
  de layout fica em `html[data-estrutura]`. Cor nova em componente deve usar
  token (`var(--color-…)`), senão não acompanha as paletas. **Desligado desde
  out/2026** (`SHOW_THEME_SWITCHER = false`, agora em `lib/theme.ts`): o site
  abre sempre na direção decidida e ignora `?tema=`/storage. Pra voltar a
  discutir, ligar de novo. Falta promover a paleta Âmbar pro `@theme`. As fontes do Google dos estilos
  alternativos (`FONTES_DIRECOES`) saíram do `index.html` (out/2026, travavam a 1ª exibição); o ThemeSwitcher
  as injeta quando ligado. O site no ar usa só Elegant + Inter, servidas de `public/fonts/`.
- **Selos de proporção nas imagens** (`components/ui/RatioTag.tsx`) são
  apoio ao time de design — mostram a proporção real da caixa na tela.
  Desligados desde out/2026 (`SHOW_RATIO_TAGS = false`) — o usuário pode pedir pra religar. O
  requisito de produção do `MediaSlot` fica no tooltip do selo.
- **PDP redesenhada (out/2026, foco em conversão):** coluna de compra com trilha, estrelas
  (`Avaliacao`), etiquetas (família, volume, % de essência), "notas em destaque" (1ª nota de cada
  camada), selo de desconto, Pix em destaque, frete grátis/prazo abaixo do botão e acordeões (Sobre a
  fragrância, Notas, Como usar); galeria maior, presa ao rolar no desktop. Abaixo: "Arquétipo {nome}"
  (foto da representação sangrando a seção — metade esquerda no desktop, topo no celular — com degradê só nos
  últimos ~40% pra não apagar a pessoa; degrau numa camada por cima da foto — + `quem`/`cheiro[1]`), benefícios
  ("Por que Arquétypus", claro e centrado: ícones de traço em aro latão, colunas com filetes), pirâmide olfativa
  (`components/PiramideOlfativa.tsx`, out/2026): editorial clara, foto 48% + texto 52%, "Como {nome} se revela" e três
  linhas Topo/Coração/Fundo (título fixo da camada, notas, descritores, mini natureza-morta à direita). No desktop a foto
  sangra a seção (altura toda, metade esquerda) e some no creme por máscara nos últimos ~40%, como em "Arquétipo {nome}";
  o nome no título vai na cor do arquétipo (`a.cor`, como o H1), o resto da interface é igual pros 9; mesma estrutura
  pros 9, o que varia fica em `data/piramideOlfativa.ts` (descrição, descritores, alts) e nas pastas
  `assets/fotos/piramide/principal/{id}.jpg` (sem ela, usa `pdp-notas/`) e `piramide/camadas/{id}-{topo|coracao|fundo}.jpg`
  (sem ela, a linha mostra um mockup tracejado com a especificação). As minis são fotos 4:3 NÃO recortadas — naturezas-mortas da mesma "sessão"
  (superfície creme lisa, luz lateral da esquerda, sombra de contato suave; prompt-base descrito em
  `data/piramideOlfativa.ts`), com fundo calibrado pro creme da seção (#ebe1d3) e bordas esmaecidas por máscara CSS.
  Geradas por IA (Higgsfield, GPT Image 2.5): só a Sereia; os outros 8 mostram mockup até gerar (Higgsfield sem
  crédito em out/2026). Descritores dos outros 8 são RASCUNHO técnico tirado das notas — revisar com o usuário.
  Em dev, se uma foto trocada com o mesmo nome continuar aparecendo a antiga, apagar `node_modules/.cache/imagetools`
  e reiniciar o Vite. No celular: título → descrição → foto → camadas, e a seção passa da altura da tela (pedido
  do usuário: sem carrossel e sem esconder etapa). `PiramideInfografico.tsx`/`data/piramides.ts` e as pastas
  `pdp-piramide*` ficaram sem uso. "Combina com" editorial (`components/ComboEditorial.tsx`, out/2026) aprovado na
  Sereia e espelhado pros 9 (`comboDe` em `data/combos.ts`): a Sereia tem entrada própria (Sereia + Afrodite, copy do
  usuário); os outros usam o par de layering (`a.par`), texto = `a.layer` + fechamento do usuário, card = `ep`,
  família e 4 notas da fórmula (nada inventado). Vende identidade e não economia (preço numa linha discreta depois do botão, sem "os dois por"),
  título grande = "Sereia + Afrodite" (nomes na cor de cada arquétipo, suavizada), headline vira título de apoio;
  título dos nomes em itálico; à direita dois cards com contorno — foto de ponta a ponta até o topo com nome + legenda
  por cima (degradê creme no alto), embaixo frase do momento e 4 notas centralizadas (`cards` em `data/combos.ts`;
  frase da Afrodite é rascunho a confirmar) unidos por um "+" grande que invade os dois; botão = `SweepCta` da home vazado com borda dourada (hover: dourado com texto claro); desligado (sem checkout); `VER_HOVER` em `ComboEditorial` liga só a aparência pra revisar o hover.
  A seção inteira fica dentro de um banner retangular largo (até 100rem) com fundo de foto de cetim bege (centro liso,
  dobras só nas bordas; `assets/fotos/texturas/cetim.jpg`, gerada por IA e calibrada pro `papel-2`, a 20% de opacidade pra não competir) e sombra leve embaixo, como se flutuasse.
  Celular (< 768 px) tem versão própria: tudo centralizado, ordem texto → cards empilhados (até 420 px, "+" entre
  eles) → botão → preço → selos; título de apoio com uma frase por linha; cetim a 10%. Tablet e desktop não mudam.
  Os cards do celular são horizontais (referência do usuário): foto 16:9 de ponta a ponta com o frasco à direita
  (`combo/{id}-mobile.jpg`, geradas por IA), nome grande na cor do arquétipo + frase + filete dourado à esquerda. Fotos: natureza-morta de produto
  por arquétipo em `assets/fotos/combo/{id}.jpg` (sem pessoas, mesma "sessão" da Pirâmide; geradas por IA no
  Higgsfield — só Sereia e Afrodite por enquanto; faixa de fundo estendida no topo pro texto do card não cair no
  frasco); sem arquivo (desktop ou `-mobile`), o card mostra mockup tracejado até gerar. As versões com o arquétipo
  ao fundo foram testadas e deixadas pra depois (out/2026). A seção de layering antiga saiu da PDP. Depois: FAQ/ficha e carrossel dos outros 8 (o par primeiro, setas no desktop; claro desde out/2026, cards
  com contorno fino como os do combo: foto, família, nome, estrelas, preço + parcelas e "Ver fragrância →"). Barra fixa
  de compra (`PdpStickyBar`): no celular fica à vista sempre que `#pdp-comprar` não está na tela (o botão
  aparece sem rolar, pedido do usuário); no desktop só depois de passar o botão; some no rodapé. O botão segue
  "Em breve" (decisão do usuário: sem checkout). O pop-up (modo compacto) mantém o layout anterior.
  **Celular: o botão principal (abaixo do preço) aparece sem rolar** (pedido do usuário): ordem foto → nome →
  estrelas → preço → botão, e frase/etiquetas/notas descem pra depois do botão; a foto ocupa a largura toda com
  altura `clamp(12rem, 100svh − 20.5rem, quadrada)` (object-cover ancorado no topo, a tampa nunca some);
  sem o "Descubra a…" e com menos respiro entre estrelas e preço no celular. Conferido no iPhone SE (375×548).
- **PDP existe em `/body-splash/:slug`** (`pages/ProductPage.tsx`), com
  `CartContext` global (`context/CartContext.tsx`) — header, barra de
  frete e `KitBuilder` compartilham a mesma sacola agora.
- **Sem persistência.** O carrinho vive só em memória (`useState`); dá
  reload e some. Não implementar localStorage/backend sem perguntar —
  depende de onde o checkout de verdade vai rodar.
- **"Comprar agora" hoje faz o mesmo que "Adicionar à sacola".** Não
  existe checkout — decidir isso é decisão de produto, não técnica.
- **Kit Descoberta saiu do ar (set/2026).** `/kit-descoberta` redireciona
  pra home; sem link no hero, drawer, rodapé nem comparativo. `KitPage`,
  `KitSheet` e `KitPurchase` ficam no repo, desligados, pra religar. O
  card editorial que era do kit na home virou "Arquétipo em destaque" —
  desde out/2026 banner rotativo Fênix → Sereia → Zeus, 4 s cada
  (`components/FeaturedCarousel.tsx`, `SLIDES`; texto vem de
  `data/archetypes.ts`; fotos `assets/fotos/destaque-*.jpg` — Sereia e Zeus
  geradas por IA no Higgsfield, naturezas-mortas de alta perfumaria — Sereia em
  pedestal de madrepérola na água, Zeus em travertino diante de estátua grega;
  trocar pelas de campanha). No desktop (lg+) usa `destaque-*-desktop.jpg`: a
  foto expandida nas laterais com IA (FLUX.2 Pro Outpaint) pra não cortar demais.
  Cor do card por banner em `SLIDES[].bg`, animada via `@property --destaque-bg`
  (index.css). Sem partículas (testadas e tiradas a pedido, out/2026) — só o
  degradê. `FEATURED_ID` em
  `HomePage.tsx` só vale pro Ateliê/direções.
- **Fotos da designer (set/2026) em `src/assets/fotos/`** — convertidas de
  PNG pra JPG. Catálogo da home (`catalogo/`) mostra o frasco; a PDP tem
  galeria (`components/ProductGallery.tsx`): 1ª foto o frasco
  (`pdp-frasco/`), 2ª a pessoa com o frasco (`pdp-lifestyle/`), ambas
  recorte 1:1 das fotos 9:16, lidas por `import.meta.glob` (arquivo = id do
  arquétipo; pra mais fotos, nova pasta e mais uma entrada em `slides`).
  `miniaturas/` são recortes do frasco pro product tag da comunidade.
  **Galeria da PDP com 5 fotos (out/2026):** frasco → notas (`pdp-notas/`) → arquétipo
  ao fundo (`pdp-arquetipo/`) → representação do arquétipo de corpo inteiro
  (`pdp-representacao/`) → pessoa com o frasco. As 3 do meio são geradas por IA
  (Higgsfield, GPT Image 2.5, 1200×1200), com o ícone original (`public/icon-512.png`
  recolorido na cor do rótulo) como referência pra não distorcer o emblema. Arquétipo
  sem arquivo na pasta só não ganha o slide. Feitos: Afrodite, Imperatriz, Cleópatra, Fada,
  Sereia, Zeus, Guerreiro, Imperador, Fênix (os 9; Fênix com duas pessoas, por ser unissex). Desde out/2026 em qualidade média (custo).
  **Zeus trocou de frasco (out/2026):** rótulo bronze/sépia com nuvens, rosto de Zeus e águia, texto
  creme e "DEO COLÔNIA" (referência: lab-fabio.vercel.app/arquetypus-lp, `zeus-criativo.png`). Todas
  as fotos do Zeus (catálogo, comunidade, destaque, PDP, miniatura) foram refeitas com IA trocando o
  frasco azul pelo novo; o card do destaque passou a `#4f3a29`. As versões desktop do
  hero de Afrodite/Guerreiro (`hero/*-desktop.jpg`) são a foto da designer
  expandida pra 16:9 com IA (Higgsfield, FLUX.2 Pro Outpaint) — as laterais
  foram geradas; o frasco e a pessoa são os pixels originais.
  O que sobrou em `assets/mocks/` ainda é mock antigo.
- **Famílias olfativas (out/2026): 5, em `data/families.ts`** — Florais & Elegantes,
  Frutados & Cítricos, Frescos & Luminosos, Ambarados & Adocicados, Amadeirados &
  Especiados (substituíram Floral/Aquático/Amadeirado/Oriental, que não podem voltar).
  Cada arquétipo tem `familias: [principal, secundária]` em `data/archetypes.ts` e
  aparece no filtro das duas; `fam` (só o nome da principal — a secundária não aparece no site, só no filtro) é derivado, não
  escrever à mão. `FAMILIES` (home.ts) monta a lista de arquétipos de cada família.
  Regras da marca: nunca "Oriental" nem "Aquático", sem emoji, nenhum perfume ou
  marca de terceiros como referência. Os nomes comerciais de ingredientes da
  fórmula (Cashmeran, Ambroxan…) ficam, por decisão do usuário. Famílias não têm URL
  própria (o filtro é estado da home), então não há redirecionamento.
- **Fotos das famílias olfativas** (`assets/fotos/familias/{slug}.jpg`, out/2026):
  geradas por IA no Higgsfield (GPT Image 2.5), 896×1120, estilo editorial quente
  em linho/travertino com luz de fim de tarde (a "opção b", escolhida pelo usuário;
  as outras opções foram apagadas), exceto Frescos & Luminosos: fonte de jardim em
  travertino com maçã verde, limão, bambu, zimbro e gengibre (escolhida out/2026).
  Pra testar alternativa, salvar como `{slug}-opcao-N.jpg` na mesma pasta — fica fora
  do build (glob em `data/home.ts`); ao escolher, renomear pra `{slug}.jpg`. Trocar por foto de campanha ou regerar em 2k antes do lançamento.
- **"A diferença" (out/2026)** é `components/DifferenceSection.tsx`: duas
  colunas "Arquétypus" (mais larga e em destaque: aro dourado, brilho, texto maior) × "Marcas tradicionais", sempre visíveis (sem chave nem abas no celular), cada
  uma com foto no topo (`assets/fotos/diferenca/`): `arquetypus.jpg` gerada
  por IA (Higgsfield, frascos reais de referência) e `splash-comum.jpg`, frasco
  genérico sem marca enviado pelo usuário. Título "O que torna Arquétypus diferente?". Texto em
  `COMPARISON`: 5 linhas pareadas, cada uma com título e descrição, escritas pelo usuário (out/2026); sem animação de entrada (aparece na hora).
  Concentração de essência é **10%** em todo o site (confirmado pelo usuário, out/2026;
  antes a PDP dizia 5%).
- **Benefícios (out/2026)**: o bloco "07 dias de garantia" virou faixa corrida
  (`components/BenefitsMarquee.tsx`, textos em `BENEFITS` em `data/home.ts`):
  garantia, envio 24 h, pagamento seguro, 6x sem juros, 5% no Pix
  (ajustes de caixa alta/ícone testados e revertidos a pedido, out/2026 — fica o
  original: itálico, ícone de traço pequeno, 44 s por volta).
- **Outros canais de venda (out/2026, pedido do usuário):** Mercado Livre, Shopee e TikTok Shop (`CANAIS_VENDA` em
  `data/empresa.ts`, componente `ui/CanaisVenda.tsx`) — na coluna de compra da PDP logo depois dos selos de
  envio/garantia/pagamento ("Prefere comprar em outro lugar?"; o quadro de frete abaixo do botão só aparece com frete
  grátis ativo), e no rodapé ("Também à venda em"). Só os logos, monocromáticos em latão (paths da Simple Icons,
  CC0; o Mercado Livre usa o aperto de mãos do Mercado Pago), sem texto — as cores originais chamavam atenção demais.
  O order bump de layering ("Complete o ritual") saiu junto, desligado por `SHOW_ORDER_BUMP` em `ProductPurchase`.
  Links ainda `null` (selo sem clique) — preencher quando o
  usuário passar as URLs das lojas.
- **Rodapé Boutique (out/2026)** (`FooterBoutique` em `boutique/BoutiqueMore.tsx`):
  escuro, logo dourada completa (`assets/brand/logo-dourado.png`), email
  `contato@arquetypus.com.br` (era sac@, trocado em todos os rodapés), canais oficiais com
  só ícones lado a lado em "Nossas redes" (`CONTATOS` em `data/home.ts`: Instagram @arquetypus, TikTok
  @arquetypusparfum, WhatsApp (12) 99206-7178, e-mail — Pinterest saiu de todos os rodapés) e selos de
  pagamento (`PAGAMENTOS`: Pix, Visa, Master, Elo, Amex, Hipercard — desenhos
  simplificados em bege `mesa`). As bandeiras são suposição: confirmar com o
  gateway quando o checkout existir.
- **Filtro do catálogo por família (out/2026):** clicar num card de "Descubra pelo
  cheiro" filtra o catálogo pelos arquétipos da família (`FAMILIES[].arquetipos`)
  e rola até ele, como os cards de gênero. Estado `catalogoFamilia` em
  `HomePage.tsx`; o `CatalogGrid` (Boutique) mostra um chip "Família: X ✕".
  Trocar o gênero nas abas tira a família.
- **Pop-up de compra enxuto (out/2026):** no pop-up (`ProductPurchase` com
  `fullPageTo`, modo compacto) o botão de comprar aparece sem rolar — sem selos
  de envio/garantia/pagamento e sem "Complete o ritual"; no celular a foto vai na
  largura toda e preço + botão ficam numa barra presa no pé do pop-up. A variante
  mini (8 ml) saiu de vez, também da PDP. A PDP (`/body-splash/:slug` direto) mantém selos e ritual e
  ganhou o convite "Descubra {o/a} {energia}" (a etiqueta de energia saiu dos
  cards do catálogo). `PurchaseSheet` fecha com saída animada pelo ✕, fundo, Esc,
  arrastando o puxador ou o conteúdo já no topo (celular).
- **Seções da home desligadas (out/2026):** "O perfume errado", "Reconhecimento",
  "Para criadores" e "Diário olfativo" — flags `SHOW_DIAGNOSIS`/`SHOW_RECOGNITION`/
  `SHOW_CREATORS`/`SHOW_DIARY` em `HomePage.tsx`. `/criadores` segue no ar; o
  Diário virou "Em breve" no Drawer e saiu dos rodapés. Os cartões de benefício
  do rodapé Boutique (envio, garantia, pagamento) foram removidos. Ordem da
  home: hero → comunidade → coleções por gênero → catálogo → famílias →
  destaque → diferença → benefícios (marquee) → cupom → rodapé. O fechamento "Talvez você
  não seja apenas um." está desligado (`SHOW_CLOSING`).
- **Sobrenome dos body splash (out/2026):** cada arquétipo tem `sobrenome`
  (Afrodite First Kiss, Fada Pure Light…) em `data/archetypes.ts`, mostrado
  numa linha menor e mais apagada abaixo do nome por `components/ui/Sobrenome.tsx`
  (tamanho em `em`, relativo ao nome). Ligado nas telas no ar: catálogo, comunidade,
  destaque, pop-up/PDP, layering e `/criadores`. As direções desligadas
  (`directions/`, `atelie/`), quiz e kit ainda não mostram.
- **Quiz ainda não tem rota.** O 1º banner do hero (`HeroCinema`) mostra o CTA
  "Descubra seus arquétipos" desligado, com "Teste de 2 minutos · em breve"
  (`QUIZ_CTA` em `data/home.ts`). `pages/QuizPage.tsx`/`ResultPage.tsx` existem
  mas não estão ligados no `App.tsx` — quando o quiz entrar, trocar o botão por
  `Link` pra rota.
- **`/criadores` existe** (`pages/CreatorsPage.tsx`). Comissão do afiliado e preço do kit vêm
  de `data/economics.ts` (`ECON`), não hard-coded no componente —
  comissão confirmada pelo usuário como faixa de 10% a 20% (`comissaoMinPct`/`comissaoMaxPct`,
  exibida por `comissaoTexto`);
  `kitMargemPct` fica `null` de propósito, mesmo motivo.
- **Formulário de criador e "adicionar kit à sacola" não persistem de
  verdade** — submit só muda estado local (`submitted`/`added`), sem
  request nenhuma. Precisa de backend antes de ir pra produção.
- **Páginas institucionais (vigência 01/10/2026)**, no rodapé em 4 colunas no padrão de loja — Loja · Institucional · Ajuda · Políticas, com "Nossas redes" junto da marca — e nos mesmos grupos no menu do celular:
  `/perguntas-frequentes` (`FAQ_LOJA` + `FAQ_PRODUTO` em `data/faq.ts`; a PDP mostra só 5 de `FAQ_PRODUTO` — `FAQ_PDP` — com link pra cá; publica
  schema.org/FAQPage), `/entrega-e-frete`, `/trocas-e-devolucoes`, `/privacidade`, `/termos-de-uso`,
  `/regras-do-site`, `/sobre`. Casca em `components/ui/Legal.tsx`. Dados da empresa e fornecedores num lugar só:
  `data/empresa.ts` (`EMPRESA`, `EMPRESA_LINHA` no rodapé com endereço completo, `OPERACAO`: Mercado Pago,
  Melhor Envio + Correios/Jadlog/J&T, Vercel, Google Workspace, Google Ads/Meta/TikTok). Regras confirmadas pelo
  usuário: desistência em 7 dias **com produto lacrado e sem uso**; defeito 30 dias; reembolso Pix em até 3 dias
  após receber e avaliar; estorno do cartão no prazo da operadora; cupom 15% uma vez por CPF, acumula com outras
  promoções e com o Pix; sem promessa de duração na pele (só "10% de essência"). Retenção GA4 no texto = 14 meses
  (o usuário pediu 12, que o GA4 não oferece) — configurar igual. Revisão jurídica recomendada antes de publicar.
- **Hospedagem na Vercel (SSG em produção):** `vercel.json` define Vite, pipeline completo
  `npm run build`, saída `dist`, `cleanUrls: true` e `trailingSlash: false`. Rewrite SPA removido
  somente após gerar e verificar 18 páginas + `404.html`. Não restaurar catch-all para home:
  cada URL deve entregar seu HTML. Arquivos estáticos são servidos diretamente; rota desconhecida
  recebe 404 própria/noindex. `/loja/:id` e `/arquetipos/:id` usam 308 para `/body-splash/{slug}`; kit, `/body-splash`
  sozinho (vai pro `#catalogo`) usam 307 para home. Produto/ID inexistente (`/loja/x`, `/body-splash/x`) é 404
  real, sem curinga pra home (soft 404, out/2026). O build simula as regras (primeira que
  casa vence) antes de aceitar o `vercel.json`.
  Matcher vem de `ARCHETYPES`: executar `npm run configure:vercel`, revisar e versionar antes do push;
  `npm run verify:vercel` bloqueia drift no início do build. Pré-renderização publicada no domínio
  principal; trabalho corrente diretamente na `main`, conforme decisão do usuário. A branch
  `prerender` foi integrada e removida. Operação e manutenção em `README.md`.
- **robots.txt, sitemap.xml e llms.txt (out/2026)** são gerados no build (plugin `arquivosSeo` no
  `vite.config.ts`, conteúdo em `src/lib/arquivosSeo.ts`) a partir dos dados do site — produtos e preços
  de `ARCHETYPES`, empresa de `data/empresa.ts`, páginas de `data/rotas.ts`. Não criar esses arquivos à mão
  em `public/`. Também respondem em `npm run dev`. Frete grátis vem de `FRETE_GRATIS_ACIMA` (`data/empresa.ts`) — DESLIGADO desde out/2026 (`null`, não confirmado):
  com `null` nenhum texto (PDP, FAQ, Entrega e Frete, descrições, llms.txt) promete frete grátis; o valor planejado
  fica em `FRETE_GRATIS_PLANEJADO`.
  - **Página pública nova:** cadastrar em `PAGINAS_PUBLICAS` (`data/rotas.ts`) e ligar o componente em `PAGINAS`
    no `App.tsx` — as rotas saem dessa lista. O `satisfies` faz o `tsc` falhar se faltar componente ou sobrar
    caminho, e o `verify:ssr` falha se alguém escrever `<Route path="…">` solto no `App.tsx` (só produto,
    redirecionamentos e 404 ficam fora da lista).
  - **Números comerciais** (Pix, parcelas, prazos de desistência/defeito/envio, % de essência, cupom) vêm de
    `CONDICOES` em `data/empresa.ts`, com `precoPix`/`parcela` pras contas; a quantidade de fragrâncias por extenso
    vem de `ARCHETYPES.length` (`lib/extenso.ts`). Site, FAQ, políticas, descrições de SEO e `llms.txt` leem dali —
    nunca escrever "6x", "5%", "7 dias" etc. à mão. As direções desligadas ainda têm "6x" escrito no texto
    (as contas já usam `CONDICOES`).
- **Header e rodapé iguais em todas as páginas (out/2026):** o header é do `Layout`; o
  `FooterBoutique` é montado pela home (por direção visual) e pelo `Layout` em todas as outras rotas
  (`!isHome` — com pop-up aberto o `Layout` olha a página de fundo, então não duplica).
- **SEO por página (out/2026):** modelo compartilhado em `lib/seoModel.ts`; `RouteSeo` e
  `lib/seo.ts` aplicam metadados na navegação cliente, renderer injeta o mesmo head no HTML bruto.
  Títulos, descrição, canonical e OG são próprios de cada rota; canonical sempre oficial,
  sem hostname de preview. Domínio oficial: `https://www.arquetypus.com.br` (`SITE` em `data/empresa.ts`),
  porque a Vercel serve o www e redireciona o domínio sem www pra ele (decisão do usuário, out/2026). PDP usa nome, sobrenome, frase, família e preço. Não duplicar regras
  SEO nas páginas ou publicar avaliações não confirmadas. O Product tem `offers` (preço de `a.preco`, BRL,
  InStock — OutOfStock se `status: 'wait'`) desde out/2026, por decisão do usuário, mesmo sem checkout ativo;
  sem `priceValidUntil` até existir data real de fim de promoção.
- **Favicon (out/2026):** emblema dourado com fundo transparente (`favicon.ico` 16/32/48, `favicon-32.png`);
  ícones de iPhone/app (`apple-touch-icon`, `icon-192/512`) com fundo branco — iOS não aceita transparência.
- **Revisão de textos (out/2026):** escondida a seção "Quem já vende" de `/criadores` (números de
  planejamento, `SHOW_RANKING = false`); menu do celular sem volumes nem "Perfumes"; ficha técnica da PDP
  sem nota interna, sem IFRA não confirmado e com "Anvisa: produto regularizado"; aviso de consentimento
  (LGPD) no formulário do cupom. Estojo de lona saiu da PDP (não existe). "7 dias de garantia" fica (decisão
  do usuário). Ficha técnica mostra o nº de notificação na Anvisa de cada arquétipo (`anvisa` em
  `data/archetypes.ts`); o INCI e os alérgenos ficam só na embalagem, conforme a Anvisa (decisão do usuário) —
  o site só avisa isso. Pendentes: "D+30" de pagamento a criadores, avaliações e pessoas da comunidade.
- **Estrelas de avaliação (out/2026, pedido do usuário, estilo Judge.me):**
  `★★★★★ 4,8 (260)` abaixo do nome nos cards do catálogo, da comunidade e do
  destaque (`components/ui/Avaliacao.tsx`, meia estrela suportada). Dados em
  `data/reviews.json` por arquétipo (`rating`, `count`, `items`), atualizados à mão;
  `lib/reviews.ts` é a única camada de leitura — trocar por API real só ali.
  `SHOW_RATINGS` (em `lib/reviews.ts`) desliga tudo. **Atenção:** os números foram
  passados pelo usuário com o produto ainda sem venda; confirmar que são avaliações
  reais de cliente antes de ir ao ar (mesma regra das linhas abaixo) — senão desligar.
- **Avaliações na PDP são propositalmente genéricas** — o v6 tinha
  depoimentos e contagem reais só pra Sereia (208 avaliações, nomes de
  clientes). Não estendi isso pros outros 8 porque seria inventar
  review — ver regra de copy abaixo.
- **INCI fica na embalagem** (decisão do usuário, out/2026): a ficha técnica da PDP não lista
  composição — só informa que o INCI completo, com alérgenos, está na caixa, conforme a Anvisa.
- **`UGC_VIDEOS` em `data/home.ts` tem depoimentos fictícios/ilustrativos**
  (2 dos 4 textos foram inventados pra dar volume ao carrossel — os
  outros 2 vêm de `TESTIMONIALS`, que já eram ilustrativos). As fotos
  (`assets/fotos/comunidade/`) e os @ vieram da designer — não está
  confirmado se são pessoas reais e autorizadas, e a seção diz "Pessoas
  reais". Confirmar antes do lançamento. **Desde out/2026 são 9 cards:** os 5
  novos (Fada, Fênix, Guerreiro, Imperador, Zeus) têm pessoas GERADAS POR IA
  (Higgsfield, GPT Image 2.5, com a foto do frasco da PDP como referência), @
  inventados e sem depoimento. O usuário decidiu manter "Pessoas reais." e os @
  sem selo por enquanto (protótipo interno) — trocar tudo por conteúdo real e
  autorizado antes de ir ao ar. Os textos dos depoimentos e o "4,8 ·
  2.147 avaliações" estão escondidos (`SHOW_REVIEWS = false` em
  `HomePage.tsx`), assim como os percentuais de percepção
  (`SHOW_PROOF_STATS = false`) — copy revisada de set/2026 manda tirar
  do ar até existir dado real.

## Pendências reais (não resolvidas no protótipo, não inventar resposta)

- Pirâmides olfativas em `data/archetypes.ts` são a fórmula da Scentec
  (out/2026) — não alterar sem nova ficha. Os textos "o que isso tem a
  ver com cheiro" (`cheiro`) e de layering foram reescritos a partir dela.
- Preço unificado (out/2026): os 9 body splash custam R$ 79,90 (antes
  R$ 89,90 feminino / R$ 94,90 masculino), com preço cheio R$ 99,90
  (`precoCheio`) sempre mostrado riscado ao lado — usar o componente
  `components/ui/Preco.tsx` em todo preço de produto, nunca `brl(a.preco)` solto.
  Pix (5%) e parcelas continuam calculados sobre o `preco` com desconto. As
  direções desligadas e o Ateliê ainda mostram só o preço com desconto. Kit (out/2026, decisão do usuário):
  **de R$ 199,90 por R$ 149,90** — o site ainda não vende kit; quando entrar, usar esses
  valores (preço cheio riscado via `Preco`). `KIT_TIERS` em `data/home.ts` (escada antiga
  89,90/84,90/79,90 do `KitBuilder`) e `ECON.kitPreco` (Kit Descoberta, 79,90) estão
  desatualizados — revisar ao religar.
- **Pré-renderização estática (out/2026):** React `renderToString` +
  `StaticRouter`, mesma árvore React, hidratação do documento compatível e fallback cliente
  quando URL/histórico exigem outra árvore. Pipeline gera 18 páginas públicas + 404 em `dist`;
  renderer/template/evidências privadas em `dist-server` nunca são publicados. Sem framework
  novo ou plugin SSG. `build:client` isolado não serve como build de deploy. Os scripts em
  `scripts/` são parte permanente do pipeline; não removê-los junto de documentação temporária.
  Validar HTML bruto, recursos, roteamento real e paridade antes de publicar; operação em `README.md`.
- **Título do produto decidido (out/2026):** "Body Splash Premium {nome} {sobrenome} | Arquétypus Parfum"
  (termo buscado na frente, sem volume), em `productMetadata` (`lib/seoModel.ts`); o H1 segue só o nome.
- **Metadados por página, ajustes adiados pelo usuário (out/2026):** descrição do produto com família + 3 notas + 10% de essência (≤155 caracteres), og:image 1200×630 por
  produto (só faz efeito com a pré-renderização) e H1 fixo na home ("Body Splash Premium com 10% de
  essência" — hoje o H1 é o texto do slide e muda a cada 4 s; decidir se visível ou só pra leitor).
  Não usar `react-helmet-async`: `lib/seo.ts` já faz título, descrição, canonical e og por rota.
- CMV/CAC não existem — não construir lógica de ponto de equilíbrio ou
  desconto máximo sem confirmar com o usuário primeiro.

## Convenções de trabalho

- **URL de produto (out/2026):** sempre `productPath(a)` (`data/archetypes.ts`), nunca
  montada à mão. O `slug` (nome-sobrenome sem acento) é definitivo: não renomear nem
  derivar do nome — se o nome mudar, o slug fica. Produto novo ganha `slug` e
  `npm run configure:vercel` gera os redirecionamentos dos endereços antigos.
- **Nenhuma seção depois do hero pode passar da altura da tela** (decisão de
  reunião, out/2026) — só o hero da home cobre 100%. Seção com muito conteúdo
  vira trilho horizontal no celular ou tem altura presa à tela (`svh`).
  Exceção: comunidade/UGC no celular — cards grandes pela largura mesmo que a
  seção passe da tela em celular baixo (pedido de out/2026). No desktop a foto
  do card tem piso de 27rem de altura (notebook 1366×768 achatava a foto) — lá
  a seção também pode passar um pouco da tela.
- **Cantos: uma escala só.** Usar `rounded-sm…3xl` (tokens `--radius-*`,
  ajustados no estilo Elegant em `index.css`), nunca raio em px solto;
  `rounded-full` só pra pílula/círculo.

- **Âncoras da home (out/2026)** pra mandar link direto: `#inicio`, `#comunidade`,
  `#segmentos`, `#catalogo`, `#familias`, `#destaque`, `#diferenca`, `#beneficios`,
  `#cupom`, `#rodape`, e cada produto do catálogo pelo id (`#afrodite`, `#fenix`…).
  Seção nova na home ganha `id` também; não renomear os existentes (links já enviados).
- **Performance da home e páginas (out/2026):**
  - Direções desligadas fora do JS principal: `HomePage` importa as peças delas de
    `components/directions/lazy.tsx` (`React.lazy`, só baixam se desenhadas). Peça nova de direção alternativa
    entra lá; a direção decidida segue importada direto (é a que o servidor pré-renderiza).
  - Estrelas de avaliação: uma fileira = um elemento (`.estrelas` em `index.css`, máscara CSS), não 5 SVGs.
  - `content-visibility: auto` nas seções da home abaixo da dobra (Boutique) — `index.css`.
  - Comunidade (`CommunityBoutique`): HTML inicial com 1 cópia dos cards (eram 3 = 27 cards, 45% das caixas de
    layout da home, medido seção a seção). No celular as outras 2 entram depois do `load` (navegador livre, fora
    de um deslize); no desktop logo na hidratação (vários cards à vista). `useInfiniteCarousel({ copias })` +
    `chaveDaCopia` reaproveitam os cards como cópia do meio e compensam o scroll antes da pintura (trilho com
    `overflow-anchor: none`). `useCoverflow` lê todas as posições antes de escrever (sem layout card a card).
  - Imagens fora da 1ª tela com `loading="lazy"`: `MediaSlot` é lazy por padrão (`prioridade` pra foto de topo);
    `<img>` solto precisa do atributo. `verify-prerender` derruba o build com mais de 5 imagens sem lazy numa página.
- **GTM carregado depois do `load` (out/2026, decisão do usuário):** snippet em `index.html` (teto de 5 s). Eventos
  enviados antes (consentimento, `page_view` do `RouteTracker`) esperam no `dataLayer` e são processados quando o
  GTM chega. Custo aceito: não mede quem sai antes do `load` (visitas de 1–3 s, cliques acidentais em anúncio) —
  sessões no GA4 caem um pouco frente aos cliques do Ads/Meta a partir de 06/10/2026. Não voltar o GTM pro topo.
- **Vídeo do hero atrasado (out/2026):** `HeroCinema` não põe o `<video>` no HTML inicial — mostra a foto do 1º
  quadro (`hero-video-poster`) e monta o vídeo depois do `load` da página (teto de 8 s), só no celular (no desktop
  aparece a foto 16:9 e o vídeo nunca baixa). A barra do 1º slide espera o vídeo entrar. `verify-prerender` derruba
  o build se um `<video>` publicado no HTML sair sem `poster` ou com `preload` diferente de `none`/`metadata`. Ao
  trocar o vídeo, trocar também `hero-video-poster.jpg` pelo 1º quadro do novo.
- **Imagens otimizadas no build (out/2026):** `vite-imagetools` (`vite.config.ts`) converte toda imagem importada
  de `src/` em WebP q80, sem metadados, com largura máxima 1600 px (2400 pra `*-desktop.jpg`, 900 pra flor) —
  só reduz. Original fica em `src/assets/` em qualidade cheia; foto nova não precisa de tratamento manual.
  `public/` não passa por aí. `verify-prerender` derruba o build se uma imagem publicada passar de 400 KB.
  **Fotos responsivas:** foto de conteúdo grande entra com `?responsiva` (400/800/1200 px; 800–2400 nas
  `*-desktop.jpg`) e é lida por `foto()`/`fotosPorId()` (`src/lib/foto.ts`) → `{ src, srcSet }`; `MediaSlot` aceita
  `Foto` + `sizes`. Catálogo, comunidade, PDP, famílias (e miniaturas, sem srcset) são lidos **por pasta** — trocar
  o arquivo ou pôr foto nova com o id do arquétipo não pede código. Travas: `verify-prerender` falha com foto > 60 KB
  publicada sem `srcset`; `smoke-ssr` falha se a mesma foto for importada simples e com `?responsiva` (no Linux da
  Vercel isso quebra a paridade SSR/cliente) — pra URL única, usar `foto(x).src`.
  `/assets/*` sai com cache de 1 ano `immutable` (`headers` gerado por `configure-vercel.mjs`). Medir
  antes/depois com `npm run perf -- <rótulo> [comparar-com]` (retratos em `perf/`).
- **Texto alternativo das fotos (out/2026):** foto que é conteúdo (frasco, pessoa com o produto) leva `alt`
  descritivo montado com `produtoNome(a)` (`data/archetypes.ts`) — `alt` é obrigatório no `MediaSlot` (o `tsc`
  falha sem ele, de propósito: toda foto nova exige a decisão), a galeria da PDP
  e os slides do hero (`HERO_SLIDES[].alt`) passam o seu. `alt=""` só pra foto decorativa ou já dita pelo texto
  ao lado (miniatura do card com o nome, foto de gênero/família com rótulo, flor/fita).
- **Nome do produto no site: "Body Splash Premium"** (out/2026), nunca só "body
  splash" — está em `tipo` (`data/archetypes.ts`), FAQ, alts e textos. "Splash
  comum" (concorrente genérico em "A diferença") continua como está.
- **Código do arquétipo (`cod`, "ARQ-01"…) é referência interna** (out/2026):
  fica em `data/archetypes.ts`, mas nunca aparece no site — nem "ARQ-07", nem
  "Nº 07", nem numeral romano derivado dele.
- **Nome cadastrado no GTIN (`nomeOficial`) não é nome comercial do site.** Usar somente
  para identificação estruturada em SEO/integrações; componentes, H1, cards e sacola
  continuam usando `nome`/`sobrenome`. `gtin13` é texto e pertence ao Product no JSON-LD.
- Português nas strings de UI e nos dados de conteúdo; inglês em
  nomes de tipo, variável e arquivo — como já está no código.
- Não inventar copy novo pros 9 arquétipos. Se uma seção nova precisa
  de texto que não existe no v6, perguntar antes de escrever.
- Rodar `npx tsc -b` e `npm run build` antes de considerar qualquer
  mudança pronta.
- Não adicionar biblioteca de UI/componentes (shadcn, MUI, etc.) sem
  perguntar — o visual é definido pelos tokens de `src/index.css`,
  portados do protótipo.
