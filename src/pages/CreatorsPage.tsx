import { useState } from 'react'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import { comissaoTexto } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { Reveal } from '@/components/ui/Reveal'
import { CutFrame } from '@/components/ui/CutFrame'
import { SweepCta } from '@/components/ui/SweepCta'
import { DEGRAU_CLARO, DEGRAU_ESCURO, Flor, Glow, SectionEyebrow } from '@/components/ui/Editorial'
// gerada no Higgsfield (GPT Image 2.5) com as fotos de produto como referência — pessoa não existe; trocar por criador(a) real
import creatorsHero from '@/assets/fotos/criadores-hero.jpg'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { comMarca, useSeo } from '@/lib/seo'

const HOW_IT_WORKS = [
  { n: '01', title: 'Aplique escolhendo um arquétipo', body: 'Um só — é ele que você vai representar, gravar e recomendar.' },
  { n: '02', title: 'Aguarde a aprovação', body: 'Avaliamos fit de conteúdo e disponibilidade do arquétipo escolhido.' },
  { n: '03', title: 'Receba a amostra e o briefing', body: 'Frasco do seu arquétipo, ângulos que funcionam e o que não fazer.' },
  { n: '04', title: 'Grave do seu jeito e ganhe por venda', body: 'Seu link, sua comissão, pagamento em D+30 via Pix.' },
]

const MATERIALS = [
  'Amostra física do arquétipo escolhido, em casa',
  'Briefing de tom e glifo — o que combina com aquela energia',
  'Ângulos e ganchos que já converteram para outros criadores',
  'Link e cupom próprios, rastreados por venda',
  'Painel com ranking e status de pagamento',
]

// Ilustrativo — mesmo padrão do H-17 da home. Não é medição real: a seção "Quem já vende" fica escondida
// (SHOW_RANKING) até existir programa rodando com números reais.
const SHOW_RANKING = false
const RANKING_STATS = [
  { v: '42', label: 'criadoras ativas na categoria feminina' },
  { v: '31', label: 'criadores ativos na categoria masculina' },
  { v: '18%', label: 'taxa média de conversão por link, entre os 10 melhores' },
  { v: 'D+30', label: 'prazo médio até o primeiro pagamento' },
]

const GAINS = [
  { v: comissaoTexto, label: ['de comissão', 'por venda'] },
  { v: 'Grátis', label: ['amostra do seu', 'arquétipo'] },
  { v: 'D+30', label: ['pagamento', 'via Pix'] },
]

