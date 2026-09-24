import { useNavigate } from 'react-router-dom'
import { ECON } from '@/data/economics'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { KitPurchase, brl } from '@/components/KitPurchase'

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
  const navigate = useNavigate()

  return (
    <div>
      {/* seção de compra (mesmo componente do pop-up da home) */}
      <KitPurchase />

      <section className="mt-8 bg-papel-2 px-4 py-8">
        <Eyebrow>Como funciona o crédito</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Três passos, sem
          <br />
          letra miúda
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-3">
              <span className="font-label text-xs text-latao-texto">{s.n}</span>
              <div>
                <b className="text-sm">{s.title}</b>
                <p className="mt-0.5 text-sm text-tinta-2">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-8">
        <Eyebrow>Antes de comprar</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">
          Já sabe o seu
          <br />
          arquétipo?
        </h2>
        <div className="mt-4 flex flex-col gap-2.5">
          <button onClick={() => navigate('/')} className="w-full rounded-lg bg-tinta py-4 text-sm font-medium text-papel">
            Já sei o meu — ver os nove
          </button>
        </div>
      </section>
    </div>
  )
}
