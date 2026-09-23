import { useMemo, useState } from 'react'
import { segmentPool } from '@/data/archetypes'
import { ECON } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { RatioTag } from '@/components/ui/RatioTag'
import { useCart } from '@/context/CartContext'
import kit9Minis from '@/assets/mocks/kit-9-minis.jpg'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type Variante = 'todos' | 'F' | 'M'

const VARIANTES: { key: Variante; label: string; meta: string }[] = [
  { key: 'todos', label: 'Completo', meta: '9 minis' },
  { key: 'F', label: 'Feminino', meta: '5 minis' },
  { key: 'M', label: 'Masculino', meta: '4 minis' },
]

/**
 * Seção de compra do Kit Descoberta: foto, título, variante, minis incluídos,
 * preço e comprar. Usada na página /kit-descoberta e no pop-up aberto a partir
 * da home — mesma fonte, sem duplicar.
 */
export function KitPurchase() {
  const [variante, setVariante] = useState<Variante>('todos')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const pool = useMemo(() => segmentPool(variante), [variante])
  const variantLabel = VARIANTES.find((v) => v.key === variante)!.label

  function addToCart() {
    addItem({
      key: `kit-${variante}`,
      archetypeId: 'kit',
      label: `Kit Descoberta · ${variantLabel}`,
      variant: variantLabel,
      unitPrice: ECON.kitPreco,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="relative">
        <img
          src={kit9Minis}
          alt="Os nove minis de 8 ml do Kit Descoberta enfileirados sobre linho claro"
          className="aspect-[4/5] w-full object-cover"
        />
        <RatioTag />
      </div>
      <div className="px-4 pt-6">
        <Eyebrow>Antes de escolher o seu tamanho</Eyebrow>
        <h1 className="mt-2.5 font-display text-3xl leading-[1.1]">
          Nove miniaturas.
          <br />O valor volta inteiro.
        </h1>
        <p className="mt-3 text-sm text-tinta-2">
          8 ml de cada um dos nove arquétipos. {brl(ECON.kitPreco)}. O que você pagar aqui vira
          crédito integral quando levar o primeiro tamanho cheio.
        </p>
      </div>

      <section className="px-4 pt-6">
        <Eyebrow>Escolha a sua variante</Eyebrow>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {VARIANTES.map((v) => (
            <button
              key={v.key}
              onClick={() => setVariante(v.key)}
              className={`rounded-lg border p-3 text-center ${variante === v.key ? 'border-tinta' : 'border-linha-2'}`}
            >
              <b className="block text-sm">{v.label}</b>
              <span className="mt-0.5 block font-mono text-[9px] text-tinta-3 uppercase">{v.meta}</span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-center font-mono text-[10px] text-latao-texto uppercase">
          {brl(ECON.kitPreco)} · mesmo preço nas três
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {pool.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-linha-2 p-2.5">
              <span
                className="size-7 shrink-0 rounded-full"
                style={{ background: a.cor, opacity: a.status === 'wait' ? 0.4 : 1 }}
              />
              <span className="flex-1 text-sm">
                {a.nome}
                <span className="block font-mono text-[9px] text-tinta-3">
                  {a.cod} · {a.fam}
                </span>
              </span>
              <span className="font-mono text-[9px] text-tinta-3 uppercase">8 ml</span>
            </div>
          ))}
        </div>
      </section>

      {/* preço + comprar — sacola desativada, ver CLAUDE.md */}
      <section className="px-4 pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl">{brl(ECON.kitPreco)}</span>
          <span className="font-mono text-[10px] text-latao-texto uppercase">Crédito integral no tamanho cheio</span>
        </div>
        <p className="mt-1 text-xs text-tinta-2">
          {brl(ECON.kitPreco * 0.95)} no Pix · ou 6x de {brl(ECON.kitPreco / 6)} sem juros
        </p>
        <button
          disabled
          onClick={addToCart}
          className="mt-4 w-full rounded-lg bg-tinta py-4 text-sm font-medium text-papel opacity-40"
        >
          {added ? 'Adicionado ✓' : 'Em breve'}
        </button>
      </section>
    </>
  )
}
