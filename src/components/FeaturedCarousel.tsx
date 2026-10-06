import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getArchetype, productPath } from '@/data/archetypes'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { RatioTag } from '@/components/ui/RatioTag'
import { foto } from '@/lib/foto'
import featuredFenix from '@/assets/fotos/destaque-fenix.jpg?responsiva'
// Sereia e Zeus: geradas por IA (Higgsfield, GPT Image 2.5, out/2026) com o frasco da PDP como referência, cada
// uma numa natureza-morta de alta perfumaria própria — Sereia num pedestal de madrepérola sobre água parada, Zeus
// sobre travertino diante de uma estátua grega, em bege nublado. Trocar pelas de campanha; as versões 9:16 foram
// expandidas embaixo e nas laterais (FLUX.2 Pro Outpaint) pra o frasco ficar menor e acima do texto no celular
import featuredSereia from '@/assets/fotos/destaque-sereia.jpg?responsiva'
import featuredZeus from '@/assets/fotos/destaque-zeus.jpg?responsiva'
// versões desktop (lg+): a foto recortada um pouco em altura e expandida nas laterais com IA (Higgsfield, FLUX.2 Pro
// Outpaint) pra ~5:4 — no espaço largo do desktop a 9:16 ficava com zoom demais. O centro é a foto original
import featuredFenixDesktop from '@/assets/fotos/destaque-fenix-desktop.jpg?responsiva'
import featuredSereiaDesktop from '@/assets/fotos/destaque-sereia-desktop.jpg?responsiva'
import featuredZeusDesktop from '@/assets/fotos/destaque-zeus-desktop.jpg?responsiva'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { Avaliacao } from '@/components/ui/Avaliacao'
import { CONDICOES, parcela, precoPix } from '@/data/empresa'

/** Banners do "Arquétipo em destaque", na ordem. `bg` é o fundo do card, na cor da foto: burgundy da marca
 *  (Fênix), azul-petróleo do mar (Sereia) e bege escurecido de céu nublado (Zeus). Hex, não var(): a cor anima
 *  como propriedade registrada. `pos` é o recorte vertical da foto 9:16 no tablet (onde fica o frasco); `sobe` é
 *  quanto a foto sobe no celular (margem negativa, % da largura) pra o frasco ficar acima do texto.
 *  Todo o texto vem de data/archetypes.ts. */
const SLIDES = [
  { id: 'fenix', img: foto(featuredFenix), imgDesktop: foto(featuredFenixDesktop), bg: '#540010', pos: '50% 20%', sobe: '10.5%' },
  { id: 'sereia', img: foto(featuredSereia), imgDesktop: foto(featuredSereiaDesktop), bg: '#0d4350', pos: '50% 12%', sobe: '10.5%' },
  { id: 'zeus', img: foto(featuredZeus), imgDesktop: foto(featuredZeusDesktop), bg: '#4f483e', pos: '50% 12%', sobe: '10.5%' },
] as const

const AUTOPLAY_MS = 4000
const SWIPE_PX = 50

/** Dourado sobre o fundo escuro do card */
const LATAO_CLARO = 'var(--color-latao)'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** H-15 Arquétipo em destaque — banner rotativo (Fênix → Sereia → Zeus, 4 s cada) com o card editorial.
 *  Os slides ficam empilhados na mesma célula do grid e trocam em fade, então a altura do card é a do maior
 *  texto e não pula. Barras de progresso como as do hero, sem as setas; no celular dá pra deslizar.
 *  Celular: card vertical com texto sobre a foto; md+: foto à esquerda, texto à direita na cor do banner. */
