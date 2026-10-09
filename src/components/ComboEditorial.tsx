import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { Archetype } from '@/types/archetype'
import { comboFoto, comboFotoMobile, type Combo } from '@/data/combos'
import { produtoNome } from '@/data/archetypes'
import { CONDICOES } from '@/data/empresa'
import { brl } from '@/components/ProductPurchase'
import { DEGRAU_CLARO, SectionEyebrow } from '@/components/ui/Editorial'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { SweepCta } from '@/components/ui/SweepCta'
import { useInView } from '@/lib/useInView'
import { foto } from '@/lib/foto'
import cetim from '@/assets/fotos/texturas/cetim.jpg?responsiva'
import { useCupom } from '@/context/CupomContext'

const CETIM = foto(cetim)

/** Ordem de entrada (stagger) — `--i` vira atraso em `.seq-anim` (index.css); `--y` 0 = só fade. */
const anim = (i: number, y?: number) => ({ '--i': i, ...(y === undefined ? {} : { '--y': `${y}px` }) }) as CSSProperties

/** Cor do arquétipo levemente dessaturada pro creme da seção (puxada pra tinta-2), só nos nomes. */
const corSuave = (cor: string) => `color-mix(in srgb, ${cor} 82%, var(--color-tinta-2))`

/** `true` liga só a aparência do botão (hover visível), sem ação no clique — usado pra revisar o visual. Desligado
 *  (`false`) enquanto não existir checkout. */
const VER_HOVER = false

