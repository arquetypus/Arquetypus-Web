# Prompts de imagens — Arquetypus Web

> Levantado manualmente a partir do código (`src/data/`, `src/pages/`, `src/components/`) e do
> layout de referência https://lab-fabio.vercel.app/modelo-04/index.html.
> **Status: 41/41 arquivos regerados e conectados no código.**

## Referência de frasco (decisão de estilo)

O modelo-04 (lab-fabio) foi usado como referência de **forma do frasco, tampa, bomba spray,
composição do rótulo e caixa** — não de paleta. As 9 fotos "frente" já estão salvas em
`src/assets/reference-lab-fabio/<id>-frente.jpg`, baixadas do próprio site, pra usar como
imagem de referência (img2img) em cada prompt.

**Cor continua sendo a nossa (`src/data/archetypes.ts`, campos `cor`/`bg`), não a do site de
referência.** O motivo: `cor`/`bg` já dirigem todo o resto da UI (cards do catálogo, gradiente,
número do arquétipo, tint dos badges) — trocar pra paleta do modelo-04 quebraria a consistência
com o site já construído. Só a *fotografia do produto* (frasco cilíndrico, tampa arredondada,
rótulo enrolado com o nome em serifa vertical, logo raio-de-sol) vem do modelo-04.

**Imperador:** decisão do usuário em 2026-09-22 — descartar por enquanto a regra 5 do
`CLAUDE.md` ("Imperador é o único perfume, 50 ml, frasco diferente"). Ele segue agora a MESMA
forma/220 ml dos outros 8, igual ao modelo-04. `CLAUDE.md` ainda não foi atualizado com isso —
se a decisão for definitiva, atualizar a regra 5 lá também.

## Como usar

1. Gere com o Higgsfield CLI (já instalado e autenticado nesta máquina — `higgsfield auth login`).
2. Cada bloco abaixo já é o comando completo (`higgsfield product-photoshoot create ...`). Rode
   da raiz do projeto pra `--image` (caminho relativo) resolver certo.
3. `--wait` bloqueia até terminar e imprime a URL do resultado. Baixe com
   `curl -sL <url> -o src/assets/mocks/<arquivo>`.
4. Depois de salvo: importar o arquivo no `data/` correspondente (`archetypes.ts` não guarda
   imagem — é `data/home.ts` e os imports no topo dos arquivos de página) e passar pro
   `MediaSlot`/`<img>` via `src`. Isso troca o placeholder tracejado pela imagem — fora do
   escopo deste documento.
5. Marque `✅` no checklist conforme for entregando.

Estilo base (repetido em todo prompt):
```
Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark, ARQUETYPUS PARFUM logo only where the label itself shows it. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background.
```

Frasco base (repetido em todo prompt com produto):
```
Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, metallic spray pump, lower two-thirds wrapped in a colored label with a sunburst-"A" logo and "ARQUÊTYPUS PARFUM" wordmark at the top, the archetype name set in large vertical serif type along the left edge of the label. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), only recolor the label/liquid to the hex given.
```

## Checklist

