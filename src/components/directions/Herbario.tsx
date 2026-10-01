import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import { COMPARISON, DIAGNOSIS, ENERGIES, FAMILIES, FRASCO_IMG, HERO_SLIDES, HOME_COPY as C, JOURNAL, QUALIFICATION, SEALS, SEGMENTS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import { scrollToId } from '@/lib/scrollToId'
import type { Archetype } from '@/types/archetype'
import {
  brl,
  CREATOR_STATS,
  FilterTabs,
  FOOTER_EXPLORE,
  FOOTER_SOON,
  numero,
  parcela,
  pix,
  preventSubmit,
  type CatalogProps,
  type DirectionPageProps,
} from './shared'

/**
 * Direção "Herbário" (ThemeSwitcher) — a coleção como um arquivo botânico: cada arquétipo é um espécime
 * catalogado, com etiqueta datilografada, fita adesiva segurando a foto e as notas (topo, coração, fundo)
 * como a ficha de classificação. Referências (Behance): "SPECIMEN — Botanical Archive", "HERBARIUM no13",
 * "RUKKOLA Botanical Perfumery", "MOSS — Perfume Brand Identity". Linguagem que se repete: papel
 * envelhecido, verde musgo, ferrugem, máquina de escrever (Courier Prime), fita, carimbo, fichas pautadas.
 */

const MAQ = { fontFamily: "'Courier Prime', ui-monospace, monospace" }
/** Pauta de caderno de campo. */
const PAUTA = 'repeating-linear-gradient(to bottom, transparent 0 27px, color-mix(in srgb, var(--color-linha-2) 70%, transparent) 27px 28px)'

/** Pedaço de fita adesiva translúcida. */
function Fita({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`absolute h-6 w-20 bg-papel-3/80 shadow-sm ${className}`} style={{ backdropFilter: 'blur(1px)' }} />
}

/** Foto presa com duas fitas. */
function Presa({ src, alt = '', aspect = 'aspect-[4/5]', className = '' }: { src: string; alt?: string; aspect?: string; className?: string }) {
  return (
    <span className={`relative block bg-papel p-2.5 shadow-[0_8px_20px_-12px_rgba(40,30,10,0.45)] ${className}`}>
      <Fita className="-top-3 left-6 -rotate-6" />
      <Fita className="-top-3 right-6 rotate-6" />
      <span className={`block overflow-hidden ${aspect}`}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover sepia-[15%]" />
      </span>
    </span>
  )
}

/** Etiqueta datilografada. */
function Etiqueta({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-tinta/40 bg-papel-2 px-3 py-2.5 text-[11px] leading-relaxed text-tinta ${className}`} style={MAQ}>
      {children}
    </div>
  )
}

function Notas({ a }: { a: Archetype }) {
  return (
    <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2">
      <dt className="text-tinta-3">Topo</dt>
      <dd>{a.topo}</dd>
      <dt className="text-tinta-3">Coração</dt>
      <dd>{a.coracao}</dd>
      <dt className="text-tinta-3">Fundo</dt>
      <dd>{a.fundo}</dd>
    </dl>
  )
}

/* ---------------- Hero: a prancha ---------------- */

export function HeroHerbario() {
  const slide = HERO_SLIDES[0]
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ARCHETYPES.length), 3600)
    return () => clearInterval(t)
  }, [])
  const a = ARCHETYPES[i]
  return (
    <section className="relative overflow-hidden bg-papel px-5 pt-12 pb-16 md:px-10 lg:pt-20 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs tracking-[0.2em] text-latao-texto uppercase" style={MAQ}>
            Arquivo Arquétypus · {slide.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[42px] leading-[1.02] text-balance text-tinta md:text-6xl lg:text-7xl">{slide.heading.replace(/\n/g, ' ')}</h1>
          <p className="mt-5 max-w-[38ch] text-base text-tinta-2 italic lg:text-lg">{slide.sub}</p>
          <button
            type="button"
            onClick={() => scrollToId('catalogo')}
            className="mt-8 cursor-pointer border border-tinta px-7 py-3.5 text-[12px] tracking-[0.15em] text-tinta uppercase transition-colors hover:bg-tinta hover:text-papel"
            style={MAQ}
          >
            Ver os 9 arquétipos →
          </button>
        </div>
        {/* prancha: espécime da vez, preso com fita, com a etiqueta ao lado */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative rotate-[-1.5deg]">
            {ARCHETYPES.map((x, n) => (
              <div key={x.id} aria-hidden={n !== i} className="transition-opacity duration-700" style={{ opacity: n === i ? 1 : 0, position: n === 0 ? 'relative' : 'absolute', inset: 0 }}>
                <Presa src={FRASCO_IMG[x.id]} alt={n === i ? `${x.tipo} ${x.nome}` : ''} aspect="aspect-[3/4]" />
              </div>
            ))}
          </div>
          <Etiqueta className="relative -mt-10 ml-auto w-[78%] rotate-[1.5deg] shadow-md">
            <p className="flex justify-between">
              <span>Espécime Nº {numero(a.cod)}</span>
              <span>{a.vol}</span>
            </p>
            <p className="mt-1 font-display text-2xl text-tinta" style={{ fontFamily: 'var(--font-display)' }}>
              {a.nome}
            </p>
            <p className="text-tinta-2 italic">{a.fam}</p>
            <div className="mt-2 border-t border-dashed border-tinta/30 pt-2">
              <Notas a={a} />
            </div>
          </Etiqueta>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Catálogo: os espécimes ---------------- */

export function CatalogHerbario({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel-2 px-4 py-16 md:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-tinta/30 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-latao-texto uppercase" style={MAQ}>
              Catálogo de espécimes · Nº 01–09
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-tinta lg:text-6xl">
              {C.catalogo.title[0]} <em className="text-latao-texto">{C.catalogo.title[1]}</em>
            </h2>
          </div>
          <FilterTabs
            filtro={filtro}
            setFiltro={setFiltro}
            filtros={filtros}
            base="border px-3 py-1.5 text-[11px] uppercase"
            on="border-tinta bg-tinta text-papel"
            off="border-tinta/30 text-tinta-2 hover:border-tinta"
          />
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, n) => (
            <li key={a.id} className={n % 2 ? 'sm:rotate-[0.8deg]' : 'sm:rotate-[-0.8deg]'}>
              <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="no-press group block">
                <Presa src={FRASCO_IMG[a.id]} alt={`${a.tipo} ${a.nome}`} className="transition-transform duration-500 group-hover:-translate-y-1" />
              </Link>
              <Etiqueta className="mt-4">
                <p className="flex justify-between text-tinta-3">
                  <span>Nº {numero(a.cod)}</span>
                  <span>
                    {a.energia} · {a.vol}
                  </span>
                </p>
                <p className="mt-1 text-xl text-tinta" style={{ fontFamily: 'var(--font-display)' }}>
                  {a.nome} <span className="text-sm text-tinta-2 italic">— {a.fam}</span>
                </p>
                <div className="mt-2 border-t border-dashed border-tinta/30 pt-2">
                  <Notas a={a} />
                </div>
                {/* regra 7 */}
                <div className="mt-3 flex items-end justify-between gap-3 border-t border-dashed border-tinta/30 pt-2">
                  <span>
                    <b className="block text-base">{brl(a.preco)}</b>
                    <span className="text-tinta-2">
                      {brl(pix(a.preco))} Pix · 6x {brl(parcela(a.preco))}
                    </span>
                  </span>
                  <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="shrink-0 bg-tinta px-3 py-1.5 text-papel hover:bg-latao-texto">
                    Comprar
                  </Link>
                </div>
              </Etiqueta>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Página inteira ---------------- */

function Cabeca({ n, eyebrow, title, sub }: { n: string; eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs tracking-[0.2em] text-latao-texto uppercase" style={MAQ}>
        Gaveta {n} · {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl leading-[1.08] text-tinta lg:text-6xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-tinta-2 italic">{sub}</p>}
    </div>
  )
}

function Secao({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-5 py-16 md:px-10 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** Carimbo circular. */
function Carimbo({ top, mid, className = '' }: { top: string; mid: string; className?: string }) {
  return (
    <div className={`grid aspect-square place-items-center rounded-full border-[3px] border-double border-latao-texto p-4 text-center text-latao-texto ${className}`} style={MAQ}>
      <div>
        <p className="text-[10px] tracking-[0.25em] uppercase">{top}</p>
        <p className="font-display text-6xl leading-none lg:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
          {mid}
        </p>
      </div>
    </div>
  )
}

export function HerbarioPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — linha datilografada */}
      <section className="border-y border-tinta/30 bg-papel-2 px-5 py-4">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] tracking-[0.12em] text-tinta-2 uppercase" style={MAQ}>
          {SEALS.map((s) => (
            <li key={s}>✓ {s}</li>
          ))}
        </ul>
      </section>

      {/* Coleções — três pastas de arquivo com aba */}
      <Secao id="segmentos">
        <Cabeca n="I" eyebrow="Coleções" title="Escolha por onde começar" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SEGMENTS.map((seg, i) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group relative cursor-pointer pt-7 text-left">
              {/* aba da pasta */}
              <span className="absolute top-0 h-7 w-32 rounded-t-md border border-b-0 border-tinta/30 bg-papel-3 px-3 pt-1.5 text-[10px] tracking-[0.15em] text-tinta-2 uppercase" style={{ ...MAQ, left: `${12 + i * 18}%` }}>
                {seg.label}
              </span>
              <span className="block border border-tinta/30 bg-papel-3 p-4 transition-transform duration-300 group-hover:-translate-y-1">
                <Presa src={seg.img} aspect="aspect-[4/3]" />
                <span className="mt-4 block font-display text-3xl text-tinta">{seg.name}</span>
                <span className="mt-1 block text-[11px] text-tinta-3" style={MAQ}>
                  {seg.meta}
                </span>
                <span className="mt-3 block text-[11px] tracking-[0.15em] text-latao-texto uppercase" style={MAQ}>
                  {C.segmentos.cta} →
                </span>
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Diagnóstico — caderno de campo pautado */}
      <Secao className="bg-papel-2">
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Cabeca n="II" eyebrow={C.diagnostico.eyebrow} title={C.diagnostico.title} sub={C.diagnostico.sub} />
          <div className="border-l-2 border-latao/60 bg-papel px-6 pt-4 pb-8 lg:px-10" style={{ backgroundImage: PAUTA, lineHeight: '28px' }}>
            {DIAGNOSIS.map((d) => (
              <div key={d.n} className="pt-7">
                <p className="text-[12px] text-latao-texto" style={MAQ}>
                  Obs. {d.n}
                </p>
                <p className="font-display text-xl text-tinta italic lg:text-2xl">{d.title}</p>
                <p className="text-sm text-tinta-2">{d.body}</p>
              </div>
            ))}
            <p className="mt-7 font-display text-2xl text-tinta">
              {C.diagnostico.fecho[0]} <span className="text-latao-texto italic underline decoration-latao/50 underline-offset-4">{C.diagnostico.fecho[1]}</span>
            </p>
          </div>
        </div>
      </Secao>

      {/* Famílias — fichas de classificação */}
      <Secao>
        <Cabeca n="III" eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {FAMILIES.map((f, i) => (
            <button key={f.nome} type="button" onClick={toCatalog} className={`no-press group cursor-pointer text-left ${i % 2 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}`}>
              <Presa src={f.img} aspect="aspect-square" className="transition-transform duration-300 group-hover:-translate-y-1" />
              <Etiqueta className="mt-3">
                <p className="text-tinta-3">Família {String(i + 1).padStart(2, '0')}</p>
                <p className="text-lg text-tinta" style={{ fontFamily: 'var(--font-display)' }}>
                  {f.nome}
                </p>
                <p className="text-tinta-2 italic">{f.desc}</p>
                <p className="mt-1 text-tinta-3">{f.arquetipos.map((id) => getArchetype(id)?.nome).join(', ')}</p>
              </Etiqueta>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — prensadas em papel, como flores secas */}
      <Secao className="bg-tinta text-papel">
        <p className="text-xs tracking-[0.2em] text-latao uppercase" style={MAQ}>
          Gaveta IV · {C.energias.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight lg:text-6xl">{C.energias.title}</h2>
        <p className="mt-4 text-papel/70 italic">{C.energias.sub}</p>
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {ENERGIES.map((e) => (
            <button key={e.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer bg-papel p-3 text-left text-tinta">
              <span className="block aspect-[3/4] overflow-hidden">
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover sepia-[30%] transition-[filter] duration-700 group-hover:sepia-0" />
              </span>
              <span className="mt-3 block font-display text-2xl">{e.nome}</span>
              <span className="block text-[11px] text-tinta-2" style={MAQ}>
                {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Reconhecimento — anotações à mão na margem */}
      <Secao>
        <Cabeca n="V" eyebrow={C.reconhecimento.eyebrow} title={C.reconhecimento.title} sub={C.reconhecimento.sub} />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {QUALIFICATION.map((q, i) => (
            <li key={q.title} className="relative border border-tinta/30 bg-papel-2 p-6 pt-8">
              <span className="absolute -top-3 left-5 bg-papel px-2 text-[11px] text-latao-texto" style={MAQ}>
                Nota {String(i + 1).padStart(2, '0')}
              </span>
              <b className="block font-display text-xl leading-snug font-normal text-tinta">{q.title}</b>
              <p className="mt-2 text-sm text-tinta-2 italic">{q.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 font-display text-3xl text-tinta lg:text-4xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <em className="text-latao-texto">{C.reconhecimento.fecho[2]}</em>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — espécime em destaque, com a ficha completa */}
      <Secao id="destaque">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Presa src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} aspect="aspect-[4/5]" className="rotate-[-2deg]" />
          <div>
            <p className="text-xs tracking-[0.2em] text-latao-texto uppercase" style={MAQ}>
              {C.destaque.eyebrow} · Espécime Nº {numero(featured.cod)}
            </p>
            <h2 className="mt-3 font-display text-6xl leading-none text-tinta lg:text-8xl">{featured.nome}</h2>
            <p className="mt-4 font-display text-xl text-tinta-2 italic">{featured.ep}</p>
            <p className="mt-4 text-sm leading-relaxed text-tinta-2">{featured.cheiro[1]}</p>
            <Etiqueta className="mt-6">
              <p className="text-tinta-3">
                {featured.fam} · {featured.energia} · {featured.tipo} {featured.vol}
              </p>
              <div className="mt-2 border-t border-dashed border-tinta/30 pt-2">
                <Notas a={featured} />
              </div>
              <p className="mt-3 border-t border-dashed border-tinta/30 pt-2">
                <b className="text-lg">{brl(featured.preco)}</b>{' '}
                <span className="text-tinta-2">
                  · {brl(pix(featured.preco))} no Pix · 6x de {brl(parcela(featured.preco))} sem juros
                </span>
              </p>
            </Etiqueta>
            <Link to={`/loja/${featured.id}`} state={{ backgroundLocation: location }} className="mt-6 inline-block bg-tinta px-8 py-4 text-[12px] tracking-[0.15em] text-papel uppercase hover:bg-latao-texto" style={MAQ}>
              {C.destaque.cta} {featured.nome} →
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte */}
      <Secao className="bg-papel-2 text-center">
        <p className="mx-auto max-w-[18ch] font-display text-5xl leading-tight text-tinta italic lg:text-7xl">{C.ponte.text}</p>
        <button type="button" onClick={toCatalog} className="mt-8 cursor-pointer border-b border-tinta pb-1 text-[12px] tracking-[0.15em] text-tinta uppercase" style={MAQ}>
          {C.ponte.cta} →
        </button>
      </Secao>

      {/* Diferença — livro-razão de duas colunas */}
      <Secao>
        <Cabeca n="VI" eyebrow={C.diferenca.eyebrow} title={<>{C.diferenca.title[0]} <em className="text-latao-texto">{C.diferenca.title[1]}</em></>} />
        <div className="mt-12 border border-tinta/40 bg-papel-2" style={MAQ}>
          <div className="grid grid-cols-[1fr_1fr] border-b-2 border-tinta/40 text-[11px] tracking-[0.15em] uppercase md:grid-cols-[8rem_1fr_1fr]">
            <span className="hidden border-r border-tinta/30 p-3 text-tinta-3 md:block">Campo</span>
            <span className="border-r border-tinta/30 p-3 text-tinta">{C.diferenca.colunas[0]}</span>
            <span className="p-3 text-tinta-3">{C.diferenca.colunas[1]}</span>
          </div>
          {COMPARISON.map((c) => (
            <div key={c.tema} className="grid grid-cols-[1fr_1fr] border-b border-tinta/20 text-[13px] last:border-b-0 md:grid-cols-[8rem_1fr_1fr]">
              <span className="hidden border-r border-tinta/30 p-3 text-tinta-3 md:block">{c.tema}</span>
              <span className="border-r border-tinta/30 p-3 text-tinta">✓ {c.arquetypus}</span>
              <span className="p-3 text-tinta-3 line-through decoration-tinta/30">{c.comum}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 font-display text-3xl text-tinta italic">
          {C.diferenca.fecho[0]} <span className="text-latao-texto">{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — fotos presas no mural */}
      <Secao className="bg-papel-3">
        <Cabeca n="VII" eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} />
        <ul className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className={i % 2 ? 'rotate-[2deg]' : 'rotate-[-2deg]'}>
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="no-press block">
                  <Presa src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o body splash ${arq.nome}`} aspect="aspect-[3/4]" />
                  <p className="mt-3 text-center text-[11px] text-tinta-2" style={MAQ}>
                    {v.creator} · {arq.nome} · {brl(arq.preco)}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* Garantia — carimbo */}
      <Secao>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr]">
          <Carimbo top={C.garantia.label} mid={C.garantia.dias} className="mx-auto w-56 rotate-[-8deg] lg:w-64" />
          <div>
            <h2 className="font-display text-4xl leading-tight text-tinta lg:text-5xl">
              {C.garantia.title[0]} <em className="text-latao-texto">{C.garantia.title[1]}</em>
            </h2>
            <p className="mt-5 text-tinta-2">
              {C.garantia.body[0]} {C.garantia.body[1]}
            </p>
            <p className="mt-5 text-[12px] text-tinta-3" style={MAQ}>
              {C.garantia.nota}
            </p>
          </div>
        </div>
      </Secao>

      {/* Criadores */}
      <Secao className="bg-papel-2">
        <Cabeca n="VIII" eyebrow={C.criadores.eyebrow} title={<>{C.criadores.title[0]} <em className="text-latao-texto">{C.criadores.title[1]}</em></>} sub={C.criadores.body} />
        <dl className="mt-10 grid grid-cols-3 gap-4">
          {CREATOR_STATS.map((s) => (
            <div key={s.valor} className="flex flex-col border border-tinta/30 bg-papel p-4 lg:p-8">
              <dd className="font-display text-3xl text-tinta lg:text-6xl">{s.valor}</dd>
              <dt className="order-last mt-2 text-[10px] text-tinta-3 uppercase lg:text-[11px]" style={MAQ}>
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-[60ch] text-sm text-tinta-2">{C.criadores.body2}</p>
        <Link to="/criadores" className="mt-6 inline-block bg-tinta px-8 py-4 text-[12px] tracking-[0.15em] text-papel uppercase hover:bg-latao-texto" style={MAQ}>
          {C.criadores.cta} →
        </Link>
      </Secao>

      {/* Diário — fichas de biblioteca */}
      <Secao id="diario">
        <Cabeca n="IX" eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="relative border border-tinta/30 bg-papel-2 px-6 pt-10 pb-6" style={{ backgroundImage: PAUTA, backgroundPosition: '0 52px' }}>
              <span aria-hidden className="absolute inset-x-0 top-8 h-px bg-alerta/40" />
              <p className="absolute top-2.5 left-6 text-[11px] text-tinta-3" style={MAQ}>
                Ficha {String(i + 1).padStart(3, '0')}
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug text-tinta">{j.title}</h3>
              <p className="mt-2 text-sm leading-[28px] text-tinta-2">{j.body}</p>
              <p className="mt-2 text-[11px] text-tinta-3" style={MAQ}>
                {C.diario.breve}
              </p>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Cupom — etiqueta de amarrar, com furo */}
      <Secao className="bg-papel-3">
        <div className="relative mx-auto max-w-3xl border border-tinta/40 bg-papel px-6 py-12 text-center lg:px-16" style={{ clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 50%)' }}>
          <span aria-hidden className="absolute top-1/2 left-[4%] size-4 -translate-y-1/2 rounded-full border border-tinta/40 bg-papel-3" />
          <p className="text-xs tracking-[0.2em] text-latao-texto uppercase" style={MAQ}>
            {C.cupom.eyebrow}
          </p>
          <p className="mt-2 font-display text-8xl leading-none text-tinta">{C.cupom.valor}</p>
          <h2 className="mt-2 font-display text-2xl text-tinta italic">{C.cupom.title}</h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-sm text-tinta-2">{C.cupom.body}</p>
          <form onSubmit={preventSubmit} className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2" style={MAQ}>
            <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="border-b border-tinta/50 bg-transparent py-2 text-sm placeholder:text-tinta-3 focus:outline-none" />
            <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="border-b border-tinta/50 bg-transparent py-2 text-sm placeholder:text-tinta-3 focus:outline-none" />
            <button type="submit" className="mt-3 cursor-pointer bg-tinta py-3.5 text-[12px] tracking-[0.15em] text-papel uppercase hover:bg-latao-texto sm:col-span-2">
              {C.cupom.cta}
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — colofão do arquivo */}
      <footer className="-mb-24 border-t border-tinta/30 bg-tinta px-5 pt-16 pb-[calc(2.5rem+6rem)] text-papel md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl">Arquétypus</p>
            <p className="mt-3 font-display text-xl text-papel/80 italic">
              {C.rodape.tagline[0]} <span className="text-latao">{C.rodape.tagline[1]}</span>
            </p>
          </div>
          <ul className="space-y-2 text-[12px]" style={MAQ}>
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-latao">
                  → {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 text-[12px]" style={MAQ}>
            <li>
              <Link to="/privacidade" className="hover:text-latao">
                → Privacidade
              </Link>
            </li>
            <li>
              <button type="button" onClick={openCookiePreferences} className="cursor-pointer hover:text-latao">
                → Gerenciar cookies
              </button>
            </li>
            {FOOTER_SOON.map((s) => (
              <li key={s} aria-disabled="true" className="text-papel/40">
                {s} · em breve
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-papel/20 pt-5 text-[11px] leading-relaxed text-papel/50" style={MAQ}>
          {C.rodape.redes.join(' · ')} — {C.rodape.pagamentos} — {C.rodape.sac}
          <br />
          {C.rodape.empresa}
        </p>
      </footer>
    </>
  )
}
