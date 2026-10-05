import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype, NOTAS_LEGENDA } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProductGallery } from '@/components/ProductGallery'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { PDP_FRASCO, PDP_LIFESTYLE } from '@/data/productMedia'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Selos de confiança (P-08) — ícones de traço, mesmo estilo dos selos da home
const TRUST = [
  { label: ['Envio em', '24 h úteis'], icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { label: ['7 dias de', 'garantia'], icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4' },
  { label: ['Pagamento', 'seguro'], icon: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3' },
]


/** Artigo de cada energia, pro convite da PDP ("Descubra o Poder", "Descubra a Sedução") */
const ARTIGO_ENERGIA: Record<string, string> = { Sedução: 'a', Força: 'a', Poder: 'o', Mistério: 'o' }

/**
 * Seção de compra do arquétipo (P-02 a P-09): galeria/notas, identidade,
 * variante, preço, comprar, selos e complementos. Usada na PDP (/loja/:id)
 * e no pop-up de compra aberto a partir da home — mesma fonte, sem duplicar.
 * `status: 'wait'` (hoje nenhum; Zeus saiu em set/2026) nunca vende: mostra lista de espera no lugar de
 * variante/preço/comprar (regra 8 do CLAUDE.md).
 */
/**
 * `fullPageTo`: só no pop-up — no desktop o link "Ver página completa" fica na coluna da galeria
 * (no celular ele continua no fim do PurchaseSheet).
 * Pop-up (compacto, out/2026): o botão de comprar aparece sem rolar — saem os selos de envio/garantia/pagamento e o
 * "Complete o ritual" (continuam na página completa) e, no celular, preço + botão ficam numa barra presa no pé do
 * pop-up, com a foto na largura toda. A variante mini saiu de vez (out/2026): um tamanho só, sem seletor.
 * Página completa: convite "Descubra {o/a} {energia}" acima do nome.
 * lg+: duas colunas, cada uma um bloco centralizado na altura — galeria (7) e compra (5).
 */
export function ProductPurchase({ a, fullPageTo }: { a: Archetype; fullPageTo?: string }) {
  const par = getArchetype(a.par)
  const { addItem } = useCart()
  const isPerfume = a.tipo === 'Perfume'
  const isWait = a.status === 'wait'
  const compact = !!fullPageTo

  // tamanho único (a variante mini saiu em out/2026)
  const selected = { key: 'full', label: a.vol, meta: isPerfume ? 'Perfume' : 'Splash', price: a.preco }

  const [showNotes, setShowNotes] = useState(false)
  const [addonPar, setAddonPar] = useState(false)
  const [added, setAdded] = useState(false)

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
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const notes = [
    { label: 'Topo', value: a.topo, note: NOTAS_LEGENDA.topo },
    { label: 'Coração', value: a.coracao, note: NOTAS_LEGENDA.coracao },
    { label: 'Base', value: a.fundo, note: NOTAS_LEGENDA.fundo },
  ]

  return (
    // Grade de 12 colunas no lg+: galeria em 7, compra em 5, os dois blocos centralizados na altura (sem texto
    // solto no topo). Celular: uma coluna, galeria → compra. Vale pro pop-up e pra PDP
    <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-12 lg:py-10 xl:gap-x-16">
      {/* P-02 Galeria + notas (botões Fotos/Notas embaixo). Celular: largura toda, só a margem lateral */}
      <section className="px-4 pt-3 lg:col-span-7 lg:px-0 lg:pt-0">
        {/* lg: largura limitada também pela altura da tela, pra caber sem rolagem em monitores baixos */}
        <div className="lg:mx-auto lg:w-full lg:max-w-[min(36rem,calc(88svh-10rem))]">
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
              <Eyebrow>Notas olfativas</Eyebrow>
              <div className="mt-3 space-y-2 text-sm lg:mt-5 lg:space-y-3 lg:text-base">
                {notes.map((n) => (
                  <div key={n.label} className="flex justify-between gap-3">
                    <span>
                      <b className="block">{n.label}</b>
                      <span className="block text-[11px] leading-tight text-tinta-3 lg:text-xs">{n.note}</span>
                    </span>
                    <span className="text-right text-tinta-2">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* lg: pl = largura da coluna de miniaturas + gap, pra centralizar os botões sob a foto principal */}
        <div className="mt-3 flex justify-center gap-2 lg:pl-[5.25rem]">
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

      <div className="lg:col-span-5">
        {/* P-03/04 Identidade + frase. Hierarquia: (convite) → código/energia → nome → frase → tipo/família */}
        <section className="px-4 pt-5 lg:px-0 lg:pt-0">
          {/* página completa: convite pela energia, que saiu da etiqueta dos cards do catálogo */}
          {!compact && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-latao/50 px-3 py-1 font-label text-[9px] tracking-[0.2em] text-latao-texto uppercase">
              <span aria-hidden className="size-1 rotate-45 bg-latao" />
              Descubra {ARTIGO_ENERGIA[a.energia] ?? ''} {a.energia}
            </p>
          )}
          <Eyebrow>
            Energia {a.energia}
          </Eyebrow>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] lg:text-[44px]" style={{ color: a.cor }}>
            {a.nome}
            <Sobrenome a={a} />
          </h1>
          <p className="mt-2.5 font-display text-lg leading-snug italic lg:mt-3 lg:text-xl">{a.card}</p>
          <p className="mt-3 font-label text-[9px] tracking-[0.18em] text-tinta-3 uppercase lg:mt-4">
            {a.tipo} · {a.vol} · {a.fam}
          </p>
        </section>

        {isWait ? (
          /* status 'wait': lista de espera, nunca venda */
          <section className="mt-5 px-4 lg:mt-6 lg:border-t lg:border-linha lg:px-0 lg:pt-6">
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
            {/* P-06 Preço + P-07 Comprar — regra 7: Pix e parcelamento sempre junto do preço. No pop-up do celular
                o bloco fica preso no pé do pop-up (sticky), então o botão aparece sem rolar */}
            <div
              className={`mt-5 px-4 lg:mt-6 lg:border-t lg:border-linha lg:px-0 lg:pt-6 ${
                compact
                  ? 'max-lg:sticky max-lg:bottom-0 max-lg:z-10 max-lg:border-t max-lg:border-linha max-lg:bg-papel max-lg:pt-3 max-lg:pb-3 max-lg:shadow-[0_-12px_20px_-14px_rgba(40,46,41,0.35)]'
                  : ''
              }`}
            >
              <div className={compact ? 'max-lg:flex max-lg:items-end max-lg:justify-between max-lg:gap-3' : ''}>
                <Preco a={a} className="font-display text-2xl lg:text-[30px] lg:leading-none" />
                <p className={`mt-1 text-xs text-tinta-2 lg:mt-2 lg:text-[13px] ${compact ? 'max-lg:mt-0 max-lg:pb-1 max-lg:text-right max-lg:text-[11px]' : ''}`}>
                  {brl(pix)} no Pix · ou 6x de {brl(selected.price / 6)} sem juros
                </p>
              </div>
              <p className={`mt-1.5 font-label text-[10px] text-ok uppercase ${compact ? 'max-lg:hidden' : ''}`}>● Em estoque e pronto para envio</p>

              {/* sacola desativada, ver CLAUDE.md */}
              <button
                disabled
                onClick={addToCart}
                className="mt-3 w-full rounded-lg bg-tinta py-4 text-sm font-medium tracking-wide text-papel uppercase opacity-40 lg:mt-5 lg:py-3.5"
              >
                {added ? 'Adicionado ✓' : 'Em breve'}
              </button>
            </div>
          </>
        )}

        {/* P-08 Selos — faixa única dividida, ícone + texto (só na página completa) */}
        {!compact && (
        <section className="mt-5 px-4 lg:mt-5 lg:px-0">
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
        )}

        {/* P-09 Complete sua rotina (só na página completa) */}
        {par && !isPerfume && !isWait && !compact && (
          <section className="mt-6 px-4 lg:mt-5 lg:px-0">
            <Eyebrow>Complete o ritual</Eyebrow>
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-linha-2 p-3 text-sm transition-colors hover:border-tinta-3 lg:py-2.5">
              <input type="checkbox" checked={addonPar} onChange={(e) => setAddonPar(e.target.checked)} />
              <span>
                {par.nome} {par.vol}
                <span className="block font-label text-[9px] text-tinta-3 uppercase">
                  Layering recomendado · + <Preco a={par} />
                </span>
              </span>
            </label>
          </section>
        )}
      </div>
    </div>
  )
}
