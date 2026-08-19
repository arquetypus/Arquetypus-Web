# ARQUETYPUS — e-commerce D2C

Perfumaria de arquétipos, 9 SKUs, Brasil, mobile-first. Conceito: "Você
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
preenchido por dados" — a PDP e a página de arquétipo são o mesmo
componente lendo `Archetype` diferente.

## Regras que não podem ser violadas

Herdadas do protótipo (v2 a v6) — não são preferência de estilo, são
decisão de produto já tomada:

1. **Cada resposta do quiz pontua dois arquétipos, nunca um.** Garante
   que o secundário sempre tem lastro (layering deixa de ser
   arbitrário) e que nenhuma pergunta isolada decide o resultado.
2. **Nenhuma pergunta do quiz menciona nota olfativa.** O teste é
   sobre identidade, não sobre preferência de cheiro.
3. **O passo de segmentação filtra o pool antes de pontuar.** O teste
   nunca pode devolver um SKU que a pessoa não compraria (ex.: pool
   masculino nunca inclui Afrodite).
4. **Nenhum claim de efeito fisiológico ou terapêutico.** "Despertar"
   é identidade de marca, não promessa de produto.
5. **200 ml feminino, 220 ml masculino/unissex, exceto Imperador** (50
   ml, único perfume — os outros 8 são body splash).
6. **Cada arquétipo tem URL própria renderizada no servidor:**
   `/arquetipos/:id`. Nunca só um modal ou tab client-side sem rota.
7. **Preço, parcelamento e Pix sempre visíveis junto ao produto** —
   nunca atrás de accordion ou clique extra.
8. **Zeus (`status: 'wait'`) nunca vende.** Se o quiz devolve Zeus
   como dominante, a tela mostra lista de espera e empurra o
   secundário como oferta — nunca esconde o resultado nem substitui
   silenciosamente o arquétipo.

## Pendências técnicas conhecidas

- **Drawer funcional** (`components/Drawer.tsx`, aberto via `Layout`).
  Itens sem página real (Sobre, Ajuda e trocas) ficam visíveis mas
  desabilitados com rótulo "Em breve" em vez de link morto ou rota
  inventada — quando essas páginas existirem, trocar por `Link` de
  verdade em `Drawer.tsx`.
- **PDP existe em `/loja/:id`** (`pages/ProductPage.tsx`), com
  `CartContext` global (`context/CartContext.tsx`) — header, barra de
  frete e `KitBuilder` compartilham a mesma sacola agora.
- **Sem persistência.** O carrinho vive só em memória (`useState`); dá
  reload e some. Não implementar localStorage/backend sem perguntar —
  depende de onde o checkout de verdade vai rodar.
- **"Comprar agora" hoje faz o mesmo que "Adicionar à sacola".** Não
  existe checkout — decidir isso é decisão de produto, não técnica.
- **`/kit-descoberta` e `/criadores` existem** (`pages/KitPage.tsx`,
  `pages/CreatorsPage.tsx`). Comissão do afiliado e preço do kit vêm
  de `data/economics.ts` (`ECON`), não hard-coded no componente —
  `comissaoPct` é HIPÓTESE (chute do v6, sem CMV real por trás);
  `kitMargemPct` fica `null` de propósito, mesmo motivo.
- **Formulário de criador e "adicionar kit à sacola" não persistem de
  verdade** — submit só muda estado local (`submitted`/`added`), sem
  request nenhuma. Precisa de backend antes de ir pra produção.
- **FAQ e legal ainda não existem como página própria** — o FAQ
  genérico já está portado dentro da PDP, mas não isolado com
  schema.org/FAQPage.
- **Avaliações na PDP são propositalmente genéricas** — o v6 tinha
  depoimentos e contagem reais só pra Sereia (208 avaliações, nomes de
  clientes). Não estendi isso pros outros 8 porque seria inventar
  review — ver regra de copy abaixo.
- **INCI na ficha técnica é o esqueleto comum a todo body splash**
  (álcool, água, parfum, glicerina). Os alérgenos de fragrância
  específicos de cada arquétipo dependem da fórmula real da Scentec —
  não preenchi por arquétipo pelo mesmo motivo das avaliações.
- **`UGC_VIDEOS` em `data/home.ts` tem depoimentos fictícios/ilustrativos**
  (3 dos 5 criadores e seus textos foram inventados pra dar volume ao
  carrossel — só os 2 primeiros vêm de `TESTIMONIALS`, que já eram
  ilustrativos). Trocar por depoimentos e criadores reais antes do
  lançamento.

## Pendências reais (não resolvidas no protótipo, não inventar resposta)

- Pirâmides olfativas em `data/archetypes.ts` são proposta funcional.
  A ficha técnica da Scentec manda quando chegar — não alterar sem a
  fonte.
- Preço do splash masculino (`imperador`/`fenix`/`zeus`/`guerreiro`
  hoje R$ 94,90) ainda não foi decidido se unifica com o feminino (R$
  89,90) pra escada de preço fechar. Ver v6, "Três decisões".
- CMV/CAC não existem — não construir lógica de ponto de equilíbrio ou
  desconto máximo sem confirmar com o usuário primeiro.

## Convenções de trabalho

- Português nas strings de UI e nos dados de conteúdo; inglês em
  nomes de tipo, variável e arquivo — como já está no código.
- Não inventar copy novo pros 9 arquétipos. Se uma seção nova precisa
  de texto que não existe no v6, perguntar antes de escrever.
- Rodar `npx tsc -b` e `npm run build` antes de considerar qualquer
  mudança pronta.
- Não adicionar biblioteca de UI/componentes (shadcn, MUI, etc.) sem
  perguntar — o visual é definido pelos tokens de `src/index.css`,
  portados do protótipo.
