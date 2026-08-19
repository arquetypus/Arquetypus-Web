import { Link, Navigate, useParams } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { Reveal } from '@/components/ui/Reveal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function ArchetypePage() {
  const { id } = useParams<{ id: string }>()
  const a = id ? getArchetype(id) : undefined
  const par = a ? getArchetype(a.par) : undefined

  if (!a) return <Navigate to="/" replace />

  return (
    <div>
      {/* Hero fullbleed */}
      <section
        className="flex min-h-[70svh] flex-col justify-end px-4 pt-24 pb-10"
        style={{ background: a.bg }}
      >
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: a.cor }}>
          {a.cod} · Energia {a.energia}
        </p>
        <h1 className="mt-2 font-display text-6xl leading-[0.95]" style={{ color: a.cor }}>
          {a.nome}
        </h1>
        <p className="mt-3 font-display text-lg text-tinta-2 italic">{a.ep}</p>
      </section>

      {/* Quem é */}
      <Reveal as="section" className="bg-papel px-4 py-10">
        <p className="font-mono text-[10px] tracking-[0.18em] text-tinta-3 uppercase">
          Quem é {a.seg === 'M' ? 'o' : 'a'} {a.nome}
        </p>
        {a.quem.map((p, i) => (
          <p key={i} className="mt-4 text-lg leading-loose">
            {p}
          </p>
        ))}
      </Reveal>

      {/* O que isso tem a ver com cheiro */}
      <Reveal as="section" className="px-4 py-10" style={{ background: a.bg }}>
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: a.cor }}>
          O que isso tem a ver com cheiro
        </p>
        {a.cheiro.map((p, i) => (
          <p key={i} className="mt-4 text-lg leading-loose">
            {p}
          </p>
        ))}
      </Reveal>

      {/* Pirâmide olfativa visual */}
      <Reveal as="section" className="bg-papel px-4 py-10">
        <p className="font-mono text-[10px] tracking-[0.18em] text-latao uppercase">
          Pirâmide olfativa
        </p>
        <div className="mt-5 overflow-hidden rounded-lg border border-linha-2">
          {[
            { label: 'Topo', notas: a.topo, mix: 30 },
            { label: 'Coração', notas: a.coracao, mix: 60 },
            { label: 'Fundo', notas: a.fundo, mix: 100 },
          ].map((faixa) => (
            <div
              key={faixa.label}
              className="flex items-center justify-between gap-3 px-4 py-4"
              style={{ background: `color-mix(in srgb, ${a.bg} ${faixa.mix}%, var(--color-papel))` }}
            >
              <span className="font-mono text-[9px] tracking-widest text-tinta uppercase">
                {faixa.label}
              </span>
              <span className="text-right text-sm text-tinta">{faixa.notas}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Layering */}
      {par && (
        <Reveal as="section" className="px-4 py-10" style={{ background: a.bg }}>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: a.cor }}>
            Layering
          </p>
          <h2 className="mt-2 font-display text-2xl">
            Combina com {par.nome}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-tinta-2">{a.layer}</p>
          <Link
            to={`/arquetipos/${par.id}`}
            className="mt-5 flex items-center gap-3 rounded-lg border border-linha-2 bg-papel p-3"
          >
            <span className="size-8 shrink-0 rounded-full" style={{ background: par.bg }} />
            <span>
              <span className="flex items-center gap-1.5 font-display text-base">
                <span className="size-2 rounded-full" style={{ background: par.cor }} />
                {par.nome}
              </span>
              <span className="mt-0.5 block text-xs text-tinta-3">{par.ep}</span>
            </span>
          </Link>
        </Reveal>
      )}

      {/* CTA final */}
      <Reveal as="section" className="bg-papel px-4 py-10">
        {a.status === 'wait' ? (
          <div className="rounded-lg bg-papel-2 p-4">
            <p className="font-medium">{a.nome} ainda não despertou</p>
            <p className="mt-2 text-sm text-tinta-2">
              A fórmula está em reformulação. Entre na lista e você é avisado antes de qualquer
              outra pessoa.
            </p>
            <input
              type="email"
              placeholder="seu@email.com"
              className="mt-3 w-full rounded-md border border-linha-2 bg-papel px-3 py-2 text-sm"
            />
            <button className="mt-2 w-full rounded-lg bg-tinta py-3 text-sm font-medium tracking-wide text-papel uppercase">
              Avise-me quando despertar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl">{brl(a.preco)}</span>
              <span className="font-mono text-[10px] text-latao">6x de {brl(a.preco / 6)}</span>
            </div>
            <Link
              to={`/loja/${a.id}`}
              className="mt-4 block w-full rounded-lg bg-tinta py-4 text-center text-sm font-medium tracking-wide text-papel uppercase"
            >
              Ver {a.nome} na loja
            </Link>
          </>
        )}
        <Link
          to="/teste"
          className="mt-4 block text-center text-sm text-tinta-2 underline decoration-linha-2 underline-offset-4"
        >
          Não sei se é o meu — fazer o teste
        </Link>
      </Reveal>
    </div>
  )
}
