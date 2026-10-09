import { useState } from 'react'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import { comissaoTexto } from '@/data/economics'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SweepCta } from '@/components/ui/SweepCta'
import { DEGRAU_CLARO, Glow, Ornament, SectionEyebrow } from '@/components/ui/Editorial'
// gerada no Higgsfield (GPT Image 2.5) com as fotos de produto como referência — pessoa não existe; trocar por criador(a) real
import creatorsHero from '@/assets/fotos/criadores-hero.jpg?responsiva'
import cetim from '@/assets/fotos/texturas/cetim.jpg?responsiva'
import { foto } from '@/lib/foto'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { IconeArquetipo } from '@/components/ui/IconeArquetipo'

const CETIM = foto(cetim)

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

/**
 * /criadores — redesenho editorial (out/2026, pedido do usuário: "mais editorial e sofisticada", no tom do site
 * atual). Sai o vaivém de blocos escuros com brilho/flor/moldura recortada (identidade antiga); entra a linguagem
 * da PDP: fundos creme alternados (papel / papel-2) com degrau, títulos display com segunda linha em itálico
 * latão, filetes e ornamento dourados, foto emoldurada. A citação "A regra" vai num banner de cetim, como o
 * "Combina com" da PDP. Textos iguais aos de antes (nenhuma copy nova).
 */
