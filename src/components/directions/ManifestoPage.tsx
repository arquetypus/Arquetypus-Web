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
  SealIcon,
  type DirectionPageProps,
} from './shared'

/**
 * Página inteira da direção "Manifesto": a home como um cartaz. Linguagem que se repete — caixa alta
 * condensada enorme, fios grossos de 2px, caixas com borda preta, ocre chapado como marca-texto, números
 * gigantes, inversão preto/papel no hover e faixas de texto correndo. Nada de sombra, nada de degradê.
 */

function Titulo({ eyebrow, children, sub, invert = false }: { eyebrow: string; children: React.ReactNode; sub?: string; invert?: boolean }) {
  return (
    <div className={`border-b-2 pb-6 ${invert ? 'border-papel' : 'border-tinta'}`}>
      <p className={`inline-block px-2 py-1 font-label text-[10px] tracking-[0.2em] uppercase ${invert ? 'bg-latao text-tinta' : 'bg-tinta text-papel'}`}>
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[44px] leading-[1.02] uppercase lg:text-8xl">{children}</h2>
      {sub && <p className={`mt-4 max-w-[52ch] text-base ${invert ? 'text-papel/70' : 'text-tinta-2'}`}>{sub}</p>}
    </div>
  )
}

function Secao({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`px-4 py-14 md:px-10 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-[1600px]">{children}</div>
    </section>
  )
}

/** Faixa corrida de texto (reaproveita a animação .boutique-marquee). */
function Faixa({ itens, className = '' }: { itens: readonly string[]; className?: string }) {
  const row = [...itens, ...itens, ...itens, ...itens]
  return (
    <div aria-hidden className={`overflow-hidden border-y-2 border-tinta py-2.5 ${className}`}>
      <div className="boutique-marquee flex w-max gap-6 font-display text-2xl whitespace-nowrap uppercase lg:text-4xl">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6">
            {t} <span className="text-base lg:text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const marcaTexto = 'bg-latao px-[0.08em] text-tinta [box-decoration-break:clone]'

export function ManifestoPage({ catalog, onSegment, toCatalog, featured, featuredImg }: DirectionPageProps) {
  const location = useLocation()
  return (
    <>
      {/* Selos — quatro caixas */}
      <section className="grid grid-cols-2 border-b-2 border-tinta md:grid-cols-4">
        {SEALS.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 px-4 py-5 md:px-10 ${i % 2 === 1 ? 'border-l-2' : ''} ${i >= 2 ? 'border-t-2 md:border-t-0' : ''} ${i === 2 ? 'md:border-l-2' : ''} border-tinta`}>
            <SealIcon seal={s} className="size-6 shrink-0" />
            <span className="font-label text-[11px] tracking-[0.12em] uppercase">{s}</span>
          </div>
        ))}
      </section>

      {/* Coleções — três linhas gigantes; foto aparece dentro da linha */}
      <Secao id="segmentos">
        <Titulo eyebrow="Coleções">Escolha por onde começar</Titulo>
        <ul>
          {SEGMENTS.map((seg) => (
            <li key={seg.name} className="border-b-2 border-tinta">
              <button
                type="button"
                onClick={() => onSegment(seg.seg)}
                className="no-press group flex w-full cursor-pointer items-center gap-4 py-5 text-left transition-colors hover:bg-latao lg:gap-8 lg:px-4"
              >
                <span className="h-20 w-28 shrink-0 overflow-hidden border-2 border-tinta lg:h-32 lg:w-52">
                  <img src={seg.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block truncate pt-[0.08em] font-display text-5xl leading-[1.05] font-normal uppercase lg:text-9xl">{seg.name}</b>
                  <span className="font-label text-[10px] tracking-[0.18em] uppercase opacity-70">
                    {seg.label} · {seg.meta}
                  </span>
                </span>
                <span aria-hidden className="hidden font-display text-5xl transition-transform group-hover:translate-x-2 md:block lg:text-7xl">→</span>
              </button>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Diagnóstico — três caixas com números gigantes */}
      <Secao className="bg-papel-2">
        <Titulo eyebrow={C.diagnostico.eyebrow} sub={C.diagnostico.sub}>
          {C.diagnostico.title}
        </Titulo>
        <ol className="mt-8 grid border-2 border-tinta md:grid-cols-3">
          {DIAGNOSIS.map((d, i) => (
            <li key={d.n} className={`p-6 lg:p-10 ${i > 0 ? 'border-t-2 border-tinta md:border-t-0 md:border-l-2' : ''}`}>
              <span className="font-display text-8xl leading-none text-latao lg:text-[160px]">{d.n}</span>
              <b className="mt-4 block text-xl leading-snug font-semibold">{d.title}</b>
              <p className="mt-2 text-sm text-tinta-2">{d.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 font-display text-5xl leading-[1.02] uppercase lg:text-8xl">
          {C.diagnostico.fecho[0]} <span className={marcaTexto}>{C.diagnostico.fecho[1]}</span>
        </p>
      </Secao>

      {/* Famílias — grade de cartazes */}
      <Secao>
        <Titulo eyebrow={C.familias.eyebrow} sub={C.familias.sub}>
          {C.familias.title}
        </Titulo>
        <div className="mt-8 grid grid-cols-2 border-2 border-tinta lg:grid-cols-4">
          {FAMILIES.map((f, i) => (
            <button
              key={f.nome}
              type="button"
              onClick={toCatalog}
              className={`no-press group cursor-pointer text-left transition-colors hover:bg-tinta hover:text-papel ${i % 2 === 1 ? 'border-l-2' : ''} ${i >= 2 ? 'border-t-2 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l-2' : ''} border-tinta`}
            >
              <span className="block aspect-square overflow-hidden border-b-2 border-tinta">
                <img src={f.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale contrast-125 transition-[filter] duration-500 group-hover:grayscale-0 group-hover:contrast-100" />
              </span>
              <span className="block p-4 lg:p-6">
                <b className="block font-display text-4xl font-normal uppercase lg:text-5xl">{f.nome}</b>
                <span className="mt-1 block text-sm">{f.desc}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {f.attrs.map((a) => (
                    <span key={a} className="border border-current px-2 py-0.5 font-label text-[9px] tracking-[0.12em] uppercase">
                      {a}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
      </Secao>

      {/* Energias — palavras gigantes alternando lado, foto revelada no hover */}
      <section className="bg-tinta px-4 py-14 text-papel md:px-10 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <Titulo eyebrow={C.energias.eyebrow} sub={C.energias.sub} invert>
            {C.energias.title}
          </Titulo>
          <ul>
            {ENERGIES.map((e, i) => (
              <li key={e.nome} className="border-b-2 border-papel">
                <button
                  type="button"
                  onClick={toCatalog}
                  className={`no-press group relative flex w-full cursor-pointer items-center gap-6 overflow-hidden py-4 lg:py-6 ${i % 2 === 1 ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <img aria-hidden src={e.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
                  <b className="relative pt-[0.08em] font-display text-6xl leading-[1.05] font-normal uppercase transition-colors group-hover:text-latao lg:text-[180px]">{e.nome}</b>
                  <span className="relative font-label text-[10px] tracking-[0.18em] uppercase opacity-70">
                    {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' / ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reconhecimento — checklist em caixas */}
      <Secao>
        <Titulo eyebrow={C.reconhecimento.eyebrow} sub={C.reconhecimento.sub}>
          {C.reconhecimento.title}
        </Titulo>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {QUALIFICATION.map((q) => (
            <li key={q.title} className="flex gap-4 border-2 border-tinta p-5 shadow-[6px_6px_0_var(--color-tinta)] lg:p-8">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center border-2 border-tinta bg-latao font-bold">
                ✓
              </span>
              <span>
                <b className="block text-lg leading-snug font-semibold">{q.title}</b>
                <span className="mt-2 block text-sm text-tinta-2">{q.body}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-12 font-display text-4xl leading-[1.05] uppercase lg:text-7xl">
          {C.reconhecimento.fecho[0]} {C.reconhecimento.fecho[1]} <span className={marcaTexto}>{C.reconhecimento.fecho[2]}</span>
        </p>
      </Secao>

      {catalog}

      {/* Destaque — cartaz dividido: foto e painel ocre */}
      <section id="destaque" className="grid border-y-2 border-tinta md:grid-cols-2">
        <div className="relative aspect-[4/5] border-b-2 border-tinta md:aspect-auto md:border-r-2 md:border-b-0">
          <img src={featuredImg} alt={`Mão segurando o ${featured.tipo.toLowerCase()} ${featured.nome}`} className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          <span className="absolute top-4 left-4 -rotate-3 border-2 border-tinta bg-papel px-3 py-1.5 font-label text-[10px] tracking-[0.18em] uppercase">
            {C.destaque.eyebrow}
          </span>
        </div>
        <div className="flex flex-col justify-center bg-latao p-6 text-tinta md:p-10 lg:p-16">
          <span className="font-label text-[10px] tracking-[0.18em] uppercase">
            {featured.energia} · {featured.fam}
          </span>
          <h2 className="mt-3 pt-[0.08em] font-display text-7xl leading-[1.02] uppercase lg:text-[160px]">{featured.nome}</h2>
          <p className="mt-4 text-xl font-semibold">{featured.ep}</p>
          <p className="mt-3 text-sm">{featured.cheiro[1]}</p>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t-2 border-tinta pt-4">
            <span>
              <b className="block font-display text-5xl">{brl(featured.preco)}</b>
              <span className="text-xs">
                {brl(pix(featured.preco))} no Pix · 6x de {brl(parcela(featured.preco))} · {featured.tipo} {featured.vol}
              </span>
            </span>
            <Link to={`/loja/${featured.id}`} state={{ backgroundLocation: location }} className="bg-tinta px-8 py-4 font-label text-[12px] tracking-[0.18em] text-papel uppercase hover:bg-papel hover:text-tinta">
              {C.destaque.cta} {featured.nome} →
            </Link>
          </div>
        </div>
      </section>

      {/* Ponte — faixa e frase */}
      <section className="bg-latao text-tinta">
        <Faixa itens={[C.ponte.text]} />
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-12 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <p className="font-display text-6xl leading-[1.02] uppercase lg:text-9xl">{C.ponte.text}</p>
          <button type="button" onClick={toCatalog} className="shrink-0 cursor-pointer bg-tinta px-8 py-4 font-label text-[12px] tracking-[0.18em] text-papel uppercase hover:bg-papel hover:text-tinta">
            {C.ponte.cta} →
          </button>
        </div>
        <Faixa itens={[C.ponte.text]} />
      </section>

      {/* Diferença — tabela de borda grossa; coluna da Arquétypus marcada em ocre */}
      <Secao>
        <Titulo eyebrow={C.diferenca.eyebrow}>
          {C.diferenca.title[0]} <span className={marcaTexto}>{C.diferenca.title[1]}</span>
        </Titulo>
        <div className="mt-8 border-2 border-tinta">
          <div className="grid grid-cols-2 border-b-2 border-tinta font-label text-[11px] tracking-[0.15em] uppercase">
            <span className="bg-latao p-3 lg:p-4">{C.diferenca.colunas[0]}</span>
            <span className="border-l-2 border-tinta p-3 text-tinta-3 lg:p-4">{C.diferenca.colunas[1]}</span>
          </div>
          {COMPARISON.map((c, i) => (
            <div key={c.tema} className={`grid grid-cols-2 ${i > 0 ? 'border-t-2 border-tinta' : ''}`}>
              <p className="p-3 font-semibold lg:p-5 lg:text-xl">{c.arquetypus}</p>
              <p className="border-l-2 border-tinta p-3 text-sm text-tinta-3 lg:p-5 lg:text-base">{c.comum}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 font-display text-4xl leading-[1.05] uppercase lg:text-7xl">
          {C.diferenca.fecho[0]} <span className={marcaTexto}>{C.diferenca.fecho[1]}</span>
        </p>
      </Secao>

      {/* Comunidade — fotos com etiquetas tortas, tipo lambe-lambe */}
      <Secao className="bg-papel-2">
        <Titulo eyebrow={C.comunidade.eyebrow} sub={C.comunidade.sub}>
          {C.comunidade.title}
        </Titulo>
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className={i % 2 === 0 ? 'lg:rotate-[-1.5deg]' : 'lg:translate-y-6 lg:rotate-[1.5deg]'}>
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="no-press group relative block border-2 border-tinta bg-papel">
                  <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                  <span className="absolute top-3 left-3 -rotate-2 bg-latao px-2 py-1 font-label text-[10px] tracking-[0.1em]">{v.creator}</span>
                  <span className="flex items-center justify-between border-t-2 border-tinta p-3 transition-colors group-hover:bg-tinta group-hover:text-papel">
                    <b className="font-display text-2xl font-normal uppercase">{arq.nome}</b>
                    <span className="text-sm font-semibold">{brl(arq.preco)}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Secao>

      {/* Garantia — 07 gigante sobre preto */}
      <section className="overflow-hidden bg-tinta px-4 py-14 text-papel md:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1600px] items-center gap-6 lg:grid-cols-2">
          <p className="font-display leading-[0.85] text-latao" style={{ fontSize: 'clamp(180px, 34vw, 520px)' }}>
            {C.garantia.dias}
          </p>
          <div>
            <p className="inline-block bg-latao px-2 py-1 font-label text-[10px] tracking-[0.2em] text-tinta uppercase">{C.garantia.label}</p>
            <h2 className="mt-4 font-display text-5xl leading-[1.02] uppercase lg:text-7xl">
              {C.garantia.title[0]} <span className="text-latao">{C.garantia.title[1]}</span>
            </h2>
            <p className="mt-6 text-lg text-papel/80">
              {C.garantia.body[0]} {C.garantia.body[1]}
            </p>
            <p className="mt-6 border-t-2 border-papel pt-3 font-label text-[11px] tracking-[0.15em] uppercase">{C.garantia.nota}</p>
          </div>
        </div>
      </section>

      {/* Criadores — três caixas de número */}
      <Secao>
        <Titulo eyebrow={C.criadores.eyebrow} sub={C.criadores.body}>
          {C.criadores.title[0]} <span className={marcaTexto}>{C.criadores.title[1]}</span>
        </Titulo>
        <dl className="mt-8 grid grid-cols-3 border-2 border-tinta">
          {CREATOR_STATS.map((s, i) => (
            <div key={s.valor} className={`flex flex-col p-4 lg:p-10 ${i > 0 ? 'border-l-2 border-tinta' : ''} ${i === 0 ? 'bg-latao' : ''}`}>
              <dd className="font-display text-4xl lg:text-8xl">{s.valor}</dd>
              <dt className="order-last mt-2 font-label text-[9px] tracking-[0.12em] uppercase lg:text-[11px]">{s.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] text-tinta-2">{C.criadores.body2}</p>
          <Link to="/criadores" className="shrink-0 bg-tinta px-8 py-4 text-center font-label text-[12px] tracking-[0.18em] text-papel uppercase hover:bg-latao hover:text-tinta">
            {C.criadores.cta} →
          </Link>
        </div>
      </Secao>

      {/* Diário — linhas numeradas */}
      <Secao id="diario" className="bg-papel-2">
        <Titulo eyebrow={C.diario.eyebrow}>{C.diario.title}</Titulo>
        <ol>
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-b-2 border-tinta py-6 lg:grid-cols-[8rem_1fr_auto] lg:gap-x-10">
              <span className="font-display text-5xl text-latao-texto lg:text-7xl">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <b className="block font-display text-3xl leading-[1.05] font-normal uppercase lg:text-5xl">{j.title}</b>
                <span className="mt-2 block text-sm text-tinta-2">{j.body}</span>
              </span>
              <span className="col-start-2 mt-3 inline-block justify-self-start border-2 border-tinta px-2 py-1 font-label text-[9px] tracking-[0.15em] uppercase lg:col-start-auto lg:mt-0">
                {C.diario.breve}
              </span>
            </li>
          ))}
        </ol>
      </Secao>

      {/* Cupom — caixa ocre com sombra chapada */}
      <Secao>
        <div className="grid gap-8 border-2 border-tinta bg-latao p-6 shadow-[10px_10px_0_var(--color-tinta)] lg:grid-cols-2 lg:p-14">
          <div>
            <p className="inline-block bg-tinta px-2 py-1 font-label text-[10px] tracking-[0.2em] text-papel uppercase">{C.cupom.eyebrow}</p>
            <p className="mt-2 font-display leading-[0.9]" style={{ fontSize: 'clamp(120px, 20vw, 280px)' }}>
              {C.cupom.valor}
            </p>
            <h2 className="font-display text-4xl uppercase lg:text-5xl">{C.cupom.title}</h2>
            <p className="mt-3 max-w-[40ch]">{C.cupom.body}</p>
          </div>
          <form onSubmit={preventSubmit} className="flex flex-col justify-end gap-3">
            <input type="email" name="email" autoComplete="email" placeholder="seu@email.com" aria-label="E-mail" className="border-2 border-tinta bg-papel px-4 py-4 placeholder:text-tinta-3 focus:outline-none" />
            <input type="tel" name="whatsapp" inputMode="tel" autoComplete="tel-national" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="border-2 border-tinta bg-papel px-4 py-4 placeholder:text-tinta-3 focus:outline-none" />
            <button type="submit" className="cursor-pointer bg-tinta py-4 font-label text-[12px] tracking-[0.18em] text-papel uppercase hover:bg-papel hover:text-tinta">
              {C.cupom.cta} →
            </button>
          </form>
        </div>
      </Secao>

      {/* Rodapé — preto, nome gigante */}
      <footer className="-mb-24 overflow-hidden bg-tinta pb-[calc(2rem+6rem)] text-papel">
        <Faixa itens={[C.rodape.tagline[0], C.rodape.tagline[1]]} className="border-papel bg-latao text-tinta" />
        <div className="mx-auto max-w-[1600px] px-4 pt-12 md:px-10">
          <p className="font-display leading-[0.85] uppercase" style={{ fontSize: 'clamp(56px, 15vw, 280px)' }}>
            Arquétypus
          </p>
          <div className="mt-10 grid gap-8 border-t-2 border-papel pt-6 md:grid-cols-3">
            <ul className="space-y-2 font-label text-[11px] tracking-[0.15em] uppercase">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-latao">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 font-label text-[11px] tracking-[0.15em] uppercase">
              <li>
                <Link to="/privacidade" className="hover:text-latao">
                  Privacidade
                </Link>
              </li>
              <li>
                <button type="button" onClick={openCookiePreferences} className="cursor-pointer uppercase hover:text-latao">
                  Gerenciar cookies
                </button>
              </li>
              {FOOTER_SOON.map((s) => (
                <li key={s} aria-disabled="true" className="text-papel/40">
                  {s} · em breve
                </li>
              ))}
            </ul>
            <div className="space-y-2 font-label text-[11px] tracking-[0.15em] text-papel/60 uppercase">
              <p>{C.rodape.redes.join(' / ')}</p>
              <p>{C.rodape.pagamentos}</p>
              <p className="normal-case">{C.rodape.sac}</p>
              <p>{C.rodape.empresa}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
