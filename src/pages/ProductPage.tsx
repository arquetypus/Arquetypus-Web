import { Link, Navigate, useParams } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProductPurchase, brl } from '@/components/ProductPurchase'

const BENEFITS = [
  { n: '01', title: 'Fixação de verdade', body: 'Concentração de 5% com fixador — some do ar, não da pele. Dura o expediente inteiro.' },
  { n: '02', title: 'Leve o bastante para reaplicar', body: 'Não satura. Pode voltar a usar depois da academia, antes do jantar, quando quiser.' },
  { n: '03', title: 'Combina em vez de brigar', body: 'Construído para sobrepor com os outros oito. Camada, não substituição.' },
]

const HOW_TO = [
  { step: 'Passo 1', text: 'Aplique após o banho, com a pele ainda úmida.' },
  { step: 'Passo 2', text: 'Pescoço, pulsos e atrás dos joelhos.' },
  { step: 'Passo 3', text: 'Reaplique quando quiser. É splash, não perfume.' },
]

const FAQ = [
  {
    q: 'Qual a diferença entre body splash e perfume?',
    a: 'O body splash tem concentração menor de essência — no nosso caso 5% — e é feito para o corpo todo, com sensação de frescor e reaplicação livre. O perfume concentra mais e é aplicado em pontos específicos. Um não substitui o outro; muita gente usa os dois em camada.',
  },
  {
    q: 'Quanto tempo dura na pele?',
    a: 'Em média de 4 a 6 horas, variando com o tipo de pele e o clima. Pele hidratada segura mais. Se quiser mais fixação, aplique logo após o banho, com a pele ainda úmida.',
  },
  { q: 'Posso usar todos os dias?', a: 'Sim. É um desodorante corporal de uso diário. Reaplique quando quiser.' },
  {
    q: 'Pode manchar a roupa?',
    a: 'Aplique na pele, não sobre o tecido, e espere secar antes de vestir. Como qualquer produto com álcool e essência, o contato direto com tecidos claros ou delicados pode marcar.',
  },
  {
    q: 'Gestantes e lactantes podem usar?',
    a: 'Recomendamos consultar seu médico antes de usar qualquer cosmético com fragrância durante a gestação e a amamentação.',
  },
  {
    q: 'Tenho pele sensível ou alergia. E agora?',
    a: 'Publicamos o INCI completo na ficha técnica de cada produto, incluindo os alérgenos de fragrância de declaração obrigatória assim que a formulação for confirmada. Faça teste no antebraço 24 h antes do primeiro uso.',
  },
  {
    q: 'Como funciona o teste de arquétipo?',
    a: 'São cinco perguntas sobre você — nenhuma sobre notas olfativas. No fim você recebe seu arquétipo dominante e o secundário, com a fragrância correspondente e a sugestão de como combinar os dois.',
  },
  { q: 'E se eu não gostar do cheiro?', a: 'Você tem 7 dias para devolver, mesmo com o frasco aberto. Sem perguntas.' },
  {
    q: 'Como funciona a entrega?',
    a: 'Envio em até 24 h úteis após a confirmação do pagamento. Frete grátis acima de R$ 199. O prazo aparece no carrinho ao informar o CEP.',
  },
]

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const a = id ? getArchetype(id) : undefined
  const par = a ? getArchetype(a.par) : undefined
  const { addItem } = useCart()

  if (!a) return <Navigate to="/" replace />

  // botão "Em breve" (sacola desativada): leva o tamanho cheio dos dois
  function levarOsDois() {
    if (!par || !a) return
    for (const x of [a, par]) {
      addItem({ key: `${x.id}-full-layer`, archetypeId: x.id, label: `${x.nome} · ${x.vol}`, variant: x.vol, unitPrice: x.preco })
    }
  }

  return (
    <div>
      {/* P-02 a P-09 — seção de compra (mesmo componente do pop-up da home) */}
      <ProductPurchase key={a.id} a={a} />

      {/* P-11 Benefícios */}
      <section className="mt-8 bg-papel-2 px-4 py-8">
        <Eyebrow>Benefícios</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">O que {a.nome} faz por você</h2>
        <div className="mt-5 flex flex-col gap-4">
          {BENEFITS.map((b) => (
            <div key={b.n} className="flex gap-3">
              <span className="font-label text-xs text-latao-texto">{b.n}</span>
              <div>
                <b className="text-sm">{b.title}</b>
                <p className="mt-0.5 text-sm text-tinta-2">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pirâmide olfativa */}
      <details className="border-b border-linha px-4 py-5">
        <summary className="cursor-pointer font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase">
          Pirâmide olfativa
        </summary>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="font-medium">Topo</dt>
            <dd className="text-right text-tinta-2">{a.topo}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium">Coração</dt>
            <dd className="text-right text-tinta-2">{a.coracao}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium">Fundo</dt>
            <dd className="text-right text-tinta-2">{a.fundo}</dd>
          </div>
        </dl>
      </details>

      {/* P-13 Como usar */}
      <details className="border-b border-linha bg-papel-2 px-4 py-5">
        <summary className="cursor-pointer font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase">
          Como usar
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {HOW_TO.map((h) => (
            <div key={h.step} className="rounded-lg border border-linha-2 p-3">
              <b className="font-label text-[9px] tracking-widest text-latao-texto uppercase">{h.step}</b>
              <p className="mt-1 text-sm">{h.text}</p>
            </div>
          ))}
        </div>
      </details>

      {/* P-14 Layering */}
      {par && (
        <section className="px-4 py-8">
          <Eyebrow>Combina com</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">
            {a.nome} + {par.nome}
          </h2>
          <p className="mt-2 text-sm text-tinta-2">{a.layer}</p>
          <button
            disabled
            onClick={levarOsDois}
            className="mt-4 w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase opacity-40"
          >
            Em breve
          </button>
        </section>
      )}

      {/* P-17 FAQ */}
      <section className="bg-papel-2 px-4 py-8">
        <Eyebrow>Dúvidas</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">Perguntas frequentes</h2>
        <div className="mt-4 flex flex-col gap-2">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-lg border border-linha-2 p-3">
              <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-tinta-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* P-18 Ficha técnica */}
      <details className="border-b border-linha px-4 py-5">
        <summary className="cursor-pointer font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase">
          Ficha técnica
        </summary>
        <table className="mt-4 w-full text-sm">
          <tbody>
            <tr className="border-b border-linha">
              <td className="py-2 font-label text-[10px] text-tinta-3 uppercase">Volume</td>
              <td className="py-2 text-right">{a.vol}</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-label text-[10px] text-tinta-3 uppercase">Tipo</td>
              <td className="py-2 text-right">{a.tipo}</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-label text-[10px] text-tinta-3 uppercase">Categoria IFRA</td>
              <td className="py-2 text-right">Cat. 5A · conforme Emenda 51</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-label text-[10px] text-tinta-3 uppercase">ANVISA</td>
              <td className="py-2 text-right">Grau 1 · notificação nº —</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-tinta-2">
          Composição (INCI): Alcohol Denat., Aqua, Parfum (Fragrance), Glycerin, Propylene Glycol.
        </p>
        <p className="mt-2 text-xs text-alerta">
          Os alérgenos de fragrância de declaração obrigatória entram aqui assim que a ficha
          técnica da Scentec for confirmada — ver CLAUDE.md.
        </p>
        <div className="mt-3 rounded-lg bg-papel-2 p-3 text-xs text-tinta-2">
          <b className="text-tinta">Antes do primeiro uso:</b> faça teste de sensibilidade no
          antebraço e aguarde 24 h. Uso externo. Produto alcoólico e inflamável. Não ingerir.
          Manter fora do alcance de crianças.
        </div>
      </details>

      {par && (
        <section className="border-t border-linha px-4 py-8">
          <Eyebrow>Mesma energia</Eyebrow>
          <h2 className="mt-2.5 font-display text-2xl">Você também pode despertar</h2>
          <Link
            to={`/loja/${par.id}`}
            className="mt-4 flex items-center gap-3 rounded-lg border border-linha-2 p-3"
          >
            <span className="size-8 rounded-full" style={{ background: par.cor }} />
            <span>
              <b className="block text-sm">{par.nome}</b>
              <span className="font-label text-[9px] text-tinta-3 uppercase">
                {par.fam} · {brl(par.preco)}
              </span>
            </span>
          </Link>
        </section>
      )}
    </div>
  )
}
