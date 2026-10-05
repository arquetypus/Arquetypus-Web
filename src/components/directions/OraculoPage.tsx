import { Link, useLocation } from 'react-router-dom'
import { getArchetype, productPath } from '@/data/archetypes'
import { COMPARISON, DIAGNOSIS, ENERGIES, FAMILIES, HOME_COPY as C, JOURNAL, QUALIFICATION, SEALS, SEGMENTS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import logoBranco from '@/assets/brand/logo-branco.png'
import { TarotCard } from './Oraculo'
import {
  brl,
  CREATOR_STATS,
  FOOTER_EXPLORE,
  FOOTER_SOON,
  parcela,
  pix,
  preventSubmit,
  romano,
  SealIcon,
  type DirectionPageProps,
} from './shared'

/**
 * Página inteira da direção "Oráculo": a home como uma leitura de tarô. Linguagem que se repete em todas
 * as seções — ornamento ✦ entre filetes, numerais romanos, janelas em arco, medalhões com aro dourado,
 * céu de pontos de luz e o dourado como única cor de destaque sobre a noite azul.
 */

const CEU =
  'radial-gradient(1px 1px at 8% 20%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 92% 14%, var(--color-latao) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 80%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 20% 88%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 50% 6%, var(--color-latao) 50%, transparent 51%), radial-gradient(1px 1px at 34% 52%, var(--color-latao) 50%, transparent 51%)'

function Ornamento({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 text-latao ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-latao/70" />
      <span className="text-[10px]">✦</span>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-latao/70" />
    </div>
  )
}

function Cabeca({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center">
      <p className="font-label text-[10px] tracking-[0.4em] text-latao uppercase">{eyebrow}</p>
      <h2 className="mx-auto mt-4 max-w-[22ch] font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-[46ch] text-sm text-tinta-2 lg:text-base">{sub}</p>}
      <Ornamento className="mt-6" />
    </div>
  )
}

function Secao({ children, className = '', id, ceu = false }: { children: React.ReactNode; className?: string; id?: string; ceu?: boolean }) {
  return (
    <section id={id} className={`relative overflow-hidden px-5 py-16 md:px-10 lg:py-28 ${className}`}>
      {ceu && <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: CEU }} />}
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** Medalhão: imagem redonda com aro dourado duplo. */
function Medalhao({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span className={`block rounded-full p-1.5 ring-1 ring-latao/60 ${className}`}>
      <span className="block aspect-square overflow-hidden rounded-full ring-1 ring-latao/40">
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      </span>
    </span>
  )
}

