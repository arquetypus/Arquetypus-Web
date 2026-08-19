# PROMPT DE REFINAMENTO — ARQUETYPUS V7.1
## Ajustes sobre a implementação atual

> **Contexto:** A V7 implementou hero sticky, Reveal/motion, CaptureModal, banners secundários, segmentação, famílias/energias em cards, ArchetypePage cinematográfica, ResultPage com card compartilhável e PDP com accordions. Os ajustes abaixo não reescrevem nada — refinam o que já está implementado.

> **Regra:** Todas as regras do CLAUDE.md continuam valendo. Não inventar copy. Conteúdo em `data/`, nunca hardcoded. Não adicionar lib de UI.

---

## 1. SEÇÕES DARK NA HOME — Ritmo claro/escuro

**Problema:** Todos os tokens dark (`--color-noite`, `--color-noite-2`, `--color-papel-inv`) existem no CSS mas nenhuma seção da home os usa. Tudo é `bg-papel` ou `bg-papel-2`. Falta contraste dramático e ritmo visual.

**Arquivo:** `pages/HomePage.tsx`

### Converter para fundo escuro estas seções:

1. **H-18 Comparativo** — É a seção "nós vs. eles", o momento de maior diferenciação da marca. Trocar:
   - Container: `bg-papel-2` → `bg-noite`
   - Título e textos principais: adicionar `text-papel-inv`
   - Textos secundários (Splash comum): `text-tinta-3` → `text-papel-inv/50`
   - Coluna Arquetypus: `text-tinta-2` → `text-papel-inv/80`
   - A frase final em itálico fica com `text-papel-inv`
   - Borders internos: `border-linha-2` → `border-papel-inv/10`

2. **H-13 Catálogo dos 9** — Os cards com `bg` colorido de cada arquétipo ganham contraste enorme sobre fundo escuro. Trocar:
   - Container: `py-7` → `bg-noite py-8`
   - Eyebrow e título: adicionar `text-papel-inv`
   - Cards: manter `bg-papel` nos cards (eles flutuam sobre o fundo escuro)
   - Isso cria o efeito "galeria" com cards claros sobre fundo negro

3. **H-20 Garantia** — Seção emocional que ganha peso em dark. Trocar:
   - Container: `bg-papel-2` → `bg-noite`
   - Todos os textos: `text-papel-inv`, secundários `text-papel-inv/70`
   - O selo "30 dias": `border-papel-inv/20 text-papel-inv`

4. **H-22 Diário olfativo** — Trocar:
   - Container: `bg-papel-2` → `bg-noite`
   - Eyebrow, título, subtítulos: `text-papel-inv`
   - Body dos itens: `text-papel-inv/70`
   - Seta `→`: manter `text-latao` (dourado sobre escuro fica rico)

### Garantir que a alternância resultante seja:
```
Hero (escuro/vídeo)
└─ PUV (papel)
└─ Selos (papel)
└─ Banners secundários (papel)
└─ Diagnóstico (papel-2)
└─ Banner coleção (papel)
└─ Segmentação (papel)
└─ Famílias (papel)
└─ Energias (papel-2)
└─ Qualificação (papel)
└─ Método (papel-2)
└─ Catálogo dos 9 (NOITE) ← dark
└─ Kit Descoberta (papel)
└─ Kit Builder (papel-2)
└─ Stats (papel)
└─ Comparativo (NOITE) ← dark
└─ Comunidade UGC (papel)
└─ Garantia (NOITE) ← dark
└─ Criadores (papel)
└─ Diário (NOITE) ← dark
└─ Captura (papel)
└─ Footer (papel, border-top)
```

---

## 2. REVEAL NA ARCHETYPE PAGE

**Problema:** A ArchetypePage é a página mais narrativa do site mas as seções entram sem nenhuma animação. O scroll é longo e estático.

**Arquivo:** `pages/ArchetypePage.tsx`

### O que fazer:
- Importar `Reveal` de `@/components/ui/Reveal`
- Envolver cada `<section>` em `<Reveal as="section" ...>` mantendo todos os props de className e style que já existem
- As seções que devem receber Reveal:
  1. Hero (min-h-[70svh]) — **NÃO envolver em Reveal**, é a primeira coisa visível
  2. "Quem é" → `<Reveal as="section" className="bg-papel px-4 py-10">`
  3. "O que tem a ver com cheiro" → `<Reveal as="section" className="px-4 py-10" style={{ background: a.bg }}>`
  4. "Pirâmide olfativa" → `<Reveal as="section" className="bg-papel px-4 py-10">`
  5. "Layering" → `<Reveal as="section" className="px-4 py-10" style={{ background: a.bg }}>`
  6. "CTA final" → `<Reveal as="section" className="bg-papel px-4 py-10">`

---

## 3. REVEAL + ANIMAÇÃO DE ENTRADA NA RESULT PAGE

**Problema:** O resultado do quiz é o "aha moment" da marca, mas o nome do arquétipo entra sem qualquer efeito. É flat.

