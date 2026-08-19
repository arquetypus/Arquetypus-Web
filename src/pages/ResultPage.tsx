import { Link, Navigate, useLocation } from 'react-router-dom'
import type { QuizResult } from '@/types/archetype'
import { Reveal } from '@/components/ui/Reveal'

export function ResultPage() {
  const location = useLocation()
  const result = location.state as QuizResult | null

  if (!result) return <Navigate to="/teste" replace />

  const { dominante: a, secundario: b, percentualDominante } = result
  const wait = a.status === 'wait'
  const oferta = wait ? b : a

  return (
    <div>
      {/* Revelação */}
      <section
        className="flex min-h-[60svh] flex-col items-center justify-center px-4 py-12 text-center"
        style={{ background: a.bg }}
      >
        <p
          className="reveal-name font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: a.cor, animationDelay: '0.2s', opacity: 0 }}
        >
          {a.cod} · Seu arquétipo dominante
        </p>
        <h1
          className="reveal-name mt-3 font-display text-6xl leading-[0.95]"
          style={{ color: a.cor, animationDelay: '0.5s', opacity: 0 }}
        >
          {a.nome}
        </h1>
        <p
          className="reveal-name mt-4 font-display text-xl italic"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          {a.card}
        </p>
      </section>

      {/* Card compartilhável */}
      <Reveal as="section" className="bg-papel px-4 py-8">
        <p className="font-mono text-[10px] tracking-[0.18em] text-tinta-3 uppercase">
          Card para compartilhar
        </p>
        <div
          className="mt-4 flex aspect-[9/16] w-full max-w-52 flex-col justify-end rounded-2xl p-5"
          style={{ background: a.bg }}
        >
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: a.cor }}>
            Arquetypus · {a.cod}
          </p>
          <p className="mt-2 font-display text-3xl leading-none" style={{ color: a.cor }}>
            {a.nome}
          </p>
          <p className="mt-3 font-display text-sm italic">{a.card}</p>
        </div>
        <button className="mt-4 inline-block rounded-full border border-linha-2 px-6 py-2.5 text-xs font-medium">
          Compartilhar resultado
        </button>
      </Reveal>

      {/* Composição dominante/secundário */}
      <Reveal as="section" className="bg-papel-2 px-4 py-8">
        <h2 className="font-display text-2xl">
          Você é {a.nome}
          <br />
          com traço de {b.nome}
        </h2>
        <div className="mt-5 flex h-3 overflow-hidden rounded-full">
          <div style={{ width: `${percentualDominante}%`, background: a.cor }} />
          <div style={{ width: `${100 - percentualDominante}%`, background: b.cor }} />
        </div>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ background: a.cor }} />
            <b>{a.nome}</b>
            <i className="text-tinta-3 not-italic">Dominante · {percentualDominante}%</i>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ background: b.cor }} />
            <b>{b.nome}</b>
            <i className="text-tinta-3 not-italic">Secundário · {100 - percentualDominante}%</i>
          </div>
        </div>
      </Reveal>

      {/* Layering */}
      <Reveal as="section" className="bg-papel px-4 py-8">
        <p className="font-mono text-[10px] tracking-[0.18em] text-latao uppercase">
          Como usar as duas juntas
        </p>
        <p className="mt-3 text-sm leading-relaxed text-tinta-2">{a.layer}</p>
      </Reveal>

      {/* CTAs */}
      <Reveal as="section" className="bg-papel px-4 pb-10">
        {wait ? (
          <div className="rounded-lg bg-papel-2 p-4">
            <p className="font-medium">{a.nome} ainda não despertou</p>
            <p className="mt-2 text-sm text-tinta-2">
              A fórmula está em reformulação. Enquanto isso, {b.nome} é a leitura mais próxima do
              seu resultado.
            </p>
            <Link
              to={`/arquetipos/${oferta.id}`}
              className="mt-3 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
            >
              Conhecer {oferta.nome}
            </Link>
          </div>
        ) : (
          <Link
            to={`/loja/${a.id}`}
            className="block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
          >
            Ver {a.nome} na loja
          </Link>
        )}
        <Link
          to="/teste"
          className="mt-4 block text-center text-sm text-tinta-2 underline decoration-linha-2 underline-offset-4"
        >
          Refazer o teste
        </Link>
      </Reveal>
    </div>
  )
}