export function CreatorsPage() {
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const a = picked ? getArchetype(picked) : undefined

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="-mb-24">
      {/* Hero — claro. A foto cobre a metade direita inteira (desktop) e se dissolve no creme por um degradê suave no
          lado esquerdo; no celular cobre o topo e se dissolve pra baixo. Texto à esquerda / embaixo */}
      <section className="relative isolate overflow-hidden bg-papel-2 lg:min-h-[calc(100svh-5rem)]">
        <Glow className="-top-24 -left-24 -z-10 size-80 lg:size-[32rem]" forca={10} />
        <div className="relative aspect-[4/5] w-full md:aspect-[16/11] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
          <MediaSlot
            aspect="auto"
            bg="#F0EAE4"
            src={foto(creatorsHero)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            prioridade
            alt="Pessoa gravando um vídeo com o celular enquanto apresenta o Body Splash Premium Afrodite First Kiss, com o Cleópatra Nile Rose sobre a mesa"
            requisito="FOTO · 4:5 · 1600×2000 · CRIADOR(A) SEGURANDO UM FRASCO · LUZ NATURAL"
            className="absolute! inset-0 rounded-none [&_img]:object-[50%_30%]"
          />
          {/* degradê na cor do fundo: celular pra baixo, desktop no lado esquerdo da foto */}
          <div
            aria-hidden
            className="absolute inset-0 lg:hidden"
            style={{ background: 'linear-gradient(to bottom, transparent 45%, color-mix(in srgb, var(--color-papel-2) 40%, transparent) 68%, color-mix(in srgb, var(--color-papel-2) 85%, transparent) 86%, var(--color-papel-2) 100%)' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden lg:block"
            style={{ background: 'linear-gradient(to left, transparent 55%, color-mix(in srgb, var(--color-papel-2) 35%, transparent) 75%, color-mix(in srgb, var(--color-papel-2) 80%, transparent) 90%, var(--color-papel-2) 100%)' }}
          />
        </div>
        <div className="relative mx-auto -mt-20 grid max-w-7xl px-5 pb-14 md:px-10 lg:mt-0 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:items-center lg:py-16">
          <div className="text-center lg:col-span-6 lg:text-left">
            {/* centrado no celular, alinhado à esquerda (só o filete da frente) no desktop */}
            <div className="lg:[&>div]:justify-start lg:[&>div>span:last-child]:hidden">
              <SectionEyebrow center>Para criadores</SectionEyebrow>
            </div>
            <h1 className="mt-5 font-display text-[44px] leading-[1.02] text-tinta lg:text-6xl xl:text-7xl">
              Um arquétipo.
              <br />
              <span className="text-latao-texto italic">O seu, de verdade.</span>
            </h1>
            <Ornament className="mx-auto mt-7 w-28 lg:mx-0 lg:mt-9" />
            <p className="mx-auto mt-6 max-w-[40ch] text-[15px] leading-relaxed text-tinta-2 lg:mx-0 lg:text-lg">
              Você não vende o catálogo inteiro — representa um dos nove, com amostra grátis e
              comissão em cada venda pelo seu link.
            </p>
            {/* mesmo desenho do botão de compra da PDP (BotaoComprar): dourado cheio, sombra dourada, brilho periódico
                que passa também no hover (.cta-compra-sheen) e sobe 1 px */}
            <button
              type="button"
              onClick={() => document.getElementById('cr-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative isolate mt-8 w-full max-w-sm overflow-hidden rounded-lg bg-latao py-4 text-[13px] font-semibold tracking-[0.14em] text-papel uppercase shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--color-latao)_90%,black)] transition-[box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_18px_36px_-12px_color-mix(in_srgb,var(--color-latao)_100%,transparent)] active:translate-y-0 active:scale-[0.985] lg:mt-10 lg:w-auto lg:px-14 lg:text-[15px]"
            >
              <span aria-hidden className="cta-compra-sheen pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2" />
              Quero ser criador
            </button>
          </div>
        </div>
      </section>

      {/* O que você ganha — claro, centrado: três números grandes separados por filetes latão */}
      <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <div className="relative mx-auto max-w-6xl text-center">
          <SectionEyebrow center>O que você ganha</SectionEyebrow>
          <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
            Comissão, amostra
            <br />
            <span className="text-latao-texto italic">e pagamento rápido</span>
          </h2>
          <dl className="mt-10 grid grid-cols-3 divide-x divide-latao/30 border-y border-latao/30 py-8 lg:mt-16 lg:py-14">
            {GAINS.map((g) => (
              <div key={g.v} className="flex flex-col items-center px-2">
                <dt className="order-last mt-3 font-label text-[8.5px] leading-relaxed tracking-[0.18em] text-tinta-3 uppercase lg:mt-5 lg:text-[10px]">
                  {g.label[0]}
                  <br />
                  {g.label[1]}
                </dt>
                <dd className="font-display text-[24px] leading-none text-balance text-latao-texto min-[390px]:text-[26px] sm:text-[34px] lg:text-7xl">{g.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* O processo — claro (papel-2): quatro passos com numeral grande em itálico latão; no desktop uma linha
          fina liga os números, no celular a linha desce pela esquerda */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO} animateContent>
        <div className="relative md:mx-auto md:max-w-3xl lg:max-w-7xl">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div>
              <SectionEyebrow>O processo</SectionEyebrow>
              <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
                Do formulário
                <br />
                <span className="text-latao-texto italic">à primeira venda</span>
              </h2>
            </div>
          </div>
          <ol className="relative mt-10 border-l border-latao/40 pl-6 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-x-10 lg:border-t lg:border-l-0 lg:pt-10 lg:pl-0">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.n} className="relative pb-8 last:pb-0 lg:pb-0">
                {/* ponto na linha: à esquerda no celular, em cima no desktop */}
                <span aria-hidden className="absolute top-2 -left-[1.6rem] size-2 rotate-45 bg-latao lg:-top-[2.85rem] lg:left-0" />
                <span aria-hidden className="block font-display text-[34px] leading-none text-latao-texto italic lg:text-6xl">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-[20px] leading-snug text-tinta lg:mt-5 lg:text-2xl lg:leading-[1.25]">{s.title}</h3>
                <p className="mt-1.5 max-w-[34ch] text-[13px] leading-relaxed text-tinta-2 lg:mt-3 lg:text-[15px]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* A regra — citação num banner de cetim (como o "Combina com" da PDP), flutuando sobre o creme */}
      <Reveal as="section" className="relative overflow-hidden bg-papel px-4 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <div className="relative mx-auto max-w-[100rem] overflow-hidden rounded-3xl bg-papel-2 px-6 py-14 text-center shadow-[0_24px_50px_-28px_rgba(40,46,41,0.45)] ring-1 ring-latao/25 lg:px-16 lg:py-24">
          <img
            src={CETIM.src}
            srcSet={CETIM.srcSet || undefined}
            sizes="100vw"
            alt=""
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative mx-auto max-w-4xl">
            <SectionEyebrow center>A regra</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Por que só <span className="text-latao-texto italic">um arquétipo?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-[34ch] font-display text-[21px] leading-[1.45] text-tinta italic lg:mt-12 lg:max-w-[46ch] lg:text-[30px] lg:leading-[1.4]">
              Quem carrega o catálogo inteiro não é ninguém em especial. Quem carrega um só vira
              referência dele — o conteúdo fica mais verdadeiro e você não compete com outro criador
              vendendo a mesma coisa que você.
            </p>
            <Ornament className="mx-auto mt-8 w-24 lg:mt-12" />
          </div>
        </div>
      </Reveal>

      {/* Quem já vende — escondido: dado ilustrativo, ver SHOW_RANKING */}
      {SHOW_RANKING && (
        <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
          <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <SectionEyebrow>Quem já vende</SectionEyebrow>
              <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
                30 a 60 criadores
                <br />
                <span className="text-latao-texto italic">por categoria</span>
              </h2>
            </div>
            <div className="lg:col-span-8">
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:mt-0 lg:grid-cols-4 lg:gap-x-8">
                {RANKING_STATS.map((s) => (
                  <div key={s.label} className="flex flex-col border-t border-latao/30 pt-4 lg:pt-6">
                    <dt className="order-last mt-2 text-[12px] leading-relaxed text-tinta-2 lg:mt-3 lg:text-sm">{s.label}</dt>
                    <dd className="font-display text-[34px] leading-none text-latao-texto lg:text-6xl">{s.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 font-label text-[8.5px] tracking-[0.18em] text-tinta-3 uppercase">Planejamento interno · dado ilustrativo</p>
            </div>
          </div>
        </Reveal>
      )}

      {/* O que você recebe — claro (papel-2), título à esquerda, lista numerada à direita com filetes */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <SectionEyebrow>O que você recebe</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Kit de mídia
              <br />
              <span className="text-latao-texto italic">do seu arquétipo</span>
            </h2>
          </div>
          <ol className="mt-8 border-t border-latao/30 lg:col-span-7 lg:mt-0">
            {MATERIALS.map((m, i) => (
              <li key={m} className="flex items-baseline gap-5 border-b border-latao/30 py-4 text-[15px] leading-snug text-tinta lg:gap-8 lg:py-5 lg:text-[17px]">
                <span aria-hidden className="w-6 shrink-0 font-display text-lg text-latao-texto italic lg:text-xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {m}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Aplicação — claro, fecha a página: cartão creme com contorno dourado. À esquerda o arquétipo (cards com o
          ícone do arquétipo e o nome na cor dele), à direita os dados */}
      <Reveal as="section" id="cr-form" className="relative overflow-hidden bg-papel px-4 pt-14 pb-24 md:px-10 lg:pt-24 lg:pb-32" style={DEGRAU_CLARO}>
        <Glow className="top-1/3 left-1/2 size-80 -translate-x-1/2 lg:size-[36rem]" forca={8} />
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <SectionEyebrow center>Aplicação</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Escolha o seu <span className="text-latao-texto italic">arquétipo</span>
            </h2>
            <Ornament className="mx-auto mt-6 w-24 lg:mt-8" />
          </div>

          <div className="mt-10 rounded-3xl bg-papel-2 px-4 py-7 text-tinta shadow-[0_30px_60px_-36px_rgba(40,46,41,0.5)] ring-1 ring-latao/30 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-14 lg:px-14 lg:py-14">
            <div className="lg:col-span-7">
              <p className="font-label text-[10px] tracking-[0.2em] text-latao-texto uppercase">1 · Seu arquétipo</p>
              <div className="mt-4 grid grid-cols-3 gap-2 lg:gap-3">
                {ARCHETYPES.map((arq) => {
                  const on = picked === arq.id
                  return (
                    <button
                      key={arq.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPicked(arq.id)}
                      className={`flex flex-col items-center rounded-xl border bg-papel px-1 pt-3 pb-3 text-center transition-[border-color,box-shadow] duration-300 lg:pt-4 ${
                        on ? 'border-latao shadow-[0_10px_24px_-14px_color-mix(in_srgb,var(--color-latao)_100%,transparent)]' : 'border-linha-2 hover:border-latao/60'
                      }`}
                    >
                      {/* ícone do arquétipo: medalhão dourado com o símbolo na cor dele (IconeArquetipo) */}
                      <span
                        className={`block transition-transform duration-300 ${on ? 'scale-105' : ''} ${arq.status === 'wait' ? 'opacity-40' : ''}`}
                        style={{ color: arq.cor }}
                      >
                        <IconeArquetipo id={arq.id} className="size-10 lg:size-12" />
                      </span>
                      <b className="mt-2.5 font-display text-[17px] leading-tight font-normal lg:text-xl" style={{ color: arq.cor }}>
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

            <div className="mt-8 border-t border-latao/30 pt-7 lg:col-span-5 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
              <p className="font-label text-[10px] tracking-[0.2em] text-latao-texto uppercase">2 · Seus dados</p>
              {submitted ? (
                <p className="mt-5 font-display text-xl leading-snug text-tinta italic">
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
                    <SweepCta type="submit" disabled={!picked} className="max-w-none! border-latao! lg:w-full">
                      Enviar aplicação
                    </SweepCta>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