| ✓ | Arquivo (em `src/assets/mocks/`) | Formato | Onde aparece |
|---|---|---|---|
| ✅ | `frasco-afrodite.png` | 3:4 · full-bleed | Home › Catálogo, card Afrodite |
| ✅ | `frasco-imperatriz.png` | 3:4 · full-bleed | Home › Catálogo, card Imperatriz |
| ✅ | `frasco-cleopatra.png` | 3:4 · full-bleed | Home › Catálogo, card Cleópatra |
| ✅ | `frasco-fada.png` | 3:4 · full-bleed | Home › Catálogo, card Fada |
| ✅ | `frasco-sereia2.png` | 3:4 · full-bleed | Home › Catálogo, card Sereia |
| ✅ | `frasco-zeus.png` | 3:4 · full-bleed | Home › Catálogo, card Zeus |
| ✅ | `frasco-guerreiro.png` | 3:4 · full-bleed | Home › Catálogo, card Guerreiro |
| ✅ | `frasco-imperador.png` | 3:4 · full-bleed | Home › Catálogo, card Imperador |
| ✅ | `frasco-fenix.png` | 3:4 · full-bleed | Home › Catálogo, card Fênix |
| ✅ | `pdp-afrodite.png` | 1:1 · 1200×1200 | PDP Afrodite › galeria |
| ✅ | `pdp-imperatriz.png` | 1:1 · 1200×1200 | PDP Imperatriz › galeria |
| ✅ | `pdp-cleopatra.png` | 1:1 · 1200×1200 | PDP Cleópatra › galeria |
| ✅ | `pdp-fada.png` | 1:1 · 1200×1200 | PDP Fada › galeria |
| ✅ | `pdp-sereia.png` | 1:1 · 1200×1200 | PDP Sereia › galeria (substitui a atual) |
| ✅ | `pdp-zeus.png` | 1:1 · 1200×1200 | PDP Zeus › galeria |
| ✅ | `pdp-guerreiro.png` | 1:1 · 1200×1200 | PDP Guerreiro › galeria |
| ✅ | `pdp-imperador.png` | 1:1 · 1200×1200 | PDP Imperador › galeria |
| ✅ | `pdp-fenix.png` | 1:1 · 1200×1200 | PDP Fênix › galeria |
| ✅ | `hero-video-concept.png` | 9:16 · 1080×1920 | Home › Hero, slide 1 (fullscreen) |
| ✅ | `hero-afrodite.png` | 9:16 · 1080×1920 | Home › Hero, slide 2 — Afrodite lifestyle |
| ✅ | `hero-kit.png` | 9:16 · 1080×1920 | Home › Hero, slide 3 — Kit Descoberta |
| ✅ | `segmento-feminino.png` | 4:3 · 1600×1200 | Home › Segmentação — Para elas |
| ✅ | `segmento-masculino.png` | 4:3 · 1600×1200 | Home › Segmentação — Para eles |
| ✅ | `segmento-unissex.png` | 4:3 · 1600×1200 | Home › Segmentação — Para todos |
| ✅ | `familia-floral-bleed.png` | 4:5 · sem produto | Home › Descubra por família — Floral |
| ✅ | `familia-aquatico-bleed.png` | 4:5 · sem produto | Home › Descubra por família — Aquático |
| ✅ | `familia-amadeirado-bleed.png` | 4:5 · sem produto | Home › Descubra por família — Amadeirado |
| ✅ | `familia-oriental-bleed.png` | 4:5 · sem produto | Home › Descubra por família — Oriental |
| ✅ | `energia-seducao.png` | 4:5 | Home › Que energia você quer despertar — Sedução |
| ✅ | `energia-poder.png` | 4:5 | Home › Que energia — Poder |
| ✅ | `energia-misterio.png` | 4:5 | Home › Que energia — Mistério |
| ✅ | `energia-forca.png` | 4:5 | Home › Que energia — Força |
| ✅ | `bodegon-9-frascos.png` | banner largo | Home › topo da seção Catálogo |
| ✅ | `home/banner-kit-descoberta.png` | 16:10 · 1600×1000 | Home › Kit Descoberta, banner |
| ✅ | `kit-9-minis.png` | 4:5 · 1600×2000 | `/kit-descoberta` › hero, os 9 minis alinhados |
| ✅ | `creators-hero.png` | 4:5 · 1600×2000 | `/criadores` › hero, criador(a) com frasco |
| ✅ | `ugc-cleopatra.png` | 9:16 · 1080×1920 | Home › Quem já despertou — @marianac_ · Cleópatra |
| ✅ | `ugc-sereia.png` | 9:16 · 1080×1920 | Home › Quem já despertou — @rafa.dias · Sereia |
| ✅ | `ugc-afrodite.png` | 9:16 · 1080×1920 | Home › Quem já despertou — @brunavieira · Afrodite |
| ✅ | `ugc-guerreiro.png` | 9:16 · 1080×1920 | Home › Quem já despertou — @lucas.arq · Guerreiro |
| ✅ | `ugc-imperatriz.png` | 9:16 · 1080×1920 | Home › Quem já despertou — @camis.beauty · Imperatriz |

