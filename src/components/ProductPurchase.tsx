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
import { BRINDE, CONDICOES, FRETE_GRATIS_ACIMA, parcela, precoPix, VENDAS_ATIVAS } from '@/data/empresa'
import { CanaisVenda } from '@/components/ui/CanaisVenda'
import { SweepCta } from '@/components/ui/SweepCta'
import { BotaoComprar } from '@/components/ui/BotaoComprar'

/** Order bump de layering ("Complete o ritual") — trocado pelos outros canais de venda em out/2026. */
const SHOW_ORDER_BUMP = false
/** teto do seletor de quantidade da PDP */
const QTD_MAX = 10
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
 * `fullPageTo`: só no pop-up — "Ver página completa" logo abaixo do botão (out/2026: botão vazado dourado no desktop,
 * link de texto na barra do pé no celular) e o nome do produto vira link pra página.
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
  // quantidade (só na PDP completa — o pop-up e a barra fixa põem 1)
  const [qtd, setQtd] = useState(1)

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
    }, compact ? 1 : qtd)
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
    // Pop-up no celular: coluna flex pra o nome subir pra antes da foto (order-first) — a foto fica na largura toda e a
    // barra de preço presa no pé nunca cobre o nome (iPhone SE e 11, out/2026)
    <div className={`lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-12 lg:py-10 ${compact ? 'max-lg:flex max-lg:flex-col xl:gap-x-16 lg:items-center' : 'lg:items-start xl:gap-x-24'}`}>
      {/* P-02 Galeria + notas (botões Fotos/Notas embaixo). Celular: largura toda, só a margem lateral */}
      {/* página completa (out/2026): a coluna da galeria fica fixa enquanto a coluna de compra (mais alta) rola. Ela prende
          na MESMA posição em que começa (8,5rem do topo = header 5rem + respiro da seção 3,5rem), então não "acompanha"
          o scroll no início, e termina os mesmos 3,5rem antes do pé da tela — galeria centralizada nela, com a mesma
          distância do header e do pé da tela. Galeria alinhada à esquerda, na maior medida que a altura deixa (foto
          quadrada, sem corte, até 100svh − 12,5rem e no máximo ~700 px); em tela mais
          vertical (variante `vertical`) as miniaturas descem pra baixo dela e a foto ocupa a largura da coluna */}
      <section className={`px-4 pt-3 lg:col-span-7 lg:px-0 lg:pt-0 ${compact ? '' : 'lg:sticky lg:top-[8.5rem] lg:flex lg:h-[calc(100svh-12rem)] lg:items-center'}`}>
        {/* lg: largura limitada também pela altura da tela, pra caber sem rolagem em monitores baixos */}
        <div className={`lg:mx-auto lg:w-full ${compact ? 'lg:max-w-[min(36rem,calc(88svh-10rem))]' :'md:max-lg:mx-auto md:max-lg:max-w-[min(36rem,calc(100svh-20.5rem))] lg:mx-0 lg:max-w-[min(49rem,calc(100svh-7.25rem))] vertical:max-w-[calc(100svh-17.75rem)]'}`}>
        <div className="relative">
          <ProductGallery
            key={a.id}
            nome={a.nome}
            bg={a.bg}
            miniaturasEmbaixoNaTelaAlta={!compact}
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
        <div className={`mt-3 flex justify-center gap-2 lg:pl-[5.25rem] ${compact ? 'max-lg:mt-2' : 'hidden'}`}>
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
      </section>

      {/* pop-up no celular: `contents` tira esta caixa, pra a barra de preço sticky ficar presa ao pop-up inteiro e não
          só ao bloco do nome — senão ela não desce até o pé e sobe por cima do nome (iPhone SE, out/2026) */}
      <div className={`lg:col-span-5 ${compact ? 'max-lg:contents' : ''}`}>
        {/* P-03/04 Identidade + frase. Hierarquia: (convite) → código/energia → nome → frase → tipo/família */}
        {/* pop-up no celular: grade de 2 colunas — nome e estrelas à esquerda, "Energia …" no espaço vazio à direita,
            alinhado ao topo do nome (pedido do usuário, out/2026) */}
        <section className={`px-4 lg:px-0 lg:pt-0 ${compact ? 'pt-2.5 max-lg:order-first max-lg:grid max-lg:grid-cols-[1fr_auto] max-lg:gap-x-3 lg:pt-0' : 'pt-3'}`}>
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
          <Eyebrow className={compact ? 'text-latao-texto max-lg:col-start-2 max-lg:row-start-1 max-lg:mt-2 max-lg:text-right' : 'text-latao-texto max-lg:hidden'}>
            {compact ? `Energia ${a.energia}` : `Descubra ${ARTIGO_ENERGIA[a.energia] ?? ''} ${a.energia}`}
          </Eyebrow>
          <h1 className={`mt-2 font-display text-3xl leading-[1.05] lg:text-[44px] ${compact ? 'max-lg:col-start-1 max-lg:row-start-1 max-lg:mt-0' : ''}`} style={{ color: a.cor }}>
            {fullPageTo ? (
              // pop-up: o nome leva à página completa (seta discreta indica o link)
              <Link to={fullPageTo} replace className="transition-opacity hover:opacity-75">
                {a.nome}
                <span aria-hidden className="ml-1.5 align-super text-[0.4em] text-latao-texto">↗</span>
                <Sobrenome a={a} />
              </Link>
            ) : (
              <>
                {a.nome}
                <Sobrenome a={a} />
              </>
            )}
          </h1>
          {/* prova social logo abaixo do nome (estilo Judge.me), mesmo dado dos cards do catálogo */}
          <div className={`mt-1.5 flex leading-none lg:mt-3 ${compact ? 'max-lg:col-span-2' : ''}`}>
            <Avaliacao id={a.id} className="text-[13px] lg:text-sm" />
          </div>
          {!compact && (
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
        {/* pop-up: frase + tipo fora da seção do nome — no celular o nome sobe pra antes da foto e isto fica depois dela */}
        {compact && (
          <div className="px-4 lg:px-0">
            <p className="mt-3 font-display text-lg leading-snug italic lg:text-xl">{a.card}</p>
            <p className="mt-3 font-label text-[9px] tracking-[0.18em] text-tinta-3 uppercase lg:mt-4">
              {a.tipo} · {a.vol} · {a.fam}
            </p>
          </div>
        )}

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
              className={`px-4 lg:mt-6 lg:border-t lg:border-linha lg:px-0 lg:pt-6 mt-3 ${
                compact
                  ? 'max-lg:sticky max-lg:bottom-0 max-lg:z-10 max-lg:border-t max-lg:border-linha max-lg:bg-papel max-lg:pt-3 max-lg:pb-[calc(env(safe-area-inset-bottom)+0.75rem)] max-lg:shadow-[0_-12px_20px_-14px_rgba(40,46,41,0.35)]'
                  : ''
              }`}
            >
              {/* pop-up no celular: preço + desconto numa linha e Pix + parcelas embaixo, numa linha só (lado a lado
                  ficavam espremidos, out/2026) — regra 7: os três continuam visíveis */}
              <div>
                <div className="flex items-center gap-2.5">
                  <Preco
                    a={a}
                    // riscado menor que o padrão (out/2026): destaca a oferta e libera espaço pro botão no celular
                    classeRiscado="text-[0.55em]"
                    className={`shrink-0 font-display leading-none ${compact ? 'text-xl lg:text-[28px]' : 'text-[26px] lg:text-[32px]'}`}
                  />
                  {descontoPct > 0 && (
                    <span className="rounded-full bg-latao/15 px-2 py-0.5 font-label text-[10px] font-semibold tracking-wide text-latao-texto">
                      −{descontoPct}%
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-[11px] text-tinta-2 lg:mt-2 lg:text-xs ${compact ? 'max-lg:mt-0.5 max-lg:truncate' : ''}`}>
                  <b className="font-semibold text-tinta">{brl(pix)} no Pix</b> ({CONDICOES.pixDescontoPct}% off) · ou {CONDICOES.parcelasSemJuros}x de {brl(parcela(selected.price))} sem juros
                </p>
              </div>
              <p className={`mt-1.5 flex items-center gap-1.5 font-label text-[10px] tracking-wide text-ok uppercase ${compact ? 'max-lg:hidden' : ''}`}>
                <span aria-hidden className="estoque-pulse relative size-1.5 rounded-full bg-ok" /> Em estoque e pronto para envio
              </p>

              {/* botão de compra (BotaoComprar): ativo desde out/2026 (VENDAS_ATIVAS) — sem checkout, põe na sacola.
                  PDP completa (out/2026, pedido do usuário, referência: PDP da Wepink): seletor de quantidade em contorno
                  dourado colado à esquerda do botão, mesma altura; a caixa do brinde fica separada, logo abaixo */}
              {!compact ? (
                <>
                  <div className="mt-4 flex gap-2.5 lg:mt-5">
                    {VENDAS_ATIVAS && (
                      <div role="group" aria-label="Quantidade" className="flex shrink-0 items-stretch rounded-lg border border-latao/70 bg-papel">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          disabled={qtd <= 1}
                          onClick={() => setQtd((q) => Math.max(1, q - 1))}
                          className="w-9 text-xl leading-none text-latao-texto transition-colors hover:text-tinta disabled:opacity-35 max-[359px]:w-8 min-[390px]:w-10 lg:w-11"
                        >
                          −
                        </button>
                        <span aria-live="polite" className="flex w-7 items-center justify-center text-base font-semibold text-tinta tabular-nums">
                          {qtd}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          disabled={qtd >= QTD_MAX}
                          onClick={() => setQtd((q) => Math.min(QTD_MAX, q + 1))}
                          className="w-9 text-xl leading-none text-latao-texto transition-colors hover:text-tinta disabled:opacity-35 max-[359px]:w-8 min-[390px]:w-10 lg:w-11"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <BotaoComprar
                      // a barra fixa da PDP (PdpStickyBar) aparece quando este botão sai da tela por cima
                      id="pdp-comprar"
                      onClick={addToCart}
                      adicionado={added}
                      className="min-w-0 flex-1 px-3 py-3.5 text-xs tracking-[0.06em] whitespace-nowrap max-[359px]:text-[11px] min-[390px]:text-[13px] min-[390px]:tracking-[0.1em] lg:text-[15px] lg:tracking-[0.14em]"
                    />
                  </div>
                  {/* oferta do brinde (BRINDE, data/empresa.ts). Desktop: presente à esquerda com 72% da altura do texto
                      (absoluto — em flex o ícone esticaria o próprio texto), texto centralizado. Celular: ícone de 32 px
                      ao lado, texto à esquerda */}
                  {BRINDE && (
                    <div className="relative mt-3 rounded-lg bg-papel-2 px-4 py-3 max-lg:flex max-lg:items-center max-lg:gap-3">
                      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="brinde-shake size-8 shrink-0 text-latao-texto lg:absolute lg:inset-y-0 lg:left-4 lg:my-auto lg:aspect-square lg:h-[72%] lg:w-auto">
                      <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zM12 7c1.5-3 5-3.5 5-1.5S14 7 12 7z" />
                    </svg>
                      <p className="text-[13px] leading-snug text-tinta-2 lg:px-[3.75rem] lg:text-center">
                      <b className="font-semibold text-tinta">
                        Brinde grátis na compra: {BRINDE.amostras} decants de {BRINDE.ml} ml de outros arquétipos
                      </b>
                      {BRINDE.kitsEmEstoque !== null && (
                        <span className="mt-0.5 block font-medium text-alerta">
                          {BRINDE.kitsEmEstoque === 1 ? 'Último kit' : `Últimos ${BRINDE.kitsEmEstoque} kits`} de decants em estoque
                        </span>
                      )}
                    </p>
                    </div>
                  )}
                </>
              ) : (
                <BotaoComprar
                  id={compact ? undefined : 'pdp-comprar'}
                  onClick={addToCart}
                  adicionado={added}
                  className={`mt-3 w-full text-sm lg:mt-5 ${compact ? 'max-lg:mt-2 py-4 lg:py-3.5' : 'py-4'}`}
                />
              )}
              {/* pop-up (out/2026): "Ver página completa" junto do botão — enquanto não há checkout é a ação que funciona.
                  Celular: link de texto curto na barra do pé (não encolhe a foto); desktop: botão vazado discreto (borda fina,
                  menor, sem o brilho periódico) — não pode competir com o botão de comprar */}
              {fullPageTo && (
                <>
                  <Link
                    to={fullPageTo}
                    replace
                    className="mt-1.5 block py-0.5 text-center font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase lg:hidden"
                  >
                    <span className="border-b border-latao-texto/50 pb-0.5">Ver página completa →</span>
                  </Link>
                  <SweepCta
                    to={fullPageTo}
                    replace
                    className="mt-2.5 max-w-none! rounded-lg! max-lg:hidden! border-latao/35! bg-transparent! py-2.5! text-[11px]! text-tinta-2! hover:text-tinta! lg:block! [&_.cta-sheen]:hidden"
                  >
                    Ver página completa →
                  </SweepCta>
                </>
              )}
              {!compact && !VENDAS_ATIVAS && (
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
            {/* celular: largura de 4 ícones (4 × 2,75rem + 3 vãos de 0,625rem), então quebra sempre em 4 + 3, centralizados */}
            <CanaisVenda className="mt-3 justify-center max-md:mx-auto max-md:max-w-[12.875rem]" />
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