**Arquivo:** `pages/ResultPage.tsx`, `index.css`

### O que fazer:

**3a. Animação de revelação do nome:**

Adicionar em `index.css`:
```css
@media (prefers-reduced-motion: no-preference) {
  .reveal-name {
    animation: reveal-name 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
}

@keyframes reveal-name {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

Na seção de revelação (a primeira `<section>` com `min-h-[60svh]`), aplicar:
- No eyebrow (`{a.cod} · Seu arquétipo dominante`): `className="... reveal-name"` com `style={{ animationDelay: '0.2s', opacity: 0 }}`
- No `<h1>` com o nome: `className="... reveal-name"` com `style={{ animationDelay: '0.5s', opacity: 0 }}`
- No `<p>` com `a.card`: `className="... reveal-name"` com `style={{ animationDelay: '0.8s', opacity: 0 }}`

Isso cria um cascade: eyebrow → nome → frase, revelando progressivamente.

**3b. Reveal nas seções seguintes:**

Importar `Reveal` e envolver:
- "Card para compartilhar" → `<Reveal as="section">`
- "Composição dominante/secundário" → `<Reveal as="section">`
- "Layering" → `<Reveal as="section">`
- "CTAs" → `<Reveal as="section">`

---

## 4. CATÁLOGO DOS 9 — CARDS MAIORES

**Problema:** Os cards do catálogo (H-13) têm `w-36` (144px) — estreitos demais para a seção mais importante de produto da home. Com fundo escuro (item 1) o impacto melhora, mas os cards precisam respirar.

**Arquivo:** `pages/HomePage.tsx`, seção H-13

### O que fazer:
- Aumentar os cards de `w-36` para `w-44` (176px)
- Aumentar o nome do arquétipo de `font-display text-sm` para `font-display text-base`
- Aumentar as bolinhas de cor de `size-2` para `size-2.5`
- Opcional: se o fundo for dark (item 1), os cards com `bg-papel` ganham `shadow-lg` sutil para flutuar

---

## 5. HERO CTA — MAIS ELEGANTE

**Problema:** O botão "Fazer o teste" no hero é um bloco branco sólido (`bg-papel-inv py-4`). Funcional, mas pesado visualmente para a estética Cinematic Noir.

**Arquivo:** `components/HeroVideo.tsx`

### O que fazer:
Trocar o botão de:
```tsx
<Link
  to="/teste"
  className="mt-4 block w-full rounded-lg bg-papel-inv py-4 text-center text-sm font-medium text-tinta"
>
```
Para:
```tsx
<Link
  to="/teste"
  className="mt-4 block w-full rounded-lg border border-papel-inv/40 bg-papel-inv/10 py-4 text-center text-sm font-medium text-papel-inv backdrop-blur-sm"
>
```

Isso cria um botão "glass" translúcido sobre o vídeo escuro — mais sofisticado, mantém a legibilidade.

Adicionar um **segundo CTA** abaixo, mais discreto, para quem quer ir direto ao catálogo:
```tsx
<a
  href="#catalogo"
  className="mt-2 block text-center text-xs text-papel-inv/60 underline underline-offset-2"
>
  Ou explore a coleção
</a>
```

---

## 6. FUSÃO DO BANNER COLEÇÃO (H-07) COM O CATÁLOGO (H-13)

**Problema:** A seção H-07 "Nove arquétipos. Um sistema." é um bloco solto com MediaSlot 16:10, desconectado do catálogo. Serve melhor como header visual do catálogo.

**Arquivo:** `pages/HomePage.tsx`

### O que fazer:
- Remover a seção H-07 como bloco independente
- Mover o MediaSlot do bodegón (16:10) para dentro da seção H-13 como header, antes do scroll de cards
- A seção H-13 fica assim:

```tsx
<Reveal as="section" id="catalogo" className="bg-noite py-8">
  {/* Imagem bodegón como header */}
  <MediaSlot
    aspect="16/10"
    bg="#2a2a27"
    requisito="BODEGÓN DOS 9 FRASCOS"
    className="rounded-none border-x-0 border-t-0"
  />
  <div className="px-4 pt-6 pb-3">
    <Eyebrow className="text-latao">O catálogo</Eyebrow>
    <h2 className="mt-2.5 font-display text-2xl text-papel-inv">
      Nove arquétipos.
      <br />
      Um sistema.
    </h2>
    <p className="mt-2 text-sm text-papel-inv/60">
      Dois perfumes e sete body splashes construídos sobre quatro energias.
    </p>
  </div>
  <div className="flex snap-x gap-3 overflow-x-auto px-4 pb-2">
    {/* cards dos 9 mantém bg-papel */}
  </div>