## Prompts

### Frascos — catálogo (3:4, full-bleed no card)

**✅ `frasco-afrodite.png`** — 3:4 · full-bleed · Home › Catálogo, card Afrodite
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/afrodite-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, rose-gold metallic spray pump, lower two-thirds wrapped in a #B9697F dusty rose pink label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #B9697F. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #F1E8EA background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Afrodite — Floral sedutor, energia Sedução. Epíteto: O floral que não pede licença." \
  --wait
```

**✅ `frasco-imperatriz.png`** — 3:4 · full-bleed · Home › Catálogo, card Imperatriz
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/imperatriz-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, dark bronze metallic spray pump, lower two-thirds wrapped in a #8E4566 deep berry-wine label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #8E4566. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #F0E6EB background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Imperatriz — Oriental âmbar, energia Poder. Epíteto: Não herda o trono. Toma." \
  --wait
```

**✅ `frasco-cleopatra.png`** — 3:4 · full-bleed · Home › Catálogo, card Cleópatra
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/cleopatra-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, antique-gold metallic spray pump, lower two-thirds wrapped in a #A08148 warm amber-gold label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #A08148. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #F1ECE1 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Cleópatra — Oriental especiado, energia Sedução. Epíteto: Sedução é estratégia, não acaso." \
  --wait
```

**✅ `frasco-fada.png`** — 3:4 · full-bleed · Home › Catálogo, card Fada
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/fada-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed silver metallic spray pump, lower two-thirds wrapped in a #8FA3B8 soft powder-blue label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #8FA3B8. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #E9EEF3 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Fada — Floral fresco, energia Mistério. Epíteto: Leve não é frágil." \
  --wait
```

**✅ `frasco-sereia2.png`** — 3:4 · full-bleed · Home › Catálogo, card Sereia
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/sereia-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed silver metallic spray pump, lower two-thirds wrapped in a #3C7484 deep teal label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #3C7484. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #E8EFF1 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Sereia — Aquático doce, energia Mistério. Epíteto: Encanta sem levantar a voz." \
  --wait
```

**✅ `frasco-zeus.png`** — 3:4 · full-bleed · Home › Catálogo, card Zeus
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/zeus-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, gunmetal metallic spray pump, lower two-thirds wrapped in a #63748C slate blue-grey label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #63748C. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #E9EBEF background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Zeus — Aromático mineral, energia Força. Epíteto: A voz que encerra a discussão. Status: lista de espera, nunca vende." \
  --wait
```

**✅ `frasco-guerreiro.png`** — 3:4 · full-bleed · Home › Catálogo, card Guerreiro
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/guerreiro-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, matte-black metallic spray pump, lower two-thirds wrapped in a #5F6B4C olive moss-green label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #5F6B4C. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #EDEFE7 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Guerreiro — Aromático aquático, energia Força. Epíteto: Constância é a forma mais rara de coragem." \
  --wait
```

**✅ `frasco-imperador.png`** — 3:4 · full-bleed · Home › Catálogo, card Imperador
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/imperador-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, polished dark bronze metallic spray pump, lower two-thirds wrapped in a #7C5236 rich amber-brown label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #7C5236. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #F0EAE4 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Imperador — Âmbar amadeirado, energia Poder. Epíteto: O poder que não precisa ser exercido. 220ml, mesma forma dos outros 8 (decisão 2026-09-22)." \
  --wait
```

**✅ `frasco-fenix.png`** — 3:4 · full-bleed · Home › Catálogo, card Fênix
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/fenix-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed copper metallic spray pump, lower two-thirds wrapped in a #B0563C burnt terracotta-orange label with a sunburst-A logo and ARQUÊTYPUS PARFUM wordmark at the top, archetype name set in large vertical serif type along the left edge. Match bottle shape, cap and label composition EXACTLY to the reference image (img2img), recolor label/liquid to #B0563C. Product fills most of the frame, bottom third left emptier for UI text overlay, seamless pastel #F2EAE7 background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, silent, soft directional studio light, shallow depth of field, ultra-detailed glass reflections, no text, no watermark. No marketplace/stock-photo look, no harsh flash, no pure-white infinite background." \
  --aspect_ratio 3:4 --count 2 --product_context "Fênix — Amadeirado defumado, energia Força. Epíteto: Você já foi outra pessoa. E deu certo." \
  --wait
