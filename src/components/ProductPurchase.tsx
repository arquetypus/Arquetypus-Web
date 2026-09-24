import { useMemo, useState } from 'react'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import pdpAfrodite from '@/assets/mocks/pdp-afrodite.png'
import pdpImperatriz from '@/assets/mocks/pdp-imperatriz.png'
import pdpCleopatra from '@/assets/mocks/pdp-cleopatra.png'
import pdpFada from '@/assets/mocks/pdp-fada.png'
import pdpSereia from '@/assets/mocks/pdp-sereia.png'
import pdpZeus from '@/assets/mocks/pdp-zeus.png'
import pdpGuerreiro from '@/assets/mocks/pdp-guerreiro.png'
import pdpImperador from '@/assets/mocks/pdp-imperador.png'
import pdpFenix from '@/assets/mocks/pdp-fenix.png'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const PDP_IMG: Record<string, string> = {
  afrodite: pdpAfrodite,
  imperatriz: pdpImperatriz,
  cleopatra: pdpCleopatra,
  fada: pdpFada,
  sereia: pdpSereia,
  zeus: pdpZeus,
  guerreiro: pdpGuerreiro,
  imperador: pdpImperador,
  fenix: pdpFenix,
}

const MINI_PRICE = 19.9
const NECESSAIRE_PRICE = 24.9

/**
 * Seção de compra do arquétipo (P-02 a P-09): galeria/notas, identidade,
 * variante, preço, comprar, selos e complementos. Usada na PDP (/loja/:id)
 * e no pop-up de compra aberto a partir da home — mesma fonte, sem duplicar.
 * `status: 'wait'` (Zeus) nunca vende: mostra lista de espera no lugar de
 * variante/preço/comprar (regra 8 do CLAUDE.md).
 */
