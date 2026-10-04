import { Link, Navigate, useParams } from 'react-router-dom'
import { getArchetype, NOTAS_LEGENDA } from '@/data/archetypes'
import { FRASCO_CUT_IMG } from '@/data/home'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { CutFrame } from '@/components/ui/CutFrame'
import { DEGRAU_CLARO, DEGRAU_ESCURO, Flor, Glow, Ornament, SectionEyebrow } from '@/components/ui/Editorial'
import { ProductPurchase, brl } from '@/components/ProductPurchase'
import { Sobrenome } from '@/components/ui/Sobrenome'

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

/** Acordeão no estilo editorial: linha fina, título em fonte de display, "+" que vira "−" ao abrir. */
function Accordion({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <details className={`group border-b ${dark ? 'border-papel-inv/15' : 'border-linha-2'}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
        <span className={`font-display text-lg leading-snug lg:text-xl ${dark ? 'text-papel-inv' : 'text-tinta'}`}>{title}</span>
        <span
          aria-hidden
          className="relative size-4 shrink-0 text-latao-texto before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
        />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  )
}

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

  // pirâmide: topo mais estreito, base mais larga (só no desenho — o conteúdo vem de data/archetypes.ts)
  const piramide = [
    { label: 'Topo', value: a.topo, note: NOTAS_LEGENDA.topo, w: 'lg:w-[62%]' },
    { label: 'Coração', value: a.coracao, note: NOTAS_LEGENDA.coracao, w: 'lg:w-[81%]' },
    { label: 'Base', value: a.fundo, note: NOTAS_LEGENDA.fundo, w: 'lg:w-full' },
  ]

  return (
    <div className="-mb-24">
      {/* P-02 a P-09 — seção de compra (mesmo componente do pop-up da home), contida no grid da página */}
      <div className="bg-papel pb-10 lg:mx-auto lg:max-w-7xl lg:pt-6 lg:pb-20">
        <ProductPurchase key={a.id} a={a} />
      </div>

      {/* P-11 Benefícios — escuro, sobe por cima (degrau), lista numerada editorial */}
      <Reveal as="section" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-14 text-papel-inv md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_ESCURO} animateContent>
        <Glow className="-top-24 -right-24 size-72 lg:size-96" forca={20} />
        <div className="relative md:mx-auto md:max-w-3xl lg:max-w-7xl">
          <SectionEyebrow dark>Benefícios</SectionEyebrow>
          <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
            O que <span className="text-latao">{a.nome}</span> faz por você
          </h2>
          <ol className="mt-8 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-x-12">
            {BENEFITS.map((b) => (
              <li key={b.n} className="flex gap-4 border-t border-papel-inv/10 py-5 last:border-b lg:flex-col lg:gap-5 lg:border-papel-inv/20 lg:pt-6 lg:pb-0 lg:last:border-b-0">
                <span aria-hidden className="w-6 shrink-0 pt-1 font-label text-[10px] tracking-widest text-latao lg:w-auto lg:pt-0 lg:font-display lg:text-5xl lg:font-light lg:tracking-normal">
                  {b.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] leading-snug lg:text-2xl lg:leading-[1.25]">{b.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-papel-inv/60 lg:mt-3 lg:text-[15px]">{b.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Pirâmide olfativa + P-13 Como usar — claro, lado a lado no desktop */}
      <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <Flor style={{ bottom: '-70px', right: '-90px', width: '260px', transform: 'rotate(-30deg)' }} />
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            <SectionEyebrow>Pirâmide olfativa</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Como {a.nome} <span className="text-latao-texto">se revela</span>
            </h2>
            {/* desktop: faixas que alargam de cima pra baixo, desenhando a pirâmide */}
            <ol className="mt-8 flex flex-col gap-3 lg:mt-12 lg:items-center">
              {piramide.map((n) => (
                <li key={n.label} className={`w-full ${n.w}`}>
                  <CutFrame cut={10} innerClassName="bg-papel px-5 py-4 lg:py-5 lg:text-center">
                    <span className="font-label text-[9px] tracking-[0.2em] text-latao-texto uppercase">
                      {n.label} <span className="text-tinta-3">· {n.note}</span>
                    </span>
                    <p className="mt-1.5 font-display text-xl leading-snug text-tinta lg:text-2xl">{n.value}</p>
                  </CutFrame>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 lg:col-span-5 lg:mt-0">
            <SectionEyebrow>Como usar</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Três gestos, <span className="text-latao-texto">todo dia</span>
            </h2>
            <ol className="mt-8 lg:mt-12">
              {HOW_TO.map((h, i) => (
                <li key={h.step} className="flex gap-5 border-t border-linha py-5 last:border-b">
                  <span aria-hidden className="font-display text-4xl leading-none font-light text-latao-texto">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{h.step}</span>
                    <p className="mt-1 text-[15px] leading-relaxed text-tinta lg:text-base">{h.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      {/* P-14 Layering — escuro, os dois frascos lado a lado com "+" */}
      {par && (
        <Reveal as="section" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-14 text-papel-inv md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_ESCURO} animateContent>
          <Glow className="top-1/3 left-1/2 size-80 -translate-x-1/2 lg:size-[30rem]" forca={14} />
          <div className="relative mx-auto max-w-4xl text-center">
            <SectionEyebrow dark center>Combina com</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
              {a.nome} <span className="text-latao">+</span> {par.nome}
            </h2>
            <div className="mt-10 flex items-end justify-center gap-6 lg:gap-12">
              {[a, par].map((x, i) => (
                <div key={x.id} className="contents">
                  {i === 1 && <span aria-hidden className="mb-16 font-display text-4xl text-latao lg:text-5xl">+</span>}
                  <figure className="flex flex-col items-center">
                    {FRASCO_CUT_IMG[x.id] && (
                      <img
                        src={FRASCO_CUT_IMG[x.id]}
                        alt={`Frasco ${x.nome}`}
                        className="h-40 w-auto rounded-lg shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] ring-1 ring-latao/40 lg:h-56"
                      />
                    )}
                    <figcaption className="mt-4">
                      <b className="block font-display text-xl font-normal" style={{ color: 'var(--color-papel-inv)' }}>
                        {x.nome}
                        <Sobrenome a={x} />
                      </b>
                      <span className="mt-1 block font-label text-[9px] tracking-[0.18em] text-papel-inv/50 uppercase">{x.fam}</span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-[44ch] font-display text-lg leading-relaxed text-papel-inv/80 italic lg:text-xl">{a.layer}</p>
            <button
              disabled
              onClick={levarOsDois}
              className="mt-8 w-full max-w-xs rounded-full border border-papel-inv/30 bg-papel-inv/10 py-4 text-xs font-medium tracking-wide text-papel-inv uppercase opacity-50"
            >
              Levar os dois · em breve
            </button>
          </div>
        </Reveal>
      )}

      {/* P-17 FAQ + P-18 Ficha técnica — claro; título à esquerda, acordeões à direita no desktop */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO}>
        <div className="relative md:mx-auto md:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <SectionEyebrow>Dúvidas</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
              Perguntas <span className="text-latao-texto">frequentes</span>
            </h2>
          </div>
          <div className="mt-6 lg:col-span-8 lg:mt-0">
            <div className="border-t border-linha-2">
              {FAQ.map((f) => (
                <Accordion key={f.q} title={f.q}>
                  <p className="max-w-[64ch] text-[15px] leading-relaxed text-tinta-2">{f.a}</p>
                </Accordion>
              ))}
            </div>

            <div className="mt-12">
              <Eyebrow>Ficha técnica</Eyebrow>
              <div className="mt-3 border-t border-linha-2">
                <Accordion title={`${a.nome} · ${a.tipo} ${a.vol}`}>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 text-sm">
                    {[
                      ['Volume', a.vol],
                      ['Tipo', a.tipo],
                      ['Categoria IFRA', 'Cat. 5A · conforme Emenda 51'],
                      ['ANVISA', 'Grau 1 · notificação nº —'],
                    ].map(([k, v]) => (
                      <div key={k} className="col-span-2 grid grid-cols-subgrid border-b border-linha py-2.5">
                        <dt className="font-label text-[10px] tracking-[0.14em] text-tinta-3 uppercase">{k}</dt>
                        <dd className="text-right text-tinta">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-tinta-2">
                    Composição (INCI): Alcohol Denat., Aqua, Parfum (Fragrance), Glycerin, Propylene Glycol.
                  </p>
                  <p className="mt-2 text-xs text-alerta">
                    Os alérgenos de fragrância de declaração obrigatória entram aqui assim que a ficha
                    técnica da Scentec for confirmada — ver CLAUDE.md.
                  </p>
                  <div className="mt-4 rounded-lg bg-papel p-4 text-xs leading-relaxed text-tinta-2">
                    <b className="text-tinta">Antes do primeiro uso:</b> faça teste de sensibilidade no
                    antebraço e aguarde 24 h. Uso externo. Produto alcoólico e inflamável. Não ingerir.
                    Manter fora do alcance de crianças.
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Mesma energia — escuro, fecha a página com o par em card claro */}
      {par && (
        <Reveal as="section" className="relative z-10 overflow-hidden bg-noite px-5 pt-14 pb-24 text-papel-inv md:px-10 lg:pt-24 lg:pb-32" style={DEGRAU_ESCURO} animateContent>
          <Glow className="-bottom-20 -left-24 size-72 lg:size-96" forca={14} />
          <div className="relative mx-auto max-w-3xl text-center">
            <SectionEyebrow dark center>Mesma energia</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
              Você também pode <span className="text-latao">despertar</span>
            </h2>
            <Link to={`/loja/${par.id}`} className="group mx-auto mt-10 block max-w-md">
              <CutFrame cut={14} innerClassName="flex items-center gap-5 bg-papel p-5 text-left text-tinta transition-colors group-hover:bg-papel-2">
                {FRASCO_CUT_IMG[par.id] && (
                  <img src={FRASCO_CUT_IMG[par.id]} alt="" aria-hidden className="h-24 w-auto shrink-0 rounded-md" />
                )}
                <span className="min-w-0 flex-1">
                  <b className="block font-display text-2xl font-normal" style={{ color: par.cor }}>
                    {par.nome}
                    <Sobrenome a={par} />
                  </b>
                  <span className="mt-1 block text-sm text-tinta-2">{par.fam}</span>
                  <span className="mt-2 block text-sm text-tinta">{par.status === 'wait' ? 'Em breve' : brl(par.preco)}</span>
                </span>
                <span aria-hidden className="text-xl text-latao-texto transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </CutFrame>
            </Link>
            <Ornament className="mx-auto mt-12 w-24" />
            <Link
              to="/#catalogo"
              className="mt-6 inline-block font-label text-[10px] tracking-[0.18em] text-latao uppercase"
            >
              <span className="border-b border-latao/40 pb-0.5">Ver os 9 arquétipos</span>
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  )
}
