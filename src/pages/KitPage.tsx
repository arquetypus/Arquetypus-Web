import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { segmentPool } from '@/data/archetypes'
import { ECON } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { useCart } from '@/context/CartContext'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type Variante = 'todos' | 'F' | 'M'

const VARIANTES: { key: Variante; label: string; meta: string }[] = [
  { key: 'todos', label: 'Completo', meta: '9 minis' },
  { key: 'F', label: 'Feminino', meta: '5 minis' },
  { key: 'M', label: 'Masculino', meta: '4 minis' },
]

const STEPS = [
  {
    n: '01',
    title: `Compre o kit por ${brl(ECON.kitPreco)}`,
    body: 'Chegam os nove — ou os cinco/quatro da sua variante — em frascos de 8 ml, prontos pra testar na sua pele, não no pulso de outra pessoa.',
  },
  {
    n: '02',
    title: 'Descubra qual é o seu',
    body: 'Teste os nove ao longo dos dias que quiser. Sem prazo de validade pro crédito, sem pressa.',
  },
  {
    n: '03',
    title: `Leve o tamanho cheio com os ${brl(ECON.kitPreco)} abatidos`,
    body: 'O valor que você pagou no kit sai inteiro do preço do splash ou perfume — em qualquer um dos nove, não só no que você testou primeiro.',
  },
]

export function KitPage() {
  const [variante, setVariante] = useState<Variante>('todos')
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
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
    <div>
      <MediaSlot
        aspect="4/5"
        bg="#EFEDE8"
        requisito="FOTO · 4:5 · 1600×2000 · OS 9 MINIS ALINHADOS · ESCALA REAL"
        className="rounded-none border-x-0 border-t-0"
      />
      <div className="px-4 py-6">
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

      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>Como funciona o crédito</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Três passos, sem
          <br />
          letra miúda
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {STEPS.map((s) => (
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

      <section className="px-4 py-8">
        <Eyebrow>Escolha a sua variante</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Completo, feminino
          <br />
          ou masculino
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {VARIANTES.map((v) => (
            <button
              key={v.key}
              onClick={() => setVariante(v.key)}
              className={`rounded-lg border p-3 text-center ${variante === v.key ? 'border-tinta' : 'border-linha-2'}`}
            >
              <b className="block text-sm">{v.label}</b>
              <span className="mt-0.5 block font-mono text-[9px] text-tinta-3 uppercase">
                {v.meta}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-center font-mono text-[10px] text-latao uppercase">
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

      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>Antes de comprar</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Já sabe o seu
          <br />
          arquétipo?
        </h2>
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-lg bg-tinta py-4 text-sm font-medium text-papel"
          >
            Já sei o meu — ver os nove
          </button>
          <Link
            to="/teste"
            className="block w-full rounded-lg border border-linha-2 py-4 text-center text-sm font-medium"
          >
            Não sei — fazer o teste
          </Link>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl">{brl(ECON.kitPreco)}</span>
          <span className="font-mono text-[10px] text-latao uppercase">
            Crédito integral no tamanho cheio
          </span>
        </div>
        <button
          onClick={addToCart}
          className="mt-4 w-full rounded-lg bg-tinta py-4 text-sm font-medium text-papel"
        >
          {added ? 'Adicionado ✓' : 'Adicionar kit à sacola'}
        </button>
      </section>
    </div>
  )
}
