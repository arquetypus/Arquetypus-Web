# PROMPT DE DESIGN — ARQUETYPUS V8
## De wireframe com ritmo a site com alma

> **Onde estamos:** Estrutura sólida (7 rotas, quiz, cart, drawer, capture modal), bugs resolvidos, ritmo dark/light, motion framework (Reveal, reveal-name, page-fade). Tudo funciona. Mas o visual ainda comunica "protótipo organizado", não "perfumaria de arquétipos". Este prompt foca exclusivamente em decisões de design — nenhuma feature nova, nenhuma mudança de lógica.

> **Todas as regras do CLAUDE.md continuam valendo.**

---

## 0. FONTES NÃO ESTÃO CARREGANDO

**Bug crítico de design.** Os tokens `--font-display: 'Bodoni Moda'`, `--font-sans: 'Jost'` e `--font-mono: 'IBM Plex Mono'` existem no CSS mas **nenhuma dessas fontes é importada**. Não há `<link>` no `index.html`, nem `@import` no CSS, nem `@font-face`. O browser faz fallback para serif/sans-serif/monospace do sistema. A identidade tipográfica inteira da marca está invisível.

**Arquivo:** `index.html`

Adicionar antes de `</head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&family=IBM+Plex+Mono:wght@400&family=Jost:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

- Bodoni Moda: regular 400, bold 700, italic 400 (opsz 6-96 para variação óptica)
- Jost: light 300 (body default), regular 400, medium 500 (botões e destaques)
- IBM Plex Mono: regular 400 (eyebrows e dados técnicos)

Só esse fix já vai transformar o visual inteiro porque a Bodoni Moda nos headings e a Jost light no body são a alma tipográfica da marca.

---

## 1. ESCALA TIPOGRÁFICA — MAIS CONTRASTE E DRAMA

**O problema:** Todos os headings são `text-2xl` (24px). Todas as eyebrows são `text-[9.5px]`. Todos os body são `text-sm` (14px). Sem variação, sem hierarquia, sem drama. O site lê como um bloco contínuo de texto do mesmo tamanho.

**Arquivo:** múltiplos

### Definir escala com intenção:

```
Hero h1:        text-4xl (36px) → ou text-5xl em mobile-first (48px no ArchetypePage)
Section h2:     text-2xl (24px) → manter, está ok para seções
Section h2 dark: text-3xl (30px) → os headings em seções dark devem ser maiores
Body:           text-base (16px) → subir de text-sm (14px) para text-base nos parágrafos narrativos
Body small:     text-sm (14px) → manter para descrições secundárias
Caption/meta:   text-xs (12px) → manter
Mono data:      text-[10px] → manter
```

### Onde aplicar:

- **HeroVideo h1**: `text-3xl` → `text-4xl` ou `text-[2.5rem]`. "Qual arquétipo desperta em você?" é o primeiro texto que todos leem, precisa dominar.
- **ArchetypePage h1**: `text-6xl` está ótimo — manter. É a página mais dramática.
- **ResultPage h1**: `text-6xl` está ótimo — manter.
- **HomePage h2 em seções dark** (Catálogo, Comparativo, Garantia, Diário): subir de `text-2xl` para `text-3xl`. No fundo escuro o heading precisa de mais peso.
- **PUV (primeira seção após hero)**: o body está em `text-sm`. Subir para `text-base leading-relaxed` — é a proposição de valor, precisa de presença.
- **ArchetypePage "Quem é" e "Cheiro"**: `text-lg leading-relaxed` → `text-[1.125rem] leading-[1.75]` ou `text-lg leading-loose`. Esses parágrafos são conteúdo editorial, precisam de leading generoso para respirar.

### Bodoni Moda italic como acento:

O italic da Bodoni é lindo e sub-usado. Atualmente só aparece em epítetos (`a.ep`) e na frase do comparativo. Expandir:
- Na **Garantia**, o texto "Mesmo com o frasco aberto" deveria ser `font-display italic` em vez de mono uppercase
- No **Kit Descoberta**, "O valor volta como crédito" deveria ter uma palavra em italic para destaque
- No **footer**, "ARQUETYPUS" poderia usar italic de destaque na tagline (se houver)

---

## 2. BOTÕES — HIERARQUIA VISUAL CLARA

**O problema:** Existem 3 tipos de botão no site todo, e dois deles parecem iguais:
- Primário: `bg-tinta text-papel rounded-lg py-4` (preto sólido)
- Secundário: `border border-linha-2 rounded-lg py-4` (outline cinza)
- Glass (só no hero): `border-papel-inv/40 bg-papel-inv/10 backdrop-blur-sm`

O primário e o secundário são blocos retangulares idênticos em peso — a diferença é só fill vs outline. Não há hierarquia forte.

### Redesenhar com 3 níveis claros:

**Primário (ação decisiva — comprar, fazer o teste):**
```tsx
className="w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
```
Adicionar `tracking-wide uppercase` para dar mais presença ao botão principal. O `uppercase` diferencia visualmente do secundário.

**Secundário (navegação — ver coleção, conhecer arquétipo):**
```tsx
className="inline-block rounded-full border border-linha-2 px-6 py-2.5 text-xs font-medium"
```
Trocar de `rounded-lg` para `rounded-full` (pill shape) nos botões secundários. Isso cria contraste formal com o primário retangular. O tamanho menor (`py-2.5` vs `py-4`) reforça a hierarquia.

**Terciário (links suaves — "Ou explore a coleção", "Refazer o teste"):**
```tsx
className="text-sm text-tinta-2 underline underline-offset-4 decoration-linha-2"
```
Underline discreto, sem borda, sem background.

### Onde aplicar:

- Todos os `rounded-lg border border-linha-2 px-5 py-3` e `rounded-lg border border-linha-2 px-4 py-2` internos (cards, banners, segmentação) → viram `rounded-full` pill
- "Quero ser criador", "Ver coleção", "Conhecer Afrodite" → pill
- "Fazer o teste", "Comprar agora", "Quero experimentar", "Quero meu cupom" → mantêm retangular com uppercase
- "Não sei se é o meu — fazer o teste", "Refazer o teste" → terciário underline

---

## 3. SELOS — REDESENHO COMO STRIP HORIZONTAL

**O problema:** Os 4 selos (Vegano, Cruelty free, ANVISA, IFRA 51) são caixinhas iguais com `text-[8px]` — micro, genéricas, facilmente ignoráveis. Parecem placeholder.

### Redesenhar como strip horizontal contínua:

```tsx
<section className="flex items-center justify-center gap-4 border-y border-linha px-4 py-3">
  {SEALS.map((s) => (
    <span key={s} className="font-mono text-[9px] tracking-widest text-tinta-3 uppercase">
      {s}
    </span>
  ))}