</Reveal>
```

---

## 7. COMUNIDADE UGC — MAIS CONTEÚDO PLACEHOLDER

**Problema:** Só existem 2 items em `UGC_VIDEOS`. Com 2 cards de 70vw o carrossel não rola — ocupa quase a tela toda sem criar a sensação de "tem mais".

**Arquivo:** `data/home.ts`

### O que fazer:
Adicionar mais 3-4 placeholders para que o carrossel tenha scroll real:

```ts
export const UGC_VIDEOS = [
  { creator: '@marianac_', archetypeId: 'cleopatra', testimonial: 'Fiz o teste achando que era brincadeira. Deu Cleópatra e era exatamente eu.' },
  { creator: '@rafa.dias', archetypeId: 'sereia', testimonial: 'Uso Sereia de dia e Fênix à noite. Virou rotina.' },
  { creator: '@brunavieira', archetypeId: 'afrodite', testimonial: 'Toda vez que uso Afrodite alguém pergunta o que eu estou usando.' },
  { creator: '@lucas.arq', archetypeId: 'guerreiro', testimonial: 'Não achava que body splash podia fixar assim. Guerreiro mudou o jogo.' },
  { creator: '@camis.beauty', archetypeId: 'imperatriz', testimonial: 'Imperatriz é o meu cheiro do inverno. Sério, vicia.' },
]
```

**Atenção:** esses depoimentos são placeholders ilustrativos. No CLAUDE.md precisa existir uma nota informando que são fictícios e precisam ser substituídos por conteúdo real antes do lançamento. A lógica do componente já suporta N items sem mudança.

---

## 8. SCROLL SMOOTH NOS LINKS DE ÂNCORA

**Problema:** Os links `href="#catalogo"`, `href="#segmentos"`, `href="#kit"` funcionam via `useEffect` no `HomePage` com `scrollIntoView({ behavior: 'smooth' })`, mas o scroll container não é `window` — é o `div` com `overflow-y-auto` no Layout. Verificar se o smooth scroll funciona corretamente dentro do container scrollável.

**Arquivo:** `pages/HomePage.tsx`, `components/Layout.tsx`

### O que fazer:
- Testar se `document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })` funciona dentro do `scrollRef` do Layout (div com `overflow-y-auto`)
- Se não funcionar, trocar para:
```tsx
const el = document.getElementById(hash.slice(1))
const container = el?.closest('[data-scroll-container]')
if (el && container) {
  container.scrollTo({
    top: el.offsetTop - 60, // compensar header fixo
    behavior: 'smooth',
  })
}
```
E adicionar `data-scroll-container` no div de scroll do Layout.

---

## 9. FOOTER — LINKS FUNCIONAIS

**Problema:** Os links do footer são strings de texto plain, não links reais. Precisam virar `<Link>` para as rotas que existem.

**Arquivo:** `pages/HomePage.tsx`, footer

### O que fazer:
Reorganizar o footer em grupos com links reais para rotas que já existem:
```tsx
<footer className="border-t border-linha px-4 py-8">
  <p className="text-center font-display text-lg text-tinta">ARQUETYPUS</p>
  <nav className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-tinta-2">
    <Link to="/#catalogo">Os 9 arquétipos</Link>
    <Link to="/kit-descoberta">Kit Descoberta</Link>
    <Link to="/teste">Teste de arquétipo</Link>
    <Link to="/criadores">Seja criador</Link>
    <Link to="/#diario">Diário olfativo</Link>
    <span className="text-tinta-3">Trocas e devoluções</span>
    <span className="text-tinta-3">Privacidade</span>
    <span className="text-tinta-3">Termos</span>
  </nav>
  <div className="mt-5 flex justify-center gap-4 text-xs text-tinta-3">
    <span>Instagram</span>
    <span>TikTok</span>
    <span>Pinterest</span>
  </div>
  <p className="mt-4 text-center font-mono text-[9px] text-tinta-3 uppercase">
    Pix · Visa · Master · Elo · Boleto
  </p>
  <p className="mt-3 text-center text-[10px] text-tinta-3">
    sac@arquetypus.com.br · Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba · SP
  </p>
</footer>
```

Items sem rota real (Trocas, Privacidade, Termos, redes sociais) ficam como `<span>` com `text-tinta-3` até terem destino.

---

## ORDEM DE EXECUÇÃO

| # | Item | Impacto | Complexidade |
|---|------|---------|-------------|
| 1 | Seções dark na home | Alto | Baixa — só trocar classes |
| 6 | Fusão H-07 + H-13 | Médio | Baixa — mover JSX |
| 2 | Reveal na ArchetypePage | Alto | Baixa — envolver em componente |
| 3 | Reveal + animação no ResultPage | Alto | Baixa — CSS + envolver |
| 5 | Hero CTA glass | Médio | Baixa — trocar classes |
| 4 | Cards maiores no catálogo | Médio | Baixa — trocar w-36 → w-44 |
| 7 | Mais UGC placeholders | Baixo | Baixa — adicionar dados |
| 8 | Scroll smooth âncoras | Médio | Média — testar no container |
| 9 | Footer com links reais | Baixo | Baixa — trocar JSX |

Todos os itens são de baixa complexidade. A maioria envolve trocar classes CSS e envolver seções em `<Reveal>`. O item de maior impacto visual é o 1 (seções dark) porque transforma o ritmo inteiro da página com mudanças puramente de classes.