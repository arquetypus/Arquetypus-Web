import { Link, useLocation } from 'react-router-dom'
import { getArchetype, productPath } from '@/data/archetypes'
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
 * Direção "Zen" (ThemeSwitcher) — wabi-sabi: o vazio (ma) como elemento. Referências: "Wabi-Sabi" e
 * "WABI + WABI" (Awwwards — paleta #E0DCD6 / #511400), guia de web design japonês da Utsubo (tategaki,
 * Mincho, uma ideia por tela). Linguagem que se repete: muito espaço, texto vertical nas margens, filetes
 * finos, um único destaque cor de ferrugem, o ensō (círculo de pincel) e fotos pequenas cercadas de vazio.
 */

/** Texto vertical (tategaki), lido de cima pra baixo. */
function Vertical({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-label text-[10px] tracking-[0.4em] uppercase [writing-mode:vertical-rl] ${className}`}>{children}</span>
  )
}

/** Ensō — círculo de pincel, aberto. */
function Enso({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <path
        d="M118 22c42 8 66 44 60 86-6 44-46 74-90 68-42-6-70-42-64-84 4-30 24-54 52-64"
        fill="none"
        stroke="var(--color-latao)"
        strokeWidth="11"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M124 26c36 10 56 40 52 76" fill="none" stroke="var(--color-latao)" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

/** Seção com rótulo vertical na margem esquerda. */
function Secao({ children, rotulo, id, className = '' }: { children: React.ReactNode; rotulo?: string; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-6 py-24 md:px-12 lg:py-40 ${className}`}>
      <div className="relative mx-auto max-w-6xl lg:pl-20">
        {rotulo && <Vertical className="absolute top-0 left-0 hidden text-tinta-3 lg:block">{rotulo}</Vertical>}
        {children}
      </div>
    </section>
  )
}

function Titulo({ children, sub, className = '' }: { children: React.ReactNode; sub?: string; className?: string }) {
  return (
    <div className={className}>
      <h2 className="max-w-[18ch] font-display text-3xl leading-[1.4] text-tinta lg:text-5xl lg:leading-[1.35]">{children}</h2>
      {sub && <p className="mt-6 max-w-[40ch] text-sm leading-loose text-tinta-2 lg:text-base">{sub}</p>}
    </div>
  )
}

/* ---------------- Hero ---------------- */

const HERO_ID = 'zeus'

