import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getArchetype } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MediaSlot } from '@/components/ui/MediaSlot'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const MINI_PRICE = 19.9
const NECESSAIRE_PRICE = 24.9

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
  { q: 'E se eu não gostar do cheiro?', a: 'Você tem 30 dias para devolver, mesmo com o frasco aberto. Sem perguntas.' },
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

  const isPerfume = a?.tipo === 'Perfume'
  const variants = useMemo(() => {
    if (!a) return []
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

  if (!a) return <Navigate to="/" replace />

  const selected = variants.find((v) => v.key === variant) ?? variants[0]
  const pix = selected.price * 0.95

  function addToCart() {
    addItem({
      key: `${a!.id}-${selected.key}`,
      archetypeId: a!.id,
      label: `${a!.nome} · ${selected.label}`,
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
        archetypeId: a!.id,
        label: `Necessaire Arquetypus · ${a!.nome}`,
        variant: 'Único',
        unitPrice: NECESSAIRE_PRICE,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function levarOsDois() {
    if (!par) return
    addToCart()
    addItem({
      key: `${par.id}-full-layer`,
      archetypeId: par.id,
      label: `${par.nome} · ${par.vol}`,
      variant: par.vol,
      unitPrice: par.preco,
    })
  }

  return (
    <div>
      <p className="px-4 pt-3 font-mono text-[9px] tracking-widest text-tinta-3 uppercase">
        {a.energia} / {a.cod} / {a.nome}
      </p>

      {/* P-02 Galeria + notas */}
      <section className="mt-2 px-4">
        <div className="relative">
          <MediaSlot aspect="1/1" bg={a.bg} requisito={`FRASCO · ${a.nome.toUpperCase()}`} />
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
            className={`rounded-full border px-3 py-1.5 font-mono text-[9px] tracking-wide uppercase ${!showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
          >
            Frasco
          </button>
          <button
            onClick={() => setShowNotes(true)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[9px] tracking-wide uppercase ${showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
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
              <span className="mt-0.5 block font-mono text-[9px] text-tinta-3 uppercase">
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
        <p className="mt-1.5 font-mono text-[10px] text-ok uppercase">● Em estoque e pronto para envio</p>
      </section>

      {/* P-07 Comprar */}
      <section className="mt-4 px-4">
        <button
          onClick={addToCart}
          className="w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase"
        >
          Comprar agora
        </button>
        <button
          onClick={addToCart}
          className="mt-2.5 w-full rounded-lg border border-linha-2 py-4 text-sm font-medium"
        >
          {added ? 'Adicionado ✓' : 'Adicionar à sacola'}
        </button>
      </section>

      {/* P-08 Selos */}
      <section className="mt-5 grid grid-cols-3 gap-2 px-4 text-center">
        <div className="rounded-md border border-linha-2 p-2 font-mono text-[8px] tracking-wide text-tinta-2 uppercase">
          Envio em
          <br />
          24 h úteis
        </div>
        <div className="rounded-md border border-linha-2 p-2 font-mono text-[8px] tracking-wide text-tinta-2 uppercase">
          30 dias de
          <br />
          garantia
        </div>
        <div className="rounded-md border border-linha-2 p-2 font-mono text-[8px] tracking-wide text-tinta-2 uppercase">
          Pagamento
          <br />
          seguro
        </div>
      </section>

      {/* P-09 Complete sua rotina */}
      {par && !isPerfume && (
        <section className="mt-6 px-4">
          <Eyebrow>Complete o ritual</Eyebrow>
          <label className="mt-3 flex items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm">
            <input type="checkbox" checked={addonPar} onChange={(e) => setAddonPar(e.target.checked)} />
            <span>
              {par.nome} {par.vol}
              <span className="block font-mono text-[9px] text-tinta-3 uppercase">
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
              Necessaire Arquetypus
              <span className="block font-mono text-[9px] text-tinta-3 uppercase">
                Estojo em lona com o glifo · +{brl(NECESSAIRE_PRICE)}
              </span>
            </span>
          </label>
        </section>
      )}

      {/* P-11 Benefícios */}
      <section className="mt-8 bg-papel-2 px-4 py-8">
        <Eyebrow>Benefícios</Eyebrow>
        <h2 className="mt-2.5 font-display text-2xl">O que {a.nome} faz por você</h2>
        <div className="mt-5 flex flex-col gap-4">
          {BENEFITS.map((b) => (
            <div key={b.n} className="flex gap-3">
              <span className="font-mono text-xs text-latao">{b.n}</span>
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
        <summary className="cursor-pointer font-mono text-[10px] tracking-[0.18em] text-latao uppercase">
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
        <summary className="cursor-pointer font-mono text-[10px] tracking-[0.18em] text-latao uppercase">
          Como usar
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {HOW_TO.map((h) => (
            <div key={h.step} className="rounded-lg border border-linha-2 p-3">
              <b className="font-mono text-[9px] tracking-widest text-latao uppercase">{h.step}</b>
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
            onClick={levarOsDois}
            className="mt-4 w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase"
          >
            Levar os dois — {brl(selected.price + par.preco)}
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
        <summary className="cursor-pointer font-mono text-[10px] tracking-[0.18em] text-latao uppercase">
          Ficha técnica
        </summary>
        <table className="mt-4 w-full text-sm">
          <tbody>
            <tr className="border-b border-linha">
              <td className="py-2 font-mono text-[10px] text-tinta-3 uppercase">Volume</td>
              <td className="py-2 text-right">{a.vol}</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-mono text-[10px] text-tinta-3 uppercase">Tipo</td>
              <td className="py-2 text-right">{a.tipo}</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-mono text-[10px] text-tinta-3 uppercase">Categoria IFRA</td>
              <td className="py-2 text-right">Cat. 5A · conforme Emenda 51</td>
            </tr>
            <tr className="border-b border-linha">
              <td className="py-2 font-mono text-[10px] text-tinta-3 uppercase">ANVISA</td>
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
              <span className="font-mono text-[9px] text-tinta-3 uppercase">
                {par.fam} · {brl(par.preco)}
              </span>
            </span>
          </Link>
        </section>
      )}
    </div>
  )
}
