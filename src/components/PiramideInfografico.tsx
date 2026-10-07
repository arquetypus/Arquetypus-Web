import type { Archetype } from '@/types/archetype'
import type { Foto } from '@/lib/foto'
import type { CSSProperties } from 'react'
import { produtoNome } from '@/data/archetypes'
import { CONDICOES } from '@/data/empresa'
import { Reveal } from '@/components/ui/Reveal'
import { DEGRAU_ESCURO, SectionEyebrow } from '@/components/ui/Editorial'

type Camada = { label: string; value: string; note: string }

const FATIAS = [
  { clipPath: 'inset(0 0 65% 0)', transform: 'translateY(-2.4%)' },
  { clipPath: 'inset(34% 0 37% 0)', transform: 'translateY(0)' },
  { clipPath: 'inset(62% 0 0 0)', transform: 'translateY(2.4%)' },
] as const

const CONECTORES = ['clamp(9.5rem,12vw,15rem)', 'clamp(5.75rem,7vw,8.75rem)', '3.25rem'] as const

/** Notas separadas por “·”; cada nota continua sendo uma unidade de quebra. */
function Notas({ value }: { value: string }) {
  return (
    <>
      {value.split(',').map((nota, i) => (
        <span key={nota} className="whitespace-nowrap">
          {i > 0 && <span aria-hidden className="mx-1 text-latao/65">·</span>}
          {nota.trim()}
        </span>
      ))}
    </>
  )
}

/**
 * Infográfico olfativo: arte recortada em três fatias com respiro negativo; cada andar se conecta à descrição.
 * No celular, leitura vira título → arte separada → camadas, sem comprimir textos.
 */
export function PiramideInfografico({ a, camadas, foto }: { a: Archetype; camadas: Camada[]; foto: Foto }) {
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden bg-noite px-5 py-14 text-papel-inv md:px-10 lg:flex lg:min-h-[calc(100svh-9.5rem)] lg:items-center lg:py-10"
      style={DEGRAU_ESCURO}
      animateContent
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl lg:size-[52rem]"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-latao) 16%, transparent), transparent)' }}
      />

      <div className="relative mx-auto grid w-full max-w-[105rem] items-center lg:grid-cols-[minmax(15rem,0.72fr)_minmax(44rem,2.28fr)] lg:gap-x-8 xl:gap-x-12">
        <header className="text-center max-lg:[&>div:first-child]:justify-center lg:text-left">
          <SectionEyebrow dark>Pirâmide olfativa</SectionEyebrow>
          <h2 className="mx-auto mt-4 max-w-[11ch] font-display text-[34px] leading-[1.04] sm:text-[42px] lg:mx-0 lg:text-[48px] xl:text-[54px]">
            Como <span className="text-latao italic">{a.nome}</span> se revela
          </h2>
          <p className="mx-auto mt-5 max-w-[38ch] text-[14px] leading-relaxed text-papel-inv/65 lg:mx-0 lg:text-[15px]">{a.cheiro[0]}</p>
          <p className="mt-4 font-label text-[9px] tracking-[0.18em] text-latao uppercase">
            {a.fam} <span aria-hidden className="mx-1.5 text-latao/60">·</span> {CONDICOES.essenciaPct}% de essência
          </p>
        </header>

        <div className="mt-7 grid items-center lg:mt-0 lg:grid-cols-[minmax(25rem,1.35fr)_minmax(18rem,0.85fr)] lg:gap-x-8 xl:gap-x-12">
          <figure className="relative mx-auto grid aspect-square w-full max-w-[30rem] place-items-center sm:max-w-[34rem] lg:mr-0 lg:ml-auto lg:max-w-[min(42rem,68svh)]">
            <span aria-hidden className="absolute inset-x-[11%] bottom-[1%] h-[10%] rounded-[50%] bg-black/45 blur-2xl" />
            <div aria-hidden className="absolute inset-0">
              {FATIAS.map((fatia, i) => (
                <img
                  key={i}
                  src={foto.src}
                  srcSet={foto.srcSet || undefined}
                  sizes="(min-width: 1536px) 42rem, (min-width: 1024px) 40vw, 100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_1.2rem_1.4rem_rgba(0,0,0,0.34)]"
                  style={fatia}
                />
              ))}
            </div>
            <figcaption className="sr-only">
              Pirâmide olfativa do {produtoNome(a)}: ingredientes organizados em topo, coração e base.
            </figcaption>
          </figure>

          <ol className="mt-7 border-y border-latao/35 lg:mt-0 lg:grid lg:h-[min(38rem,68svh)] lg:grid-rows-[34fr_30fr_36fr] lg:border-y-0">
            {camadas.map((c, i) => (
              <li
                key={c.label}
                className="relative grid grid-cols-[3rem_minmax(0,1fr)] content-center gap-3 border-b border-papel-inv/15 py-4 last:border-b-0 lg:grid-cols-[2.5rem_minmax(0,1fr)] lg:gap-3 lg:py-3 lg:pl-2 lg:before:absolute lg:before:top-1/2 lg:before:right-full lg:before:w-[var(--connector)] lg:before:border-t lg:before:border-latao/65 lg:after:absolute lg:after:top-1/2 lg:after:right-[calc(100%+var(--connector))] lg:after:size-1.5 lg:after:translate-x-1/2 lg:after:-translate-y-1/2 lg:after:rounded-full lg:after:bg-latao"
                style={{ '--connector': CONECTORES[i] } as CSSProperties}
              >
                <span className="pt-0.5 font-label text-[9px] tracking-[0.22em] text-latao">0{i + 1}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="font-label text-[10px] tracking-[0.22em] text-latao uppercase">{c.label}</h3>
                    <p className="font-label text-[8px] tracking-[0.12em] text-papel-inv/40 uppercase">{c.note}</p>
                  </div>
                  <p className="mt-1.5 flex flex-wrap font-display text-[19px] leading-snug text-papel-inv lg:text-[20px] xl:text-[21px]">
                    <Notas value={c.value} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Reveal>
  )
}