export function CreatorsPage() {
  useSeo({
    title: comMarca('Programa de Criadores'),
    description:
      'Faça parte do programa de criadores da Arquétypus: indique nossos Body Splash Premium para a sua comunidade e ganhe comissão por venda. Candidate-se.',
    path: '/criadores',
  })
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const a = picked ? getArchetype(picked) : undefined

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function goToForm(e: React.MouseEvent) {
    e.preventDefault()
    document.getElementById('cr-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="-mb-24">
      {/* Hero — escuro, como o topo da home. Celular: foto cheia que se dissolve no noite, texto embaixo.
          lg: texto à esquerda sobre o noite, foto à direita dissolvendo pra esquerda */}
      <section className="relative isolate overflow-hidden bg-noite text-papel-inv lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2">
        <Glow className="-top-20 -left-24 -z-10 size-80 lg:size-[28rem]" forca={14} />
        <div className="relative lg:order-last">
          <MediaSlot
            aspect="4/5"
            bg="#F0EAE4"
            src={creatorsHero}
            requisito="FOTO · 4:5 · 1600×2000 · CRIADOR(A) SEGURANDO UM FRASCO · LUZ NATURAL"
            // lg: a foto preenche a coluna (altura da tela) — ! vence o aspectRatio inline
            className="rounded-none border-0 lg:absolute! lg:inset-0 lg:aspect-auto! lg:h-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] lg:hidden"
            style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-noite) 55%, transparent) 55%, var(--color-noite))' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[35%] lg:block"
            style={{ background: 'linear-gradient(to left, transparent, color-mix(in srgb, var(--color-noite) 55%, transparent) 60%, var(--color-noite))' }}
          />
        </div>

        <div className="relative -mt-16 px-6 pb-14 md:px-10 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:py-20 lg:pr-16 xl:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <SectionEyebrow dark>Para criadores</SectionEyebrow>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] lg:text-6xl xl:text-7xl">
            Um arquétipo.
            <br />
            <span className="text-latao">O seu, de verdade.</span>
          </h1>
          <div aria-hidden className="mt-6 flex max-w-xs items-center gap-2">
            <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--color-latao), transparent)' }} />
            <span className="size-1 rotate-45 bg-latao" />
          </div>
          <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-papel-inv/75 lg:text-lg">
            Você não vende o catálogo inteiro — representa um dos nove, com amostra grátis e
            comissão em cada venda pelo seu link.
          </p>
          <a
            href="#cr-form"
            onClick={goToForm}
            className="mt-8 block w-full rounded-full border border-papel-inv/30 bg-papel-inv/10 py-4 text-center text-xs font-medium tracking-wide text-papel-inv uppercase backdrop-blur-sm transition-colors duration-300 hover:border-latao hover:bg-papel-inv/15 lg:mt-10 lg:w-auto lg:self-start lg:px-12"
          >
            Quero ser criador
          </a>
        </div>
      </section>

      {/* O que você ganha — claro, abaixo do hero (degrau), números num card de moldura recortada */}
      <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <Flor style={{ bottom: '-60px', right: '-80px', width: '240px', transform: 'rotate(-30deg)' }} />
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <div className="lg:col-span-5">
            <SectionEyebrow>O que você ganha</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Comissão, amostra
              <br />
              <span className="text-latao-texto">e pagamento rápido</span>
            </h2>
          </div>
          <CutFrame cut={14} className="mt-8 lg:col-span-7 lg:mt-0" innerClassName="bg-papel">
            <dl className="grid grid-cols-3 py-8 lg:py-12">
              {GAINS.map((g, i) => (
                <div key={g.v} className={`flex flex-col items-center text-center ${i > 0 ? 'border-l border-linha' : ''}`}>
                  <dt className="order-last mt-3 font-label text-[8.5px] leading-relaxed tracking-[0.16em] text-tinta-3 uppercase lg:mt-4 lg:text-[10px]">
                    {g.label[0]}
                    <br />
                    {g.label[1]}
                  </dt>
                  <dd className="font-display text-[30px] leading-none font-light text-latao-texto lg:text-6xl">{g.v}</dd>
                </div>
              ))}
            </dl>
          </CutFrame>
        </div>
      </Reveal>

      {/* O processo — escuro, por cima (degrau invertido), lista editorial numerada */}
      <Reveal as="section" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-14 text-papel-inv md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_ESCURO} animateContent>
        <Glow className="-top-24 -right-24 size-72 lg:size-96" forca={20} />
        <div className="relative md:mx-auto md:max-w-3xl lg:max-w-7xl">
          <SectionEyebrow dark>O processo</SectionEyebrow>
          <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
            Do formulário
            <br />
            <span className="text-latao">à primeira venda</span>
          </h2>
          <ol className="mt-8 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-x-10">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.n} className="flex gap-4 border-t border-papel-inv/10 py-5 last:border-b lg:flex-col lg:gap-5 lg:border-papel-inv/20 lg:pt-6 lg:pb-0 lg:last:border-b-0">
                <span aria-hidden className="w-6 shrink-0 pt-1 font-label text-[10px] tracking-widest text-latao lg:w-auto lg:pt-0 lg:font-display lg:text-5xl lg:font-light lg:tracking-normal">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] leading-snug lg:text-2xl lg:leading-[1.25]">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-papel-inv/60 lg:mt-3 lg:text-[15px]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* A regra — claro, citação editorial centralizada */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-6 pt-16 pb-16 text-center md:px-10 lg:pt-28 lg:pb-28" style={DEGRAU_CLARO}>
        <Flor style={{ top: '-40px', left: '-90px', width: '260px', transform: 'rotate(150deg)' }} />
        <div className="relative mx-auto max-w-4xl">
          <SectionEyebrow center>A regra</SectionEyebrow>
          <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
            Por que só <span className="text-latao-texto">um arquétipo</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[34ch] font-display text-[21px] leading-[1.45] text-tinta italic lg:mt-12 lg:max-w-[46ch] lg:text-[30px] lg:leading-[1.4]">
            Quem carrega o catálogo inteiro não é ninguém em especial. Quem carrega um só vira
            referência dele — o conteúdo fica mais verdadeiro e você não compete com outro criador
            vendendo a mesma coisa que você.
          </p>
          <div aria-hidden className="mx-auto mt-8 flex w-24 items-center gap-2 lg:mt-12">
            <span className="h-px flex-1 bg-latao/60" />
            <span className="size-1 rotate-45 bg-latao" />
            <span className="h-px flex-1 bg-latao/60" />
          </div>
        </div>
      </Reveal>

      {/* Quem já vende — escuro, números grandes em latão (escondido: dado ilustrativo, ver SHOW_RANKING) */}
      {SHOW_RANKING && (
      <Reveal as="section" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-14 text-papel-inv md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_ESCURO} animateContent>
        <Glow className="bottom-0 -left-20 size-72 lg:size-96" forca={14} />
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <SectionEyebrow dark>Quem já vende</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
              30 a 60 criadores
              <br />
              <span className="text-latao">por categoria</span>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:mt-0 lg:grid-cols-4 lg:gap-x-8">
              {RANKING_STATS.map((s) => (
                <div key={s.label} className="flex flex-col border-t border-papel-inv/15 pt-4 lg:pt-6">
                  <dt className="order-last mt-2 text-[12px] leading-relaxed text-papel-inv/60 lg:mt-3 lg:text-sm">{s.label}</dt>
                  <dd className="font-display text-[34px] leading-none font-light text-latao lg:text-6xl">{s.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-label text-[8.5px] tracking-[0.18em] text-papel-inv/35 uppercase">Planejamento interno · dado ilustrativo</p>
          </div>
        </div>
      </Reveal>
      )}

      {/* O que você recebe — claro, lista com losango latão */}
      <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <SectionEyebrow>O que você recebe</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Kit de mídia
              <br />
              <span className="text-latao-texto">do seu arquétipo</span>
            </h2>
          </div>
          <ul className="mt-8 lg:col-span-8 lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-x-12">
            {MATERIALS.map((m) => (
              <li key={m} className="flex items-baseline gap-4 border-b border-linha py-4 text-[15px] leading-snug text-tinta lg:py-5 lg:text-base">
                <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rotate-45 bg-latao" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Aplicação — escuro (fecha a página), formulário num card claro de moldura recortada */}
      <Reveal as="section" id="cr-form" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-24 text-papel-inv md:px-10 lg:pt-24 lg:pb-32" style={DEGRAU_ESCURO} animateContent>
        <Glow className="-top-16 right-[10%] size-72 lg:size-96" forca={16} />
        <Glow className="bottom-10 -left-24 size-64" forca={10} />
        <div className="relative md:mx-auto md:max-w-3xl lg:max-w-6xl">
          <div className="text-center">
            <SectionEyebrow dark center>Aplicação</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
              Escolha o seu <span className="text-latao">arquétipo</span>
            </h2>
          </div>

          <CutFrame cut={14} className="mt-10 lg:mt-14" innerClassName="bg-papel px-5 py-7 text-tinta lg:grid lg:grid-cols-2 lg:gap-14 lg:px-14 lg:py-14">
            <div>
              <Eyebrow>1 · Seu arquétipo</Eyebrow>
              <div className="mt-4 grid grid-cols-3 gap-2 lg:gap-3">
                {ARCHETYPES.map((arq) => {
                  const on = picked === arq.id
                  return (
                    <button
                      key={arq.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPicked(arq.id)}
                      className={`rounded-lg border px-1 py-3 text-center transition-colors lg:py-4 ${
                        on ? 'border-latao bg-papel-2' : 'border-linha-2 hover:border-latao/60'
                      }`}
                      style={on ? { boxShadow: `inset 0 0 0 1px ${arq.cor}` } : undefined}
                    >
                      <span
                        className="mx-auto mb-2 block size-5 rounded-full lg:size-6"
                        style={{ background: arq.cor, opacity: arq.status === 'wait' ? 0.4 : 1 }}
                      />
                      <b className="font-display text-[15px] font-normal lg:text-base">
                        {arq.nome}
                        <Sobrenome a={arq} />
                      </b>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 font-label text-[9.5px] tracking-[0.14em] text-latao-texto uppercase">
                {a
                  ? `Você vai representar: ${a.nome}${a.status === 'wait' ? ' · em lista de espera junto com o arquétipo' : ''}`
                  : 'Nenhum arquétipo selecionado'}
              </p>
            </div>

            <div className="mt-8 border-t border-linha pt-7 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
              <Eyebrow>2 · Seus dados</Eyebrow>
              {submitted ? (
                <p className="mt-5 font-display text-xl leading-snug text-tinta">
                  Aplicação enviada. Avaliamos e voltamos por WhatsApp.
                </p>
              ) : (
                // sem backend ainda: o submit só muda estado local (ver CLAUDE.md)
                <form onSubmit={submit} className="mt-4 flex flex-col gap-5">
                  {[
                    { label: 'Nome', type: 'text', placeholder: 'Seu nome', required: true, autoComplete: 'name' },
                    { label: 'WhatsApp', type: 'tel', placeholder: 'DDD + número', required: true, autoComplete: 'tel-national' },
                    { label: 'Rede social', type: 'text', placeholder: '@ do seu Instagram ou TikTok', required: true },
                    { label: 'Portfólio (opcional)', type: 'url', placeholder: 'Link de um vídeo seu', required: false },
                  ].map((f) => (
                    <label key={f.label} className="block">
                      <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{f.label}</span>
                      <input
                        required={f.required}
                        type={f.type}
                        placeholder={f.placeholder}
                        autoComplete={f.autoComplete}
                        className="mt-1.5 block w-full border-b border-linha-2 bg-transparent pb-2.5 text-[15px] text-tinta placeholder:text-tinta-3/70 focus:border-latao focus:outline-none"
                      />
                    </label>
                  ))}
                  <div className="mt-2 text-center lg:text-left">
                    <SweepCta type="submit" disabled={!picked} className="lg:w-auto lg:px-10">
                      Enviar aplicação
                    </SweepCta>
                  </div>
                </form>
              )}
            </div>
          </CutFrame>
        </div>
      </Reveal>
    </div>
  )
}