</section>
```

Uma linha horizontal única, separada por espaço (sem caixas), com border top e bottom para criar uma faixa visual. Muito mais limpo e editorial. Os selos são informação de credibilidade, não cards.

---

## 4. DIAGNÓSTICO — MAIS PESO VISUAL

**O problema:** A seção "Você já comprou um cheiro que não era seu?" é a primeira seção de conteúdo com argumento, mas visualmente é idêntica a todas as outras (Eyebrow → h2 → lista).

### Redesenhar com destaque no número:

```tsx
{DIAGNOSIS.map((d) => (
  <div key={d.n} className="flex gap-4">
    <span className="font-display text-4xl text-linha-2">{d.n}</span>
    <div className="pt-1">
      <b className="text-base">{d.title}</b>
      <p className="mt-1 text-sm text-tinta-2">{d.body}</p>
    </div>
  </div>
))}
```

Número grande em `font-display text-4xl` com cor suave (`text-linha-2`) cria ancoragem visual sem ser gritante. O body sobe para `text-base` no título. Isso diferencia essa seção de todas as outras "listas com eyebrow".

---

## 5. STATS — NÚMERO COMO STATEMENT

**O problema:** Os stats (94%, 89%, etc.) são `text-3xl text-latao` em grid 2x2. Funcionais mas sem impacto. Para uma seção que deveria provar o ponto com dados, os números precisam dominar.

### Redesenhar:

```tsx
<div className="mt-5 grid grid-cols-2 gap-6">
  {STATS.map((st) => (
    <div key={st.label}>
      <span className="block font-display text-5xl tracking-tight text-latao">{st.pct}</span>
      <span className="mt-2 block text-sm leading-snug text-tinta-2">{st.label}</span>
    </div>
  ))}
