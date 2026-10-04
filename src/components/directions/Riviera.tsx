import { Link, useLocation } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { COMPARISON, DIAGNOSIS, ENERGIES, FAMILIES, FRASCO_IMG, HERO_SLIDES, HOME_COPY as C, JOURNAL, QUALIFICATION, SEALS, SEGMENTS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import { scrollToId } from '@/lib/scrollToId'
import {
  brl,
  CREATOR_STATS,
  FilterTabs,
  FOOTER_EXPLORE,
  FOOTER_SOON,
  parcela,
  pix,
  preventSubmit,
  type CatalogProps,
  type DirectionPageProps,
} from './shared'

/**
 * Direção "Riviera" (ThemeSwitcher) — verão mediterrâneo: luz, mar e postal de viagem. Referências
 * (Behance): "MARBLE BLUE | Mediterranean Hotel", "Dimora Livia — Luxury Boutique Hotel", "The Floral
 * Arches", "Riviera Hotel — Charline Groen", "Baume & Mercier Riviera Summer". Linguagem que se repete:
 * listras de toldo, ondas entre as seções, o sol (círculo na cor de destaque), cartões-postais com selo e
 * carimbo, adesivos tortos e cantos bem redondos. Serifa macia (Fraunces).
 */

const TOLDO = 'repeating-linear-gradient(90deg, var(--color-noite) 0 28px, var(--color-papel) 28px 56px)'

/** Onda entre seções: a cor de cima "derrama" na de baixo. */
function Onda({ de, para, inverter = false }: { de: string; para: string; inverter?: boolean }) {
  return (
    <div aria-hidden style={{ background: para }} className="-mt-px">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block h-8 w-full lg:h-14 ${inverter ? 'scale-x-[-1]' : ''}`}>
        <path d="M0 0h1440v20c-120 25-240 38-360 25S840 0 720 8 480 50 360 52 120 30 0 18z" fill={de} />
      </svg>
    </div>
  )
}

/** Adesivo redondo e torto. */
function Adesivo({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`grid size-24 place-items-center rounded-full bg-latao p-3 text-center font-display text-sm leading-tight text-papel shadow-lg lg:size-28 ${className}`}>
      {children}
    </span>
  )
}

/** Selo postal com borda serrilhada. */
function SeloPostal({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span className={`block border-2 border-dashed border-linha-2 bg-papel p-1 ${className}`}>
      <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
    </span>
  )
}

/* ---------------- Hero ---------------- */

export function HeroRiviera() {
  const slide = HERO_SLIDES[0]
  return (
    <section className="relative overflow-hidden bg-papel">
      <div aria-hidden className="h-10 lg:h-14" style={{ background: TOLDO }} />
      {/* franja do toldo: meias-luas alternando as duas cores */}
      <svg aria-hidden className="block h-3.5 w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="franja-toldo" width="56" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0h28a14 14 0 0 1-28 0Z" fill="var(--color-noite)" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#franja-toldo)" />
      </svg>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-16 md:px-10 lg:grid-cols-2 lg:pt-16 lg:pb-24">
        <div>
          <p className="font-label text-[11px] tracking-[0.25em] text-latao-texto uppercase">☀ {slide.eyebrow}</p>
          <h1 className="mt-5 font-display text-[44px] leading-[1.02] text-balance text-tinta md:text-6xl lg:text-7xl">{slide.heading.replace(/\n/g, ' ')}</h1>
          <p className="mt-5 max-w-[36ch] text-lg text-tinta-2">{slide.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToId('catalogo')} className="cursor-pointer rounded-full bg-tinta px-8 py-4 text-sm font-medium text-papel hover:bg-latao">
              Ver os 9 arquétipos
            </button>
            <button type="button" onClick={() => scrollToId('segmentos')} className="cursor-pointer rounded-full border-2 border-tinta px-8 py-4 text-sm font-medium text-tinta hover:bg-papel-2">
              Escolha por onde começar
            </button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-lg">
          {/* o sol */}
          <span aria-hidden className="absolute inset-[6%] rounded-full bg-latao" />
          <span aria-hidden className="absolute inset-x-[6%] bottom-[6%] h-1/2 overflow-hidden rounded-b-full">
            <span className="absolute inset-0" style={{ background: 'repeating-linear-gradient(to bottom, var(--color-noite) 0 10px, transparent 10px 22px)', opacity: 0.85 }} />
          </span>
          <img src={FRASCO_IMG.afrodite} alt="Body Splash Premium Afrodite" className="absolute top-[12%] left-[10%] w-[40%] rotate-[-8deg] rounded-[2rem] border-4 border-papel object-cover shadow-xl" style={{ aspectRatio: '3/4' }} />
          <img src={FRASCO_IMG.sereia} alt="Body Splash Premium Sereia" className="absolute top-[22%] right-[8%] w-[42%] rotate-[7deg] rounded-[2rem] border-4 border-papel object-cover shadow-xl" style={{ aspectRatio: '3/4' }} />
          <Adesivo className="absolute bottom-[4%] left-[38%] rotate-[-12deg]">Nove fragrâncias</Adesivo>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Catálogo: cartões-postais ---------------- */

export function CatalogRiviera({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel-2 px-4 py-16 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-label text-[11px] tracking-[0.25em] text-latao-texto uppercase">☀ {C.catalogo.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-[20ch] font-display text-4xl leading-tight text-tinta lg:text-6xl">
            {C.catalogo.title[0]} <em className="text-latao-texto">{C.catalogo.title[1]}</em>
          </h2>
          <FilterTabs filtro={filtro} setFiltro={setFiltro} filtros={filtros} className="mt-7 justify-start sm:justify-center" base="rounded-full border-2 px-4 py-2 text-xs font-medium" on="border-tinta bg-tinta text-papel" off="border-tinta/20 bg-papel text-tinta hover:border-tinta" />
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, n) => (
            <li key={a.id} className={`rounded-[1.75rem] bg-papel p-3 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.35)] ${n % 2 ? 'lg:rotate-[1deg]' : 'lg:rotate-[-1deg]'}`}>
              <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="no-press group relative block overflow-hidden rounded-[1.25rem]" style={{ background: a.bg }}>
                <img src={FRASCO_IMG[a.id]} alt={`${a.tipo} ${a.nome}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* carimbo postal com a energia */}
                <span className="absolute top-3 right-3 grid size-20 rotate-12 place-items-center rounded-full border-2 border-dashed border-papel/90 text-center font-label text-[9px] leading-tight tracking-[0.15em] text-papel uppercase">
                  {a.energia}
                </span>
              </Link>
              {/* verso do postal: nome e linhas de endereço com o preço (regra 7) */}
              <div className="grid grid-cols-[1fr_auto] gap-3 px-2 pt-4 pb-2">
                <div>
                  <b className="block font-display text-3xl leading-none font-normal text-tinta">{a.nome}</b>
                  <p className="mt-1 text-sm text-tinta-2 italic">{a.ep}</p>
                </div>
                <span className="size-3 rounded-full" style={{ background: a.cor }} aria-hidden />
              </div>
              <div className="mx-2 space-y-1 border-t border-dashed border-linha-2 pt-3 text-sm">
                <p className="flex justify-between">
                  <b className="font-semibold text-tinta">{brl(a.preco)}</b>
                  <span className="text-tinta-3">
                    {a.fam} · {a.vol}
                  </span>
                </p>
                <p className="text-xs text-tinta-2">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))}
                </p>
              </div>
              <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="mx-2 mt-4 mb-1 block rounded-full bg-tinta py-3 text-center text-sm font-medium text-papel hover:bg-latao">
                Comprar
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Página inteira ---------------- */