export function HeroZen() {
  const slide = HERO_SLIDES[0]
  const heroArq = getArchetype(HERO_ID)!
  return (
    <section className="relative bg-papel px-6 pt-16 pb-24 md:px-12 lg:min-h-[88svh] lg:pt-24">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12 lg:items-end">
        {/* título em pé, como nos cartazes japoneses */}
        <div className="flex gap-6 lg:col-span-5">
          <Vertical className="text-latao">{slide.eyebrow}</Vertical>
          <div>
            <h1 className="font-display text-[34px] leading-[1.5] text-tinta md:text-5xl lg:text-6xl lg:leading-[1.4]">{slide.heading.replace(/\n/g, ' ')}</h1>
            <p className="mt-8 text-sm leading-loose text-tinta-2">{slide.sub}</p>
            <button type="button" onClick={() => scrollToId('catalogo')} className="group mt-12 inline-flex cursor-pointer items-center gap-4 text-sm text-tinta">
              <span className="h-px w-12 bg-tinta transition-all duration-500 group-hover:w-20" />
              Ver os 9 arquétipos
            </button>
          </div>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7">
          <Enso className="absolute -top-16 -right-6 w-48 lg:-top-24 lg:right-0 lg:w-72" />
          <img src={FRASCO_IMG[HERO_ID]} alt={`Body Splash Premium ${heroArq.nome}`} className="relative ml-auto w-[70%] object-cover lg:w-[62%]" style={{ aspectRatio: '3/4' }} />
          <p className="mt-4 ml-auto w-[70%] text-[11px] tracking-[0.2em] text-tinta-3 uppercase lg:w-[62%]">{heroArq.nome}</p>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Catálogo: um por vez, alternando lados ---------------- */

export function CatalogZen({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel-2 px-6 py-24 md:px-12 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] font-display text-3xl leading-[1.4] text-tinta lg:text-5xl">
            {C.catalogo.title[0]}
            <br />
            <span className="text-latao">{C.catalogo.title[1]}</span>
          </h2>
          <FilterTabs filtro={filtro} setFiltro={setFiltro} filtros={filtros} className="gap-6" base="border-b pb-1 text-xs tracking-[0.15em]" on="border-tinta text-tinta" off="border-transparent text-tinta-3 hover:text-tinta" />
        </div>
        <ul className="mt-20 space-y-24 lg:mt-32 lg:space-y-40">
          {items.map((a, n) => (
            <li key={a.id} className={`flex flex-col gap-8 md:flex-row md:items-end md:gap-14 ${n % 2 ? 'md:flex-row-reverse md:text-right' : ''}`}>
              <Link to={productPath(a)} state={{ backgroundLocation: location }} className="no-press group relative block w-[72%] md:w-[38%] lg:w-[30%]" style={n % 2 ? { marginLeft: 'auto' } : undefined}>
                <img src={FRASCO_IMG[a.id]} alt={`${a.tipo} ${a.nome}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition-opacity duration-700 group-hover:opacity-85" />
                <Vertical className={`absolute top-0 hidden text-tinta-3 md:block ${n % 2 ? '-left-8' : '-right-8'}`}>
                  {a.energia} · {a.fam}
                </Vertical>
              </Link>
              <div className="md:flex-1">
                <b className="mt-3 block font-display text-4xl font-normal text-tinta lg:text-6xl">{a.nome}</b>
                <p className="mt-4 text-sm leading-loose text-tinta-2">{a.ep}</p>
                {/* regra 7 */}
                <p className="mt-6 text-base text-tinta">{brl(a.preco)}</p>
                <p className="text-xs text-tinta-3">
                  {brl(pix(a.preco))} no Pix · 6x de {brl(parcela(a.preco))} · {a.vol}
                </p>
                <Link to={productPath(a)} state={{ backgroundLocation: location }} className={`group mt-8 inline-flex items-center gap-4 text-sm text-tinta ${n % 2 ? 'md:flex-row-reverse' : ''}`}>
                  <span className="h-px w-10 bg-latao transition-all duration-500 group-hover:w-16" />
                  Comprar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Página inteira ---------------- */

export function ZenPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — uma linha só, quase sussurrada */}
      <section className="border-y border-linha px-6 py-5">
        <p className="mx-auto max-w-6xl text-center text-[10px] tracking-[0.35em] text-tinta-3 uppercase">{SEALS.join('　·　')}</p>
      </section>

      {/* Coleções — três fotos pequenas, muito espaço */}
      <Secao id="segmentos" rotulo="Coleções">
        <Titulo>Escolha por onde começar</Titulo>
        <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-10">
          {SEGMENTS.map((seg, i) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className={`no-press group cursor-pointer text-left ${i === 1 ? 'md:mt-24' : ''}`}>
              <img src={seg.img} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover transition-opacity duration-700 group-hover:opacity-85" />
              <span className="mt-6 block text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{seg.label}</span>
              <b className="mt-2 block font-display text-2xl font-normal text-tinta">{seg.name}</b>
              <span className="mt-1 block text-xs text-tinta-3">{seg.meta}</span>
              <span className="mt-6 inline-flex items-center gap-3 text-xs text-tinta">
                <span className="h-px w-8 bg-latao transition-all duration-500 group-hover:w-14" />
                {C.segmentos.cta}
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Diagnóstico — três frases, uma por linha, com o vazio entre elas */}
      <Secao rotulo={C.diagnostico.eyebrow} className="bg-papel-2">
        <Titulo sub={C.diagnostico.sub}>{C.diagnostico.title}</Titulo>
        <ol className="mt-20 space-y-14 lg:ml-[33%]">
          {DIAGNOSIS.map((d) => (
            <li key={d.n} className="border-t border-linha-2 pt-6">
              <span className="text-[11px] tracking-[0.3em] text-latao">{d.n}</span>
              <b className="mt-3 block font-display text-xl leading-relaxed font-normal text-tinta lg:text-2xl">{d.title}</b>
              <p className="mt-2 text-sm leading-loose text-tinta-2">{d.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-24 text-center font-display text-2xl leading-relaxed text-tinta lg:text-3xl">
          {C.diagnostico.fecho[0]}
          <br />
          <span className="text-latao">{C.diagnostico.fecho[1]}</span>
        </p>
      </Secao>

      {/* Famílias — quatro pedras: imagem redonda e pequena */}
      <Secao rotulo={C.familias.eyebrow}>
        <Titulo sub={C.familias.sub}>{C.familias.title}</Titulo>
        <div className="mt-20 grid grid-cols-2 gap-x-10 gap-y-16 lg:grid-cols-4">
          {FAMILIES.map((f) => (
            <button key={f.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer text-center">
              <span className="mx-auto block aspect-square w-[78%] overflow-hidden rounded-[46%_54%_52%_48%/52%_46%_54%_48%]">
                <img src={f.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale-[30%] transition-[filter] duration-700 group-hover:grayscale-0" />
              </span>
              <b className="mt-6 block font-display text-xl font-normal text-tinta">{f.nome}</b>
              <span className="mt-2 block text-xs leading-relaxed text-tinta-3">{f.desc}</span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — quatro palavras, cada uma com a sua imagem pequena ao lado */}
      <Secao rotulo={C.energias.eyebrow} className="bg-noite text-papel">
        <h2 className="max-w-[18ch] font-display text-3xl leading-[1.4] lg:text-5xl">{C.energias.title}</h2>
        <p className="mt-6 text-sm text-papel/70">{C.energias.sub}</p>
        <ul className="mt-20">
          {ENERGIES.map((e) => (
            <li key={e.nome} className="border-t border-papel/15 last:border-b">
              <button type="button" onClick={toCatalog} className="no-press group flex w-full cursor-pointer items-center gap-8 py-8 text-left">
                <span className="block size-16 shrink-0 overflow-hidden lg:size-20">
                  <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                </span>
                <b className="flex-1 font-display text-3xl font-normal lg:text-5xl">{e.nome}</b>
                <span className="hidden text-xs tracking-[0.2em] text-papel/50 md:block">{e.arquetipos.map((id) => getArchetype(id)?.nome).join('　')}</span>
              </button>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Reconhecimento */}
      <Secao rotulo={C.reconhecimento.eyebrow}>
        <Titulo sub={C.reconhecimento.sub}>{C.reconhecimento.title}</Titulo>
        <ul className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {QUALIFICATION.map((q) => (
            <li key={q.title}>
              <span aria-hidden className="block h-12 w-px bg-latao" />
              <b className="mt-6 block font-display text-lg leading-relaxed font-normal text-tinta">{q.title}</b>
              <p className="mt-3 text-sm leading-loose text-tinta-2">{q.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-24 text-center font-display text-2xl leading-relaxed text-tinta lg:text-3xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]}
          <br />
          <span className="text-latao">{C.reconhecimento.fecho[2]}</span>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — uma imagem, um nome */}
      <Secao id="destaque" rotulo={C.destaque.eyebrow}>
        <div className="grid items-end gap-14 lg:grid-cols-12">
          <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="w-[80%] object-cover object-[50%_20%] lg:col-span-5 lg:w-full" style={{ aspectRatio: '3/4' }} />
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="mt-4 font-display text-6xl leading-none text-tinta lg:text-8xl">{featured.nome}</h2>
            <p className="mt-8 font-display text-xl leading-relaxed text-tinta-2">{featured.ep}</p>
            <p className="mt-6 text-sm leading-loose text-tinta-2">{featured.cheiro[1]}</p>
            <p className="mt-10 text-lg text-tinta">{brl(featured.preco)}</p>
            <p className="text-xs text-tinta-3">
              {brl(pix(featured.preco))} no Pix · ou 6x de {brl(parcela(featured.preco))} sem juros · {featured.tipo} {featured.vol}
            </p>
            <Link to={productPath(featured)} state={{ backgroundLocation: location }} className="group mt-10 inline-flex items-center gap-4 text-sm text-tinta">
              <span className="h-px w-12 bg-latao transition-all duration-500 group-hover:w-20" />
              {C.destaque.cta} {featured.nome}
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte — o ensō e uma frase */}
      <section className="relative grid min-h-[70svh] place-items-center overflow-hidden bg-papel-2 px-6 py-24 text-center">
        <Enso className="absolute w-[min(80vw,520px)] opacity-70" />
        <div className="relative">
          <p className="max-w-[14ch] font-display text-3xl leading-relaxed text-tinta lg:text-5xl">{C.ponte.text}</p>
          <button type="button" onClick={toCatalog} className="mt-10 cursor-pointer text-sm text-tinta underline decoration-latao underline-offset-8 hover:text-latao">
            {C.ponte.cta}
          </button>
        </div>
      </section>

      {/* Diferença — duas colunas, uma clara e uma esmaecida */}
      <Secao rotulo={C.diferenca.eyebrow}>
        <Titulo>
          {C.diferenca.title[0]} <span className="text-latao">{C.diferenca.title[1]}</span>
        </Titulo>
        <div className="mt-20 grid grid-cols-2 gap-8 lg:gap-20">
          <p className="border-b border-tinta pb-3 text-[10px] tracking-[0.3em] text-tinta uppercase">{C.diferenca.colunas[0]}</p>
          <p className="border-b border-linha-2 pb-3 text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{C.diferenca.colunas[1]}</p>
          {COMPARISON.map((c) => (
            <div key={c.tema} className="col-span-2 grid grid-cols-2 gap-8 lg:gap-20">
              <p className="font-display text-base leading-relaxed text-tinta lg:text-lg">{c.arquetypus}</p>
              <p className="text-sm leading-relaxed text-tinta-3/70">{c.comum}</p>
            </div>
          ))}
        </div>
        <p className="mt-24 text-center font-display text-2xl leading-relaxed text-tinta">
          {C.diferenca.fecho[0]}
          <br />
          <span className="text-latao">{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — retratos em fileira, sem moldura */}
      <Secao rotulo={C.comunidade.eyebrow} className="bg-papel-2">
        <Titulo sub={C.comunidade.sub}>{C.comunidade.title}</Titulo>
        <ul className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className={i % 2 ? 'lg:mt-16' : ''}>
                <Link to={productPath(arq)} state={{ backgroundLocation: location }} className="no-press group block">
                  <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition-opacity duration-700 group-hover:opacity-85" />
                  <span className="mt-4 block font-display text-lg text-tinta">{arq.nome}</span>
                  <span className="text-xs text-tinta-3">
                    {v.creator} · {brl(arq.preco)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* Garantia — o número dentro do ensō */}
      <Secao rotulo={C.garantia.label}>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto grid aspect-square w-64 place-items-center lg:w-80">
            <Enso className="absolute inset-0" />
            <span className="font-display text-7xl text-tinta lg:text-8xl">{C.garantia.dias}</span>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-[1.4] text-tinta lg:text-4xl">
              {C.garantia.title[0]}
              <br />
              <span className="text-latao">{C.garantia.title[1]}</span>
            </h2>
            <p className="mt-8 text-sm leading-loose text-tinta-2">
              {C.garantia.body[0]}
              <br />
              {C.garantia.body[1]}
            </p>
            <p className="mt-8 text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{C.garantia.nota}</p>
          </div>
        </div>
      </Secao>

      {/* Criadores */}
      <Secao rotulo={C.criadores.eyebrow} className="bg-papel-2">
        <Titulo sub={C.criadores.body}>
          {C.criadores.title[0]} <span className="text-latao">{C.criadores.title[1]}</span>
        </Titulo>
        <dl className="mt-20 grid grid-cols-3 gap-6">
          {CREATOR_STATS.map((s) => (
            <div key={s.valor} className="flex flex-col border-t border-tinta pt-6">
              <dd className="font-display text-3xl text-tinta lg:text-5xl">{s.valor}</dd>
              <dt className="order-last mt-3 text-[10px] tracking-[0.2em] text-tinta-3 uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-14 max-w-[56ch] text-sm leading-loose text-tinta-2">{C.criadores.body2}</p>
        <Link to="/criadores" className="group mt-10 inline-flex items-center gap-4 text-sm text-tinta">
          <span className="h-px w-12 bg-latao transition-all duration-500 group-hover:w-20" />
          {C.criadores.cta}
        </Link>
      </Secao>

      {/* Diário — três textos em colunas estreitas */}
      <Secao id="diario" rotulo={C.diario.eyebrow}>
        <Titulo>{C.diario.title}</Titulo>
        <ol className="mt-20 grid gap-14 md:grid-cols-3 md:gap-12">
          {JOURNAL.map((j, i) => (
            <li key={j.title}>
              <span className="text-[11px] tracking-[0.3em] text-latao">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-display text-xl leading-relaxed text-tinta">{j.title}</h3>
              <p className="mt-3 text-sm leading-loose text-tinta-2">{j.body}</p>
              <p className="mt-6 text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{C.diario.breve}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Cupom */}
      <Secao className="bg-papel-2">
        <div className="mx-auto grid max-w-4xl gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{C.cupom.eyebrow}</p>
            <p className="mt-6 font-display text-8xl leading-none text-latao">{C.cupom.valor}</p>
            <h2 className="mt-6 font-display text-2xl leading-relaxed text-tinta">{C.cupom.title}</h2>
            <p className="mt-4 text-sm leading-loose text-tinta-2">{C.cupom.body}</p>
          </div>
          <form onSubmit={preventSubmit} className="flex flex-col justify-end gap-8">
            <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="border-b border-tinta/40 bg-transparent py-3 text-sm placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
            <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="border-b border-tinta/40 bg-transparent py-3 text-sm placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
            <button type="submit" className="group inline-flex cursor-pointer items-center gap-4 self-start text-sm text-tinta">
              <span className="h-px w-12 bg-latao transition-all duration-500 group-hover:w-20" />
              {C.cupom.cta}
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — quase nada */}
      <footer className="-mb-24 border-t border-linha bg-papel px-6 pt-20 pb-[calc(3rem+6rem)] md:px-12">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[2fr_1fr_1fr]">
          <p className="font-display text-xl leading-relaxed text-tinta">
            {C.rodape.tagline[0]}
            <br />
            <span className="text-latao">{C.rodape.tagline[1]}</span>
          </p>
          <ul className="space-y-3 text-xs text-tinta-2">
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-tinta">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-3 text-xs text-tinta-2">
            <li>
              <Link to="/privacidade" className="hover:text-tinta">
                Privacidade
              </Link>
            </li>
            <li>
              <button type="button" onClick={openCookiePreferences} className="cursor-pointer hover:text-tinta">
                Gerenciar cookies
              </button>
            </li>
            {FOOTER_SOON.map((s) => (
              <li key={s} aria-disabled="true" className="text-tinta-3/60">
                {s} · em breve
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-20 max-w-6xl text-[10px] leading-loose tracking-[0.2em] text-tinta-3 uppercase">
          {C.rodape.redes.join('　')}　·　{C.rodape.pagamentos}　·　<span className="normal-case">{C.rodape.sac}</span>
          <br />
          {C.rodape.empresa}
        </p>
      </footer>
    </>
  )
}