</div>
```

De `text-3xl` para `text-5xl` e `tracking-tight`. O número vira statement visual. O label ganha `leading-snug` e mais margem top para não colar no número.

---

## 6. COMPARATIVO — CHECK × CROSS VISUAL

**O problema:** As duas colunas (Arquetypus vs Splash comum) são listas de texto plain. Nada diferencia visualmente os items positivos dos negativos.

### Adicionar indicador visual:

```tsx
{/* Coluna Arquetypus */}
<ul className="mt-3 flex flex-col gap-2.5">
  {COMPARISON.arquetypus.map((c) => (
    <li key={c} className="flex gap-2 text-[11px] text-papel-inv/80">
      <span className="mt-0.5 text-ok">✓</span>
      {c}
    </li>
  ))}
</ul>

{/* Coluna Splash comum */}
<ul className="mt-3 flex flex-col gap-2.5">
  {COMPARISON.comum.map((c) => (
    <li key={c} className="flex gap-2 text-[11px] text-papel-inv/40">
      <span className="mt-0.5 text-alerta/60">✗</span>
      {c}
    </li>
  ))}
</ul>
```

Check verde na coluna positiva, cross vermelho suave na negativa. A coluna negativa ganha `text-papel-inv/40` (mais apagada) para reforçar que é inferior.

---

## 7. QUIZ — PERSONALIDADE VISUAL

**O problema:** O quiz é a feature mais importante da marca e visualmente é a página mais genérica do site. Fundo branco, botões de borda cinza, sem nenhuma cor ou personalidade.

### Redesenhar a QuizPage:

- **Background:** A página inteira deveria ter `bg-noite text-papel-inv` — escuro cria foco e intimidade. O quiz é uma jornada introspectiva, não um formulário.
- **Progress bar:** Trocar de `bg-latao` para gradiente que muda de cor conforme avança: `bg-gradient-to-r from-afrodite via-latao to-fenix`. Cria sensação de progressão visual.
- **Opções:** Cards mais expressivos:
```tsx
<button
  key={i}
  onClick={() => pick(i)}
  className="flex items-center gap-3 rounded-xl border border-papel-inv/15 bg-papel-inv/5 p-4 text-left text-sm text-papel-inv/90 transition-colors hover:bg-papel-inv/10"
>
  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-papel-inv/20 font-mono text-xs text-papel-inv/50">
    {String.fromCharCode(65 + i)}
  </span>
  <span>{o.label}</span>
</button>
```
Letra em círculo, background sutil, bordas translúcidas. Cria elegância sem peso.

- **Pergunta:** `text-2xl` → `text-3xl` com `font-display` e `text-papel-inv`.

- **Segmentação inicial** (Feminina / Masculina / Mostrar os nove): mesmos cards escuros.

---

## 8. CATÁLOGO CARDS — MAIS REFINAMENTO

**O problema:** Os cards dos 9 arquétipos têm a parte superior colorida (`a.bg`) e a parte inferior branca com dados. Funcional, mas o bloco colorido é um retângulo vazio esperando foto. Sem foto, ele precisa comunicar algo.

### Melhorar o placeholder:

No bloco colorido de cada card, adicionar o nome do arquétipo em display grande e transparente como marca d'água:
```tsx
<div
  className="relative flex aspect-[4/5] items-end overflow-hidden rounded-t-lg p-2.5"
  style={{ background: a.bg }}
>
  {/* Nome como marca d'água */}
  <span
    className="absolute -bottom-2 -left-1 font-display text-[3rem] leading-none tracking-tight opacity-10"
    style={{ color: a.cor }}
  >
    {a.nome}
  </span>
  <span className="relative font-mono text-[8px] text-tinta-2">{a.cod}</span>
  {a.status === 'wait' && (
    <span className="absolute top-1.5 right-1.5 rounded bg-papel/80 px-1 py-0.5 font-mono text-[7px] text-alerta uppercase">
      Em breve
    </span>
  )}