export function ProductPurchase({ a }: { a: Archetype }) {
  const par = getArchetype(a.par)
  const { addItem } = useCart()
  const isPerfume = a.tipo === 'Perfume'
  const isWait = a.status === 'wait'

  const variants = useMemo(() => {
    if (isPerfume) return [{ key: 'full', label: a.vol, meta: 'Perfume', price: a.preco }]
    return [
      { key: 'mini', label: '8 ml', meta: 'Mini', price: MINI_PRICE },
      { key: 'full', label: a.vol, meta: 'Splash', price: a.preco },
    ]
  }, [a, isPerfume])

  const [variant, setVariant] = useState(variants[variants.length - 1]?.key ?? 'full')
  const [showNotes, setShowNotes] = useState(false)
  const [addonPar, setAddonPar] = useState(false)
  const [addonNecessaire, setAddonNecessaire] = useState(false)
  const [added, setAdded] = useState(false)

  const selected = variants.find((v) => v.key === variant) ?? variants[0]
  const pix = selected.price * 0.95

  function addToCart() {
    addItem({
      key: `${a.id}-${selected.key}`,
      archetypeId: a.id,
      label: `${a.nome} · ${selected.label}`,
      variant: selected.label,
      unitPrice: selected.price,
    })
    if (addonPar && par) {
      addItem({
        key: `${par.id}-full-addon`,
        archetypeId: par.id,
        label: `${par.nome} · ${par.vol}`,
        variant: par.vol,
        unitPrice: par.preco,
      })
    }
    if (addonNecessaire) {
      addItem({
        key: 'necessaire',
        archetypeId: a.id,
        label: `Necessaire Arquétypus · ${a.nome}`,
        variant: 'Único',
        unitPrice: NECESSAIRE_PRICE,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <p className="px-4 pt-3 font-label text-[9px] tracking-widest text-tinta-3 uppercase">
        {a.energia} / {a.cod} / {a.nome}
      </p>

      {/* P-02 Galeria + notas */}
      <section className="mt-2 px-4">
        <div className="relative">
          <MediaSlot
            aspect="1/1"
            bg={a.bg}
            src={PDP_IMG[a.id]}
            requisito={`FOTO · 1:1 · 1200×1200 · FRASCO · ${a.nome.toUpperCase()}`}
          />
          {showNotes && (
            <div className="absolute inset-0 flex flex-col justify-center rounded-lg bg-papel/95 p-5">
              <Eyebrow>Notas olfativas · {a.cod}</Eyebrow>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <b>Topo</b>
                  <span className="text-right text-tinta-2">{a.topo}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <b>Coração</b>
                  <span className="text-right text-tinta-2">{a.coracao}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <b>Base</b>
                  <span className="text-right text-tinta-2">{a.fundo}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setShowNotes(false)}
            className={`rounded-full border px-3 py-1.5 font-label text-[9px] tracking-wide uppercase ${!showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
          >
            Frasco
          </button>
          <button
            onClick={() => setShowNotes(true)}
            className={`rounded-full border px-3 py-1.5 font-label text-[9px] tracking-wide uppercase ${showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
          >
            Notas
          </button>
        </div>
      </section>

      {/* P-03/04 Identidade + frase */}
      <section className="px-4 pt-5">
        <Eyebrow>
          {a.cod} · Energia {a.energia}
        </Eyebrow>
        <h1 className="mt-1.5 font-display text-3xl" style={{ color: a.cor }}>
          {a.nome}
        </h1>
        <p className="mt-3 font-display text-lg italic">{a.card}</p>
      </section>

      {isWait ? (
        /* Zeus: lista de espera, nunca venda */
        <section className="mt-5 px-4">
          <p className="rounded-lg border border-linha-2 p-4 text-sm text-tinta-2">
            <b className="block font-label text-[10px] tracking-[0.18em] text-alerta uppercase">Em breve</b>
            <span className="mt-1.5 block">
              {a.nome} ainda não está à venda. Entre na lista de espera para saber quando chegar.
            </span>
          </p>
          <button
            disabled
            className="mt-3 w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase opacity-40"
          >
            Entrar na lista · em breve
          </button>
        </section>
      ) : (
        <>
          {/* P-05 Variante */}
          <section className="mt-5 px-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${variants.length}, 1fr)` }}>
              {variants.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setVariant(v.key)}
                  className={`rounded-lg border p-3 text-center ${variant === v.key ? 'border-tinta' : 'border-linha-2'}`}
                >
                  <b className="block text-sm">{v.label}</b>
                  <span className="mt-0.5 block font-label text-[9px] text-tinta-3 uppercase">
                    {v.meta} · {brl(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* P-06 Preço */}
          <section className="mt-4 px-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl">{brl(selected.price)}</span>
            </div>
            <p className="mt-1 text-xs text-tinta-2">
              {brl(pix)} no Pix · ou 6x de {brl(selected.price / 6)} sem juros
            </p>
            <p className="mt-1.5 font-label text-[10px] text-ok uppercase">● Em estoque e pronto para envio</p>
          </section>

          {/* P-07 Comprar — sacola desativada, ver CLAUDE.md */}
          <section className="mt-4 px-4">
            <button
              disabled
              onClick={addToCart}
              className="w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase opacity-40"
            >
              {added ? 'Adicionado ✓' : 'Em breve'}
            </button>
          </section>
        </>
      )}

      {/* P-08 Selos */}
      <section className="mt-5 grid grid-cols-3 gap-2 px-4 text-center">
        <div className="rounded-md border border-linha-2 p-2 font-label text-[8px] tracking-wide text-tinta-2 uppercase">
          Envio em
          <br />
          24 h úteis
        </div>
        <div className="rounded-md border border-linha-2 p-2 font-label text-[8px] tracking-wide text-tinta-2 uppercase">
          7 dias de
          <br />
          garantia
        </div>
        <div className="rounded-md border border-linha-2 p-2 font-label text-[8px] tracking-wide text-tinta-2 uppercase">
          Pagamento
          <br />
          seguro
        </div>
      </section>

      {/* P-09 Complete sua rotina */}
      {par && !isPerfume && !isWait && (
        <section className="mt-6 px-4">
          <Eyebrow>Complete o ritual</Eyebrow>
          <label className="mt-3 flex items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm">
            <input type="checkbox" checked={addonPar} onChange={(e) => setAddonPar(e.target.checked)} />
            <span>
              {par.nome} {par.vol}
              <span className="block font-label text-[9px] text-tinta-3 uppercase">
                Layering recomendado · +{brl(par.preco)}
              </span>
            </span>
          </label>
          <label className="mt-2 flex items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm">
            <input
              type="checkbox"
              checked={addonNecessaire}
              onChange={(e) => setAddonNecessaire(e.target.checked)}
            />
            <span>
              Necessaire Arquétypus
              <span className="block font-label text-[9px] text-tinta-3 uppercase">
                Estojo em lona com o glifo · +{brl(NECESSAIRE_PRICE)}
              </span>
            </span>
          </label>
        </section>
      )}
    </>
  )
}