export function OraculoPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — quatro sinetes em linha */}
      <section className="border-y border-latao/20 bg-papel-2 px-5 py-6">
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-y-5 md:grid-cols-4">
          {SEALS.map((s) => (
            <li key={s} className="flex flex-col items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-full ring-1 ring-latao/50">
                <SealIcon seal={s} className="size-4 text-latao" />
              </span>
              <span className="font-label text-[9px] tracking-[0.25em] text-tinta-2 uppercase">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Coleções — três portais em arco */}
      <Secao id="segmentos" ceu>
        <Cabeca eyebrow="Coleções" title="Escolha por onde começar" />
        <div className="mt-12 grid gap-8 sm:grid-cols-3 lg:mt-16 lg:gap-12">
          {SEGMENTS.map((seg, i) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group cursor-pointer text-center">
              <span className="mx-auto block w-[72%] rounded-t-full border border-latao/50 p-2 sm:w-full">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full">
                  <img src={seg.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-papel/70 to-transparent" />
                </span>
              </span>
              <span className="mt-5 block font-display text-sm tracking-[0.3em] text-latao">{romano(String(i + 1))}</span>
              <span className="mt-1 block font-display text-3xl text-tinta">{seg.name}</span>
              <span className="mt-1 block font-label text-[9px] tracking-[0.25em] text-tinta-3 uppercase">
                {seg.label} · {seg.meta}
              </span>
              <span className="mt-4 inline-block border-b border-latao/50 pb-0.5 font-label text-[10px] tracking-[0.25em] text-latao uppercase group-hover:border-latao">
                {C.segmentos.cta}
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Diagnóstico — três cartas viradas, lidas em sequência */}
      <Secao className="bg-papel-2">
        <Cabeca eyebrow={C.diagnostico.eyebrow} title={C.diagnostico.title} sub={C.diagnostico.sub} />
        <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {DIAGNOSIS.map((d, i) => (
            <li key={d.n} className="rounded-xl bg-papel p-2 ring-1 ring-latao/40">
              <div className="flex h-full flex-col items-center rounded-lg border border-latao/30 px-6 py-8 text-center">
                <span className="font-display text-2xl tracking-[0.2em] text-latao">{romano(String(i + 1))}</span>
                <span aria-hidden className="mt-3 text-[10px] text-latao/70">✦</span>
                <b className="mt-4 font-display text-xl leading-snug font-normal text-tinta lg:text-2xl">{d.title}</b>
                <p className="mt-3 text-sm leading-relaxed text-tinta-2">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-center font-display text-2xl leading-snug text-tinta lg:text-3xl">
          {C.diagnostico.fecho[0]} <span className="text-latao italic">{C.diagnostico.fecho[1]}</span>
        </p>
      </Secao>

      {/* Famílias — medalhões */}
      <Secao ceu>
        <Cabeca eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-4">
          {FAMILIES.map((f) => (
            <button key={f.nome} type="button" onClick={toCatalog} className="no-press group cursor-pointer text-center">
              <Medalhao src={f.img} className="mx-auto w-[85%] transition-transform duration-500 group-hover:-translate-y-1.5" />
              <b className="mt-5 block font-display text-2xl font-normal text-tinta">{f.nome}</b>
              <span className="mt-1 block text-xs text-tinta-2 italic">{f.desc}</span>
              <span className="mt-2 block font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{f.attrs.join(' · ')}</span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — constelações: a energia e os arquétipos ligados por estrelas */}
      <Secao className="bg-papel-2">
        <Cabeca eyebrow={C.energias.eyebrow} title={C.energias.title} sub={C.energias.sub} />
        <ul className="mt-12 lg:mt-16">
          {ENERGIES.map((e) => (
            <li key={e.nome} className="border-t border-latao/20 last:border-b">
              <button
                type="button"
                onClick={toCatalog}
                className="no-press group flex w-full cursor-pointer flex-col gap-4 py-7 text-left md:flex-row md:items-center md:gap-10"
              >
                <Medalhao src={e.img} className="w-20 shrink-0 lg:w-24" />
                <b className="font-display text-4xl font-normal text-tinta transition-colors group-hover:text-latao lg:w-64 lg:text-5xl">{e.nome}</b>
                {/* constelação */}
                <span className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-2">
                  {e.arquetipos.map((id, i) => (
                    <span key={id} className="flex items-center gap-3">
                      {i > 0 && <span aria-hidden className="h-px w-8 border-t border-dashed border-latao/50 lg:w-16" />}
                      <span className="flex items-center gap-2 font-label text-[11px] tracking-[0.25em] text-tinta-2 uppercase">
                        <span aria-hidden className="text-latao">✦</span>
                        {getArchetype(id)?.nome}
                      </span>
                    </span>
                  ))}
                </span>
                <span aria-hidden className="hidden text-latao transition-transform group-hover:translate-x-1 md:block">→</span>
              </button>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Reconhecimento — a leitura */}
      <Secao ceu>
        <Cabeca eyebrow={C.reconhecimento.eyebrow} title={C.reconhecimento.title} sub={C.reconhecimento.sub} />
        <ul className="mx-auto mt-12 max-w-2xl space-y-8 text-center lg:mt-16">
          {QUALIFICATION.map((q) => (
            <li key={q.title}>
              <span aria-hidden className="text-latao">✦</span>
              <b className="mt-3 block font-display text-2xl leading-snug font-normal text-tinta lg:text-3xl">{q.title}</b>
              <p className="mt-2 text-sm text-tinta-2 lg:text-base">{q.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-14 text-center font-display text-2xl leading-snug text-tinta lg:text-3xl">
          {C.reconhecimento.fecho[0]}
          <br />
          {C.reconhecimento.fecho[1]} <span className="text-latao italic">{C.reconhecimento.fecho[2]}</span>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — a carta tirada */}
      <Secao id="destaque" className="bg-papel-2">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <div className="mx-auto w-[70%] max-w-xs lg:w-full">
            <TarotCard a={featured} className="rotate-[-3deg] shadow-[0_0_60px_-10px_var(--color-latao)]" />
          </div>
          <div className="text-center lg:text-left">
            <p className="font-label text-[10px] tracking-[0.4em] text-latao uppercase">✦ {C.destaque.eyebrow}</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-tinta lg:text-7xl">{featured.nome}</h2>
            <p className="mt-4 font-display text-xl text-tinta-2 italic lg:text-2xl">{featured.ep}</p>
            <div className="mx-auto mt-6 flex max-w-sm items-center gap-4 lg:mx-0">
              <Medalhao src={featuredImg} className="w-24 shrink-0" />
              <p className="text-left text-sm leading-relaxed text-tinta-2">{featured.cheiro[1]}</p>
            </div>
            <p className="mt-8 font-display text-4xl text-tinta">{brl(featured.preco)}</p>
            <p className="mt-1 text-xs text-tinta-3">
              {brl(pix(featured.preco))} no Pix · ou 6x de {brl(parcela(featured.preco))} sem juros · {featured.tipo} {featured.vol}
            </p>
            <Link
              to={productPath(featured)}
              state={{ backgroundLocation: location }}
              className="mt-7 inline-block rounded-full bg-latao px-10 py-4 text-sm font-medium text-papel transition-opacity hover:opacity-90"
            >
              {C.destaque.cta} {featured.nome}
            </Link>
          </div>
        </div>
      </Secao>

      {/* Ponte */}
      <Secao ceu className="text-center">
        <Ornamento />
        <p className="mx-auto mt-8 max-w-[16ch] font-display text-4xl leading-tight text-tinta italic lg:text-6xl">{C.ponte.text}</p>
        <button
          type="button"
          onClick={toCatalog}
          className="mt-10 cursor-pointer rounded-full border border-latao/60 px-10 py-4 font-label text-[11px] tracking-[0.3em] text-latao uppercase transition-colors hover:bg-latao hover:text-papel"
        >
          {C.ponte.cta}
        </button>
      </Secao>

      {/* Diferença — luz e sombra: a coluna da Arquétypus acesa, a do splash comum apagada */}
      <Secao className="bg-noite">
        <Cabeca eyebrow={C.diferenca.eyebrow} title={<>{C.diferenca.title[0]} <span className="text-latao italic">{C.diferenca.title[1]}</span></>} />
        <div className="relative mt-12 grid grid-cols-2 gap-x-6 lg:mt-16 lg:gap-x-16">
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-latao/60 to-transparent" />
          <p className="text-right font-label text-[10px] tracking-[0.3em] text-latao uppercase">{C.diferenca.colunas[0]}</p>
          <p className="font-label text-[10px] tracking-[0.3em] text-tinta-3 uppercase">{C.diferenca.colunas[1]}</p>
          {COMPARISON.map((c) => (
            <div key={c.tema} className="col-span-2 grid grid-cols-2 gap-x-6 py-4 lg:gap-x-16">
              <p className="text-right font-display text-lg leading-snug text-tinta lg:text-2xl">{c.arquetypus}</p>
              <p className="text-sm leading-snug text-tinta-3 lg:text-base">{c.comum}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center font-display text-2xl text-tinta italic lg:text-3xl">
          {C.diferenca.fecho[0]} <span className="text-latao">{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — retratos em arco */}
      <Secao ceu>
        <Cabeca eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} />
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
          {UGC_VIDEOS.map((v) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className="text-center">
                <span className="block rounded-t-full border border-latao/40 p-1.5">
                  <span className="block aspect-[3/4] overflow-hidden rounded-t-full">
                    <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`} loading="lazy" className="h-full w-full object-cover" />
                  </span>
                </span>
                <p className="mt-4 font-label text-[10px] tracking-[0.2em] text-tinta-3">{v.creator}</p>
                <Link to={productPath(arq)} state={{ backgroundLocation: location }} className="mt-1 block font-display text-2xl text-tinta hover:text-latao">
                  {arq.nome}
                </Link>
                <p className="text-xs text-tinta-2">{brl(arq.preco)}</p>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* Garantia — selo circular com o texto girando em volta do 07 */}
      <Secao className="bg-noite">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-64 lg:w-80">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_40s_linear_infinite] motion-reduce:animate-none" aria-hidden>
              <defs>
                <path id="aro-garantia" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-latao)" strokeOpacity="0.5" />
              <circle cx="100" cy="100" r="68" fill="none" stroke="var(--color-latao)" strokeOpacity="0.3" />
              <text fill="var(--color-latao)" fontSize="10" letterSpacing="6.5" style={{ textTransform: 'uppercase' }}>
                <textPath href="#aro-garantia">{`${C.garantia.label} ✦ ${C.garantia.label} ✦ `}</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-7xl text-latao lg:text-8xl">{C.garantia.dias}</span>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl leading-tight text-tinta lg:text-5xl">
              {C.garantia.title[0]}
              <br />
              <em className="text-latao">{C.garantia.title[1]}</em>
            </h2>
            <p className="mt-6 text-tinta-2">{C.garantia.body[0]}</p>
            <p className="mt-2 text-tinta-2">{C.garantia.body[1]}</p>
            <p className="mt-6 font-label text-[9px] tracking-[0.3em] text-tinta-3 uppercase">{C.garantia.nota}</p>
          </div>
        </div>
      </Secao>

      {/* Criadores — três medalhões de números */}
      <Secao ceu>
        <Cabeca eyebrow={C.criadores.eyebrow} title={<>{C.criadores.title[0]} <span className="text-latao italic">{C.criadores.title[1]}</span></>} sub={C.criadores.body} />
        <dl className="mt-12 grid grid-cols-3 gap-3 lg:mt-16 lg:gap-10">
          {CREATOR_STATS.map((s) => (
            <div key={s.valor} className="flex flex-col items-center text-center">
              <dd className="grid aspect-square w-full max-w-[160px] place-items-center rounded-full font-display text-3xl text-latao ring-1 ring-latao/50 lg:text-5xl">
                {s.valor}
              </dd>
              <dt className="order-last mt-4 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-10 max-w-[52ch] text-center text-sm text-tinta-3">{C.criadores.body2}</p>
        <div className="mt-8 text-center">
          <Link to="/criadores" className="inline-block rounded-full bg-latao px-10 py-4 text-sm font-medium text-papel hover:opacity-90">
            {C.criadores.cta}
          </Link>
        </div>
      </Secao>

      {/* Diário — três arcanos menores */}
      <Secao id="diario" className="bg-papel-2">
        <Cabeca eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="rounded-t-[999px] rounded-b-xl border border-latao/40 px-6 pt-14 pb-8 text-center">
              <span className="font-display text-xl tracking-[0.2em] text-latao">{romano(String(i + 1))}</span>
              <h3 className="mt-4 font-display text-xl leading-snug text-tinta lg:text-2xl">{j.title}</h3>
              <p className="mt-3 text-sm text-tinta-2">{j.body}</p>
              <p className="mt-6 font-label text-[9px] tracking-[0.3em] text-tinta-3 uppercase">{C.diario.breve}</p>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Cupom — carta-convite */}
      <Secao ceu>
        <div className="mx-auto max-w-3xl rounded-2xl bg-papel-2 p-2 ring-1 ring-latao/50">
          <div className="rounded-xl border border-latao/30 px-6 py-12 text-center lg:px-16">
            <p className="font-label text-[10px] tracking-[0.4em] text-latao uppercase">✦ {C.cupom.eyebrow} ✦</p>
            <p className="mt-4 font-display text-8xl leading-none text-latao lg:text-9xl">{C.cupom.valor}</p>
            <h2 className="mt-3 font-display text-2xl text-tinta lg:text-3xl">{C.cupom.title}</h2>
            <p className="mx-auto mt-3 max-w-[40ch] text-sm text-tinta-2">{C.cupom.body}</p>
            <form onSubmit={preventSubmit} className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="rounded-full border border-latao/40 bg-transparent px-5 py-3.5 text-sm text-tinta placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
              <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="rounded-full border border-latao/40 bg-transparent px-5 py-3.5 text-sm text-tinta placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
              <button type="submit" className="cursor-pointer rounded-full bg-latao py-4 text-sm font-medium text-papel hover:opacity-90 sm:col-span-2">
                {C.cupom.cta}
              </button>
            </form>
          </div>
        </div>
      </Secao>

      {/* Rodapé */}
      <footer className="relative -mb-24 overflow-hidden border-t border-latao/30 bg-noite px-5 pt-20 pb-[calc(3rem+6rem)] text-center md:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: CEU }} />
        <div className="relative mx-auto max-w-4xl">
          <img src={logoBranco} alt="Arquétypus Parfum" loading="lazy" className="mx-auto h-auto w-40" />
          <Ornamento className="mt-8" />
          <p className="mt-8 font-display text-2xl text-tinta italic lg:text-3xl">
            {C.rodape.tagline[0]}
            <br />
            <span className="text-latao">{C.rodape.tagline[1]}</span>
          </p>
          <nav aria-label="Rodapé" className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 font-label text-[10px] tracking-[0.25em] text-tinta-2 uppercase">
            {FOOTER_EXPLORE.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-latao">
                {l.label}
              </Link>
            ))}
            <Link to="/privacidade" className="hover:text-latao">
              Privacidade
            </Link>
            <button type="button" onClick={openCookiePreferences} className="cursor-pointer uppercase hover:text-latao">
              Gerenciar cookies
            </button>
            {FOOTER_SOON.map((s) => (
              <span key={s} aria-disabled="true" className="text-tinta-3/60">
                {s} · em breve
              </span>
            ))}
          </nav>
          <p className="mt-10 font-label text-[9px] tracking-[0.3em] text-tinta-3 uppercase">{C.rodape.redes.join(' ✦ ')}</p>
          <p className="mt-6 font-label text-[9px] leading-relaxed tracking-wider text-tinta-3/70 uppercase">
            {C.rodape.pagamentos} · <span className="normal-case">{C.rodape.sac}</span>
            <br />
            {C.rodape.empresa}
          </p>
        </div>
      </footer>
    </>
  )
}
