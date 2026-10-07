import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype, NOTAS_LEGENDA, produtoNome } from '@/data/archetypes'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ProductGallery } from '@/components/ProductGallery'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { PDP_ARQUETIPO_FOTO, PDP_FRASCO_FOTO, PDP_LIFESTYLE_FOTO, PDP_NOTAS_FOTO, PDP_REPRESENTACAO_FOTO } from '@/data/productMedia'
import { CONDICOES, FRETE_GRATIS_ACIMA, parcela, precoPix } from '@/data/empresa'
import { CanaisVenda } from '@/components/ui/CanaisVenda'

/** Order bump de layering ("Complete o ritual") — trocado pelos outros canais de venda em out/2026. */
const SHOW_ORDER_BUMP = false
import { Avaliacao } from '@/components/ui/Avaliacao'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Selos de confiança (P-08) — ícones de traço, mesmo estilo dos selos da home
const TRUST = [
  { label: ['Envio em', `${CONDICOES.envioHorasUteis} h úteis`], icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { label: [`${CONDICOES.desistenciaDias} dias de`, 'garantia'], icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4' },
  { label: ['Pagamento', 'seguro'], icon: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3' },
]


/** Como usar (estava na seção própria da PDP; desde out/2026 fica no acordeão ao lado do preço) */
const HOW_TO = [
  'Aplique após o banho, com a pele ainda úmida.',
  'Pescoço, pulsos e atrás dos joelhos.',
  'Reaplique quando quiser. É splash, não perfume.',
]

/** Acordeão compacto da coluna de compra: título em caixa alta, "+" que vira "−" */
function DetalheAcordeao({ titulo, aberto = false, children }: { titulo: string; aberto?: boolean; children: React.ReactNode }) {
  return (
    <details open={aberto} className="group border-b border-linha-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-label text-[11px] tracking-[0.16em] text-tinta uppercase">{titulo}</span>
        <span
          aria-hidden
          className="relative size-3.5 shrink-0 text-latao-texto before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}

/** Artigo de cada energia, pro convite da PDP ("Descubra o Poder", "Descubra a Sedução") */
const ARTIGO_ENERGIA: Record<string, string> = { Sedução: 'a', Força: 'a', Poder: 'o', Mistério: 'o' }

/**
 * Seção de compra do arquétipo (P-02 a P-09): galeria/notas, identidade,
 * variante, preço, comprar, selos e complementos. Usada na PDP (/body-splash/:slug)
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

  const pix = precoPix(selected.price)
  const descontoPct = a.precoCheio > a.preco ? Math.round((1 - a.preco / a.precoCheio) * 100) : 0
  // primeira nota de cada camada da pirâmide (topo, coração, fundo) — vem da fórmula, não é copy nova
  const destaques = [a.topo, a.coracao, a.fundo].map((camada) => camada.split(',')[0].trim())

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
    <div className={`lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-12 lg:py-10 xl:gap-x-16 ${compact ? 'lg:items-center' : 'lg:items-start'}`}>
      {/* P-02 Galeria + notas (botões Fotos/Notas embaixo). Celular: largura toda, só a margem lateral */}
      {/* página completa (out/2026): galeria no topo e presa ao rolar, enquanto a coluna de compra (mais alta) passa */}
      <section className={`px-4 pt-3 lg:col-span-7 lg:px-0 lg:pt-0 ${compact ? '' : 'lg:sticky lg:top-24'}`}>
        {/* lg: largura limitada também pela altura da tela, pra caber sem rolagem em monitores baixos */}
        <div className={`lg:mx-auto lg:w-full ${compact ? 'lg:max-w-[min(36rem,calc(88svh-10rem))]' : 'md:max-lg:mx-auto md:max-lg:max-w-[min(36rem,calc(100svh-20.5rem))] lg:max-w-[min(42rem,calc(92svh-7rem))]'}`}>
        <div className="relative">
          <ProductGallery
            key={a.id}
            nome={a.nome}
            bg={a.bg}
            // página completa no celular (out/2026): foto na largura toda, altura que sobra na 1ª tela depois de nome,
            // preço e botão (~20,5rem), entre 12rem e quadrada — object-cover mantém a proporção; em tela baixa o corte é
            // ancorado no topo, pra a tampa do frasco nunca sumir (iPhone SE, out/2026)
            classeSlide={compact ? '' : 'max-md:aspect-auto! max-md:h-[clamp(12rem,calc(100svh-20.5rem),calc(100vw-2rem))] max-lg:[&_img]:object-top'}
            slides={[
              {
                src: PDP_FRASCO_FOTO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · FRASCO · ${a.nome.toUpperCase()}`,
                alt: `Frasco do ${produtoNome(a)}, ${a.vol}`,
              },
              {
                src: PDP_NOTAS_FOTO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · NOTAS · ${a.nome.toUpperCase()}`,
                alt: `${produtoNome(a)} entre os ingredientes das suas notas olfativas`,
              },
              {
                src: PDP_ARQUETIPO_FOTO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · ARQUÉTIPO · ${a.nome.toUpperCase()}`,
                alt: `${produtoNome(a)} com a figura do arquétipo ${a.nome} ao fundo`,
              },
              {
                src: PDP_REPRESENTACAO_FOTO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · REPRESENTAÇÃO · ${a.nome.toUpperCase()}`,
                alt: `${produtoNome(a)} com a representação do arquétipo ${a.nome} ao fundo`,
              },
              {
                src: PDP_LIFESTYLE_FOTO[a.id], requisito: `FOTO · 1:1 · 1200×1200 · LIFESTYLE · ${a.nome.toUpperCase()}`,
                alt: `Pessoa segurando o ${produtoNome(a)}`,
              },
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
        {/* lg: pl = largura da coluna de miniaturas + gap, pra centralizar os botões sob a foto principal.
            Só no pop-up: na página completa as notas ficam no acordeão ao lado do preço (out/2026) */}
        <div className={`mt-3 flex justify-center gap-2 lg:pl-[5.25rem] ${compact ? '' : 'hidden'}`}>
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
        <section className={`px-4 lg:px-0 lg:pt-0 ${compact ? 'pt-5' : 'pt-3'}`}>
          {/* página completa: trilha de navegação + convite pela energia (que saiu da etiqueta dos cards) */}
          {!compact && (
            <nav aria-label="Você está em" className="mb-4 max-lg:hidden font-label text-[10px] tracking-[0.14em] text-tinta-3 uppercase">
              <Link to="/" className="hover:text-tinta">Início</Link>
              <span aria-hidden className="mx-2">/</span>
              <Link to="/#catalogo" className="hover:text-tinta">{a.tipo}</Link>
              <span aria-hidden className="mx-2">/</span>
              <span className="text-tinta-2">{a.nome}</span>
            </nav>
          )}
          <Eyebrow className={compact ? undefined : 'text-latao-texto max-lg:hidden'}>
            {compact ? `Energia ${a.energia}` : `Descubra ${ARTIGO_ENERGIA[a.energia] ?? ''} ${a.energia}`}
          </Eyebrow>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] lg:text-[44px]" style={{ color: a.cor }}>
            {a.nome}
            <Sobrenome a={a} />
          </h1>
          {/* prova social logo abaixo do nome (estilo Judge.me), mesmo dado dos cards do catálogo */}
          <div className="mt-1.5 flex leading-none lg:mt-3">
            <Avaliacao id={a.id} className="text-[13px] lg:text-sm" />
          </div>
          {compact && <p className="mt-3 font-display text-lg leading-snug italic lg:text-xl">{a.card}</p>}
          {compact ? (
            <p className="mt-3 font-label text-[9px] tracking-[0.18em] text-tinta-3 uppercase lg:mt-4">
              {a.tipo} · {a.vol} · {a.fam}
            </p>
          ) : (
            // página completa: frase + etiquetas (família, volume, concentração) + 3 notas de abertura. No celular esse
            // bloco desce pra depois do botão (DetalhesTopo abaixo), pra o botão principal aparecer sem rolar (out/2026)
            <div className="max-lg:hidden">
              <p className="mt-3 font-display text-lg leading-snug italic lg:text-xl">{a.card}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {[a.fam, a.vol, `${CONDICOES.essenciaPct}% de essência`].map((t) => (
                  <li key={t} className="rounded-full border border-linha-2 px-3 py-1 font-label text-[10px] tracking-[0.08em] text-tinta-2 uppercase">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-tinta-2">
                <span className="font-label text-[10px] tracking-[0.14em] text-tinta-3 uppercase">Notas em destaque · </span>
                {destaques.join(' · ')}
              </p>
            </div>
          )}
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
              className={`px-4 lg:mt-6 lg:border-t lg:border-linha lg:px-0 lg:pt-6 ${compact ? 'mt-5' : 'mt-3'} ${
                compact
                  ? 'max-lg:sticky max-lg:bottom-0 max-lg:z-10 max-lg:border-t max-lg:border-linha max-lg:bg-papel max-lg:pt-3 max-lg:pb-3 max-lg:shadow-[0_-12px_20px_-14px_rgba(40,46,41,0.35)]'
                  : ''
              }`}
            >
              <div className={compact ? 'max-lg:flex max-lg:items-end max-lg:justify-between max-lg:gap-3' : ''}>
                <div className="flex items-center gap-2.5">
                  <Preco a={a} className={`shrink-0 font-display lg:leading-none ${compact ? 'text-2xl lg:text-[30px]' : 'text-[30px] lg:text-[36px]'}`} />
                  {descontoPct > 0 && (
                    <span className="rounded-full bg-latao/15 px-2 py-0.5 font-label text-[10px] font-semibold tracking-wide text-latao-texto">
                      −{descontoPct}%
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-xs text-tinta-2 lg:mt-2 lg:text-[13px] ${compact ? 'max-lg:mt-0 max-lg:pb-1 max-lg:text-right max-lg:text-[11px]' : ''}`}>
                  <b className="font-semibold text-tinta">{brl(pix)} no Pix</b> ({CONDICOES.pixDescontoPct}% off) · ou {CONDICOES.parcelasSemJuros}x de {brl(parcela(selected.price))} sem juros
                </p>
              </div>
              <p className={`mt-1.5 flex items-center gap-1.5 font-label text-[10px] tracking-wide text-ok uppercase ${compact ? 'max-lg:hidden' : ''}`}>
                <span aria-hidden className="size-1.5 rounded-full bg-ok" /> Em estoque e pronto para envio
              </p>

              {/* sacola desativada, ver CLAUDE.md — mantida "Em breve" no redesenho (decisão do usuário, out/2026) */}
              <button
                // a barra fixa da PDP (PdpStickyBar) aparece quando este botão sai da tela
                id={compact ? undefined : 'pdp-comprar'}
                disabled
                onClick={addToCart}
                className={`mt-3 w-full rounded-lg bg-tinta text-sm font-medium tracking-[0.12em] text-papel uppercase opacity-40 lg:mt-5 ${compact ? 'py-4 lg:py-3.5' : 'py-4'}`}
              >
                {added ? 'Adicionado ✓' : 'Em breve'}
              </button>
              {!compact && (
                <p className="mt-2 text-center text-[11px] text-tinta-3">As vendas abrem em breve. Volte para garantir o seu.</p>
              )}
              {/* celular: frase, etiquetas e notas logo depois do botão (no desktop ficam acima do preço) */}
              {!compact && (
                <div className="mt-5 lg:hidden">
                  <p className="font-display text-lg leading-snug italic">{a.card}</p>
                  {/* celular: as três etiquetas sempre numa linha só, centralizadas — fonte e respiro acompanham a largura
                      da tela (conferido em 360 e 390 px com a família mais longa, "Amadeirados & Especiados") */}
                  <ul className="mt-3 flex flex-nowrap justify-center gap-1">
                    {[a.fam, a.vol, `${CONDICOES.essenciaPct}% de essência`].map((t) => (
                      <li key={t} className="shrink-0 rounded-full border border-linha-2 px-[clamp(0.45rem,2.2vw,0.75rem)] py-1 font-label text-[clamp(8px,2.3vw,10px)] tracking-[0.03em] whitespace-nowrap text-tinta-2 uppercase">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[13px] leading-relaxed text-tinta-2">
                    <span className="font-label text-[10px] tracking-[0.14em] text-tinta-3 uppercase">Notas em destaque · </span>
                    {destaques.join(' · ')}
                  </p>
                </div>
              )}
            </div>

            {/* quadro de frete grátis logo abaixo do botão — só volta se a oferta for religada (FRETE_GRATIS_ACIMA,
                data/empresa.ts; desligada desde out/2026). O envio/prazo está nos selos abaixo */}
            {!compact && FRETE_GRATIS_ACIMA && (
              <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg bg-papel-2 px-4 py-3 lg:mx-0">
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-5 shrink-0 text-latao-texto">
                  <path d={TRUST[0].icon} />
                </svg>
                <p className="text-[13px] leading-snug text-tinta-2">
                  <b className="font-semibold text-tinta">Frete grátis acima de {brl(FRETE_GRATIS_ACIMA)}</b>
                  <span className="block">Enviado em até {CONDICOES.envioHorasUteis} h úteis após a confirmação do pagamento.</span>
                </p>
              </div>
            )}
          </>
        )}

        {/* P-08 Selos — faixa única dividida, ícone + texto (só na página completa) */}
        {!compact && (
        <section className="mt-5 px-4 lg:mt-5 lg:px-0">
          <ul className="grid grid-cols-3 divide-x divide-linha border-y border-linha">
            {TRUST.map((t) => (
              <li key={t.icon} className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5 text-latao-texto">
                  <path d={t.icon} />
                </svg>
                <span className="font-label text-[10px] leading-snug tracking-wide text-tinta-2 uppercase">
                  {t.label[0]}
                  <br />
                  {t.label[1]}
                </span>
              </li>
            ))}
          </ul>
        </section>
        )}

        {/* Outros canais de venda (out/2026), logo depois dos selos de envio/garantia/pagamento: Mercado Livre, Shopee
            e TikTok Shop, pra quem prefere comprar num marketplace que já conhece (só na página completa) */}
        {!compact && (
          <div className="mx-4 mt-4 rounded-lg bg-papel-2 px-4 py-3.5 text-center lg:mx-0">
            <p className="text-[13px] leading-snug">
              <b className="font-semibold text-tinta">Prefere comprar em outro lugar?</b>
              <span className="block text-tinta-2">Você também encontra a Arquétypus em:</span>
            </p>
            <CanaisVenda className="mt-3 justify-center" />
          </div>
        )}

        {/* Complete sua rotina — order bump de layering, desligado desde out/2026 (SHOW_ORDER_BUMP) */}
        {SHOW_ORDER_BUMP && par && !isPerfume && !isWait && !compact && (
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

        {/* Detalhes em acordeão (só na página completa, out/2026): o que normalmente se procura antes de comprar,
            sem empurrar o preço pra baixo — preço, Pix e parcelas continuam acima (regra 7) */}
        {!compact && (
          <section className="mt-6 px-4 lg:px-0">
            <div className="border-t border-linha-2">
              <DetalheAcordeao titulo="Sobre a fragrância" aberto>
                <p className="text-[14px] leading-relaxed text-tinta-2">{a.cheiro[0]}</p>
              </DetalheAcordeao>
              <DetalheAcordeao titulo="Notas olfativas">
                <dl className="space-y-3 text-[14px]">
                  {notes.map((n) => (
                    <div key={n.label}>
                      <dt className="font-label text-[10px] tracking-[0.14em] text-latao-texto uppercase">
                        {n.label} <span className="text-tinta-3">· {n.note}</span>
                      </dt>
                      <dd className="mt-0.5 text-tinta">{n.value}</dd>
                    </div>
                  ))}
                </dl>
              </DetalheAcordeao>
              <DetalheAcordeao titulo="Como usar">
                <ol className="space-y-2 text-[14px] text-tinta-2">
                  {HOW_TO.map((h, i) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden className="font-display text-latao-texto">{i + 1}</span>
                      {h}
                    </li>
                  ))}
                </ol>
              </DetalheAcordeao>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