// selos discretos abaixo do preço — condições reais da loja (CONDICOES), nada de "economia" ou frete de combo
const SELOS = [
  { label: `Envio em ${CONDICOES.envioHorasUteis} h úteis`, icon: 'M3 7h11v8H3zM14 10h4l3 3v2h-7M7.5 18.5a1.5 1.5 0 1 0 0-.01M17.5 18.5a1.5 1.5 0 1 0 0-.01' },
  { label: `${CONDICOES.desistenciaDias} dias de garantia`, icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z' },
  { label: 'Pagamento seguro', icon: 'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3' },
]

export interface SlideCombo {
  combo: Combo
  par: Archetype
  /** nome do kit (data/kits.ts) — vira a aba quando há mais de um */
  kit?: string
}

/** Tempo de cada kit na rotação. Timer fixo (setTimeout), sem pausa por mouse: a pausa no hover deixava a troca
 *  irregular — a seção é grande e o mouse quase sempre está em cima. A barra só acompanha, visual. */
const AUTOPLAY_MS = 7000

/**
 * "Combina com" editorial da PDP (out/2026; dados em data/combos.ts e data/kits.ts). Vende a ideia de dois lados da
 * mesma pessoa, não desconto: hierarquia duo (título grande) → conceito (título de apoio) → cards → botão → preço.
 * Desktop: texto 45% à esquerda, os dois cards (nome, foto do frasco, frase e notas) lado a lado à direita, unidos por um "+"
 * que invade a borda dos dois. Celular (< 768 px): centralizado, texto → cards empilhados com o "+" entre eles →
 * botão → preço → selos.
 * Fundo creme igual pra todos; cada arquétipo só leva a própria cor (suavizada) no nome.
 *
 * Celular enxuto (out/2026, pedido do usuário: "muito longo"): sem o parágrafo (o título de apoio já diz) e sem os selos
 * (já estão na área de compra), cards horizontais mais baixos (2,3:1) e respiros menores.
 *
 * Kits rotativos (out/2026, pedido do Fábio: "2 kits, rotativo igual banner da home"): com mais de um slide, abas com o
 * nome do kit e barra de progresso em cima; troca a cada AUTOPLAY_MS com fade. A coluna de texto tem largura fixa — um
 * pouco mais que "Sereia + Afrodite" (pedido do usuário: o padrão de tamanho de Afrodite/Sereia); título maior encolhe a
 * fonte só o necessário pra caber numa linha (useCabeNaLinha) em vez de alargar a coluna, que espremia os cards e
 * esticava o botão. Os slides ficam empilhados na mesma
 * célula do grid (a altura é a do maior — nada pula na troca); o inativo sai da leitura e do foco (`inert`). Pausa com o
 * mouse em cima e fora da tela (não com foco: o clique na aba deixava o foco ali e travava a rotação); com movimento reduzido a barra não anima e não gira sozinho.
 */
export function ComboEditorial({ a, slides, onLevar }: { a: Archetype; slides: SlideCombo[]; onLevar: (par: Archetype) => void }) {
  const { ref, inView } = useInView<HTMLElement>()
  const [atual, setAtual] = useState(0)
  // depois da 1ª troca a entrada de cada kit usa a animação própria (kit-in/kit-titulo-in em index.css), não o seq-in
  const [trocou, setTrocou] = useState(false)
  const varios = slides.length > 1
  const irPara = (i: number) => {
    setTrocou(true)
    setAtual(i)
  }

  // troca sozinho enquanto a seção já apareceu; clicar numa aba reinicia a contagem (o efeito depende de `atual`).
  // Movimento reduzido: não gira sozinho (só pelas abas)
  useEffect(() => {
    if (!varios || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => irPara((atual + 1) % slides.length), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [atual, varios, inView, slides.length])

  return (
    <section
      ref={ref}
      aria-labelledby="combo-titulo-0"
      aria-roledescription={varios ? 'carrossel' : undefined}
      className={`relative overflow-hidden bg-papel px-3 py-8 text-tinta md:px-6 md:py-12 lg:px-6 lg:pt-8 lg:pb-12 xl:px-8 xl:pt-10 xl:pb-14 ${inView ? 'seq-on' : ''}`}
      style={DEGRAU_CLARO}
    >
      {/* banner: a seção inteira dentro de um retângulo sobre foto de cetim bege (centro liso, dobras suaves só nas bordas;
          gerada por IA, tom calibrado pro papel-2) a 20% sobre o bege — só um sussurro das dobras, sem competir com o
          conteúdo —, cantos suaves, filete e sombra leve embaixo, como se flutuasse (a seção tem respiro
          maior embaixo pra sombra não ser cortada) */}
      <div className="relative mx-auto max-w-[100rem] overflow-hidden rounded-3xl border border-tinta/[0.06] bg-papel-2 px-5 pt-7 pb-8 shadow-[0_22px_44px_-26px_rgba(43,29,22,0.32),0_6px_14px_-8px_rgba(43,29,22,0.12)] sm:px-6 md:rounded-2xl md:px-8 md:py-10 lg:px-12 lg:py-9 xl:px-20 xl:py-10">
        <img
          src={CETIM.src}
          srcSet={CETIM.srcSet || undefined}
          sizes="(min-width: 1600px) 1600px, 100vw"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-10 md:opacity-20"
        />

        {/* abas dos kits: nome em caixa alta + barra de progresso (a do kit atual anima; ao terminar, troca) */}
        {varios && (
          <div role="tablist" aria-label="Kits" className="relative mx-auto mb-6 flex max-w-md gap-4 md:mb-10 lg:max-w-lg">
            {slides.map((sl, i) => (
              <button
                key={sl.kit ?? sl.par.id}
                type="button"
                role="tab"
                aria-selected={i === atual}
                onClick={() => i !== atual && irPara(i)}
                className="group flex flex-1 cursor-pointer flex-col items-center gap-2.5 text-center"
              >
                <span
                  className={`font-label text-[10px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300 sm:tracking-[0.2em] lg:text-[11px] ${
                    i === atual ? 'text-latao-texto' : 'text-tinta-3 group-hover:text-tinta-2'
                  }`}
                >
                  {/* celular: só o nome do kit, numa linha (com "Kit" o mais longo quebrava e desalinhava a barra) */}
                  <span className="max-sm:hidden">Kit </span>
                  {sl.kit}
                </span>
                <span className="block h-px w-full overflow-hidden bg-tinta/15">
                  {i === atual && (
                    <span
                      key={`barra-${atual}`}
                      className="hero-timer-bar block h-full bg-latao"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: inView ? 'running' : 'paused' }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* slides empilhados na mesma célula: a altura é a do maior, a troca é só de opacidade */}
        <div className="relative grid">
          {slides.map((sl, i) => (
            <div
              key={sl.kit ?? sl.par.id}
              role={varios ? 'tabpanel' : undefined}
              aria-hidden={i !== atual || undefined}
              inert={i !== atual || undefined}
              data-kit-ativo={i === atual}
              data-kit-trocou={trocou || undefined}
              // depois da 1ª troca o contêiner troca na hora: quem anima são os filhos (saída e entrada em sequência)
              // (o que sai some de vez só depois dos 0,4 s da animação de saída: transição de 0 s com atraso)
              className={`[grid-area:1/1] ${
                i === atual
                  ? 'opacity-100'
                  : `pointer-events-none opacity-0 ${trocou ? 'transition-opacity delay-[400ms] duration-0' : ''}`
              } ${trocou ? '' : 'transition-opacity duration-700 ease-out'}`}
            >
              <Slide a={a} par={sl.par} combo={sl.combo} idTitulo={`combo-titulo-${i}`} onLevar={() => onLevar(sl.par)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Encolhe um texto de uma linha (whitespace-nowrap) até caber na própria largura: mede scrollWidth × clientWidth
 * depois de pintar e devolve a escala (vai em `--t` no font-size). Mede de novo ao redimensionar e quando as fontes
 * terminam de carregar (a Elegant chega depois). No HTML pré-renderizado sai em 1 — a seção fica abaixo da dobra.
 */
function useCabeNaLinha<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [escala, setEscala] = useState(1)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => {
      // mede no tamanho cheio: zera a escala, lê, e aplica a nova (sem esperar o React)
      el.style.setProperty('--t', '1')
      const cabe = el.clientWidth / el.scrollWidth
      const nova = cabe < 1 ? Math.floor(cabe * 1000) / 1000 - 0.01 : 1
      el.style.setProperty('--t', String(nova))
      setEscala(nova)
    }
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(el.parentElement ?? el)
    document.fonts?.ready.then(medir)
    return () => obs.disconnect()
  }, [])

  return { ref, escala }
}

/** Um kit: o miolo do banner (texto à esquerda, cards à direita; no celular, empilhado). */
function Slide({ a, par, combo, idTitulo, onLevar }: { a: Archetype; par: Archetype; combo: Combo; idTitulo: string; onLevar: () => void }) {
  const { precoFinal } = useCupom()
  const duo = [a, par]
  const { ref: tituloRef, escala: escalaTitulo } = useCabeNaLinha<HTMLHeadingElement>()

  return (
    <div className="relative grid items-center md:gap-y-14 lg:grid-cols-[auto_minmax(0,42rem)] lg:justify-center lg:gap-x-20 xl:gap-x-24">
        {/* celular (< 768 px): versão própria, centralizada — a coluna vira `contents` e a ordem é texto → cards → botão,
            preço → selos (`order`), com ritmo por margens (o banner não usa gap ali); cetim ainda mais apagado (10%).
            Desktop: coluna do texto com largura fixa, a do título "Sereia + Afrodite" (dupla de nome maior quebra o título em
            duas linhas): o resto acompanha essa largura — no desktop as quebras de linha fixas dos parágrafos saem e eles correm na coluna toda (o título de
            apoio mantém a quebra marcada nos dados). Os cards têm
            largura máxima (42rem os dois) e o conjunto texto + cards fica centralizado no banner */}
        <div className="relative max-md:contents lg:w-[26.5rem] xl:w-[32rem]">
          {/* celular: "— COMBINA COM —" centralizado (filete dos dois lados); tablet/desktop: só o filete da esquerda */}
          <div className="seq-anim relative md:[&>div]:justify-start md:[&>div>span:last-child]:hidden" style={anim(0, 0)}>
            <SectionEyebrow center>Combina com</SectionEyebrow>
          </div>
          {/* sempre numa linha: dupla de nome que não cabe na coluna (largura de "Sereia + Afrodite") encolhe a fonte só o
              necessário (--t, medido em useCabeNaLinha) em vez de quebrar a linha */}
          <h2
            ref={tituloRef}
            id={idTitulo}
            className="seq-anim kit-titulo relative mt-3 font-display text-[calc(34px*var(--t))] leading-[1.05] whitespace-nowrap italic max-md:text-center md:mt-6 md:text-[calc(44px*var(--t))] md:leading-[1.02] lg:text-[calc(54px*var(--t))] xl:text-[calc(66px*var(--t))]"
            style={{ ...anim(1), '--t': escalaTitulo } as CSSProperties}
          >
            <span style={{ color: corSuave(a.cor) }}>{a.nome}</span> <span className="text-latao-texto/80">+</span>{' '}
            <span style={{ color: corSuave(par.cor) }}>{par.nome}</span>
          </h2>
          <p className="seq-anim relative mt-5 font-display text-[23px] leading-[1.15] text-tinta max-md:text-center md:mt-5 md:text-[22px] md:leading-snug lg:mt-6 lg:text-[27px]" style={anim(2)}>
            {/* linhas como marcadas nos dados (`\n`); no celular cada frase ganha a própria linha, pra não quebrar no meio */}
            {combo.headline.split('\n').map((linha) => (
              <span key={linha} className="block">
                {linha.split(/(?<=\.)\s+/).map((frase, k) => (
                  <span key={frase} className="max-md:block">
                    {k > 0 && ' '}
                    {frase}
                  </span>
                ))}
              </span>
            ))}
          </p>
          {/* celular: os parágrafos viram um texto corrido só (sem quebras fixas), pra economizar altura */}
          <div className="seq-anim relative mt-5 max-w-[40ch] text-[15px] leading-relaxed text-tinta-2 max-md:hidden max-md:mx-auto max-md:max-w-[36ch] max-md:text-center max-md:leading-[1.65] md:mt-7 md:space-y-3 md:whitespace-pre-line lg:mt-8 lg:max-w-none lg:whitespace-normal" style={anim(3)}>
            {combo.texto.map((p, k) => (
              <p key={p} className="max-md:inline">
                {k > 0 && <span className="md:hidden"> </span>}
                {p}
              </p>
            ))}
          </div>

          <div className="seq-anim relative mt-10 max-md:order-2 max-md:mt-6 max-md:text-center" style={anim(4)}>
            {/* mesmo CTA da home (SweepCta), vazado com borda dourada e texto dourado; no hover o dourado varre o botão
                e o texto fica claro (papel).
                Sem checkout ainda (CLAUDE.md): desligado; `VER_HOVER` liga só a aparência pra ver o hover, sem ação. */}
            <SweepCta disabled={!VER_HOVER} onClick={VER_HOVER ? undefined : onLevar} className="max-w-[420px]! border-latao! bg-transparent! max-md:py-[18px]! md:max-w-sm! text-latao-texto! hover:text-papel! focus-visible:text-papel! lg:max-w-none!">
              Quero as duas versões <span aria-hidden>→</span>
            </SweepCta>
            <p className="mt-3.5 text-[11px] text-tinta-3 md:mt-3">As vendas abrem em breve.</p>
            <p className="mt-2 text-[12px] text-balance text-tinta-3 md:mt-4">
              Duo {a.nome} + {par.nome} · {brl(precoFinal(a.preco) + precoFinal(par.preco))} · até {CONDICOES.parcelasSemJuros}x sem juros
            </p>
          </div>

          <ul className="seq-anim relative mt-8 flex max-w-sm divide-x divide-tinta/[0.07] border-t border-tinta/[0.07] pt-5 opacity-80 max-md:hidden max-md:order-3 max-md:mx-auto max-md:mt-6 max-md:w-full max-md:max-w-[420px] lg:max-w-none" style={anim(5)}>
            {SELOS.map((s) => (
              <li key={s.label} className="flex flex-1 flex-col items-center gap-2 px-2 text-center first:pl-0 last:pr-0">
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-latao-texto/80">
                  <path d={s.icon} />
                </svg>
                <span className="font-label text-[9px] leading-snug tracking-[0.16em] text-tinta-3 uppercase md:text-[8px] md:tracking-[0.18em]">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* os dois cards: lado a lado do tablet (768 px) em diante, empilhados no celular (até 420 px de largura). Cada card, com contorno fino: foto de
            ponta a ponta com nome e legenda por cima, e embaixo (centralizados) a frase do momento e 4 notas. O "+" é um círculo maior que
            invade a borda dos dois cards (o vão entre eles é menor que o círculo) */}
        <div className="relative grid gap-y-3 max-md:order-1 max-md:-mx-2 max-md:mt-6 md:grid-cols-2 md:gap-x-5 md:gap-y-5">
          {duo.map((x, i) => {
            const card = combo.cards[x.id]
            const mob = comboFotoMobile(x.id)
            return (
              <div key={x.id} className="contents">
              {/* celular: card horizontal (referência do usuário) — foto horizontal de ponta a ponta com o frasco à direita
                  (`combo/{id}-mobile.jpg`, gerada pra isso), degradê creme só à esquerda, nome grande na cor do arquétipo,
                  frase e filete dourado; sem a parte de baixo (frase do momento e notas) */}
              <article
                className="seq-anim relative aspect-[2.3/1] w-full overflow-hidden rounded-2xl border border-tinta/10 bg-papel md:hidden"
                style={anim(3 + i * 2, 0)}
              >
                {/* sem a foto horizontal ainda: mockup (caixa tracejada com a especificação) ocupando o card */}
                {!mob && (
                  <MediaSlot
                    aspect="auto"
                    bg={x.bg}
                    alt=""
                    requisito={`FOTO 16:9 · COMBO CELULAR · ${x.nome.toUpperCase()} · FRASCO À DIREITA`}
                    className="absolute! inset-0 items-end! justify-end! rounded-none! border-0! p-3! text-right"
                  />
                )}
                {mob && (
                  <img
                    src={mob.src}
                    srcSet={mob.srcSet || undefined}
                    sizes="100vw"
                    alt={`${produtoNome(x)} sobre pedra clara, entre alguns dos ingredientes da sua fragrância`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover object-[70%_40%]"
                  />
                )}
                {/* clareia só a esquerda (onde ficam nome e frase); o frasco, à direita, fica intacto */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-papel) 70%, transparent) 0%, color-mix(in srgb, var(--color-papel) 35%, transparent) 38%, transparent 58%)' }}
                />
                <div className="relative flex h-full max-w-[56%] flex-col justify-center pl-5">
                  <h3 className="font-display text-[32px] leading-none" style={{ color: corSuave(x.cor) }}>
                    {x.nome}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-snug text-tinta">{card.legenda}</p>
                  <span aria-hidden className="mt-3.5 h-px w-8 bg-latao" />
                </div>
              </article>
              <article
                className="seq-anim mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-tinta/12 bg-papel/70 max-md:hidden"
                style={anim(3 + i * 2, 0)}
              >
                {/* foto (natureza-morta do frasco) de ponta a ponta até o topo do card; nome e frase por
                    cima, sobre um degradê creme suave que só clareia o alto da foto (contraste do texto) */}
                <div className="relative">
                  <MediaSlot
                    aspect="4/5"
                    bg={x.bg}
                    src={comboFoto(x.id)}
                    alt={`${produtoNome(x)} sobre pedra clara, entre alguns dos ingredientes da sua fragrância`}
                    sizes="(min-width: 1024px) 330px, 46vw"
                    requisito={`FOTO · 4:5 · COMBO · ${x.nome.toUpperCase()}`}
                    className="rounded-none! [&_img]:object-top"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[42%]"
                    style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-papel) 90%, transparent) 0%, color-mix(in srgb, var(--color-papel) 60%, transparent) 50%, transparent 100%)' }}
                  />
                  <header className="absolute inset-x-0 top-0 p-5 md:p-4 lg:p-5">
                    <h3 className="font-display text-[28px] leading-tight text-tinta md:text-[24px] lg:text-[26px]">
                      {x.nome}
                    </h3>
                    <p className="mt-1.5 text-[10px] tracking-[0.16em] text-tinta/80 uppercase">{card.legenda}</p>
                  </header>
                </div>
                <div className="px-4 py-4 text-center lg:px-5">
                  {/* frase em caixa alta, Inter light (300); notas na Elegant (só existe no peso Regular — sem light/medium) */}
                  <p className="text-[11.5px] leading-snug font-light tracking-[0.14em] text-tinta uppercase">{card.descricao}</p>
                  {/* notas no tamanho cheio; a lista mais longa (Imperatriz) quebra em duas linhas — encolher deixava pequeno demais */}
                  <p className="mt-2 flex flex-wrap justify-center font-display text-[14px] leading-relaxed text-tinta-2">
                    <span className="sr-only">Notas em destaque: </span>
                    {card.notas.map((n, k) => (
                      <span key={n} className="whitespace-nowrap">
                        {n}
                        {k < card.notas.length - 1 && <span aria-hidden className="mx-1.5 text-latao">·</span>}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
              </div>
            )
          })}
          <span
            aria-hidden
            className="seq-anim absolute top-1/2 left-1/2 z-10 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-papel font-display text-[28px] leading-none text-latao-texto shadow-[0_6px_18px_-8px_rgba(43,29,22,0.35)] ring-1 ring-latao/50 lg:size-16 lg:text-[32px]"
            style={anim(4, 0)}
          >
            +
          </span>
        </div>
    </div>
  )
}
