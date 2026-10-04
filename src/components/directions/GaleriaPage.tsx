import { Link, useLocation } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { COMPARISON, DIAGNOSIS, ENERGIES, FAMILIES, HOME_COPY as C, JOURNAL, QUALIFICATION, SEALS, SEGMENTS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import {
  brl,
  CREATOR_STATS,
  FOOTER_EXPLORE,
  FOOTER_SOON,
  parcela,
  pix,
  preventSubmit,
  type DirectionPageProps,
} from './shared'

/**
 * Página inteira da direção "Galeria": a home como o percurso de uma exposição. Linguagem que se repete —
 * texto de parede (rótulo pequeno em caixa alta + título em Didone), fios pretos finos, numeração de sala
 * ("01 / 12") em cada seção, obras em passe-partout com plaqueta, muito branco e nada arredondado.
 */

const TOTAL = 12
const sala = (n: number) => `${String(n).padStart(2, '0')} / ${TOTAL}`

/** Texto de parede: número da sala, rótulo e título; à direita, o subtítulo. */
function Parede({ n, eyebrow, title, sub }: { n: number; eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="grid gap-6 border-t border-tinta pt-5 lg:grid-cols-12 lg:gap-x-10">
      <p className="font-label text-[10px] tracking-[0.25em] text-tinta-3 uppercase tabular-nums lg:col-span-2">{sala(n)}</p>
      <div className="lg:col-span-6">
        <p className="font-label text-[10px] tracking-[0.25em] text-tinta-2 uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.04] text-tinta lg:text-6xl">{title}</h2>
      </div>
      {sub && <p className="max-w-[38ch] text-sm leading-relaxed text-tinta-2 lg:col-span-4 lg:self-end">{sub}</p>}
    </div>
  )
}

function Secao({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-5 py-16 md:px-10 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

/** Obra emoldurada: passe-partout + imagem. */
function Obra({ src, aspect = 'aspect-[4/5]', alt = '' }: { src: string; aspect?: string; alt?: string }) {
  return (
    <span className="block bg-papel-2 p-3 ring-1 ring-linha transition-shadow duration-500 group-hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)] lg:p-5">
      <span className={`block overflow-hidden ${aspect}`}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
      </span>
    </span>
  )
}

/** Plaqueta de museu, com fio à esquerda. */
function Plaqueta({ n, title, children }: { n?: string; title: string; children?: React.ReactNode }) {
  return (
    <span className="mt-4 block border-l border-tinta pl-3 text-left">
      {n && <span className="block font-label text-[9px] tracking-[0.2em] text-tinta-3 tabular-nums">{n}</span>}
      <b className="block font-display text-2xl leading-tight font-normal text-tinta">{title}</b>
      {children}
    </span>
  )
}

export function GaleriaPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — linha de serviço, como a faixa de informações na entrada do museu */}
      <section className="border-y border-tinta px-5 md:px-10">
        <ul className="mx-auto flex max-w-7xl flex-wrap justify-between gap-x-6 gap-y-2 py-4 font-label text-[10px] tracking-[0.25em] text-tinta uppercase">
          {SEALS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {/* 01 Coleções — três obras grandes lado a lado */}
      <Secao id="segmentos">
        <Parede n={1} eyebrow="Coleções" title="Escolha por onde começar" />
        <div className="mt-12 grid gap-10 md:grid-cols-3 lg:mt-16 lg:gap-14">
          {SEGMENTS.map((seg) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group cursor-pointer text-left">
              <Obra src={seg.img} aspect="aspect-[3/4]" />
              <Plaqueta n={seg.label} title={seg.name}>
                <span className="block text-xs text-tinta-3 italic">{seg.meta}</span>
                <span className="mt-3 inline-flex items-center gap-2 font-label text-[10px] tracking-[0.25em] text-tinta uppercase">
                  {C.segmentos.cta} <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Plaqueta>
            </button>
          ))}
        </div>
      </Secao>

      {/* 02 Diagnóstico — verbetes de catálogo de exposição */}
      <Secao className="bg-papel-2">
        <Parede n={2} eyebrow={C.diagnostico.eyebrow} title={C.diagnostico.title} sub={C.diagnostico.sub} />
        <ol className="mt-12 lg:mt-16 lg:ml-[16.66%]">
          {DIAGNOSIS.map((d) => (
            <li key={d.n} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-linha-2 py-6 lg:grid-cols-[6rem_1fr_1fr] lg:gap-x-10">
              <span className="font-display text-3xl text-tinta-3 lg:text-5xl">{d.n}</span>
              <b className="font-display text-xl leading-snug font-normal text-tinta lg:text-2xl">{d.title}</b>
              <p className="col-start-2 mt-2 text-sm leading-relaxed text-tinta-2 lg:col-start-3 lg:mt-0">{d.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 font-display text-3xl text-tinta italic lg:ml-[16.66%] lg:text-4xl">
          {C.diagnostico.fecho[0]} {C.diagnostico.fecho[1]}
        </p>
      </Secao>

      {/* 03 Famílias — parede em "salon hang": quadros de alturas diferentes */}
      <Secao>
        <Parede n={3} eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-12 grid grid-cols-2 items-start gap-x-5 gap-y-12 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
          {FAMILIES.map((f, i) => (
            <button key={f.nome} type="button" onClick={toCatalog} className={`no-press group cursor-pointer text-left ${i % 2 === 1 ? 'lg:mt-20' : ''}`}>
              <Obra src={f.img} aspect={i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'} />
              <Plaqueta n={`Nº ${String(i + 1).padStart(2, '0')}`} title={f.nome}>
                <span className="block text-xs text-tinta-3 italic">{f.desc}</span>
                <span className="mt-1 block font-label text-[9px] tracking-[0.15em] text-tinta-3 uppercase">{f.attrs.join(', ')}</span>
              </Plaqueta>
            </button>
          ))}
        </div>
      </Secao>

      {/* 04 Energias — o corredor: quatro telas grandes em sequência horizontal */}
      <section className="bg-tinta py-16 text-papel lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 border-t border-papel/40 px-5 pt-5 md:px-10 lg:grid-cols-12 lg:gap-x-10">
          <p className="font-label text-[10px] tracking-[0.25em] text-papel/50 uppercase tabular-nums lg:col-span-2">{sala(4)}</p>
          <div className="lg:col-span-6">
            <p className="font-label text-[10px] tracking-[0.25em] text-papel/70 uppercase">{C.energias.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.04] lg:text-6xl">{C.energias.title}</h2>
          </div>
          <p className="max-w-[38ch] text-sm text-papel/70 lg:col-span-4 lg:self-end">{C.energias.sub}</p>
        </div>
        <ul className="no-scrollbar scroll-pad mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden px-5 md:px-10 lg:mt-16">
          {ENERGIES.map((e) => (
            <li key={e.nome} className="w-[80%] shrink-0 snap-start sm:w-[50%] lg:w-[36%]">
              <button type="button" onClick={toCatalog} className="no-press group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden">
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
                <span className="absolute bottom-4 left-4 bg-papel px-4 py-3 text-left text-tinta">
                  <b className="block font-display text-2xl font-normal">{e.nome}</b>
                  <span className="block text-xs text-tinta-3 italic">{e.arquetipos.map((id) => getArchetype(id)?.nome).join(', ')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 Reconhecimento — citação de parede */}
      <Secao>
        <p className="border-t border-tinta pt-5 font-label text-[10px] tracking-[0.25em] text-tinta-3 uppercase tabular-nums">
          {sala(5)} · {C.reconhecimento.eyebrow}
        </p>
        <blockquote className="mx-auto mt-12 max-w-4xl text-center font-display text-4xl leading-[1.1] text-tinta italic lg:mt-16 lg:text-7xl">
          “{C.reconhecimento.title}”
        </blockquote>
        <p className="mx-auto mt-6 max-w-[44ch] text-center text-sm text-tinta-2 lg:text-base">{C.reconhecimento.sub}</p>
        <ol className="mt-14 grid gap-8 border-t border-linha-2 pt-8 md:grid-cols-3 lg:mt-20 lg:gap-14">
          {QUALIFICATION.map((q, i) => (
            <li key={q.title}>
              <span className="font-label text-[10px] tracking-[0.2em] text-tinta-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <b className="mt-2 block font-display text-xl leading-snug font-normal text-tinta">{q.title}</b>
              <p className="mt-2 text-sm text-tinta-2">{q.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-14 text-center font-display text-2xl text-tinta lg:text-3xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <em>{C.reconhecimento.fecho[2]}</em>
        </p>
      </Secao>

      {catalog}

      {/* 07 Destaque — a obra da sala principal */}
      <Secao id="destaque" className="bg-papel-2">
        <p className="border-t border-tinta pt-5 font-label text-[10px] tracking-[0.25em] text-tinta-3 uppercase tabular-nums">
          {sala(7)} · {C.destaque.eyebrow}
        </p>
        <div className="mt-12 grid items-end gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <span className="block bg-papel p-4 ring-1 ring-linha lg:p-8">
              <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="aspect-[4/5] w-full object-cover object-[50%_20%]" />
            </span>
          </div>
          <div className="lg:col-span-5">
            <h2 className="mt-2 font-display text-6xl leading-none text-tinta lg:text-8xl">{featured.nome}</h2>
            <p className="mt-4 font-display text-xl text-tinta-2 italic">{featured.ep}</p>
            <p className="mt-4 text-sm leading-relaxed text-tinta-2">{featured.cheiro[1]}</p>
            <dl className="mt-8 grid grid-cols-2 gap-y-3 border-t border-tinta pt-4 text-sm">
              <dt className="text-tinta-3">Família</dt>
              <dd className="text-tinta">{featured.fam}</dd>
              <dt className="text-tinta-3">Formato</dt>
              <dd className="text-tinta">
                {featured.tipo}, {featured.vol}
              </dd>
              <dt className="text-tinta-3">Preço</dt>
              <dd className="text-tinta">
                <b className="font-semibold">{brl(featured.preco)}</b>
                <span className="block text-xs text-tinta-2">
                  {brl(pix(featured.preco))} no Pix · 6x de {brl(parcela(featured.preco))}
                </span>
              </dd>
            </dl>
            <Link
              to={`/loja/${featured.id}`}
              state={{ backgroundLocation: location }}
              className="mt-8 inline-block bg-tinta px-10 py-4 font-label text-[11px] tracking-[0.25em] text-papel uppercase hover:opacity-85"
            >
              {C.destaque.cta} {featured.nome}
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte — frase sozinha na parede branca */}
      <Secao className="text-center">
        <p className="mx-auto max-w-[14ch] font-display text-5xl leading-[1.05] text-tinta lg:text-8xl">{C.ponte.text}</p>
        <button type="button" onClick={toCatalog} className="mt-10 cursor-pointer border-b border-tinta pb-1 font-label text-[11px] tracking-[0.25em] text-tinta uppercase hover:opacity-70">
          {C.ponte.cta} →
        </button>
      </Secao>

      {/* 08 Diferença — ficha técnica comparada */}
      <Secao className="bg-papel-2">
        <Parede n={8} eyebrow={C.diferenca.eyebrow} title={`${C.diferenca.title[0]} ${C.diferenca.title[1]}`} />
        <table className="mt-12 w-full border-collapse text-left lg:mt-16">
          <thead>
            <tr className="border-b border-tinta font-label text-[10px] tracking-[0.2em] uppercase">
              <th className="hidden py-3 font-medium text-tinta-3 md:table-cell">Item</th>
              <th className="py-3 font-medium text-tinta">{C.diferenca.colunas[0]}</th>
              <th className="py-3 font-medium text-tinta-3">{C.diferenca.colunas[1]}</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((c) => (
              <tr key={c.tema} className="border-b border-linha-2 align-baseline">
                <td className="hidden py-5 pr-6 font-label text-[10px] tracking-[0.2em] text-tinta-3 uppercase md:table-cell">{c.tema}</td>
                <td className="py-5 pr-6 font-display text-lg text-tinta lg:text-2xl">{c.arquetypus}</td>
                <td className="py-5 text-sm text-tinta-3 italic lg:text-base">{c.comum}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-12 font-display text-2xl text-tinta lg:text-4xl">
          {C.diferenca.fecho[0]} <em>{C.diferenca.fecho[1]}</em>
        </p>
      </Secao>

      {/* 09 Comunidade — retratos com plaqueta */}
      <Secao>
        <Parede n={9} eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} />
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
          {UGC_VIDEOS.map((v) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator}>
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="no-press group block">
                  <Obra src={UGC_IMG[v.archetypeId]} aspect="aspect-[3/4]" alt={`${v.creator} segurando o body splash ${arq.nome}`} />
                  <Plaqueta n={v.creator} title={arq.nome}>
                    <span className="block text-xs text-tinta-3 italic">
                      {arq.fam}, {brl(arq.preco)}
                    </span>
                  </Plaqueta>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* 10 Garantia — o número como peça gráfica */}
      <section className="overflow-hidden border-y border-tinta px-5 py-16 md:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-12">
          <p className="font-label text-[10px] tracking-[0.25em] text-tinta-3 uppercase tabular-nums lg:col-span-2 lg:self-start">{sala(10)}</p>
          <p
            className="font-display leading-[0.8] text-transparent lg:col-span-5"
            style={{ fontSize: 'clamp(160px, 26vw, 380px)', WebkitTextStroke: '1.5px var(--color-tinta)' }}
          >
            {C.garantia.dias}
          </p>
          <div className="lg:col-span-5">
            <p className="font-label text-[10px] tracking-[0.25em] text-tinta-2 uppercase">{C.garantia.label}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-tinta lg:text-5xl">
              {C.garantia.title[0]} <em>{C.garantia.title[1]}</em>
            </h2>
            <p className="mt-6 text-tinta-2">
              {C.garantia.body[0]} {C.garantia.body[1]}
            </p>
            <p className="mt-6 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{C.garantia.nota}</p>
          </div>
        </div>
      </section>

      {/* 11 Criadores */}
      <Secao>
        <Parede n={11} eyebrow={C.criadores.eyebrow} title={`${C.criadores.title[0]} ${C.criadores.title[1]}`} sub={C.criadores.body} />
        <dl className="mt-12 grid grid-cols-3 border-y border-tinta lg:mt-16">
          {CREATOR_STATS.map((s, i) => (
            <div key={s.valor} className={`flex flex-col px-3 py-8 lg:px-8 lg:py-12 ${i > 0 ? 'border-l border-tinta' : ''}`}>
              <dd className="font-display text-4xl text-tinta lg:text-7xl">{s.valor}</dd>
              <dt className="order-last mt-3 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[60ch] text-sm text-tinta-2">{C.criadores.body2}</p>
          <Link to="/criadores" className="shrink-0 border-b border-tinta pb-1 font-label text-[11px] tracking-[0.25em] text-tinta uppercase hover:opacity-70">
            {C.criadores.cta} →
          </Link>
        </div>
      </Secao>

      {/* 12 Diário — catálogo da livraria do museu */}
      <Secao id="diario" className="bg-papel-2">
        <Parede n={12} eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ol className="mt-12 grid gap-px bg-linha-2 md:grid-cols-3 lg:mt-16">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="flex flex-col bg-papel-2 py-8 md:px-8 md:first:pl-0">
              <span className="font-display text-6xl text-tinta-3">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 font-display text-2xl leading-snug text-tinta">{j.title}</h3>
              <p className="mt-3 text-sm text-tinta-2">{j.body}</p>
              <span className="mt-auto pt-6 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{C.diario.breve}</span>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Cupom — cartão de visitante */}
      <Secao>
        <div className="grid gap-10 border border-tinta p-6 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <p className="font-label text-[10px] tracking-[0.25em] text-tinta-2 uppercase">{C.cupom.eyebrow}</p>
            <p className="mt-2 font-display text-8xl leading-none text-tinta lg:text-9xl">{C.cupom.valor}</p>
            <h2 className="mt-3 font-display text-2xl text-tinta lg:text-3xl">{C.cupom.title}</h2>
            <p className="mt-3 max-w-[40ch] text-sm text-tinta-2">{C.cupom.body}</p>
          </div>
          <form onSubmit={preventSubmit} className="flex flex-col justify-end gap-6">
            <label className="block">
              <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">E-mail</span>
              <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" className="mt-1 block w-full border-b border-tinta bg-transparent pb-2 text-tinta placeholder:text-tinta-3 focus:outline-none" />
            </label>
            <label className="block">
              <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">WhatsApp</span>
              <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="DDD + número" className="mt-1 block w-full border-b border-tinta bg-transparent pb-2 text-tinta placeholder:text-tinta-3 focus:outline-none" />
            </label>
            <button type="submit" className="cursor-pointer bg-tinta py-4 font-label text-[11px] tracking-[0.25em] text-papel uppercase hover:opacity-85">
              {C.cupom.cta}
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — claro, colunas finas e o nome gigante fechando a página */}
      <footer className="-mb-24 overflow-hidden border-t border-tinta bg-papel px-5 pt-14 pb-[calc(2rem+6rem)] text-tinta md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          <p className="font-display text-2xl leading-snug lg:col-span-5">
            {C.rodape.tagline[0]} <em>{C.rodape.tagline[1]}</em>
          </p>
          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 text-sm lg:col-span-5 lg:col-start-8">
            <ul className="space-y-2">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li>
                <Link to="/privacidade" className="hover:underline">
                  Privacidade
                </Link>
              </li>
              {FOOTER_SOON.map((s) => (
                <li key={s} aria-disabled="true" className="text-tinta-3">
                  {s} · em breve
                </li>
              ))}
              <li>
                <button type="button" onClick={openCookiePreferences} className="cursor-pointer hover:underline">
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-between gap-3 border-t border-linha-2 pt-4 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
          <span>{C.rodape.redes.join(' · ')}</span>
          <span>{C.rodape.pagamentos}</span>
          <span className="normal-case">{C.rodape.sac}</span>
          <span>{C.rodape.empresa}</span>
        </div>
        <p aria-hidden className="mt-8 text-center font-display leading-[0.8] whitespace-nowrap text-tinta select-none" style={{ fontSize: 'clamp(48px, 13vw, 230px)', letterSpacing: '-0.03em' }}>
          ARQUÉTYPUS
        </p>
      </footer>
    </>
  )
}
