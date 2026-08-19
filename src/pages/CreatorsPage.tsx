import { useState } from 'react'
import { ARCHETYPES, getArchetype } from '@/data/archetypes'
import { ECON } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'

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

// Ilustrativo — mesmo padrão do H-17 da home. Não é medição real.
const RANKING_STATS = [
  { v: '42', label: 'criadoras ativas na categoria feminina' },
  { v: '31', label: 'criadores ativos na categoria masculina' },
  { v: '18%', label: 'taxa média de conversão por link, entre os 10 melhores' },
  { v: 'D+30', label: 'prazo médio até o primeiro pagamento' },
]

export function CreatorsPage() {
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const a = picked ? getArchetype(picked) : undefined

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <MediaSlot
        aspect="4/5"
        bg="#F0EAE4"
        requisito="FOTO · 4:5 · 1600×2000 · CRIADOR(A) SEGURANDO UM FRASCO · LUZ NATURAL"
        className="rounded-none border-x-0 border-t-0"
      />
      <div className="px-4 py-6">
        <Eyebrow>Para criadores</Eyebrow>
        <h1 className="mt-2.5 font-display text-3xl leading-[1.1]">
          Um arquétipo.
          <br />O seu, de verdade.
        </h1>
        <p className="mt-3 text-sm text-tinta-2">
          Você não vende o catálogo inteiro — representa um dos nove, com amostra grátis e
          comissão em cada venda pelo seu link.
        </p>
        <a
          href="#cr-form"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('cr-form')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-4 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium text-papel"
        >
          Quero ser criador
        </a>
      </div>

      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>O que você ganha</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Comissão, amostra
          <br />e pagamento rápido
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div>
            <b className="block font-display text-2xl">{Math.round(ECON.comissaoPct * 100)}%</b>
            <span className="font-mono text-[8px] text-tinta-3 uppercase">
              de comissão
              <br />
              por venda
            </span>
          </div>
          <div>
            <b className="block font-display text-2xl">Grátis</b>
            <span className="font-mono text-[8px] text-tinta-3 uppercase">
              amostra do seu
              <br />
              arquétipo
            </span>
          </div>
          <div>
            <b className="block font-display text-2xl">D+30</b>
            <span className="font-mono text-[8px] text-tinta-3 uppercase">
              pagamento
              <br />
              via Pix
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <Eyebrow>O processo</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Do formulário
          <br />à primeira venda
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="flex gap-3">
              <span className="font-mono text-xs text-latao">{s.n}</span>
              <div>
                <b className="text-sm">{s.title}</b>
                <p className="mt-0.5 text-sm text-tinta-2">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>A regra</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Por que só
          <br />
          um arquétipo
        </h2>
        <p className="mt-3 text-sm text-tinta-2">
          Quem carrega o catálogo inteiro não é ninguém em especial. Quem carrega um só vira
          referência dele — o conteúdo fica mais verdadeiro e você não compete com outro criador
          vendendo a mesma coisa que você.
        </p>
      </section>

      <section className="px-4 py-8">
        <Eyebrow>Quem já vende</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          30 a 60 criadores
          <br />
          por categoria
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {RANKING_STATS.map((s) => (
            <div key={s.label}>
              <span className="block font-display text-2xl text-latao">{s.v}</span>
              <span className="mt-1 block text-xs text-tinta-2">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[8.5px] text-tinta-3">
          PLANEJAMENTO INTERNO · DADO ILUSTRATIVO
        </p>
      </section>

      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>O que você recebe</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Kit de mídia
          <br />
          do seu arquétipo
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {MATERIALS.map((m) => (
            <li key={m} className="flex gap-2.5 text-sm">
              <span className="mt-0.5 text-ok">✓</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section id="cr-form" className="px-4 py-8">
        <Eyebrow>Aplicação</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Escolha o seu
          <br />
          arquétipo
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {ARCHETYPES.map((arq) => (
            <button
              key={arq.id}
              type="button"
              onClick={() => setPicked(arq.id)}
              className={`rounded-lg border p-2.5 text-center ${picked === arq.id ? 'border-tinta' : 'border-linha-2'}`}
            >
              <span
                className="mx-auto mb-1.5 block size-5 rounded-full"
                style={{ background: arq.cor, opacity: arq.status === 'wait' ? 0.4 : 1 }}
              />
              <b className="text-xs">{arq.nome}</b>
            </button>
          ))}
        </div>
        <p className="mt-2.5 font-mono text-[10px] text-latao uppercase">
          {a
            ? `Você vai representar: ${a.nome}${a.status === 'wait' ? ' · em lista de espera junto com o arquétipo' : ''}`
            : 'Nenhum arquétipo selecionado'}
        </p>

        {submitted ? (
          <p className="mt-5 rounded-lg bg-papel-2 p-4 text-sm">
            Aplicação enviada. Avaliamos e voltamos por WhatsApp.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 flex flex-col gap-2.5">
            <input required type="text" placeholder="Nome" aria-label="Nome" className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm" />
            <input required type="tel" placeholder="WhatsApp (DDD + número)" aria-label="WhatsApp" className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm" />
            <input required type="text" placeholder="@ do seu Instagram ou TikTok" aria-label="Rede social" className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm" />
            <input type="url" placeholder="Link de um vídeo seu (opcional)" aria-label="Link de portfólio" className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm" />
            <button disabled={!picked} className="mt-1 rounded-lg bg-tinta py-3.5 text-sm font-medium text-papel disabled:opacity-40">
              Enviar aplicação
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
