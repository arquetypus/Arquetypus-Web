import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import {
  COMPARISON,
  DIAGNOSIS,
  ENERGIES,
  FAMILIES,
  JOURNAL,
  METHOD_STEPS,
  PUV,
  QUALIFICATION,
  SEALS,
  SEGMENTS,
  STATS,
  UGC_VIDEOS,
} from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { KitBuilder } from '@/components/KitBuilder'
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/ui/Reveal'
import { scrollToId } from '@/lib/scrollToId'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const SEGMENT_TINT: Record<'F' | 'M' | 'U', string> = {
  F: 'var(--color-afrodite)',
  M: 'var(--color-guerreiro)',
  U: 'var(--color-zeus)',
}

/** Faixa curta que suaviza a transição de bg-papel para bg-noite. */
function DarkTransition() {
  return <div className="h-8 bg-gradient-to-b from-papel to-noite" aria-hidden />
}

export function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    scrollToId(hash.slice(1))
  }, [hash])

  return (
    <div className="relative -mt-12">
      {/* H-03 Hero — carrossel sticky, card sobe por cima */}
      <HeroCarousel />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-papel">
        {/* H-04 PUV */}
        <section className="px-4 py-5">
          <p className="text-base leading-relaxed text-tinta-2">
            <b className="text-tinta">Body splash de perfumaria</b> {PUV.replace('Body splash de perfumaria', '')}
          </p>
        </section>

        {/* H-05 Selos — strip horizontal */}
        <section className="flex items-center justify-center gap-4 border-y border-linha px-4 py-3">
          {SEALS.map((s) => (
            <span key={s} className="font-mono text-[9px] tracking-widest text-tinta-3 uppercase">
              {s}
            </span>
          ))}
        </section>

        {/* H-06 Diagnóstico */}
        <Reveal as="section" className="bg-papel-2 px-4 py-8">
          <Eyebrow>Antes de tudo</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Você já comprou um
            <br />
            cheiro que não era seu?
          </h2>
          <div className="mt-5 flex flex-col gap-5">
            {DIAGNOSIS.map((d) => (
              <div key={d.n} className="flex gap-4">
                <span className="font-display text-4xl text-linha-2">{d.n}</span>
                <div className="pt-1">
                  <b className="text-base">{d.title}</b>
                  <p className="mt-1 text-sm text-tinta-2">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* H-08 Segmentação */}
        <Reveal as="section" id="segmentos" className="flex flex-col items-center gap-3 px-4 py-6">
          {SEGMENTS.map((seg) => (
            <button
              key={seg.name}
              onClick={() => scrollToId('catalogo')}
              className="block w-[80%] overflow-hidden rounded-2xl border border-linha-2 text-left transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: `color-mix(in srgb, ${SEGMENT_TINT[seg.seg]} 12%, var(--color-papel))` }}
            >
              <MediaSlot aspect="16/9" bg="transparent" requisito={`LIFESTYLE · ${seg.label.toUpperCase()}`} className="rounded-none border-x-0 border-t-0" />
              <div className="p-4">
                <span className="block font-mono text-[9px] tracking-widest text-tinta-3 uppercase">
                  {seg.label}
                </span>
                <span className="mt-1 block font-display text-2xl">{seg.name}</span>
                <span className="mt-1 block font-mono text-[9px] text-tinta-3">{seg.meta}</span>
                <span className="mt-3 inline-block rounded-full border border-linha-2 px-6 py-2.5 text-xs font-medium">
                  Ver coleção
                </span>
              </div>
            </button>
          ))}
        </Reveal>

        {/* H-09 Por família */}
        <Reveal as="section" className="py-6">
          <div className="px-4">
            <Eyebrow>Entrada racional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Descubra por família</h2>
          </div>
          <div className="scroll-pad mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {FAMILIES.map((f) => (
              <button
                key={f.nome}
                onClick={() => scrollToId('catalogo')}
                className="w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-linha-2 text-left transition-transform hover:scale-[1.02]"
              >
                <MediaSlot aspect="4/5" requisito={`ATMOSFERA · ${f.nome.toUpperCase()}`} className="rounded-none border-x-0 border-t-0" />
                <div className="p-3">
                  <b className="font-display text-base">{f.nome}</b>
                  <span className="mt-0.5 block text-xs text-tinta-2">
                    {f.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}
                  </span>
                  <span className="mt-2 flex gap-1">
                    {f.arquetipos.map((id) => (
                      <span
                        key={id}
                        className="size-3 rounded-full"
                        style={{ background: getArchetype(id)?.cor }}
                      />
                    ))}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {/* H-10 Por energia */}
        <Reveal as="section" className="bg-papel-2 py-6">
          <div className="px-4">
            <Eyebrow>Entrada emocional</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">
              Que energia você
              <br />
              quer despertar?
            </h2>
          </div>
          <div className="scroll-pad mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {ENERGIES.map((e) => (
              <button
                key={e.nome}
                onClick={() => scrollToId('catalogo')}
                className="w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-linha-2 bg-papel text-left transition-transform hover:scale-[1.02]"
              >
                <MediaSlot aspect="4/5" requisito={`ATMOSFERA · ${e.nome.toUpperCase()}`} className="rounded-none border-x-0 border-t-0" />
                <div className="p-3">
                  <b className="font-display text-base">{e.nome}</b>
                  <span className="mt-0.5 block text-xs text-tinta-2">
                    {e.arquetipos.map((id) => getArchetype(id)?.nome).join(' · ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        {/* H-11 Qualificação */}
        <Reveal as="section" className="px-4 py-6">
          <Eyebrow>Reconhecimento</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Arquetypus é para
            <br />
            você se…
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {QUALIFICATION.map((q) => (
              <li key={q} className="flex gap-2.5 text-sm">
                <span className="mt-0.5 text-ok">✓</span>
                {q}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* H-12 Método */}
        <Reveal as="section" className="bg-papel-2 px-4 py-8">
          <Eyebrow>O método</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Três passos até
            <br />
            o seu cheiro
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {METHOD_STEPS.map((m) => (
              <div key={m.n} className="flex gap-3">
                <span className="font-mono text-xs text-latao">{m.n}</span>
                <div>
                  <b className="text-sm">{m.title}</b>
                  <p className="mt-0.5 text-sm text-tinta-2">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/teste"
            className="mt-5 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
          >
            Fazer o teste
          </Link>
        </Reveal>

        <DarkTransition />

        {/* H-13 Grade dos 9 (fundido com H-07 bodegón) */}
        <Reveal as="section" id="catalogo" className="bg-noite py-8" animateContent>
          <MediaSlot
            aspect="16/10"
            bg="#2a2a27"
            requisito="BODEGÓN DOS 9 FRASCOS"
            className="rounded-none border-x-0 border-t-0"
            dark
          />
          <div className="px-4 pt-6 pb-3">
            <Eyebrow className="text-latao">O catálogo</Eyebrow>
            <h2 className="mt-2.5 font-display text-3xl text-papel-inv">
              Nove arquétipos.
              <br />
              Um sistema.
            </h2>
            <p className="mt-2 text-sm text-papel-inv/60">
              Dois perfumes e sete body splashes construídos sobre quatro energias.
            </p>
          </div>
          <div className="scroll-pad flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {ARCHETYPES.map((a) => (
              <Link
                key={a.id}
                to={`/arquetipos/${a.id}`}
                className="w-44 shrink-0 snap-start rounded-lg border border-linha-2 bg-papel shadow-lg transition-transform hover:scale-[1.02]"
              >
                <div
                  className="relative flex aspect-[4/5] items-end overflow-hidden rounded-t-lg p-2.5"
                  style={{ background: a.bg }}
                >
                  <span
                    className="pointer-events-none absolute -bottom-2 -left-1 font-display text-[3rem] leading-none tracking-tight opacity-10"
                    style={{ color: a.cor }}
                  >
                    {a.nome}
                  </span>
                  <span className="relative font-mono text-[8px] text-tinta-2">{a.cod}</span>
                  {a.status === 'wait' && (
                    <span className="absolute top-1.5 right-1.5 rounded bg-papel/80 px-1 py-0.5 font-mono text-[7px] text-alerta uppercase">
                      Em breve
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="flex items-center gap-1.5 font-display text-base">
                    <span className="size-2.5 rounded-full" style={{ background: a.cor }} />
                    {a.nome}
                  </p>
                  <p className="mt-1 font-mono text-[8px] tracking-wide text-tinta-3 uppercase">
                    {a.fam}
                    <br />
                    {a.tipo} · {a.vol}
                  </p>
                  <p className="mt-1.5 text-sm">
                    {a.status === 'wait' ? 'Avise-me →' : brl(a.preco)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* H-15 Kit Descoberta */}
        <Reveal as="section" id="kit">
          <MediaSlot aspect="16/10" bg="#EFEDE8" requisito="9 MINIS NA MÃO · ESCALA REAL" className="rounded-none border-x-0" />
          <div className="px-4 py-6">
            <Eyebrow>Antes de escolher</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Kit Descoberta</h2>
            <p className="mt-2 text-sm text-tinta-2">
              Nove miniaturas de 8 ml. <em className="font-display italic">O valor volta</em> como crédito na compra do tamanho cheio.
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl">R$ 79,90</span>
              <span className="font-mono text-[10px] text-latao uppercase">Crédito integral</span>
            </div>
            <Link
              to="/kit-descoberta"
              className="mt-4 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
            >
              Quero experimentar
            </Link>
          </div>
        </Reveal>

        {/* H-16 Escada de preço / kit builder */}
        <Reveal as="section" className="bg-papel-2 px-4 py-8">
          <Eyebrow>Monte o seu</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Quanto mais arquétipos,
            <br />
            menos você paga por um
          </h2>
          <div className="mt-5">
            <KitBuilder />
          </div>
        </Reveal>

        {/* H-17 Números de percepção */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Teste com 120 pessoas · 21 dias</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            O que elas
            <br />
            perceberam
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {STATS.map((st) => (
              <div key={st.label}>
                <span className="block font-display text-5xl tracking-tight text-latao">{st.pct}</span>
                <span className="mt-2 block text-sm leading-snug text-tinta-2">{st.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[8.5px] text-tinta-3">
            AUTOAVALIAÇÃO · N=120 · JUL/2026 · DADO ILUSTRATIVO NO PROTÓTIPO
          </p>
        </Reveal>

        <DarkTransition />

        {/* H-18 Comparativo */}
        <Reveal as="section" className="bg-noite px-4 py-8" animateContent>
          <Eyebrow>A diferença</Eyebrow>
          <h2 className="mt-2.5 font-display text-3xl text-papel-inv">
            Nem todo splash
            <br />
            entrega a mesma coisa
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <h4 className="font-display text-base text-papel-inv">Arquetypus</h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {COMPARISON.arquetypus.map((c) => (
                  <li key={c} className="flex gap-2 text-[11px] text-papel-inv/80">
                    <span className="mt-0.5 text-ok">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-base text-papel-inv/50">Splash comum</h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {COMPARISON.comum.map((c) => (
                  <li key={c} className="flex gap-2 text-[11px] text-papel-inv/40">
                    <span className="mt-0.5 text-alerta/60">✗</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center font-display text-lg text-papel-inv italic">
            Não é apenas um body splash.
            <br />É Arquetypus.
          </p>
        </Reveal>

        {/* H-19 Comunidade */}
        <Reveal as="section" className="py-8">
          <div className="px-4">
            <Eyebrow>A comunidade</Eyebrow>
            <h2 className="mt-2.5 font-display text-2xl">Quem já despertou</h2>
          </div>
          <div className="scroll-pad mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {UGC_VIDEOS.map((v) => {
              const arq = getArchetype(v.archetypeId)
              if (!arq) return null
              return (
                <div key={v.creator} className="w-[70%] shrink-0 snap-start">
                  <MediaSlot aspect="9/16" requisito={`VÍDEO 9:16 · ${v.creator}`} className="rounded-b-none" />
                  <Link
                    to={`/loja/${arq.id}`}
                    className="flex items-center gap-2.5 rounded-b-lg border border-t-0 border-linha-2 bg-papel p-2.5 transition-transform hover:scale-[1.02]"
                  >
                    <span className="size-8 shrink-0 rounded-full" style={{ background: arq.bg }} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 font-display text-sm">
                        <span className="size-2 rounded-full" style={{ background: arq.cor }} />
                        {arq.nome}
                      </span>
                      <span className="block text-xs text-tinta-3">{brl(arq.preco)}</span>
                    </span>
                  </Link>
                  <p className="mt-2 text-xs italic text-tinta-2">“{v.testimonial}”</p>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 px-4">
            <span className="text-latao">★★★★★</span>
            <span className="text-xs text-tinta-2">4,8 · 2.147 avaliações</span>
          </div>
        </Reveal>

        <DarkTransition />

        {/* H-20 Garantia */}
        <Reveal as="section" className="bg-noite px-4 py-12 text-center" animateContent>
          <div className="font-display text-7xl text-papel-inv/15">30</div>
          <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-latao uppercase">
            Dias de garantia
          </p>
          <h2 className="mt-4 font-display text-2xl text-papel-inv">
            Se não for o seu cheiro,
            <br />
            <em>é por nossa conta</em>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-papel-inv/60">
            Use, cheire, teste na sua pele. Se não for você, devolvemos o valor.
            <br />Sem perguntas, sem julgamento. Mesmo com o frasco aberto.
          </p>
        </Reveal>

        {/* H-21 Seja criador */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Para criadores</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            Ganhe vendendo
            <br />
            o seu arquétipo
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <b className="block font-display text-xl">20%</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                de comissão
                <br />
                por venda
              </span>
            </div>
            <div>
              <b className="block font-display text-xl">Grátis</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                amostra para
                <br />
                aprovados
              </span>
            </div>
            <div>
              <b className="block font-display text-xl">D+30</b>
              <span className="font-mono text-[8px] text-tinta-3 uppercase">
                pagamento
                <br />
                via Pix
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm text-tinta-2">
            Você recebe o kit, grava do seu jeito e ganha em cada venda pelo seu link. Materiais,
            ângulos que funcionam e ranking de criadores no painel.
          </p>
          <Link
            to="/criadores"
            className="mt-4 inline-block rounded-full border border-linha-2 px-6 py-2.5 text-xs font-medium"
          >
            Quero ser criador
          </Link>
        </Reveal>

        <DarkTransition />

        {/* H-22 Diário olfativo */}
        <Reveal as="section" id="diario" className="bg-noite px-4 py-8" animateContent>
          <Eyebrow>Entenda</Eyebrow>
          <h2 className="mt-2.5 font-display text-3xl text-papel-inv">Diário olfativo</h2>
          <div className="mt-5 flex flex-col gap-4">
            {JOURNAL.map((j) => (
              <div key={j.title} className="flex gap-3">
                <span className="text-latao">→</span>
                <div>
                  <b className="text-sm text-papel-inv">{j.title}</b>
                  <p className="mt-0.5 text-sm text-papel-inv/70">{j.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* H-23 Captura com cupom */}
        <Reveal as="section" className="px-4 py-8">
          <Eyebrow>Primeira compra</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            15% no seu
            <br />
            primeiro arquétipo
          </h2>
          <p className="mt-2 text-sm text-tinta-2">Cupom no e-mail, lançamentos antes de todo mundo.</p>
          <form className="mt-4 flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="seu@email.com"
              aria-label="E-mail"
              className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
            />
            <input
              type="tel"
              placeholder="WhatsApp (DDD + número)"
              aria-label="WhatsApp"
              className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
            />
            <button className="rounded-lg bg-tinta py-3.5 text-sm font-medium tracking-wide text-papel uppercase">
              Quero meu cupom
            </button>
          </form>
        </Reveal>

        {/* H-24 Rodapé */}
        <footer className="bg-noite px-4 py-10">
          <p className="text-center font-display text-2xl tracking-wide text-papel-inv">
            ARQUETYPUS
          </p>
          <p className="mt-1 text-center font-display text-xs text-papel-inv/40 italic">
            Perfumaria de arquétipos
          </p>

          <nav className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-papel-inv/60">
            <Link to="/#catalogo" className="hover:text-papel-inv">Os 9 arquétipos</Link>
            <Link to="/kit-descoberta" className="hover:text-papel-inv">Kit Descoberta</Link>
            <Link to="/teste" className="hover:text-papel-inv">Teste de arquétipo</Link>
            <Link to="/criadores" className="hover:text-papel-inv">Seja criador</Link>
            <Link to="/#diario" className="hover:text-papel-inv">Diário olfativo</Link>
            <span className="text-papel-inv/30">Trocas e devoluções</span>
            <span className="text-papel-inv/30">Privacidade</span>
            <span className="text-papel-inv/30">Termos</span>
          </nav>

          <div className="mt-8 flex justify-center gap-5 text-xs text-papel-inv/40">
            <span>Instagram</span>
            <span>TikTok</span>
            <span>Pinterest</span>
          </div>

          <div className="mt-6 border-t border-papel-inv/10 pt-4 text-center font-mono text-[8px] tracking-wider text-papel-inv/30 uppercase">
            <p>Pix · Visa · Master · Elo · Boleto</p>
            <p className="mt-2">
              sac@arquetypus.com.br · Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
