import { useMemo, useState } from 'react'
import { ARCHETYPES } from '@/data/archetypes'
import { KIT_TIERS, REWARD_FREIGHT, REWARD_MINI } from '@/data/home'
import { useCart } from '@/context/CartContext'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Só body splash em estoque entra no kit — Imperador é perfume 50 ml
// e Zeus está em lista de espera (ver CLAUDE.md, regra 8).
const PICKABLE = ARCHETYPES.filter((a) => a.tipo === 'Body splash' && a.status === 'ok')

function tierFor(qtd: number) {
  if (qtd <= 0) return null
  if (qtd === 1) return KIT_TIERS[0]
  if (qtd === 2) return KIT_TIERS[1]
  return KIT_TIERS[2]
}

export function KitBuilder() {
  const { addItem } = useCart()
  const [counts, setCounts] = useState<Record<string, number>>({})

  const qtd = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts])
  const tier = tierFor(qtd)
  const total = tier ? qtd * tier.unit : 0

  const progress = Math.min(100, (total / REWARD_FREIGHT) * 100)
  const hasMini = total >= REWARD_MINI
  const hasFreight = total >= REWARD_FREIGHT

  let msg = 'Adicione para desbloquear recompensas'
  if (hasFreight) msg = 'Miniatura grátis + frete grátis desbloqueados'
  else if (hasMini) msg = `Faltam ${brl(REWARD_FREIGHT - total)} para o frete grátis`
  else if (total > 0) msg = `Faltam ${brl(REWARD_MINI - total)} para a miniatura grátis`

  function add(id: string) {
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  }
  function remove(id: string) {
    setCounts((c) => {
      const next = { ...c }
      if (!next[id]) return c
      next[id] -= 1
      if (next[id] <= 0) delete next[id]
      return next
    })
  }

  function addKitToCart() {
    if (!tier) return
    for (const [id, n] of Object.entries(counts)) {
      const a = PICKABLE.find((p) => p.id === id)
      if (!a) continue
      addItem(
        { key: `${a.id}-kit`, archetypeId: a.id, label: `${a.nome} · ${a.vol}`, variant: a.vol, unitPrice: tier.unit },
        n,
      )
    }
    setCounts({})
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {KIT_TIERS.map((t) => (
          <div
            key={t.qtd}
            className={`relative rounded-lg border p-3 text-center ${
              tier?.qtd === t.qtd ? 'border-latao bg-papel' : 'border-linha-2'
            }`}
          >
            {t.qtd === 3 && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-latao px-2 py-0.5 font-mono text-[8px] tracking-wider text-papel">
                MAIS ESCOLHIDO
              </span>
            )}
            <span className="block font-display text-lg">{t.qtd}</span>
            <span className="mt-1 block text-xs font-medium">{t.label}</span>
            <span className="mt-0.5 block font-mono text-[9px] text-tinta-3 uppercase">
              {t.meta}
            </span>
            <span className="mt-2 block font-display text-base">{brl(t.unit)}/un</span>
            {t.economia && (
              <span className="mt-0.5 block font-mono text-[9px] text-ok">
                Economize {brl(t.economia)}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 font-mono text-[10px] tracking-widest text-tinta-3 uppercase">
        Escolha os seus
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {PICKABLE.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg border border-linha-2 p-2.5">
            <span className="size-6 shrink-0 rounded-full" style={{ background: a.cor }} />
            <span className="flex-1 text-sm">
              {a.nome}
              <span className="block font-mono text-[9px] text-tinta-3">
                {a.cod} · {a.vol}
              </span>
            </span>
            {counts[a.id] > 0 && (
              <>
                <button
                  onClick={() => remove(a.id)}
                  aria-label={`Remover ${a.nome}`}
                  className="size-7 rounded-full border border-linha-2 text-sm"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm">{counts[a.id]}</span>
              </>
            )}
            <button
              onClick={() => add(a.id)}
              aria-label={`Adicionar ${a.nome}`}
              className="size-7 rounded-full border border-linha-2 text-sm"
            >
              +
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="h-1.5 rounded-full bg-linha">
          <div
            className="h-1.5 rounded-full bg-latao transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[8.5px] text-tinta-3 uppercase">
          <span className={hasMini ? 'text-ok' : ''}>{brl(REWARD_MINI)} · miniatura grátis</span>
          <span className={hasFreight ? 'text-ok' : ''}>{brl(REWARD_FREIGHT)} · frete grátis</span>
        </div>
        <p className="mt-2 text-center font-mono text-[9.5px] tracking-wide text-tinta-2 uppercase">
          {msg}
        </p>
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-linha pt-4">
        <span className="font-mono text-[10px] tracking-widest text-tinta-3 uppercase">
          Seu kit: {qtd} {qtd === 1 ? 'arquétipo' : 'arquétipos'}
        </span>
        <span className="font-display text-xl">{qtd > 0 ? brl(total) : '—'}</span>
      </div>
      <button
        disabled={qtd === 0}
        onClick={addKitToCart}
        className="mt-4 w-full rounded-lg bg-tinta py-4 text-sm font-medium text-papel disabled:opacity-40"
      >
        Adicionar kit à sacola
      </button>
    </div>
  )
}