</div>
```

O nome do arquétipo em tamanho gigante com opacidade 10% cria identidade visual em cada card sem precisar de foto.

---

## 9. GARANTIA — MAIS DRAMÁTICA

**O problema:** A seção de garantia tem o selo "30 dias" centralizado com `border-papel-inv/20`, seguido de texto plain. Funcional, mas para a principal objeção que ela resolve (medo de comprar online sem cheirar), precisa de mais presença.

### Redesenhar:

```tsx
<Reveal as="section" className="bg-noite px-4 py-12 text-center" animateContent>
  <div className="font-display text-7xl text-papel-inv/15">30</div>
  <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-latao uppercase">
    Dias de garantia
  </p>
  <h2 className="mt-4 font-display text-2xl text-papel-inv">
    Se não for o seu cheiro,
    <br />
    <em>é por nossa conta</em>
  </h2>
  <p className="mt-4 text-sm leading-relaxed text-papel-inv/60">
    Use, cheire, teste na sua pele. Se não for você, devolvemos o valor.
    <br />Sem perguntas, sem julgamento. Mesmo com o frasco aberto.
  </p>
</Reveal>
```

O "30" em `text-7xl text-papel-inv/15` vira o statement visual da seção — um número enorme e fantasma no fundo. A hierarquia fica: número gigante → label mono → heading com italic → body discreto. Mais `py-12` para dar respiro vertical.

---

## 10. FOOTER — MAIS ESTRUTURADO E ELEGANTE

**O problema:** O footer é um bloco de texto genérico. Para uma marca que se posiciona como perfumaria premium, o footer precisa ter acabamento.

### Redesenhar:

```tsx
<footer className="bg-noite px-4 py-10">
  <p className="text-center font-display text-2xl tracking-wide text-papel-inv">
    ARQUETYPUS
  </p>
  <p className="mt-1 text-center font-display text-xs italic text-papel-inv/40">
    Perfumaria de arquétipos
  </p>

  <nav className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-papel-inv/60">
    <Link to="/#catalogo" className="hover:text-papel-inv">Os 9 arquétipos</Link>
    <Link to="/kit-descoberta" className="hover:text-papel-inv">Kit Descoberta</Link>
    <Link to="/teste" className="hover:text-papel-inv">Teste de arquétipo</Link>
    <Link to="/criadores" className="hover:text-papel-inv">Seja criador</Link>
    <Link to="/#diario" className="hover:text-papel-inv">Diário olfativo</Link>
    <span className="text-papel-inv/30">Trocas e devoluções</span>
    <span className="text-papel-inv/30">Privacidade</span>
    <span className="text-papel-inv/30">Termos</span>
  </nav>

  <div className="mt-8 flex justify-center gap-5 text-xs text-papel-inv/40">
    <span>Instagram</span>
    <span>TikTok</span>
    <span>Pinterest</span>
  </div>

  <div className="mt-6 border-t border-papel-inv/10 pt-4 text-center font-mono text-[8px] tracking-wider text-papel-inv/30 uppercase">
    <p>Pix · Visa · Master · Elo · Boleto</p>
    <p className="mt-2">
      sac@arquetypus.com.br · Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP
    </p>
  </div>
</footer>
```

Footer dark (`bg-noite`) fecha o loop visual com o hero. Links hover para branco. Tagline em Bodoni italic. Divisor sutil antes dos dados legais.

---

## ORDEM DE EXECUÇÃO

| # | Item | Impacto visual | Complexidade |
|---|------|---------------|-------------|
| 0 | Carregar fontes | **Transformador** | 3 linhas no HTML |
| 1 | Escala tipográfica | Alto | Trocar classes |
| 7 | Quiz dark + personalidade | Alto | Redesenho de página |
| 2 | Hierarquia de botões | Alto | Trocar classes |
| 9 | Garantia dramática | Médio | Redesenho de seção |
| 10 | Footer dark e estruturado | Médio | Redesenho de seção |
| 5 | Stats números gigantes | Médio | Trocar classes |
| 6 | Comparativo ✓/✗ | Médio | Trocar classes |
| 3 | Selos como strip | Médio | Redesenho simples |
| 8 | Catálogo marca d'água | Médio | Adicionar span |
| 4 | Diagnóstico número grande | Baixo | Trocar classes |

O item 0 (fontes) sozinho muda a percepção do site inteiro. É a mudança mais impactante de toda a lista e custa 3 linhas de HTML. Fazer primeiro e ver o resultado antes de continuar.