import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
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
 * Direção "Laboratório" (ThemeSwitcher) — a bancada do perfumista: ficha técnica, papel milimetrado, marcas
 * de corte nas fotos e dados em fonte mono. Referências (Behance): "The Modern Apothecary Perfume
 * Packaging", "C. O. Bigelow Apothecary Rebrand", "ARCHE PERFUME", "Aether Alchemy". Conversa com o que a
 * marca já declara (Scentec, IFRA 51, INCI) — o comparativo vira laudo. Sem claim de efeito (regra 4).
 */

const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" }
/** Papel milimetrado. */
const GRADE = {
  backgroundImage:
    'linear-gradient(color-mix(in srgb, var(--color-linha-2) 45%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-linha-2) 45%, transparent) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

/** Marcas de corte nos quatro cantos. */
function Mira({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const c = 'pointer-events-none absolute size-4 border-tinta'
  return (
    <div className={`relative p-3 ${className}`}>
      <span aria-hidden className={`${c} top-0 left-0 border-t border-l`} />
      <span aria-hidden className={`${c} top-0 right-0 border-t border-r`} />
      <span aria-hidden className={`${c} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden className={`${c} right-0 bottom-0 border-r border-b`} />
      {children}
    </div>
  )
}

/** Rótulo mono em caixa alta: "[ 01 ] TEXTO". */
function Cod({ n, children, className = '' }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] tracking-[0.08em] text-latao-texto uppercase ${className}`} style={MONO}>
      {n && <span className="text-tinta-3">[{n}] </span>}
      {children}
    </p>
  )
}

function Linha({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dashed border-linha-2 py-1.5 text-[11px]" style={MONO}>
      <dt className="text-tinta-3 uppercase">{k}</dt>
      <dd className="text-right text-tinta">{v}</dd>
    </div>
  )
}

/* ---------------- Hero: a ficha ---------------- */

const PRECO_MIN = Math.min(...ARCHETYPES.map((a) => a.preco))

export function HeroLaboratorio() {
  const slide = HERO_SLIDES[0]
  return (
    <section className="bg-papel px-5 pt-10 pb-14 md:px-10 lg:pt-16 lg:pb-20" style={GRADE}>
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between border-b border-tinta pb-2 text-[10px] text-tinta-2 uppercase" style={MONO}>
          <span>Arquétypus / Ficha 00</span>
          <span>{slide.eyebrow}</span>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[44px] leading-[1] font-medium tracking-tight text-balance text-tinta md:text-7xl lg:text-[88px]">
              {slide.heading.replace(/\n/g, ' ')}
            </h1>
            <p className="mt-6 max-w-[40ch] text-base text-tinta-2 lg:text-lg">{slide.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToId('catalogo')} className="cursor-pointer bg-tinta px-6 py-3.5 text-[12px] text-papel uppercase hover:bg-latao" style={MONO}>
                Ver os 9 arquétipos →
              </button>
              <button type="button" onClick={() => scrollToId('segmentos')} className="cursor-pointer border border-tinta px-6 py-3.5 text-[12px] text-tinta uppercase hover:bg-papel-2" style={MONO}>
                Escolha por onde começar
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Mira>
              <img src={FRASCO_IMG.sereia} alt="Body splash Sereia" className="aspect-[4/3] w-full object-cover" />
            </Mira>
            {/* ficha técnica — só dado que já existe em data/ */}
            <dl className="mt-4 bg-papel/90 p-4 ring-1 ring-tinta">
              <Linha k="Formato" v="Body splash" />
              <Linha k="Volume" v="200 ml / 220 ml" />
              <Linha k="Arquétipos" v={String(ARCHETYPES.length).padStart(2, '0')} />
              <Linha k="Famílias" v={FAMILIES.map((f) => f.nome).join(' · ')} />
              <Linha k="A partir de" v={`${brl(PRECO_MIN)} · ${brl(pix(PRECO_MIN))} Pix`} />
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Catálogo: amostras ---------------- */

export function CatalogLaboratorio({ items, filtro, setFiltro, filtros }: CatalogProps) {
  const location = useLocation()
  return (
    <section id="catalogo" className="bg-papel-2 px-4 py-16 md:px-10 lg:py-24" style={GRADE}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-tinta pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Cod n="06">{C.catalogo.eyebrow}</Cod>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-medium tracking-tight text-tinta lg:text-6xl">
              {C.catalogo.title[0]} <span className="text-latao">{C.catalogo.title[1]}</span>
            </h2>
          </div>
          <FilterTabs filtro={filtro} setFiltro={setFiltro} filtros={filtros} base="border px-3 py-1.5 text-[11px] uppercase" on="border-tinta bg-tinta text-papel" off="border-tinta/30 bg-papel text-tinta-2 hover:border-tinta" />
        </div>
        <ul className="mt-10 grid gap-px bg-tinta/80 p-px sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id} className="flex flex-col bg-papel p-4 lg:p-5">
              <div className="flex items-center justify-between text-[10px] uppercase" style={MONO}>
                <span className="text-tinta">{a.energia}</span>
                <span className="flex items-center gap-1.5 text-tinta-3">
                  <span aria-hidden className="size-2.5 rounded-full" style={{ background: a.cor }} />
                  {a.energia}
                </span>
              </div>
              <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="no-press group mt-3 block">
                <Mira>
                  <img src={FRASCO_IMG[a.id]} alt={`${a.tipo} ${a.nome}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                </Mira>
              </Link>
              <b className="mt-3 font-display text-3xl font-medium tracking-tight text-tinta">{a.nome}</b>
              <dl className="mt-2">
                <Linha k="Família" v={a.fam} />
                <Linha k="Topo" v={a.topo} />
                <Linha k="Coração" v={a.coracao} />
                <Linha k="Fundo" v={a.fundo} />
                <Linha k="Volume" v={a.vol} />
              </dl>
              {/* regra 7 */}
              <div className="mt-4 flex items-end justify-between gap-3">
                <span style={MONO}>
                  <b className="block text-lg text-tinta">{brl(a.preco)}</b>
                  <span className="text-[10px] text-tinta-2">
                    {brl(pix(a.preco))} PIX · 6× {brl(parcela(a.preco))}
                  </span>
                </span>
                <Link to={`/loja/${a.id}`} state={{ backgroundLocation: location }} className="shrink-0 bg-tinta px-4 py-2.5 text-[11px] text-papel uppercase hover:bg-latao" style={MONO}>
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

function Cabeca({ n, eyebrow, title, sub }: { n: string; eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="grid gap-4 border-b border-tinta pb-6 lg:grid-cols-12">
      <Cod n={n} className="lg:col-span-3">
        {eyebrow}
      </Cod>
      <div className="lg:col-span-9">
        <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight text-tinta lg:text-6xl">{title}</h2>
        {sub && <p className="mt-4 max-w-[56ch] text-base text-tinta-2">{sub}</p>}
      </div>
    </div>
  )
}

function Secao({ children, id, className = '', grade = false }: { children: React.ReactNode; id?: string; className?: string; grade?: boolean }) {
  return (
    <section id={id} className={`px-5 py-16 md:px-10 lg:py-24 ${className}`} style={grade ? GRADE : undefined}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

export function LaboratorioPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — barra de status */}
      <section className="border-y border-tinta bg-tinta px-5 py-2.5 text-papel">
        <ul className="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-1 text-[10px] uppercase" style={MONO}>
          {SEALS.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-latao" /> {s}
            </li>
          ))}
        </ul>
      </section>

      {/* Coleções — três frascos de ensaio */}
      <Secao id="segmentos">
        <Cabeca n="01" eyebrow="Coleções" title="Escolha por onde começar" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SEGMENTS.map((seg) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group cursor-pointer text-left">
              <span className="relative block overflow-hidden rounded-t-[999px] rounded-b-3xl border border-tinta bg-papel-2 p-2">
                <span className="block aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[20px]">
                  <img src={seg.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                {/* graduação do frasco */}
                <span aria-hidden className="absolute inset-y-16 right-4 flex flex-col justify-between">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className={`h-px bg-papel/90 ${i % 2 ? 'w-2' : 'w-4'}`} />
                  ))}
                </span>
              </span>
              <span className="mt-3 flex items-baseline justify-between">
                <b className="font-display text-3xl font-medium tracking-tight text-tinta">{seg.name}</b>
                <span className="text-[10px] text-tinta-3 uppercase" style={MONO}>
                  {seg.meta}
                </span>
              </span>
              <span className="mt-1 block text-[11px] text-latao uppercase" style={MONO}>
                {C.segmentos.cta} →
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Diagnóstico — registro de ocorrências */}
      <Secao className="bg-papel-2" grade>
        <Cabeca n="02" eyebrow={C.diagnostico.eyebrow} title={C.diagnostico.title} sub={C.diagnostico.sub} />
        <div className="mt-10 overflow-hidden border border-tinta bg-papel">
          {DIAGNOSIS.map((d, i) => (
            <div key={d.n} className={`grid gap-2 p-5 md:grid-cols-[6rem_1fr_1fr] md:gap-8 ${i ? 'border-t border-tinta' : ''}`}>
              <span className="text-[11px] text-latao-texto uppercase" style={MONO}>
                Ocorrência {d.n}
              </span>
              <b className="font-display text-xl font-medium text-tinta">{d.title}</b>
              <p className="text-sm text-tinta-2">{d.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-display text-3xl font-medium tracking-tight text-tinta lg:text-4xl">
          {C.diagnostico.fecho[0]} <span className="text-latao">{C.diagnostico.fecho[1]}</span>
        </p>
      </Secao>

      {/* Famílias — matriz de famílias × arquétipos */}
      <Secao>
        <Cabeca n="03" eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-10 grid grid-cols-2 gap-px bg-tinta p-px lg:grid-cols-4">
          {FAMILIES.map((f, i) => (
            <button key={f.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer bg-papel p-4 text-left hover:bg-papel-2">
              <span className="text-[10px] text-tinta-3 uppercase" style={MONO}>
                F-{String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-3 block aspect-square overflow-hidden">
                <img src={f.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
              </span>
              <b className="mt-3 block font-display text-2xl font-medium text-tinta">{f.nome}</b>
              <dl className="mt-2">
                <Linha k="Perfil" v={f.attrs.join(', ')} />
                <Linha k="Arquétipos" v={f.arquetipos.map((id) => getArchetype(id)?.nome).join(', ')} />
              </dl>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — gráfico de barras: quantos arquétipos em cada energia */}
      <Secao className="bg-tinta text-papel">
        <div className="grid gap-4 border-b border-papel/40 pb-6 lg:grid-cols-12">
          <p className="text-[11px] text-latao uppercase lg:col-span-3" style={MONO}>
            [04] {C.energias.eyebrow}
          </p>
          <div className="lg:col-span-9">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight lg:text-6xl">{C.energias.title}</h2>
            <p className="mt-4 text-papel/70">{C.energias.sub}</p>
          </div>
        </div>
        <ul className="mt-10 space-y-3">
          {ENERGIES.map((e) => (
            <li key={e.nome}>
              <button type="button" onClick={toCatalog} className="no-press group grid w-full cursor-pointer grid-cols-[6rem_1fr] items-center gap-4 text-left md:grid-cols-[10rem_1fr_auto]">
                <b className="font-display text-2xl font-medium">{e.nome}</b>
                <span className="relative h-12 overflow-hidden border border-papel/40">
                  <span className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-700 group-hover:opacity-100" style={{ width: `${(e.arquetipos.length / 3) * 100}%` }}>
                    <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-70 group-hover:opacity-100" />
                  </span>
                  <span className="absolute inset-y-0 left-3 flex items-center text-[10px] uppercase" style={MONO}>
                    {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' + ')}
                  </span>
                </span>
                <span className="hidden text-[11px] text-papel/60 md:block" style={MONO}>
                  n = {String(e.arquetipos.length).padStart(2, '0')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Reconhecimento — critérios de seleção */}
      <Secao grade>
        <Cabeca n="05" eyebrow={C.reconhecimento.eyebrow} title={C.reconhecimento.title} sub={C.reconhecimento.sub} />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {QUALIFICATION.map((q, i) => (
            <li key={q.title} className="border border-tinta bg-papel p-5">
              <span className="flex items-center gap-2 text-[11px] text-ok uppercase" style={MONO}>
                <span aria-hidden className="grid size-4 place-items-center border border-current text-[9px]">✓</span>
                Critério {String(i + 1).padStart(2, '0')}
              </span>
              <b className="mt-3 block font-display text-xl font-medium text-tinta">{q.title}</b>
              <p className="mt-2 text-sm text-tinta-2">{q.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-display text-3xl font-medium tracking-tight text-tinta lg:text-4xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <span className="text-latao">{C.reconhecimento.fecho[2]}</span>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — ficha completa da amostra */}
      <Secao id="destaque">
        <Cabeca n="07" eyebrow={C.destaque.eyebrow} title={featured.nome} sub={featured.ep} />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Mira>
            <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="aspect-[4/5] w-full object-cover object-[50%_20%]" />
          </Mira>
          <div className="flex flex-col">
            <p className="text-base leading-relaxed text-tinta-2">{featured.cheiro[0]}</p>
            <p className="mt-3 text-base leading-relaxed text-tinta-2">{featured.cheiro[1]}</p>
            <dl className="mt-6">
              <Linha k="Família" v={featured.fam} />
              <Linha k="Energia" v={featured.energia} />
              <Linha k="Topo" v={featured.topo} />
              <Linha k="Coração" v={featured.coracao} />
              <Linha k="Fundo" v={featured.fundo} />
              <Linha k="Formato" v={`${featured.tipo} ${featured.vol}`} />
              <Linha k="Preço" v={brl(featured.preco)} />
              <Linha k="Pix" v={brl(pix(featured.preco))} />
              <Linha k="Parcelado" v={`6× ${brl(parcela(featured.preco))} sem juros`} />
            </dl>
            <Link to={`/loja/${featured.id}`} state={{ backgroundLocation: location }} className="mt-6 self-start bg-tinta px-8 py-4 text-[12px] text-papel uppercase hover:bg-latao" style={MONO}>
              {C.destaque.cta} {featured.nome} →
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte */}
      <Secao className="bg-latao text-papel">
        <p className="font-display text-5xl leading-[1] font-medium tracking-tight lg:text-8xl">{C.ponte.text}</p>
        <button type="button" onClick={toCatalog} className="mt-8 cursor-pointer border border-papel px-6 py-3.5 text-[12px] uppercase hover:bg-papel hover:text-latao" style={MONO}>
          {C.ponte.cta} →
        </button>
      </Secao>

      {/* Diferença — laudo comparativo */}
      <Secao grade>
        <Cabeca n="08" eyebrow={C.diferenca.eyebrow} title={<>{C.diferenca.title[0]} <span className="text-latao">{C.diferenca.title[1]}</span></>} />
        <div className="mt-10 overflow-x-auto border border-tinta bg-papel">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead className="bg-tinta text-[10px] text-papel uppercase" style={MONO}>
              <tr>
                <th className="p-3 font-normal">Parâmetro</th>
                <th className="p-3 font-normal">{C.diferenca.colunas[0]}</th>
                <th className="p-3 font-normal">{C.diferenca.colunas[1]}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((c) => (
                <tr key={c.tema} className="border-t border-linha-2">
                  <td className="p-3 text-[11px] text-tinta-3 uppercase" style={MONO}>
                    {c.tema}
                  </td>
                  <td className="p-3 text-tinta">
                    <span className="mr-2 text-ok">●</span>
                    {c.arquetypus}
                  </td>
                  <td className="p-3 text-tinta-3">
                    <span className="mr-2 text-tinta-3">○</span>
                    {c.comum}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 font-display text-3xl font-medium tracking-tight text-tinta">
          {C.diferenca.fecho[0]} <span className="text-latao">{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — registros de campo */}
      <Secao className="bg-papel-2">
        <Cabeca n="09" eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} />
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className="border border-tinta bg-papel">
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="no-press block">
                  <span className="flex justify-between border-b border-tinta px-3 py-1.5 text-[10px] uppercase" style={MONO}>
                    <span>REG-{String(i + 1).padStart(3, '0')}</span>
                  </span>
                  <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o body splash ${arq.nome}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                  <span className="flex items-center justify-between border-t border-tinta px-3 py-2 text-[11px]" style={MONO}>
                    <span>{v.creator}</span>
                    <span className="text-tinta-2">{brl(arq.preco)}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* Garantia — contador */}
      <Secao className="bg-tinta text-papel">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="border border-papel/40 p-6" style={MONO}>
            <p className="text-[11px] text-latao uppercase">{C.garantia.label}</p>
            <p className="mt-2 text-[120px] leading-none tracking-tighter lg:text-[200px]">{C.garantia.dias}</p>
            <div aria-hidden className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} className="h-2 bg-latao" style={{ opacity: 1 - i * 0.1 }} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl leading-tight font-medium tracking-tight lg:text-5xl">
              {C.garantia.title[0]} <span className="text-latao">{C.garantia.title[1]}</span>
            </h2>
            <p className="mt-5 text-papel/75">
              {C.garantia.body[0]} {C.garantia.body[1]}
            </p>
            <p className="mt-5 text-[11px] text-papel/50 uppercase" style={MONO}>
              {C.garantia.nota}
            </p>
          </div>
        </div>
      </Secao>

      {/* Criadores — painel de indicadores */}
      <Secao grade>
        <Cabeca n="10" eyebrow={C.criadores.eyebrow} title={<>{C.criadores.title[0]} <span className="text-latao">{C.criadores.title[1]}</span></>} sub={C.criadores.body} />
        <dl className="mt-10 grid grid-cols-3 gap-px bg-tinta p-px">
          {CREATOR_STATS.map((s) => (
            <div key={s.valor} className="flex flex-col bg-papel p-4 lg:p-8">
              <dd className="text-3xl tracking-tight text-tinta lg:text-6xl" style={MONO}>
                {s.valor}
              </dd>
              <dt className="order-last mt-2 text-[10px] text-tinta-3 uppercase" style={MONO}>
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] text-sm text-tinta-2">{C.criadores.body2}</p>
          <Link to="/criadores" className="shrink-0 bg-tinta px-8 py-4 text-center text-[12px] text-papel uppercase hover:bg-latao" style={MONO}>
            {C.criadores.cta} →
          </Link>
        </div>
      </Secao>

      {/* Diário — documentação */}
      <Secao id="diario" className="bg-papel-2">
        <Cabeca n="11" eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ol className="mt-8">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="grid gap-2 border-b border-tinta py-5 md:grid-cols-[8rem_1fr_auto] md:items-baseline md:gap-8">
              <span className="text-[11px] text-tinta-3 uppercase" style={MONO}>
                DOC-{String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <b className="block font-display text-2xl font-medium text-tinta">{j.title}</b>
                <span className="mt-1 block text-sm text-tinta-2">{j.body}</span>
              </span>
              <span className="text-[10px] text-tinta-3 uppercase" style={MONO}>
                {C.diario.breve}
              </span>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Cupom — formulário de requisição */}
      <Secao grade>
        <div className="mx-auto grid max-w-5xl border border-tinta bg-papel lg:grid-cols-2">
          <div className="border-b border-tinta p-6 lg:border-r lg:border-b-0 lg:p-10">
            <Cod n="12">{C.cupom.eyebrow}</Cod>
            <p className="mt-3 text-[110px] leading-none tracking-tighter text-latao" style={MONO}>
              {C.cupom.valor}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium text-tinta">{C.cupom.title}</h2>
            <p className="mt-2 text-sm text-tinta-2">{C.cupom.body}</p>
          </div>
          <form onSubmit={preventSubmit} className="flex flex-col justify-center gap-4 p-6 lg:p-10" style={MONO}>
            <label className="block text-[10px] text-tinta-3 uppercase">
              Campo 01 · E-mail
              <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" className="mt-1 block w-full border border-tinta bg-papel-2 px-3 py-3 text-sm text-tinta normal-case placeholder:text-tinta-3 focus:outline-none" />
            </label>
            <label className="block text-[10px] text-tinta-3 uppercase">
              Campo 02 · WhatsApp
              <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="DDD + número" className="mt-1 block w-full border border-tinta bg-papel-2 px-3 py-3 text-sm text-tinta normal-case placeholder:text-tinta-3 focus:outline-none" />
            </label>
            <button type="submit" className="mt-2 cursor-pointer bg-tinta py-3.5 text-[12px] text-papel uppercase hover:bg-latao">
              {C.cupom.cta} →
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — colofão técnico */}
      <footer className="-mb-24 bg-tinta px-5 pt-14 pb-[calc(2rem+6rem)] text-papel md:px-10" style={MONO}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border-b border-papel/30 pb-8 text-[11px] uppercase md:grid-cols-4">
            <div className="md:col-span-2">
              <p className="font-display text-4xl tracking-tight normal-case" style={{ fontFamily: 'var(--font-display)' }}>
                Arquétypus
              </p>
              <p className="mt-3 text-sm text-papel/70 normal-case" style={{ fontFamily: 'var(--font-sans)' }}>
                {C.rodape.tagline[0]} <span className="text-latao">{C.rodape.tagline[1]}</span>
              </p>
            </div>
            <ul className="space-y-2">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-latao">
                    / {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li>
                <Link to="/privacidade" className="hover:text-latao">
                  / Privacidade
                </Link>
              </li>
              <li>
                <button type="button" onClick={openCookiePreferences} className="cursor-pointer uppercase hover:text-latao">
                  / Gerenciar cookies
                </button>
              </li>
              {FOOTER_SOON.map((s) => (
                <li key={s} aria-disabled="true" className="text-papel/40">
                  / {s} · em breve
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 grid gap-2 text-[10px] text-papel/50 uppercase md:grid-cols-4">
            <span>{C.rodape.redes.join(' / ')}</span>
            <span>{C.rodape.pagamentos}</span>
            <span className="normal-case">{C.rodape.sac}</span>
            <span>{C.rodape.empresa}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