function Cabeca({ eyebrow, title, sub, center = false, claro = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; claro?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className={`font-label text-[11px] tracking-[0.25em] uppercase ${claro ? 'text-latao' : 'text-latao-texto'}`}>☀ {eyebrow}</p>
      <h2 className={`mt-4 max-w-[20ch] font-display text-4xl leading-[1.08] lg:text-6xl ${center ? 'mx-auto' : ''} ${claro ? 'text-papel' : 'text-tinta'}`}>{title}</h2>
      {sub && <p className={`mt-4 max-w-[46ch] text-base ${center ? 'mx-auto' : ''} ${claro ? 'text-papel/75' : 'text-tinta-2'}`}>{sub}</p>}
    </div>
  )
}

function Secao({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-5 py-16 md:px-10 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

const P = 'var(--color-papel)'
const P2 = 'var(--color-papel-2)'
const N = 'var(--color-noite)'

export function RivieraPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — faixa azul com bolinhas */}
      <section className="bg-noite px-5 py-4 text-papel">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 font-label text-[11px] tracking-[0.18em] uppercase">
          {SEALS.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-full bg-latao" />
              {s}
            </li>
          ))}
        </ul>
      </section>
      <Onda de={N} para={P} />

      {/* Coleções — três janelas com toldo */}
      <Secao id="segmentos">
        <Cabeca eyebrow="Coleções" title="Escolha por onde começar" center />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SEGMENTS.map((seg) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group cursor-pointer overflow-hidden rounded-[2rem] bg-papel-2 text-left shadow-[0_14px_30px_-18px_rgba(0,0,0,0.35)]">
              <span aria-hidden className="block h-6" style={{ background: TOLDO }} />
              <span className="block overflow-hidden">
                <img src={seg.img} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span className="flex items-end justify-between gap-3 p-5">
                <span>
                  <span className="block font-label text-[10px] tracking-[0.2em] text-tinta-3 uppercase">{seg.label}</span>
                  <b className="block font-display text-3xl font-normal text-tinta">{seg.name}</b>
                  <span className="text-xs text-tinta-2">{seg.meta}</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-latao text-papel transition-transform group-hover:rotate-45">↗</span>
              </span>
            </button>
          ))}
        </div>
      </Secao>
      <Onda de={P} para={P2} inverter />

      {/* Diagnóstico — três ondas de pensamento */}
      <Secao className="bg-papel-2">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Cabeca eyebrow={C.diagnostico.eyebrow} title={C.diagnostico.title} sub={C.diagnostico.sub} />
          <ol className="space-y-4">
            {DIAGNOSIS.map((d) => (
              <li key={d.n} className="flex gap-4 rounded-[1.5rem] bg-papel p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-latao font-display text-xl text-latao-texto">{d.n}</span>
                <span>
                  <b className="block font-display text-xl font-normal text-tinta">{d.title}</b>
                  <span className="mt-1 block text-sm text-tinta-2">{d.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-12 text-center font-display text-3xl text-tinta lg:text-4xl">
          {C.diagnostico.fecho[0]} <em className="text-latao-texto">{C.diagnostico.fecho[1]}</em>
        </p>
      </Secao>
      <Onda de={P2} para={P} />

      {/* Famílias — azulejos */}
      <Secao>
        <Cabeca eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {FAMILIES.map((f) => (
            <button key={f.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer rounded-[1.5rem] border-[6px] border-noite bg-noite p-1 text-left">
              <span className="relative block overflow-hidden rounded-[1rem]">
                <img src={f.img} alt="" loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* ornamento de azulejo nos cantos */}
                <span aria-hidden className="absolute inset-2 rounded-[0.75rem] border-2 border-dashed border-papel/70" />
              </span>
              <span className="block px-3 pt-3 pb-2 text-papel">
                <b className="block font-display text-2xl font-normal">{f.nome}</b>
                <span className="text-xs text-papel/75">{f.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — quatro pores do sol */}
      <Onda de={P} para={N} inverter />
      <Secao className="bg-noite">
        <Cabeca eyebrow={C.energias.eyebrow} title={C.energias.title} sub={C.energias.sub} claro center />
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {ENERGIES.map((e) => (
            <button key={e.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer text-center text-papel">
              <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-full border-4 border-latao">
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'repeating-linear-gradient(to bottom, var(--color-noite) 0 6px, transparent 6px 14px)' }} />
              </span>
              <b className="mt-4 block font-display text-2xl font-normal">{e.nome}</b>
              <span className="text-xs text-papel/70">{e.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}</span>
            </button>
          ))}
        </div>
      </Secao>
      <Onda de={N} para={P} />

      {/* Reconhecimento — bilhetes */}
      <Secao>
        <Cabeca eyebrow={C.reconhecimento.eyebrow} title={C.reconhecimento.title} sub={C.reconhecimento.sub} center />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {QUALIFICATION.map((q, i) => (
            <li key={q.title} className={`rounded-[1.5rem] bg-papel-2 p-6 ${i === 1 ? 'md:-rotate-1' : 'md:rotate-1'}`}>
              <span aria-hidden className="text-2xl text-latao">☀</span>
              <b className="mt-2 block font-display text-xl font-normal text-tinta">{q.title}</b>
              <p className="mt-2 text-sm text-tinta-2">{q.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-center font-display text-3xl text-tinta lg:text-4xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <em className="text-latao-texto">{C.reconhecimento.fecho[2]}</em>
        </p>
      </Secao>
      <Onda de={P} para={P2} inverter />

      {catalog}

      {/* Destaque — postal grande */}
      <Onda de={P2} para={P} />
      <Secao id="destaque">
        <div className="grid overflow-hidden rounded-[2rem] bg-papel-2 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.4)] md:grid-cols-2">
          <div className="relative">
            <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="h-full max-h-[620px] w-full object-cover object-[50%_20%]" />
            <Adesivo className="absolute top-5 left-5 -rotate-12">{C.destaque.eyebrow}</Adesivo>
          </div>
          <div className="relative flex flex-col justify-center p-6 md:p-10 lg:p-14">
            <SeloPostal src={FRASCO_IMG[featured.id]} className="absolute top-6 right-6 w-16 rotate-6 lg:w-20" />
            <p className="font-label text-[11px] tracking-[0.2em] text-tinta-3 uppercase">
              {featured.fam}
            </p>
            <h2 className="mt-3 font-display text-6xl leading-none text-tinta lg:text-8xl">{featured.nome}</h2>
            <p className="mt-4 font-display text-xl text-tinta-2 italic">{featured.ep}</p>
            <p className="mt-4 text-sm text-tinta-2">{featured.cheiro[1]}</p>
            <div className="mt-6 border-t border-dashed border-linha-2 pt-4">
              <b className="font-display text-4xl font-normal text-tinta">{brl(featured.preco)}</b>
              <p className="text-xs text-tinta-2">
                {brl(pix(featured.preco))} no Pix · ou 6x de {brl(parcela(featured.preco))} sem juros · {featured.tipo} {featured.vol}
              </p>
            </div>
            <Link to={`/loja/${featured.id}`} state={{ backgroundLocation: location }} className="mt-6 self-start rounded-full bg-tinta px-8 py-4 text-sm font-medium text-papel hover:bg-latao">
              {C.destaque.cta} {featured.nome}
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte — sol nascendo */}
      <section className="relative overflow-hidden bg-latao px-5 pt-20 pb-28 text-center text-papel">
        <span aria-hidden className="absolute -bottom-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-papel/20 lg:size-[34rem] lg:-bottom-72" />
        <p className="relative mx-auto max-w-[16ch] font-display text-5xl leading-tight lg:text-7xl">{C.ponte.text}</p>
        <button type="button" onClick={toCatalog} className="relative mt-8 cursor-pointer rounded-full bg-papel px-8 py-4 text-sm font-medium text-tinta hover:bg-papel-2">
          {C.ponte.cta}
        </button>
      </section>

      {/* Diferença — duas margens */}
      <Secao>
        <Cabeca eyebrow={C.diferenca.eyebrow} title={<>{C.diferenca.title[0]} <em className="text-latao-texto">{C.diferenca.title[1]}</em></>} center />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-noite p-6 text-papel lg:p-10">
            <p className="font-label text-[11px] tracking-[0.2em] text-latao uppercase">{C.diferenca.colunas[0]}</p>
            <ul className="mt-5 space-y-3">
              {COMPARISON.map((c) => (
                <li key={c.tema} className="flex gap-3">
                  <span aria-hidden className="text-latao">☀</span>
                  <span className="font-display text-lg">{c.arquetypus}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border-2 border-dashed border-linha-2 p-6 lg:p-10">
            <p className="font-label text-[11px] tracking-[0.2em] text-tinta-3 uppercase">{C.diferenca.colunas[1]}</p>
            <ul className="mt-5 space-y-3 text-tinta-3">
              {COMPARISON.map((c) => (
                <li key={c.tema} className="flex gap-3">
                  <span aria-hidden>·</span>
                  <span className="text-base">{c.comum}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 text-center font-display text-3xl text-tinta">
          {C.diferenca.fecho[0]} <em className="text-latao-texto">{C.diferenca.fecho[1]}</em>
        </p>
      </Secao>
      <Onda de={P} para={P2} inverter />

      {/* Comunidade — postais de férias */}
      <Secao className="bg-papel-2">
        <Cabeca eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} center />
        <ul className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className={i % 2 ? 'rotate-2' : '-rotate-2'}>
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="no-press block rounded-[1.25rem] bg-papel p-2.5 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)]">
                  <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`} loading="lazy" className="aspect-[3/4] w-full rounded-[0.9rem] object-cover" />
                  <span className="flex items-center justify-between px-1 pt-2.5 text-sm">
                    <span className="font-display text-lg text-tinta">{arq.nome}</span>
                    <span className="text-xs text-tinta-3">{v.creator}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>
      <Onda de={P2} para={N} />

      {/* Garantia — selo do sol */}
      <Secao className="bg-noite text-papel">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto grid aspect-square w-64 place-items-center lg:w-80">
            <span aria-hidden className="absolute inset-0 rounded-full" style={{ background: 'repeating-conic-gradient(var(--color-latao) 0 6deg, transparent 6deg 15deg)' }} />
            <span className="relative grid aspect-square w-[78%] place-items-center rounded-full bg-latao text-center">
              <span>
                <span className="block font-display text-7xl leading-none lg:text-8xl">{C.garantia.dias}</span>
                <span className="font-label text-[10px] tracking-[0.2em] uppercase">{C.garantia.label}</span>
              </span>
            </span>
          </div>
          <div>
            <h2 className="font-display text-4xl leading-tight lg:text-5xl">
              {C.garantia.title[0]} <em className="text-latao">{C.garantia.title[1]}</em>
            </h2>
            <p className="mt-5 text-papel/80">
              {C.garantia.body[0]} {C.garantia.body[1]}
            </p>
            <p className="mt-5 font-label text-[11px] tracking-[0.15em] text-papel/50 uppercase">{C.garantia.nota}</p>
          </div>
        </div>
      </Secao>
      <Onda de={N} para={P} inverter />

      {/* Criadores — três boias */}
      <Secao>
        <Cabeca eyebrow={C.criadores.eyebrow} title={<>{C.criadores.title[0]} <em className="text-latao-texto">{C.criadores.title[1]}</em></>} sub={C.criadores.body} />
        <dl className="mt-10 grid grid-cols-3 gap-4 lg:gap-8">
          {CREATOR_STATS.map((s, i) => (
            <div key={s.valor} className={`flex flex-col items-center rounded-[2rem] p-5 text-center lg:p-10 ${i === 1 ? 'bg-latao text-papel' : 'bg-papel-2 text-tinta'}`}>
              <dd className="font-display text-3xl lg:text-6xl">{s.valor}</dd>
              <dt className="order-last mt-2 text-[11px] opacity-75">{s.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] text-sm text-tinta-2">{C.criadores.body2}</p>
          <Link to="/criadores" className="shrink-0 rounded-full bg-tinta px-8 py-4 text-center text-sm font-medium text-papel hover:bg-latao">
            {C.criadores.cta}
          </Link>
        </div>
      </Secao>
      <Onda de={P} para={P2} />

      {/* Diário — guia de viagem */}
      <Secao id="diario" className="bg-papel-2">
        <Cabeca eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="flex flex-col rounded-[1.75rem] bg-papel p-6">
              <span className="grid size-10 place-items-center rounded-full bg-noite font-display text-papel">{i + 1}</span>
              <h3 className="mt-5 font-display text-2xl leading-snug text-tinta">{j.title}</h3>
              <p className="mt-2 text-sm text-tinta-2">{j.body}</p>
              <span className="mt-auto pt-6 text-xs text-tinta-3">{C.diario.breve}</span>
            </li>
          ))}
        </ul>
      </Secao>
      <Onda de={P2} para={P} inverter />

      {/* Cupom — postal com selo */}
      <Secao>
        <div className="relative mx-auto grid max-w-5xl gap-8 rounded-[2rem] bg-papel-2 p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.4)] lg:grid-cols-2 lg:p-12">
          <SeloPostal src={FRASCO_IMG.cleopatra} className="absolute top-6 right-6 w-16 rotate-6" />
          <div className="lg:border-r lg:border-dashed lg:border-linha-2 lg:pr-12">
            <p className="font-label text-[11px] tracking-[0.25em] text-latao-texto uppercase">☀ {C.cupom.eyebrow}</p>
            <p className="mt-3 font-display text-8xl leading-none text-latao lg:text-9xl">{C.cupom.valor}</p>
            <h2 className="mt-2 font-display text-3xl text-tinta">{C.cupom.title}</h2>
            <p className="mt-3 text-sm text-tinta-2">{C.cupom.body}</p>
          </div>
          <form onSubmit={preventSubmit} className="flex flex-col justify-end gap-4">
            <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="rounded-full border-2 border-linha-2 bg-papel px-5 py-3.5 text-sm placeholder:text-tinta-3 focus:border-tinta focus:outline-none" />
            <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="rounded-full border-2 border-linha-2 bg-papel px-5 py-3.5 text-sm placeholder:text-tinta-3 focus:border-tinta focus:outline-none" />
            <button type="submit" className="cursor-pointer rounded-full bg-tinta py-4 text-sm font-medium text-papel hover:bg-latao">
              {C.cupom.cta}
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — toldo e mar */}
      <footer className="-mb-24 bg-noite pb-[calc(2.5rem+6rem)] text-papel">
        <div aria-hidden className="h-8" style={{ background: TOLDO }} />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-14 md:px-10 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-5xl">Arquétypus</p>
            <p className="mt-3 font-display text-xl text-papel/80 italic">
              {C.rodape.tagline[0]} <span className="text-latao">{C.rodape.tagline[1]}</span>
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-latao">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacidade" className="hover:text-latao">
                Privacidade
              </Link>
            </li>
            <li>
              <button type="button" onClick={openCookiePreferences} className="cursor-pointer hover:text-latao">
                Gerenciar cookies
              </button>
            </li>
            {FOOTER_SOON.map((s) => (
              <li key={s} aria-disabled="true" className="text-papel/40">
                {s} · em breve
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-12 max-w-7xl border-t border-papel/20 px-5 pt-6 text-xs text-papel/50 md:px-10">
          {C.rodape.redes.join(' · ')} · {C.rodape.pagamentos} · {C.rodape.sac} · {C.rodape.empresa}
        </p>
      </footer>
    </>
  )
}
