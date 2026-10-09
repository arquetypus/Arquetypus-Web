import type { CSSProperties } from 'react'
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

/**
 * "Combina com" editorial da PDP (out/2026, em validação só na Sereia — dados em data/combos.ts). Vende a ideia de
 * dois lados da mesma pessoa, não desconto: hierarquia duo (título grande) → conceito (título de apoio) → cards → botão → preço.
 * Desktop: texto 45% à esquerda, os dois cards (nome, foto do frasco, frase e notas) lado a lado à direita, unidos por um "+"
 * que invade a borda dos dois. Celular (< 768 px): centralizado, texto → cards empilhados com o "+" entre eles →
 * botão → preço → selos.
 * Fundo creme igual pra todos; cada arquétipo só leva a própria cor (suavizada) no nome.
 */
export function ComboEditorial({ a, par, combo, onLevar }: { a: Archetype; par: Archetype; combo: Combo; onLevar: () => void }) {
  const { precoFinal } = useCupom()
  const { ref, inView } = useInView<HTMLElement>()
  const duo = [a, par]

  return (
    <section
      ref={ref}
      aria-labelledby="combo-titulo"
      className={`relative overflow-hidden bg-papel px-3 py-12 text-tinta md:px-6 lg:px-6 lg:pt-8 lg:pb-12 xl:px-8 xl:pt-10 xl:pb-14 ${inView ? 'seq-on' : ''}`}
      style={DEGRAU_CLARO}
    >
      {/* banner: a seção inteira dentro de um retângulo sobre foto de cetim bege (centro liso, dobras suaves só nas bordas;
          gerada por IA, tom calibrado pro papel-2) a 20% sobre o bege — só um sussurro das dobras, sem competir com o
          conteúdo —, cantos suaves, filete e sombra leve embaixo, como se flutuasse (a seção tem respiro
          maior embaixo pra sombra não ser cortada) */}
      <div className="relative mx-auto grid max-w-[100rem] items-center overflow-hidden rounded-3xl border border-tinta/[0.06] bg-papel-2 px-5 pt-12 pb-10 shadow-[0_22px_44px_-26px_rgba(43,29,22,0.32),0_6px_14px_-8px_rgba(43,29,22,0.12)] sm:px-6 md:gap-y-14 md:rounded-2xl md:px-8 md:py-12 lg:grid-cols-[auto_minmax(0,42rem)] lg:justify-center lg:gap-x-20 lg:px-12 lg:py-10 xl:gap-x-24 xl:px-20 xl:py-11">
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
        {/* celular (< 768 px): versão própria, centralizada — a coluna vira `contents` e a ordem é texto → cards → botão,
            preço → selos (`order`), com ritmo por margens (o banner não usa gap ali); cetim ainda mais apagado (10%).
            Desktop: coluna do texto na largura do título "Sereia + Afrodite" (não quebra no desktop): o resto acompanha essa
            largura — no desktop as quebras de linha fixas dos parágrafos saem e eles correm na coluna toda (o título de
            apoio mantém a quebra marcada nos dados). Os cards têm
            largura máxima (42rem os dois) e o conjunto texto + cards fica centralizado no banner */}
        <div className="relative max-md:contents lg:w-min">
          {/* celular: "— COMBINA COM —" centralizado (filete dos dois lados); tablet/desktop: só o filete da esquerda */}
          <div className="seq-anim relative md:[&>div]:justify-start md:[&>div>span:last-child]:hidden" style={anim(0, 0)}>
            <SectionEyebrow center>Combina com</SectionEyebrow>
          </div>
          <h2 id="combo-titulo" className="seq-anim relative mt-3 font-display text-[34px] leading-[1.05] italic max-md:text-center min-[390px]:whitespace-nowrap md:mt-6 md:text-[44px] md:leading-[1.02] md:whitespace-normal lg:text-[54px] lg:whitespace-nowrap xl:text-[66px]" style={anim(1)}>
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
          <div className="seq-anim relative mt-5 max-w-[40ch] text-[15px] leading-relaxed text-tinta-2 max-md:mx-auto max-md:max-w-[36ch] max-md:text-center max-md:leading-[1.65] md:mt-7 md:space-y-3 md:whitespace-pre-line lg:mt-8 lg:max-w-none lg:whitespace-normal" style={anim(3)}>
            {combo.texto.map((p, k) => (
              <p key={p} className="max-md:inline">
                {k > 0 && <span className="md:hidden"> </span>}
                {p}
              </p>
            ))}
          </div>

          <div className="seq-anim relative mt-10 max-md:order-2 max-md:mt-8 max-md:text-center" style={anim(4)}>
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

          <ul className="seq-anim relative mt-8 flex max-w-sm divide-x divide-tinta/[0.07] border-t border-tinta/[0.07] pt-5 opacity-80 max-md:order-3 max-md:mx-auto max-md:mt-6 max-md:w-full max-md:max-w-[420px] lg:max-w-none" style={anim(5)}>
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
        <div className="relative grid gap-y-3.5 max-md:order-1 max-md:-mx-2 max-md:mt-8 md:grid-cols-2 md:gap-x-5 md:gap-y-5">
          {duo.map((x, i) => {
            const card = combo.cards[x.id]
            const mob = comboFotoMobile(x.id)
            return (
              <div key={x.id} className="contents">
              {/* celular: card horizontal (referência do usuário) — foto horizontal de ponta a ponta com o frasco à direita
                  (`combo/{id}-mobile.jpg`, gerada pra isso), degradê creme só à esquerda, nome grande na cor do arquétipo,
                  frase e filete dourado; sem a parte de baixo (frase do momento e notas) */}
              <article
                className="seq-anim relative aspect-[1.85/1] w-full overflow-hidden rounded-2xl border border-tinta/10 bg-papel md:hidden"
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
                  <h3 className="font-display text-[36px] leading-none" style={{ color: corSuave(x.cor) }}>
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
    </section>
  )
}
