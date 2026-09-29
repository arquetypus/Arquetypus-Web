import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProductGallery } from '@/components/ProductGallery'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Fotos da galeria, por arquétipo (nome do arquivo = id). Ordem: frasco primeiro, depois a foto com pessoa.
// Recortes 1:1 das fotos 9:16 da designer (set/2026) — ver CLAUDE.md.
const byId = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace('.jpg', ''), url]))
const PDP_FRASCO = byId(import.meta.glob<string>('@/assets/fotos/pdp-frasco/*.jpg', { eager: true, import: 'default' }))
const PDP_LIFESTYLE = byId(import.meta.glob<string>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default' }))

// Selos de confiança (P-08) — ícones de traço, mesmo estilo dos selos da home
const TRUST = [
  { label: ['Envio em', '24 h úteis'], icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { label: ['7 dias de', 'garantia'], icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4' },
  { label: ['Pagamento', 'seguro'], icon: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3' },
]

const MINI_PRICE = 19.9
const NECESSAIRE_PRICE = 24.9

/**
 * Seção de compra do arquétipo (P-02 a P-09): galeria/notas, identidade,
 * variante, preço, comprar, selos e complementos. Usada na PDP (/loja/:id)
 * e no pop-up de compra aberto a partir da home — mesma fonte, sem duplicar.
 * `status: 'wait'` (hoje nenhum; Zeus saiu em set/2026) nunca vende: mostra lista de espera no lugar de
 * variante/preço/comprar (regra 8 do CLAUDE.md).
 */
/**
 * `fullPageTo`: só no pop-up — no desktop o link "Ver página completa" fica na coluna da galeria,
 * encostado no rodapé do pop-up (no celular ele continua no fim do PurchaseSheet).
 */
export function ProductPurchase({ a, fullPageTo }: { a: Archetype; fullPageTo?: string }) {
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

  const notes = [
    { label: 'Topo', value: a.topo },
    { label: 'Coração', value: a.coracao },
    { label: 'Base', value: a.fundo },
  ]

  return (
    // Grade de 12 colunas no lg+: galeria em 7 (fixa enquanto a compra rola), compra em 5.
    // Celular: uma coluna, na ordem breadcrumb → galeria → compra. Vale pro pop-up e pra PDP
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-12 lg:pt-8 lg:pb-6 xl:gap-x-16">
      <p className="px-4 pt-3 font-label text-[9px] tracking-widest text-tinta-3 uppercase lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:px-0 lg:pt-0">
        {a.energia} / {a.cod} / {a.nome}
      </p>

      {/* P-02 Galeria + notas (botões Fotos/Notas embaixo). lg+: bloco centralizado na coluna e na altura do pop-up */}
      <section className="mt-2 px-4 lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:flex lg:flex-col lg:self-stretch lg:px-0">
        {/* largura limitada também pela altura da tela, pra caber sem rolagem em monitores baixos */}
        <div className="lg:mx-auto lg:my-auto lg:w-full lg:max-w-[min(36rem,calc(88svh-8rem))]">
        <div className="relative">
          <ProductGallery
            key={a.id}
            nome={a.nome}
            bg={a.bg}
            slides={[
              { src: PDP_FRASCO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · FRASCO · ${a.nome.toUpperCase()}` },
              { src: PDP_LIFESTYLE[a.id], requisito: `FOTO · 1:1 · 1200×1200 · LIFESTYLE · ${a.nome.toUpperCase()}` },
            ].filter((s) => s.src)}
          />
          {showNotes && (
            // lg: começa depois da coluna de miniaturas — cobre só a foto principal
            <div className="absolute inset-0 flex flex-col justify-center rounded-lg bg-papel/95 p-5 lg:left-[5.25rem] lg:p-10">
              <Eyebrow>Notas olfativas · {a.cod}</Eyebrow>
              <div className="mt-3 space-y-2 text-sm lg:mt-5 lg:space-y-3 lg:text-base">
                {notes.map((n) => (
                  <div key={n.label} className="flex justify-between gap-3">
                    <b>{n.label}</b>
                    <span className="text-right text-tinta-2">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* lg: pl = largura da coluna de miniaturas + gap, pra centralizar os botões sob a foto principal */}
        <div className="mt-2 flex gap-2 lg:mt-3 lg:justify-center lg:pl-[5.25rem]">
          <button
            onClick={() => setShowNotes(false)}
            className={`rounded-full border px-3 py-1.5 font-label text-[9px] tracking-wide uppercase ${!showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
          >
            Fotos
          </button>
          <button
            onClick={() => setShowNotes(true)}
            className={`rounded-full border px-3 py-1.5 font-label text-[9px] tracking-wide uppercase ${showNotes ? 'border-tinta bg-tinta text-papel' : 'border-linha-2'}`}
          >
            Notas
          </button>
        </div>
        </div>
        {fullPageTo && (
          <div className="hidden pt-4 text-center lg:block lg:pl-[5.25rem]">
            <Link
              to={fullPageTo}
              replace
              className="inline-block py-1 font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase"
            >
              <span className="border-b border-latao-texto/40 pb-0.5 transition-colors hover:border-latao-texto">Ver página completa</span>
            </Link>
          </div>
        )}
      </section>

      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
        {/* P-03/04 Identidade + frase */}
        <section className="px-4 pt-5 lg:px-0 lg:pt-3">
          <Eyebrow>
            {a.cod} · Energia {a.energia}
          </Eyebrow>
          <h1 className="mt-1.5 font-display text-3xl lg:mt-1.5 lg:text-[40px] lg:leading-[1.05]" style={{ color: a.cor }}>
            {a.nome}
          </h1>
          <p className="mt-3 font-display text-lg italic lg:mt-2 lg:text-lg lg:leading-snug">{a.card}</p>
          <p className="mt-3 font-label text-[9px] tracking-[0.18em] text-tinta-3 uppercase lg:mt-2">
            {a.tipo} · {a.vol} · {a.fam}
          </p>
        </section>

        {isWait ? (
          /* status 'wait': lista de espera, nunca venda */
          <section className="mt-5 px-4 lg:mt-4 lg:border-t lg:border-linha lg:px-0 lg:pt-4">
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
            {/* P-06 Preço — regra 7: Pix e parcelamento sempre junto do preço */}
            <section className="mt-5 px-4 lg:mt-4 lg:border-t lg:border-linha lg:px-0 lg:pt-4">
              <span className="font-display text-2xl lg:text-[28px] lg:leading-none">{brl(selected.price)}</span>
              <p className="mt-1 text-xs text-tinta-2 lg:mt-1.5 lg:text-[13px]">
                {brl(pix)} no Pix · ou 6x de {brl(selected.price / 6)} sem juros
              </p>
              <p className="mt-1.5 font-label text-[10px] text-ok uppercase">● Em estoque e pronto para envio</p>
            </section>

            {/* P-05 Variante */}
            <section className="mt-4 px-4 lg:mt-4 lg:px-0">
              <p className="mb-1.5 hidden font-label text-[9px] tracking-[0.18em] text-tinta-3 uppercase lg:block">Tamanho</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${variants.length}, 1fr)` }}>
                {variants.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVariant(v.key)}
                    className={`rounded-lg border p-3 text-center transition-colors lg:py-2.5 ${variant === v.key ? 'border-tinta bg-papel-2/60' : 'border-linha-2 hover:border-tinta-3'}`}
                  >
                    <b className="block text-sm">{v.label}</b>
                    <span className="mt-0.5 block font-label text-[9px] text-tinta-3 uppercase">
                      {v.meta} · {brl(v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* P-07 Comprar — sacola desativada, ver CLAUDE.md */}
            <section className="mt-4 px-4 lg:mt-3 lg:px-0">
              <button
                disabled
                onClick={addToCart}
                className="w-full rounded-lg bg-tinta py-4 lg:py-3.5 text-sm font-medium tracking-wide text-papel uppercase opacity-40"
              >
                {added ? 'Adicionado ✓' : 'Em breve'}
              </button>
            </section>
          </>
        )}

        {/* P-08 Selos — faixa única dividida, ícone + texto */}
        <section className="mt-5 px-4 lg:mt-4 lg:px-0">
          <ul className="grid grid-cols-3 divide-x divide-linha border-y border-linha">
            {TRUST.map((t) => (
              <li key={t.icon} className="flex flex-col items-center gap-1.5 px-2 py-3 text-center lg:gap-1 lg:py-2.5">
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-latao-texto">
                  <path d={t.icon} />
                </svg>
                <span className="font-label text-[8px] leading-snug tracking-wide text-tinta-2 uppercase lg:text-[8.5px]">
                  {t.label[0]}
                  <br />
                  {t.label[1]}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* P-09 Complete sua rotina */}
        {par && !isPerfume && !isWait && (
          <section className="mt-6 px-4 lg:mt-5 lg:px-0">
            <Eyebrow>Complete o ritual</Eyebrow>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm transition-colors hover:border-tinta-3 lg:py-2.5">
              <input type="checkbox" checked={addonPar} onChange={(e) => setAddonPar(e.target.checked)} />
              <span>
                {par.nome} {par.vol}
                <span className="block font-label text-[9px] text-tinta-3 uppercase">
                  Layering recomendado · +{brl(par.preco)}
                </span>
              </span>
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm transition-colors hover:border-tinta-3 lg:py-2.5">
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
      </div>
    </div>
  )
}