```

### Frascos — PDP (1:1, still-life mais limpo)

Mesma garrafa de cada arquétipo acima, recomposta em quadrado, still-life mais próximo/menos
atmosférico (a PDP já tem bastante texto ao redor, a foto pode ser mais "produto puro").

**✅ `pdp-afrodite.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/afrodite-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, rose-gold spray pump, #B9697F dusty rose pink label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #B9697F. Centered square product still-life, seamless #F1E8EA background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Afrodite — foto de produto pra página do produto (PDP), still-life limpo" \
  --wait
```

**✅ `pdp-imperatriz.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/imperatriz-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, dark bronze spray pump, #8E4566 deep berry-wine label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #8E4566. Centered square product still-life, seamless #F0E6EB background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Imperatriz — foto de produto pra PDP, still-life limpo" \
  --wait
```

**✅ `pdp-cleopatra.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/cleopatra-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, antique-gold spray pump, #A08148 warm amber-gold label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #A08148. Centered square product still-life, seamless #F1ECE1 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Cleópatra — foto de produto pra PDP, still-life limpo" \
  --wait
```

**✅ `pdp-fada.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/fada-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed silver spray pump, #8FA3B8 soft powder-blue label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #8FA3B8. Centered square product still-life, seamless #E9EEF3 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Fada — foto de produto pra PDP, still-life limpo" \
  --wait
```

**✅ `pdp-sereia.png`** — 1:1 · 1200×1200 (substitui a atual)
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/sereia-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed silver spray pump, #3C7484 deep teal label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #3C7484. Centered square product still-life, seamless #E8EFF1 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Sereia — foto de produto pra PDP, still-life limpo" \
  --wait
```

**✅ `pdp-zeus.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/zeus-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, gunmetal spray pump, #63748C slate blue-grey label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #63748C. Centered square product still-life, seamless #E9EBEF background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Zeus — foto de produto pra PDP, still-life limpo. Status: lista de espera, nunca vende." \
  --wait
```

**✅ `pdp-guerreiro.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/guerreiro-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, matte-black spray pump, #5F6B4C olive moss-green label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #5F6B4C. Centered square product still-life, seamless #EDEFE7 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Guerreiro — foto de produto pra PDP, still-life limpo" \
  --wait
```

**✅ `pdp-imperador.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/imperador-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, polished dark bronze spray pump, #7C5236 rich amber-brown label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #7C5236. Centered square product still-life, seamless #F0EAE4 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Imperador — foto de produto pra PDP, still-life limpo. 220ml, mesma forma dos outros 8." \
  --wait
```

**✅ `pdp-fenix.png`** — 1:1 · 1200×1200
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/reference-lab-fabio/fenix-frente.jpg \
  --prompt "Tall clear glass cylindrical body-splash bottle, rounded clear acrylic overcap, brushed copper spray pump, #B0563C burnt terracotta-orange label, sunburst-A logo + ARQUÊTYPUS PARFUM wordmark, archetype name in vertical serif type. Match bottle/cap/label EXACTLY to reference (img2img), recolor to #B0563C. Centered square product still-life, seamless #F2EAE7 background, soft shadow. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional studio light, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 1:1 --count 2 --product_context "Fênix — foto de produto pra PDP, still-life limpo" \
  --wait
```

### Hero — carrossel do topo (9:16)

**✅ `hero-video-concept.png`** — 9:16 · 1080×1920 · Home › Hero, slide 1 (fullscreen)
```bash
higgsfield product-photoshoot create --mode hero_banner \
  --image src/assets/mocks/bodegon-9-frascos.png \
  --prompt "Vertical fullscreen hero: a single Arquetypus body-splash bottle held close to camera, soft perfume mist rising and catching a warm spotlight against a dark charcoal #1a1917 studio background, cinematic, slow and quiet mood. Lower 40% of frame kept darker/calmer for headline and button overlay. Editorial luxury niche perfumery photography, photorealistic, minimalist, soft directional light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 9:16 --count 3 --brand_context "Arquetypus Parfum — hero fullscreen autoplay, tom cinematográfico e silencioso" \
  --wait