export function FeaturedCarousel() {
  const location = useLocation()
  const [current, setCurrent] = useState(0)
  // banner que está saindo: fica opaco por baixo enquanto o novo aparece por cima
  const [anterior, setAnterior] = useState<number | null>(null)
  const total = SLIDES.length

  const irPara = useCallback(
    (i: number) => {
      if (i === current) return
      setAnterior(current)
      setCurrent(i)
    },
    [current],
  )
  const next = useCallback(() => irPara((current + 1) % total), [irPara, current, total])
  const prev = useCallback(() => irPara((current - 1 + total) % total), [irPara, current, total])

  useEffect(() => {
    const timer = setTimeout(next, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [current, next])

  // deslizar com o dedo (só toque/caneta; touch-pan-y deixa o scroll vertical com o navegador)
  const dragStart = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') dragStart.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    dragStart.current = null
    if (dx <= -SWIPE_PX) next()
    else if (dx >= SWIPE_PX) prev()
  }

  return (
    <div
      className="destaque-tint group relative grid touch-pan-y overflow-hidden rounded-3xl ring-1 ring-latao/60 md:min-h-[32rem] md:grid-cols-[1fr_1fr] lg:mx-auto lg:min-h-[36rem] lg:max-w-7xl"
      // --destaque-bg é registrada (index.css): fundo e degradês trocam de cor juntos, em transição contínua.
      // Sombra em camadas, em volta toda e mais funda embaixo: o card parece descolado do fundo
      style={
        {
          '--destaque-bg': SLIDES[current].bg,
          background: 'var(--destaque-bg)',
          boxShadow:
            '0 1px 2px rgba(40,46,41,0.10), 0 4px 10px -2px rgba(40,46,41,0.14), 0 16px 32px -8px rgba(40,46,41,0.28), 0 40px 70px -24px rgba(40,46,41,0.45), 0 0 50px -10px rgba(40,46,41,0.18)',
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStart.current = null)}
    >
      {SLIDES.map((s, i) => {
        const a = getArchetype(s.id)!
        return (
          // picture `contents`: o img continua sendo o item do grid
          <picture key={`img-${s.id}`} className="contents">
          {/* hidden: com a picture em `contents`, o source (que aqui fica block) virava linha extra do grid */}
          <source media="(min-width: 1024px)" srcSet={s.imgDesktop.srcSet || s.imgDesktop.src} sizes="60vw" className="hidden" />
          <img loading="lazy"
            src={s.img.src}
            srcSet={s.img.srcSet || undefined}
            sizes="100vw"
            alt={i === current ? `${a.nome}: ${a.tipo.toLowerCase()} em foto editorial` : ''}
            aria-hidden={i !== current}
            // md+: altura vem do card (h-0 + min-h-full), não da proporção da foto — ! vence o aspectRatio inline;
            // a foto ocupa 56% do card e o texto começa na metade (passa um pouco da coluna do texto e some no degradê); recorte no frasco.
            // Celular: foto sobe `sobe` (margem negativa, % da largura).
            // Não usar translate aqui: transform tira a foto da ordem de pintura e ela cobre os degradês.
            // Troca rápida: a ativa aparece por cima (650 ms) enquanto a anterior já some por baixo (500 ms) — com
            // o fundo do card opaco, o meio do cross-fade só puxa pra cor do banner; as outras ficam escondidas.
            // md+: a própria foto some pra direita (mask) e revela a cor do card. Antes era um véu na cor do card
            // por cima, e na troca a borda direita da foto (em subpixel) aparecia como um risco fino na divisa
            // do degradê enquanto a camada da foto animava a opacidade
            className={`relative col-start-1 row-start-1 h-full w-full object-cover object-top max-md:-mt-(--foto-sobe) md:col-[1/3] md:aspect-auto! md:h-0 md:min-h-full md:w-[56%] md:object-(--foto-pos) md:[mask-image:linear-gradient(to_right,black_45%,transparent_100%)] lg:object-center motion-reduce:transition-none ${
              i === current
                ? 'z-[2] opacity-100 transition-opacity duration-[650ms] ease-out'
                : i === anterior
                  ? 'z-[1] opacity-0 transition-opacity duration-500 ease-in'
                  : 'z-0 opacity-0'
            }`}
            style={{ aspectRatio: '752 / 1344', '--foto-pos': s.pos, '--foto-sobe': s.sobe } as React.CSSProperties}
          />
          </picture>
        )
      })}
      <RatioTag className="top-4 right-4 z-[3] md:right-[calc(44%+1rem)]" />

      {/* celular: degradê na cor do card (var(--destaque-bg), muda junto com o fundo) subindo da base, atrás do texto */}
      <div
        aria-hidden
        className="pointer-events-none relative z-[3] col-start-1 row-start-1 h-[70%] self-end backdrop-blur-md md:hidden"
        style={{
          background:
            'linear-gradient(to top, var(--destaque-bg) 0%, color-mix(in srgb, var(--destaque-bg) 94%, transparent) 45%, color-mix(in srgb, var(--destaque-bg) 70%, transparent) 78%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
        }}
      />

      {/* Moldura interna dourada — filete fino, afastado da borda */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2.5 z-[4] rounded-[calc(var(--radius-3xl)-0.625rem)] border"
        style={{ borderColor: `color-mix(in srgb, ${LATAO_CLARO} 45%, transparent)` }}
      />

      <div className="relative z-[4] col-start-1 row-start-1 self-end px-6 pt-[82%] pb-5 md:col-start-2 md:self-center md:px-8 md:pt-10 md:pb-10 lg:px-14 lg:pt-14 lg:pb-14 xl:px-20">
        {/* textos empilhados na mesma célula: a altura é a do maior, o card não pula na troca */}
        <div className="grid">
          {SLIDES.map((s, i) => {
            const a = getArchetype(s.id)!
            const ativo = i === current
            return (
              <div
                key={`texto-${s.id}`}
                aria-hidden={!ativo}
                inert={!ativo}
                // o texto que sai some rápido e o novo entra depois, subindo um pouco — sem os dois sobrepostos
                className={`col-start-1 row-start-1 transition-[opacity,translate] ease-out motion-reduce:transition-none ${
                  ativo ? 'translate-y-0 opacity-100 delay-[250ms] duration-500' : 'pointer-events-none translate-y-2 opacity-0 duration-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-6" style={{ background: LATAO_CLARO }} />
                  {/* sombra mais fechada: no celular o eyebrow fica no começo do degradê, ainda sobre a foto */}
                  <Eyebrow className="" style={{ color: LATAO_CLARO, textShadow: '0 0 2px rgba(0,0,0,0.55), 0 1px 10px rgba(0,0,0,0.75)' }}>
                    Arquétipo em destaque
                  </Eyebrow>
                </div>
                <h2 className="mt-3 font-display text-4xl leading-[1.1] text-papel-inv lg:text-5xl">
                  {a.nome}
                  <Sobrenome a={a} />
                </h2>
                <Avaliacao id={a.id} tom="escuro" className="mt-2 text-xs lg:text-sm" />
                <p className="mt-2 font-display text-lg leading-snug text-papel-inv/85 italic lg:mt-3 lg:text-xl">{a.ep}</p>

                <div aria-hidden className="mt-4 flex items-center gap-2">
                  <span className="h-px flex-1" style={{ background: `linear-gradient(to right, ${LATAO_CLARO}, transparent)` }} />
                  <span className="size-1 rotate-45" style={{ background: LATAO_CLARO }} />
                </div>
                <div className="mt-3.5 flex items-end justify-between gap-4">
                  <div>
                    <span className="block font-label text-[9px] tracking-widest text-papel-inv/60 uppercase">
                      {a.tipo} · {a.vol}
                    </span>
                    <Preco a={a} tom="escuro" className="mt-1.5 font-display text-3xl leading-none" />
                  </div>
                  <span className="max-w-[12ch] pb-0.5 text-right font-label text-[9px] tracking-widest uppercase" style={{ color: LATAO_CLARO }}>
                    {a.fam}
                  </span>
                </div>
                {/* regra 7: Pix e parcelamento junto do preço — mesma conta do ProductPurchase */}
                <p className="mt-1.5 text-[12px] text-papel-inv/60">
                  {brl(precoPix(a.preco))} no Pix · ou {CONDICOES.parcelasSemJuros}x de {brl(parcela(a.preco))} sem juros
                </p>
                <p className="mt-2.5 max-w-[32ch] text-[13px] leading-relaxed text-papel-inv/75 lg:mt-4 lg:max-w-[42ch] lg:text-[15px]">{a.cheiro[1]}</p>

                <Link
                  to={productPath(a)}
                  state={{ backgroundLocation: location }}
                  className="mt-4 block w-full rounded-full border border-papel-inv/40 bg-papel-inv/10 py-3 text-center text-xs font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm transition-colors duration-300 ease-out hover:border-papel-inv/60 hover:bg-papel-inv/20 lg:mt-8 lg:inline-block lg:w-auto lg:px-10"
                >
                  Conhecer {a.nome}
                </Link>
              </div>
            )
          })}
        </div>

        {/* barras de progresso como as do hero (clicáveis), sem setas */}
        <div className="mt-4 flex w-full items-center gap-1.5 md:w-56 lg:mt-8 lg:w-72">
          {SLIDES.map((s, i) => (
            <button
              key={`barra-${s.id}`}
              type="button"
              onClick={() => irPara(i)}
              aria-label={`Ver ${getArchetype(s.id)!.nome}`}
              aria-current={i === current}
              className="flex h-4 flex-1 cursor-pointer items-center"
            >
              <span className="block h-px w-full overflow-hidden bg-papel-inv/25">
                {i < current ? (
                  <span className="block h-full w-full bg-latao" />
                ) : i === current ? (
                  <span key={`bar-${current}`} className="hero-timer-bar block h-full bg-latao" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
