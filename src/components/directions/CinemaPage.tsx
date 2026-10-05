import { Link, useLocation } from 'react-router-dom'
import { getArchetype, productPath } from '@/data/archetypes'
import { COMPARISON, DIAGNOSIS, ENERGIES, FAMILIES, HOME_COPY as C, JOURNAL, QUALIFICATION, SEALS, SEGMENTS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import logoBranco from '@/assets/brand/logo-branco.png'
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
 * Página inteira da direção "Cinema": a home como um filme noir. Linguagem que se repete — rótulo em
 * caixa alta bem espaçada (crédito de filme), títulos em itálico, fotos em proporção de tela (21:9 /
 * pôster 2:3), faixas pretas de letterbox, vinheta, burgundy da paleta da marca nas seções "noite",
 * película com perfurações na comunidade e o cupom como ingresso.
 */

function Credito({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-label text-[10px] tracking-[0.5em] text-latao uppercase ${className}`}>{children}</p>
}

function Cabeca({ eyebrow, title, sub, center = true }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <Credito>{eyebrow}</Credito>
      <h2 className={`mt-5 font-display text-[36px] leading-[1.05] text-tinta italic lg:text-6xl ${center ? 'mx-auto max-w-[20ch]' : 'max-w-[18ch]'}`}>{title}</h2>
      {sub && <p className={`mt-5 max-w-[46ch] text-sm text-tinta-2 lg:text-base ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  )
}

function Secao({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-5 py-20 md:px-10 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

const VINHETA = 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)'
// película: perfurações em cima e embaixo
const PERFURACAO =
  'repeating-linear-gradient(to right, transparent 0 10px, var(--color-tinta) 10px 22px, transparent 22px 34px)'

export function CinemaPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — linha de créditos */}
      <section className="border-y border-linha px-5 py-5">
        <p className="mx-auto max-w-5xl text-center font-label text-[9px] leading-loose tracking-[0.45em] text-tinta-3 uppercase">
          {SEALS.join('  ·  ')}
        </p>
      </section>

      {/* Coleções — três pôsteres */}
      <Secao id="segmentos">
        <Cabeca eyebrow="Coleções" title="Escolha por onde começar" />
        <div className="mt-14 grid gap-5 sm:grid-cols-3 lg:mt-20 lg:gap-8">
          {SEGMENTS.map((seg) => (
            <button key={seg.name} type="button" onClick={() => onSegment(seg.seg)} className="no-press group relative block aspect-[2/3] cursor-pointer overflow-hidden bg-black text-left">
              <img src={seg.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 grayscale-[40%] transition-[transform,filter,opacity] duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" />
              <span aria-hidden className="absolute inset-0" style={{ background: `${VINHETA}, linear-gradient(to top, rgba(0,0,0,0.9), transparent 55%)` }} />
              <span className="absolute inset-x-0 top-5 text-center font-label text-[9px] tracking-[0.5em] text-papel-inv/70 uppercase">{seg.label}</span>
              <span className="absolute inset-x-0 bottom-6 px-5 text-center text-papel-inv">
                <b className="block font-display text-5xl leading-none font-normal italic">{seg.name}</b>
                <span className="mt-3 block font-label text-[9px] tracking-[0.4em] text-papel-inv/60 uppercase">{seg.meta}</span>
                <span className="mt-5 inline-block border border-papel-inv/40 px-5 py-2 font-label text-[9px] tracking-[0.35em] uppercase transition-colors group-hover:border-latao group-hover:text-latao">
                  {C.segmentos.cta}
                </span>
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Diagnóstico — intertítulo de cinema mudo, depois as "legendas" */}
      <Secao className="bg-noite">
        <div className="mx-auto max-w-3xl border-4 border-double border-latao/60 px-6 py-12 text-center lg:px-16 lg:py-16">
          <Credito>{C.diagnostico.eyebrow}</Credito>
          <h2 className="mt-5 font-display text-3xl leading-tight text-tinta italic lg:text-5xl">{C.diagnostico.title}</h2>
          <p className="mt-5 text-sm text-tinta-2">{C.diagnostico.sub}</p>
        </div>
        <ol className="mx-auto mt-14 max-w-3xl space-y-10 text-center lg:mt-20">
          {DIAGNOSIS.map((d) => (
            <li key={d.n}>
              <span className="font-label text-[10px] tracking-[0.5em] text-latao">{d.n}</span>
              <b className="mt-3 block font-display text-2xl leading-snug font-normal text-tinta italic lg:text-3xl">{d.title}</b>
              <p className="mt-2 text-sm text-tinta-2">{d.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-16 text-center font-display text-3xl text-tinta italic lg:text-5xl">
          {C.diagnostico.fecho[0]} <span className="text-latao">{C.diagnostico.fecho[1]}</span>
        </p>
      </Secao>

      {/* Famílias — quatro fotogramas em tela larga */}
      <Secao>
        <Cabeca eyebrow={C.familias.eyebrow} title={C.familias.title} sub={C.familias.sub} />
        <div className="mt-14 space-y-4 lg:mt-20 lg:space-y-6">
          {FAMILIES.map((f, i) => (
            <button key={f.nome} type="button" onClick={toCatalog} className="no-press group relative block aspect-[16/9] w-full cursor-pointer overflow-hidden bg-black text-left md:aspect-[21/9]">
              <img src={f.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-75 transition-[transform,opacity] duration-1000 group-hover:scale-[1.03] group-hover:opacity-100" />
              <span aria-hidden className="absolute inset-0" style={{ background: `${VINHETA}, linear-gradient(to right, rgba(0,0,0,0.85), transparent 60%)` }} />
              <span className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 text-papel-inv lg:px-14">
                <span className="font-label text-[9px] tracking-[0.5em] text-latao">{String(i + 1).padStart(2, '0')}</span>
                <b className="mt-2 block font-display text-5xl font-normal italic lg:text-8xl">{f.nome}</b>
                <span className="mt-2 block text-sm text-papel-inv/75">{f.desc}</span>
                <span className="mt-2 block font-label text-[9px] tracking-[0.35em] text-papel-inv/50 uppercase">{f.attrs.join(' · ')}</span>
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — quatro cenas verticais */}
      <section className="bg-noite py-20 lg:py-32">
        <div className="px-5 md:px-10">
          <Cabeca eyebrow={C.energias.eyebrow} title={C.energias.title} sub={C.energias.sub} />
        </div>
        <ul className="no-scrollbar scroll-pad mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-5 md:px-10 lg:mx-auto lg:mt-20 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:after:hidden">
          {ENERGIES.map((e, i) => (
            <li key={e.nome} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
              <button type="button" onClick={toCatalog} className="no-press group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden bg-black text-left">
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-1000 group-hover:scale-105 group-hover:opacity-100" />
                <span aria-hidden className="absolute inset-0" style={{ background: `${VINHETA}, linear-gradient(to top, rgba(0,0,0,0.85), transparent 50%)` }} />
                <span aria-hidden className="absolute inset-x-0 top-0 h-[6%] bg-black" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[6%] bg-black" />
                <span className="absolute top-[9%] left-4 font-label text-[9px] tracking-[0.5em] text-papel-inv/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="absolute inset-x-0 bottom-[10%] px-5 text-papel-inv">
                  <b className="block font-display text-4xl font-normal italic">{e.nome}</b>
                  <span className="mt-2 block font-label text-[9px] tracking-[0.3em] text-papel-inv/60 uppercase">
                    {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Reconhecimento — monólogo */}
      <Secao>
        <Cabeca eyebrow={C.reconhecimento.eyebrow} title={C.reconhecimento.title} sub={C.reconhecimento.sub} />
        <ul className="mx-auto mt-14 max-w-3xl divide-y divide-linha border-y border-linha lg:mt-20">
          {QUALIFICATION.map((q) => (
            <li key={q.title} className="py-8 text-center">
              <b className="block font-display text-2xl leading-snug font-normal text-tinta italic lg:text-3xl">“{q.title}”</b>
              <p className="mt-3 text-sm text-tinta-2">{q.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-16 text-center font-display text-3xl leading-snug text-tinta italic lg:text-4xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <span className="text-latao">{C.reconhecimento.fecho[2]}</span>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — o pôster principal, em tela cheia */}
      <section id="destaque" className="relative min-h-[100svh] overflow-hidden bg-black text-papel-inv">
        <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="absolute inset-0 h-full w-full object-cover object-[50%_25%] lg:left-auto lg:w-1/2" />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: `${VINHETA}, linear-gradient(to top, color-mix(in srgb, var(--color-burgundy) 92%, transparent) 10%, transparent 70%)` }}
        />
        {/* desktop: foto na metade direita, dissolvendo no preto onde fica o texto */}
        <span aria-hidden className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-r from-black via-transparent to-transparent lg:block" />
        <span aria-hidden className="absolute inset-x-0 top-0 h-[7svh] bg-black" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[7svh] bg-black" />
        <div className="absolute inset-x-0 bottom-[11svh] px-5 text-center lg:inset-y-0 lg:right-1/2 lg:flex lg:flex-col lg:justify-center lg:px-16 lg:text-left">
          <Credito>{C.destaque.eyebrow}</Credito>
          <h2 className="mt-4 font-display text-7xl leading-none italic lg:text-[140px]">{featured.nome}</h2>
          <p className="mx-auto mt-4 max-w-[40ch] font-display text-xl text-papel-inv/85 italic lg:mx-0">{featured.ep}</p>
          <p className="mx-auto mt-3 max-w-[52ch] text-sm text-papel-inv/70 lg:mx-0">{featured.cheiro[1]}</p>
          <p className="mt-6 font-display text-4xl">{brl(featured.preco)}</p>
          <p className="mt-1 text-xs text-papel-inv/65">
            {brl(pix(featured.preco))} no Pix · ou 6x de {brl(parcela(featured.preco))} sem juros · {featured.tipo} {featured.vol}
          </p>
          <Link
            to={productPath(featured)}
            state={{ backgroundLocation: location }}
            className="mt-7 inline-block border border-papel-inv/50 lg:self-start px-10 py-3.5 font-label text-[11px] tracking-[0.35em] uppercase transition-colors hover:border-latao hover:bg-latao hover:text-black"
          >
            {C.destaque.cta} {featured.nome}
          </Link>
        </div>
      </section>

      {/* Ponte — tela preta, uma frase */}
      <section className="flex min-h-[60svh] flex-col items-center justify-center bg-black px-5 py-20 text-center text-papel-inv">
        <p className="max-w-[16ch] font-display text-5xl leading-tight italic lg:text-7xl">{C.ponte.text}</p>
        <button type="button" onClick={toCatalog} className="mt-10 cursor-pointer font-label text-[10px] tracking-[0.5em] text-latao uppercase hover:opacity-70">
          {C.ponte.cta} →
        </button>
      </section>

      {/* Diferença — como créditos de elenco: papel ..... nome */}
      <Secao className="bg-noite">
        <Cabeca eyebrow={C.diferenca.eyebrow} title={<>{C.diferenca.title[0]} <span className="text-latao">{C.diferenca.title[1]}</span></>} />
        <div className="mx-auto mt-14 max-w-4xl lg:mt-20">
          <div className="grid grid-cols-2 gap-6 pb-4 font-label text-[9px] tracking-[0.45em] uppercase">
            <span className="text-right text-latao">{C.diferenca.colunas[0]}</span>
            <span className="text-tinta-3">{C.diferenca.colunas[1]}</span>
          </div>
          {COMPARISON.map((c) => (
            <div key={c.tema} className="grid grid-cols-2 items-baseline gap-6 py-3">
              <span className="text-right font-display text-lg text-tinta italic lg:text-2xl">{c.arquetypus}</span>
              <span className="text-sm text-tinta-3 lg:text-base">{c.comum}</span>
            </div>
          ))}
        </div>
        <p className="mt-14 text-center font-display text-3xl text-tinta italic lg:text-4xl">
          {C.diferenca.fecho[0]}
          <br />
          <span className="text-latao">{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — rolo de película */}
      <section className="py-20 lg:py-32">
        <div className="px-5 md:px-10">
          <Cabeca eyebrow={C.comunidade.eyebrow} title={C.comunidade.title} sub={C.comunidade.sub} />
        </div>
        <div className="mt-14 bg-black py-4 lg:mt-20">
          <div aria-hidden className="h-3" style={{ backgroundImage: PERFURACAO, opacity: 0.25 }} />
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-3 py-3 lg:justify-center">
            {UGC_VIDEOS.map((v) => {
              const arq = getArchetype(v.archetypeId)
              if (!arq) return null
              return (
                <li key={v.creator} className="w-[62%] shrink-0 snap-center sm:w-[38%] lg:w-[22%]">
                  <Link to={productPath(arq)} state={{ backgroundLocation: location }} className="no-press group relative block aspect-[3/4] overflow-hidden">
                    <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`} loading="lazy" className="h-full w-full object-cover sepia-[25%] transition-[filter] duration-700 group-hover:sepia-0" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-4 text-papel-inv">
                      <span className="block font-label text-[9px] tracking-[0.25em] text-papel-inv/60">{v.creator}</span>
                      <b className="mt-1 block font-display text-3xl font-normal italic">{arq.nome}</b>
                      <span className="text-xs text-papel-inv/70">{brl(arq.preco)}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div aria-hidden className="h-3" style={{ backgroundImage: PERFURACAO, opacity: 0.25 }} />
        </div>
      </section>

      {/* Garantia — burgundy, 07 em itálico */}
      <section className="bg-noite-2 px-5 py-20 text-center md:px-10 lg:py-32">
        <Credito>{C.garantia.label}</Credito>
        <p className="mt-4 font-display leading-none text-latao italic" style={{ fontSize: 'clamp(140px, 24vw, 320px)' }}>
          {C.garantia.dias}
        </p>
        <h2 className="mx-auto mt-6 max-w-[24ch] font-display text-3xl leading-tight text-tinta italic lg:text-5xl">
          {C.garantia.title[0]} <span className="text-latao">{C.garantia.title[1]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[40ch] text-tinta-2">
          {C.garantia.body[0]} {C.garantia.body[1]}
        </p>
        <p className="mt-8 font-label text-[9px] tracking-[0.45em] text-tinta-3 uppercase">{C.garantia.nota}</p>
      </section>

      {/* Criadores — ficha de créditos */}
      <Secao>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Cabeca eyebrow={C.criadores.eyebrow} title={<>{C.criadores.title[0]} <span className="text-latao">{C.criadores.title[1]}</span></>} sub={C.criadores.body} center={false} />
            <p className="mt-4 max-w-[46ch] text-sm text-tinta-3">{C.criadores.body2}</p>
            <Link to="/criadores" className="mt-8 inline-block border border-latao/60 px-10 py-3.5 font-label text-[11px] tracking-[0.35em] text-latao uppercase hover:bg-latao hover:text-black">
              {C.criadores.cta}
            </Link>
          </div>
          <dl className="self-center">
            {CREATOR_STATS.map((s) => (
              <div key={s.valor} className="flex items-baseline gap-4 border-b border-linha py-6">
                <dt className="font-label text-[10px] tracking-[0.35em] text-tinta-3 uppercase">{s.label}</dt>
                <span aria-hidden className="flex-1 border-b border-dotted border-linha-2" />
                <dd className="font-display text-4xl text-tinta italic lg:text-5xl">{s.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Secao>

      {/* Diário — notas de cena com reticências */}
      <Secao id="diario" className="bg-noite">
        <Cabeca eyebrow={C.diario.eyebrow} title={C.diario.title} />
        <ol className="mx-auto mt-14 max-w-4xl lg:mt-20">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="border-t border-linha-2 py-8 last:border-b">
              <div className="flex items-baseline gap-4">
                <span className="font-label text-[10px] tracking-[0.4em] text-latao">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl leading-snug text-tinta italic lg:text-4xl">{j.title}</h3>
                <span aria-hidden className="hidden flex-1 border-b border-dotted border-linha-2 md:block" />
                <span className="hidden font-label text-[9px] tracking-[0.35em] text-tinta-3 uppercase md:block">{C.diario.breve}</span>
              </div>
              <p className="mt-2 pl-10 text-sm text-tinta-2">{j.body}</p>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Cupom — ingresso com picote */}
      <Secao>
        <div
          className="mx-auto grid max-w-4xl bg-papel-3 text-tinta md:grid-cols-[1fr_auto_1.2fr]"
          style={{
            maskImage: 'radial-gradient(circle 14px at 0 50%, transparent 98%, #000) , radial-gradient(circle 14px at 100% 50%, transparent 98%, #000)',
            maskComposite: 'intersect',
            WebkitMaskImage: 'radial-gradient(circle 14px at 0 50%, transparent 98%, #000), radial-gradient(circle 14px at 100% 50%, transparent 98%, #000)',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center lg:p-12">
            <Credito>{C.cupom.eyebrow}</Credito>
            <p className="mt-3 font-display text-8xl leading-none text-latao italic">{C.cupom.valor}</p>
            <h2 className="mt-2 font-display text-2xl italic">{C.cupom.title}</h2>
          </div>
          <span aria-hidden className="mx-8 border-t-2 border-dashed border-linha-2 md:mx-0 md:my-8 md:border-t-0 md:border-l-2" />
          <form onSubmit={preventSubmit} className="flex flex-col gap-4 p-8 lg:p-12">
            <p className="text-sm text-tinta-2">{C.cupom.body}</p>
            <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="border-b border-linha-2 bg-transparent py-2 placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
            <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="border-b border-linha-2 bg-transparent py-2 placeholder:text-tinta-3 focus:border-latao focus:outline-none" />
            <button type="submit" className="mt-2 cursor-pointer bg-latao py-3.5 font-label text-[11px] tracking-[0.35em] text-black uppercase hover:opacity-85">
              {C.cupom.cta}
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — créditos finais */}
      <footer className="-mb-24 bg-black px-5 pt-24 pb-[calc(3rem+6rem)] text-center text-papel-inv md:px-10">
        <img src={logoBranco} alt="Arquétypus Parfum" loading="lazy" className="mx-auto h-auto w-36" />
        <p className="mx-auto mt-10 max-w-[24ch] font-display text-3xl leading-snug italic lg:text-4xl">
          {C.rodape.tagline[0]} <span className="text-latao">{C.rodape.tagline[1]}</span>
        </p>
        <nav aria-label="Rodapé" className="mx-auto mt-14 grid max-w-md gap-3 font-label text-[10px] tracking-[0.4em] uppercase">
          {FOOTER_EXPLORE.map((l) => (
            <Link key={l.to} to={l.to} className="text-papel-inv/70 hover:text-latao">
              {l.label}
            </Link>
          ))}
          <Link to="/privacidade" className="text-papel-inv/70 hover:text-latao">
            Privacidade
          </Link>
          <button type="button" onClick={openCookiePreferences} className="cursor-pointer uppercase text-papel-inv/70 hover:text-latao">
            Gerenciar cookies
          </button>
          {FOOTER_SOON.map((s) => (
            <span key={s} aria-disabled="true" className="text-papel-inv/30">
              {s} · em breve
            </span>
          ))}
        </nav>
        <p className="mt-14 font-label text-[9px] tracking-[0.45em] text-papel-inv/40 uppercase">{C.rodape.redes.join('  ·  ')}</p>
        <p className="mt-4 font-label text-[9px] leading-relaxed tracking-[0.2em] text-papel-inv/30 uppercase">
          {C.rodape.pagamentos} · <span className="normal-case">{C.rodape.sac}</span>
          <br />
          {C.rodape.empresa}
        </p>
      </footer>
    </>
  )
}