```

**✅ `hero-afrodite.png`** — 9:16 · 1080×1920 · Home › Hero, slide 2 — Afrodite
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/reference-lab-fabio/afrodite-frente.jpg \
  --prompt "Vertical close-up lifestyle photo: a woman's hand holding the Arquetypus Afrodite body-splash bottle (tall clear cylindrical bottle, rounded clear overcap, rose-gold pump, #B9697F dusty rose pink label) against her bare shoulder, warm beige tones, soft sunlight streak across skin, intimate and quiet, not overtly sexual. Lower 40% of frame simple for headline overlay. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 9:16 --count 3 --brand_context "Arquetypus Parfum — hero slide Afrodite, modelo + frasco" \
  --wait
```

**✅ `hero-kit.png`** — 9:16 · 1080×1920 · Home › Hero, slide 3 — Kit Descoberta
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/mocks/bodegon-9-frascos.png \
  --prompt "Vertical photo: a hand holding a fan of nine small 8ml miniature bottles, each a different pastel color matching the 9 archetypes, above a warm neutral textured surface, soft daylight. Lower 40% calm for headline/button overlay. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 9:16 --count 3 --brand_context "Arquetypus Parfum — hero slide Kit Descoberta, 9 minis" \
  --wait
```

### Segmentação (4:3)

**✅ `segmento-feminino.png`** — 4:3 · 1600×1200 · Home › Segmentação — Para elas
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/reference-lab-fabio/afrodite-frente.jpg \
  --prompt "Horizontal lifestyle photo, soft feminine mood: a woman's hands near her collarbone holding an Arquetypus body-splash bottle, warm blush-toned light, minimal styling, editorial and quiet, not overtly posed for an ad. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:3 --count 2 --brand_context "Arquetypus Parfum — segmentação Para elas / Feminino, 5 SKUs" \
  --wait
```

**✅ `segmento-masculino.png`** — 4:3 · 1600×1200 · Home › Segmentação — Para eles
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/reference-lab-fabio/guerreiro-frente.jpg \
  --prompt "Horizontal lifestyle photo, quiet masculine mood: a man's hand holding an Arquetypus body-splash bottle at chest height, cool neutral light, minimal styling, editorial. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:3 --count 2 --brand_context "Arquetypus Parfum — segmentação Para eles / Masculino, 3 SKUs" \
  --wait
```

**✅ `segmento-unissex.png`** — 4:3 · 1600×1200 · Home › Segmentação — Para todos
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/reference-lab-fabio/zeus-frente.jpg \
  --prompt "Horizontal lifestyle photo, neutral/shared mood: two hands (one visibly feminine, one visibly masculine) each reaching for the same Arquetypus body-splash bottle on a neutral surface, soft even light, editorial. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:3 --count 2 --brand_context "Arquetypus Parfum — segmentação Para todos / Compartilhável, 1 SKU (Zeus)" \
  --wait
```

### Famílias olfativas (4:5, sem produto)

**✅ `familia-floral-bleed.png`** — 4:5 · Home › Descubra por família — Floral (Afrodite, Fada)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical macro photo, no bottle, no product: a single blush-pink peony and white rose petals floating in mid-air against a soft powder-pink gradient, blurred petals in foreground. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — família Floral: sedutor e envolvente" \
  --wait
```

**✅ `familia-aquatico-bleed.png`** — 4:5 · Home › Descubra por família — Aquático (Sereia, Guerreiro)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical macro photo, no bottle, no product: sicilian lemon slices and sea salt crystals splashing into crystal-clear turquoise water with bubbles, bright and cool. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — família Aquático: fresco e discreto" \
  --wait
```

**✅ `familia-amadeirado-bleed.png`** — 4:5 · Home › Descubra por família — Amadeirado (Imperador, Fênix)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical macro photo, no bottle, no product: dark sandalwood sticks, cedar shavings and a thin trail of smoke on a charcoal slate surface, moody low-key light. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — família Amadeirado: quente e marcante" \
  --wait
```

**✅ `familia-oriental-bleed.png`** — 4:5 · Home › Descubra por família — Oriental (Cleópatra, Imperatriz)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical macro photo, no bottle, no product: glowing amber resin pieces and vanilla pods suspended in warm golden smoke on a dark amber background. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional natural light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — família Oriental: quente e viciante" \
  --wait
```

### Energias (4:5)

**✅ `energia-seducao.png`** — 4:5 · Home › Que energia — Sedução (Afrodite, Cleópatra)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical moody photo: deep red silk fabric draped and slightly moving, low warm light, sensual but restrained, no product, no people. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — energia Sedução" \
  --wait
```

**✅ `energia-poder.png`** — 4:5 · Home › Que energia — Poder (Imperatriz, Imperador)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical moody photo: polished dark marble and brushed brass surfaces meeting at a sharp diagonal, dramatic single-source light, no product, no people. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — energia Poder" \
  --wait
```

**✅ `energia-misterio.png`** — 4:5 · Home › Que energia — Mistério (Sereia, Fada)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical moody photo: sheer pale fabric floating underwater or in fog, soft diffused blue-grey light, ethereal and quiet, no product, no people. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — energia Mistério" \
  --wait
```

**✅ `energia-forca.png`** — 4:5 · Home › Que energia — Força (Guerreiro, Fênix, Zeus)
```bash
higgsfield product-photoshoot create --mode conceptual_product \
  --prompt "Vertical moody photo: cracked dry earth or weathered stone texture lit by a low raking light at dusk, raw and resilient, no product, no people. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, soft directional light, shallow depth of field, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — energia Força" \
  --wait
```

### Bodegón (topo da seção Catálogo)

**✅ `bodegon-9-frascos.png`** — banner largo · Home › topo da seção "O Catálogo"
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/mocks/frasco-afrodite.png --image src/assets/mocks/frasco-guerreiro.png --image src/assets/mocks/frasco-zeus.png \
  --prompt "Wide horizontal still-life: all 9 Arquetypus body-splash bottles standing in a slight arc, each with the tall clear cylindrical shape and its own label color (dusty rose, berry-wine, amber-gold, powder-blue, teal, slate-blue-grey, olive-green, amber-brown, terracotta-orange), on a dark charcoal #1a1917 seamless surface, single soft spotlight sweeping across, cinematic and quiet. Editorial luxury niche perfumery photography, photorealistic, minimalist, shallow depth of field, no text, no watermark." \
  --aspect_ratio 21:9 --count 2 --brand_context "Arquetypus Parfum — bodegón dos 9 arquétipos, abre a seção do catálogo" \
  --wait
```

### Kit Descoberta

**✅ `home/banner-kit-descoberta.png`** — 16:10 · 1600×1000 · Home › banner Kit Descoberta
```bash
higgsfield product-photoshoot create --mode lifestyle_scene \
  --image src/assets/mocks/bodegon-9-frascos.png \
  --prompt "A hand naturally holding three 8ml miniature bottles (pink, teal, amber), the other six softly out of focus nearby on a warm neutral surface, soft natural window light, editorial and quiet. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, shallow depth of field, no text, no watermark." \
  --aspect_ratio 16:10 --count 3 --brand_context "Arquetypus Parfum — Kit Descoberta, 9 miniaturas de 8ml na mão" \
  --wait
```

**✅ `kit-9-minis.png`** — 4:5 · 1600×2000 · `/kit-descoberta` › hero
```bash
higgsfield product-photoshoot create --mode product_shot \
  --image src/assets/mocks/bodegon-9-frascos.png \
  --prompt "All 9 miniature 8ml perfume bottles aligned in a neat row by size, true-to-scale, each with its own archetype label color, soft directional studio light, seamless warm neutral background. Editorial luxury niche perfumery photography, photorealistic, minimalist, ultra-detailed glass reflections, no text, no watermark." \
  --aspect_ratio 4:5 --count 2 --brand_context "Arquetypus Parfum — Kit Descoberta, os 9 minis alinhados, escala real" \
  --wait
```

### Criadores

**✅ `creators-hero.png`** — 4:5 · 1600×2000 · `/criadores` › hero
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/cleopatra-frente.jpg \
  --prompt "A person's hand and forearm naturally holding an Arquetypus body-splash bottle at chest height, soft natural window light, candid editorial mood, minimal styling, warm neutral clothing, no visible face necessary, not posed like an ad. Editorial luxury niche perfumery photography, photorealistic, cinematic, minimalist, shallow depth of field, no text, no logo, no watermark." \
  --aspect_ratio 4:5 --count 3 --brand_context "Arquetypus Parfum — página de criadores, tom editorial e caseiro, não é anúncio" \
  --wait
```

### UGC — "Quem já despertou" (9:16)

**✅ `ugc-cleopatra.png`** — 9:16 · 1080×1920 · @marianac_ · Cleópatra
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/cleopatra-frente.jpg \
  --prompt "Vertical smartphone-style UGC photo, a person's hand holding the Arquetypus Cleópatra bottle (#A08148 amber-gold label) near their collarbone, candid natural light, slightly imperfect framing like a real Instagram Reel cover, no text overlay." \
  --aspect_ratio 9:16 --count 2 --brand_context "Depoimento de criador(a), estética autêntica de UGC, não polida como anúncio" \
  --wait
```

**✅ `ugc-sereia.png`** — 9:16 · 1080×1920 · @rafa.dias · Sereia
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/sereia-frente.jpg \
  --prompt "Vertical smartphone-style UGC photo, a person's hand holding the Arquetypus Sereia bottle (#3C7484 teal label) near their collarbone, candid natural light, slightly imperfect framing like a real Instagram Reel cover, no text overlay." \
  --aspect_ratio 9:16 --count 2 --brand_context "Depoimento de criador(a), estética autêntica de UGC, não polida como anúncio" \
  --wait
```

**✅ `ugc-afrodite.png`** — 9:16 · 1080×1920 · @brunavieira · Afrodite
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/afrodite-frente.jpg \
  --prompt "Vertical smartphone-style UGC photo, a person's hand holding the Arquetypus Afrodite bottle (#B9697F dusty rose label) near their collarbone, candid natural light, slightly imperfect framing like a real Instagram Reel cover, no text overlay." \
  --aspect_ratio 9:16 --count 2 --brand_context "Depoimento de criador(a), estética autêntica de UGC, não polida como anúncio" \
  --wait
```

**✅ `ugc-guerreiro.png`** — 9:16 · 1080×1920 · @lucas.arq · Guerreiro
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/guerreiro-frente.jpg \
  --prompt "Vertical smartphone-style UGC photo, a person's hand holding the Arquetypus Guerreiro bottle (#5F6B4C olive-green label) near their collarbone, candid natural light, slightly imperfect framing like a real Instagram Reel cover, no text overlay." \
  --aspect_ratio 9:16 --count 2 --brand_context "Depoimento de criador(a), estética autêntica de UGC, não polida como anúncio" \
  --wait
```

**✅ `ugc-imperatriz.png`** — 9:16 · 1080×1920 · @camis.beauty · Imperatriz
```bash
higgsfield product-photoshoot create --mode closeup_product_with_person \
  --image src/assets/reference-lab-fabio/imperatriz-frente.jpg \
  --prompt "Vertical smartphone-style UGC photo, a person's hand holding the Arquetypus Imperatriz bottle (#8E4566 berry-wine label) near their collarbone, candid natural light, slightly imperfect framing like a real Instagram Reel cover, no text overlay." \
  --aspect_ratio 9:16 --count 2 --brand_context "Depoimento de criador(a), estética autêntica de UGC, não polida como anúncio" \
  --wait
```
