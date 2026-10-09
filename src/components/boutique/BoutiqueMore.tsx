import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype, productPath } from '@/data/archetypes'
import { FRASCO_CUT_IMG, JOURNAL, UGC_FOTO, UGC_VIDEOS, CONTATOS } from '@/data/home'
import { CanaisVenda } from '@/components/ui/CanaisVenda'
import { CONDICOES, EMPRESA_LINHA, parcela, precoPix } from '@/data/empresa'
import { openCookiePreferences } from '@/lib/consent'
import logoDourado from '@/assets/brand/logo-dourado.png'
import { chaveDaCopia, useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import { useCoverflow } from '@/lib/useCoverflow'
import { CarouselDots } from '@/components/ui/CarouselDots'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { Avaliacao } from '@/components/ui/Avaliacao'

/**
 * Mais seções da direção "Boutique" (ThemeSwitcher): destaque como banner de produto, comunidade como
 * "compre o look", diário como grade de artigos, e rodapé de loja.
 * Texto de produto vem de data/; os rótulos de loja novos estão comentados onde aparecem.
 */

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function SectionHead({ kicker, title, center = false }: { kicker: string; title: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className="font-label text-[10px] tracking-[0.2em] text-tinta-2 uppercase">{kicker}</p>
      <h2 className="mt-3 font-display text-[30px] leading-[1.1] text-tinta lg:text-5xl">{title}</h2>
    </div>
  )
}

/** Destaque como banner de produto: foto, selo "Destaque", preço com Pix e parcelas (regra 7) e CTA. */
export function FeaturedBoutique({ a, img }: { a: Archetype; img: string }) {
  return (
    <section id="destaque" className="bg-papel px-4 py-14 md:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-papel-2 md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto">
          <img src={img} alt={`Mão segurando o ${a.tipo.toLowerCase()} ${a.nome}`} className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          <span className="absolute top-4 left-4 rounded-full bg-papel px-3 py-1.5 font-label text-[9px] tracking-[0.16em] text-tinta uppercase shadow">
            Arquétipo em destaque
          </span>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10 lg:p-16">
          <div className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full" style={{ background: a.cor }} />
            <span className="font-label text-[10px] tracking-[0.16em] text-tinta-2 uppercase">
              {a.energia} · {a.fam}
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl leading-none text-tinta lg:text-7xl">
            {a.nome}
            <Sobrenome a={a} />
          </h2>
          <p className="mt-4 text-lg text-tinta-2">{a.ep}</p>
          <p className="mt-3 text-sm leading-relaxed text-tinta-2">{a.cheiro[1]}</p>
          <div className="mt-6 rounded-2xl bg-papel p-4">
            <Preco a={a} className="text-2xl" />
            <span className="text-xs text-tinta-2">
              {brl(precoPix(a.preco))} no Pix · ou {CONDICOES.parcelasSemJuros}x de {brl(parcela(a.preco))} sem juros · {a.tipo} {a.vol}
            </span>
          </div>
          <Link
            to={productPath(a)}
            className="mt-5 block rounded-full bg-tinta py-4 text-center text-sm font-medium text-papel transition-opacity hover:opacity-90 md:self-start md:px-12"
          >
            Comprar {a.nome}
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Comunidade: carrossel de "vídeos" com o cartão do produto sobreposto à base de cada um. */
export function CommunityBoutique() {
  // carrossel infinito com o card do centro em foco (mesmo esquema da comunidade do Editorial): 3 cópias, e o hook
  // reposiciona o scroll ao cruzar as bordas
  const total = UGC_VIDEOS.length
  // Performance (out/2026): o HTML inicial e o 1º desenho levam 1 cópia (9 cards) — eram 27, quase metade das caixas
  // da home e a maior pintura da 1ª tela. As outras 2 cópias (só servem pra dar a volta infinita) entram depois do
  // load, com o navegador livre e fora de um deslize em andamento; o hook compensa o scroll sem salto.
  const [copias, setCopias] = useState<1 | 3>(1)
  const loop = Array.from({ length: copias }, () => UGC_VIDEOS).flat()
  // mouseDrag: no desktop dá pra arrastar os cards com o mouse (out/2026)
  const trilho = useInfiniteCarousel(total, { mouseDrag: true, copias })
  // cards de trás bem apagados: o do centro é o protagonista
  useCoverflow(trilho.container, { minOpacity: 0.15, itens: loop.length })

  useEffect(() => {
    const el = trilho.container
    if (!el || copias === 3) return
    // desktop mostra vários cards lado a lado: com 1 cópia o lado esquerdo ficaria vazio — lá as cópias entram já
    // na hidratação (a nota no desktop não depende disso). A espera até o load vale só pro celular (1 card à vista).
    if (window.matchMedia('(min-width: 64rem)').matches) return void setCopias(3)
    let ultimoScroll = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let idle: number | undefined
    const marcar = () => (ultimoScroll = Date.now())
    const expandir = () => {
      // no meio de um deslize, mexer no scroll atrapalharia o gesto: tenta de novo quando parar
      if (Date.now() - ultimoScroll < 300) return void (timer = setTimeout(expandir, 300))
      setCopias(3)
    }
    const quandoLivre = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(expandir, { timeout: 2000 })
      else timer = setTimeout(expandir, 200)
    }
    el.addEventListener('scroll', marcar, { passive: true })
    if (document.readyState === 'complete') quandoLivre()
    else window.addEventListener('load', quandoLivre, { once: true })
    return () => {
      el.removeEventListener('scroll', marcar)
      window.removeEventListener('load', quandoLivre)
      clearTimeout(timer)
      if (idle !== undefined) window.cancelIdleCallback(idle)
    }
  }, [trilho.container, copias])

  // 1ª seção depois do hero (sobe por cima dele). Cada experiência é um "vídeo" (2:3 no celular) com o produto num cartão
  // à parte, sobreposto à base do vídeo (metade dentro, metade fora) — o vídeo é a prova, o cartão é a compra.
  // Desktop: a foto acompanha a altura disponível, entre 27rem e 34rem. A largura tem piso de 300px:
  // em notebooks baixos, reduzir as duas medidas em 2:3 cortava nomes e comprimia o preço contra a miniatura.
  // Piso de 27rem na altura (out/2026): em 1366×768 a conta dava ~13rem e a foto virava uma faixa deitada, cortando
  // a pessoa e o frasco. Com o piso o card fica perto de 2:3 (300×432) — exceção aceita pelo usuário à regra da
  // altura: em notebook baixo a seção pode passar um pouco da tela.
  // Celular: só a largura manda — min(66vw, 270px) × --ugc-escala (1.155, out/2026). Exceção pedida (out/2026) à
  // regra da altura: em celular baixo o card continua grande e proporcional, mesmo que a seção passe da tela.
  // Hoje são fotos (UGC_IMG); quando os vídeos chegarem, trocar o <img> por <video> mudo em loop.
  return (
    <section
      id="comunidade"
      className="relative z-20 rounded-t-2xl bg-papel pt-4 pb-5 [--ugc-w:min(66vw*var(--ugc-escala),270px*var(--ugc-escala))] [--ugc-escala:1.155] lg:pt-4.5 lg:pb-5 lg:[--ugc-h:clamp(27rem,94svh-25.5rem,34rem)] lg:[--ugc-w:max(300px,var(--ugc-h)*2/3)]"
      style={{
        // degrau no fim: esta seção fica por cima da seguinte e projeta sombra nela, com filete latão na borda
        boxShadow: '0 14px 26px -12px rgba(40,46,41,0.3), 0 4px 8px -4px rgba(40,46,41,0.2)',
        borderBottom: '1px solid color-mix(in srgb, var(--color-latao) 60%, transparent)',
      }}
    >
      {/* filete dourado contornando o começo da seção (topo + cantos arredondados), na linha do header: cheio no
          topo e sumindo pelas laterais */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-2xl border border-b-0 border-latao"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0, black 18%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0, black 18%, transparent 100%)',
        }}
      />
      {/* eyebrow + título, mesmo cabeçalho das outras seções da home (Eyebrow latão, título mt-3) */}
      <div className="px-4 text-center md:px-10">
        <Eyebrow>A comunidade</Eyebrow>
        <h2 className="mt-3 font-display text-[30px] leading-[1.1] text-tinta lg:text-4xl">Coleção Arquétypus</h2>
      </div>
      <div className="relative mt-6 lg:mt-5">
      {/* Desktop: setas ao lado do card central, no meio da foto. */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => trilho.step(dir)}
          aria-label={dir < 0 ? 'Experiência anterior' : 'Próxima experiência'}
          className="absolute z-30 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-papel text-tinta shadow-[0_10px_24px_-10px_rgba(40,46,41,0.45)] ring-1 ring-latao/60 transition-[background-color,color,box-shadow,scale] duration-300 hover:bg-latao hover:text-papel hover:shadow-[0_14px_30px_-10px_rgba(40,46,41,0.55)] hover:ring-latao active:scale-90 lg:flex"
          style={{
            top: 'calc(var(--ugc-h) / 2)',
            [dir < 0 ? 'left' : 'right']: 'calc(50% - var(--ugc-w) / 2 - 5rem)',
          }}
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d={dir < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
          </svg>
        </button>
      ))}
      <div
        ref={trilho.containerRef}
        data-drag-scroll
        className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-9 lg:gap-5 lg:pb-7"
        // padding lateral = metade da sobra, pra o primeiro e o último card também pararem no centro.
        // pb-9: o overflow do scroll corta tudo que passa da caixa — a folga embaixo deixa a sombra dos cartões inteira
        // overflowAnchor: as cópias que entram depois do load são compensadas no scroll pelo useInfiniteCarousel —
        // o ajuste automático do navegador somaria outra compensação
        style={{ paddingInline: 'calc((100% - var(--ugc-w)) / 2)', overflowAnchor: 'none' }}
      >
        {loop.map((v, i) => {
          const arq = getArchetype(v.archetypeId)
          if (!arq) return null
          const ativo = i === trilho.activeIndex
          return (
            <article
              key={chaveDaCopia(`${v.creator}-${i % total}`, i, total, copias)}
              ref={trilho.registerItem(i)}
              aria-current={ativo ? 'true' : undefined}
              // escala/opacidade/blur vêm do useCoverflow, contínuos conforme o scroll
              className="ugc group relative shrink-0 snap-center"
              style={{ width: 'var(--ugc-w)', willChange: 'transform, opacity' }}
            >
              {/* o vídeo */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-noite ring-1 ring-latao/30 lg:aspect-auto lg:h-(--ugc-h)">
                <img
                  src={UGC_FOTO[v.archetypeId]?.src}
                  srcSet={UGC_FOTO[v.archetypeId]?.srcSet}
                  sizes="(min-width: 1024px) 360px, 77vw"
                  alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`}
                  // o card que abre centralizado: 1º da cópia única (que depois vira a do meio)
                  loading={i === (copias === 3 ? total : 0) ? 'eager' : 'lazy'}
                  decoding="async"
                  className="ugc-midia h-full w-full object-cover lg:object-[50%_25%]"
                />
                {/* topo e base escurecidos: legibilidade do @ e apoio pro cartão sobreposto */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 22%, transparent 62%, rgba(0,0,0,0.45) 100%)' }}
                />
                <span className="absolute inset-x-0 top-3.5 px-3.5 font-label text-[9px] tracking-[0.25em] text-papel-inv/90 uppercase">
                  {v.creator}
                </span>
              </div>

              {/* o produto: cartão à parte, sobreposto à base do vídeo — metade dentro, metade fora (ideia do
                  product tag da comunidade do Editorial) */}
              {/* TESTE out/2026 — preço na linha do nome (celular e desktop) e botão mais fino; miniatura do frasco
                  maior (68px, mais destaque pro produto — o cartão cresce um pouco na vertical) */}
              <div className="ugc-pop relative z-10 mx-1.5 -mt-10 rounded-xl bg-papel p-2 ring-1 ring-latao/45">
                <div className="flex items-center gap-2.5">
                  {FRASCO_CUT_IMG[arq.id] && (
                    <img loading="lazy" src={FRASCO_CUT_IMG[arq.id]} alt="" className="h-[68px] w-[51px] shrink-0 rounded-md object-cover lg:h-20 lg:w-14" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <b className="block truncate font-display text-[19px] leading-tight font-normal text-tinta lg:text-xl">
                        {arq.nome}
                        <Sobrenome a={arq} size="text-[0.7em]" />
                      </b>
                      <Preco a={arq} className="shrink-0 flex-col items-end gap-y-0.5 text-[15px] leading-none" />
                    </span>
                    <Avaliacao id={arq.id} className="mt-0.5 mb-0.5 text-[10px] lg:text-[11px]" />
                    <span className="block truncate text-[13px] text-tinta-2 lg:text-sm">{arq.fam}</span>
                    {/* só o tipo, sem o volume (out/2026): "BODY SPLASH PREMIUM" cabe numa linha também no card estreito do desktop */}
                    <span className="block font-label text-[9.5px] leading-snug tracking-[0.1em] whitespace-nowrap text-tinta-3 uppercase">
                      {arq.tipo}
                    </span>
                  </span>
                </div>
                <Link
                  to={productPath(arq)}
                  tabIndex={ativo ? 0 : -1}
                  aria-label={`Descobrir ${arq.nome}`}
                  className="mt-1.5 block w-full rounded-full border border-latao bg-latao py-1.5 text-center lg:mt-2 lg:py-2 font-label text-[10px] tracking-[0.2em] text-papel uppercase transition-colors duration-300 hover:border-tinta hover:bg-tinta"
                >
                  Descobrir
                </Link>
              </div>
            </article>
          )
        })}
      </div>
      </div>

      {/* celular: setas sem moldura, na mesma linha dos pontinhos (além do deslizar). Desktop: só os pontinhos — as
          setas ficam ao lado dos cards (acima) */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => trilho.step(-1)}
          aria-label="Experiência anterior"
          className="-my-2 flex size-10 lg:hidden cursor-pointer items-center justify-center text-tinta-2 transition-[color,transform] duration-300 hover:text-latao-texto active:scale-90"
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <CarouselDots count={total} active={trilho.activeIndex % total} className="h-6" />
        <button
          type="button"
          onClick={() => trilho.step(1)}
          aria-label="Próxima experiência"
          className="-my-2 flex size-10 lg:hidden cursor-pointer items-center justify-center text-tinta-2 transition-[color,transform] duration-300 hover:text-latao-texto active:scale-90"
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* texto de apoio embaixo, em destaque (out/2026): "Pessoas reais." como assinatura, entre filetes dourados.
          O título fica sozinho em cima, pra caber na ponta da seção que aparece no hero */}
      <div className="mt-5 px-4 text-center md:px-10 lg:mt-4">
        <p className="flex items-center justify-center gap-3 font-display text-[22px] leading-none text-tinta italic lg:text-[28px]">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-latao lg:w-12" />
          Pessoas reais.
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-latao lg:w-12" />
        </p>
        <p className="mt-2 text-[13px] text-tinta-2 lg:mt-3 lg:text-sm">Diferentes fragrâncias, momentos e formas de expressão.</p>
      </div>
    </section>
  )
}

/** Diário como grade de artigos de blog de loja. */
export function DiaryBoutique() {
  return (
    <section id="diario" className="bg-papel-2 px-4 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead kicker="Descubra mais sobre perfumaria" title="Diário olfativo" center />
        <ul className="mt-8 grid gap-3 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="flex flex-col rounded-2xl bg-papel p-6 ring-1 ring-linha lg:p-8">
              <span className="grid size-10 place-items-center rounded-full bg-papel-2 text-sm font-semibold text-tinta">{i + 1}</span>
              <h3 className="mt-5 font-display text-xl leading-snug font-semibold text-tinta lg:text-2xl">{j.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-2">{j.body}</p>
              {/* artigos ainda sem página */}
              <span className="mt-auto pt-6 text-xs font-medium text-tinta-3">Em breve</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Rodapé de loja: colunas de links e dados da empresa. Os cartões de benefício (envio, garantia, pagamento)
 * saíram a pedido (out/2026). */
/** Selos das formas de pagamento: monocromáticos, glifo em tinta escura sobre bege mais escuro da paleta (mesa),
 *  pra conversar com o rodapé escuro sem as cores das bandeiras. Desenhos simplificados (não são os arquivos
 *  oficiais das marcas). Confirmar as bandeiras quando o checkout existir. */
const PAGAMENTOS: { nome: string; glifo: React.ReactNode }[] = [
  {
    nome: 'Pix',
    glifo: (
      <span className="flex items-center gap-1">
        <svg aria-hidden viewBox="0 0 16 16" className="size-3" fill="currentColor">
          <path d="M8 1.2l2.6 2.6L8 6.4 5.4 3.8zM12.2 5.4L14.8 8l-2.6 2.6L9.6 8zM8 9.6l2.6 2.6L8 14.8l-2.6-2.6zM3.8 5.4L6.4 8l-2.6 2.6L1.2 8z" />
        </svg>
        <span className="text-[11px] font-bold tracking-tight lowercase">pix</span>
      </span>
    ),
  },
  { nome: 'Visa', glifo: <span className="text-[12px] font-black tracking-tight italic">VISA</span> },
  {
    nome: 'Mastercard',
    glifo: (
      <svg aria-hidden viewBox="0 0 30 18" className="h-3.5">
        <circle cx="11" cy="9" r="7.5" fill="currentColor" />
        <circle cx="19" cy="9" r="7.5" fill="currentColor" fillOpacity="0.55" />
      </svg>
    ),
  },
  { nome: 'Elo', glifo: <span className="text-[13px] font-black tracking-tight lowercase">elo</span> },
  { nome: 'American Express', glifo: <span className="text-[10px] font-black tracking-wide">AMEX</span> },
  { nome: 'Hipercard', glifo: <span className="text-[9.5px] font-bold tracking-tight">Hipercard</span> },
]

/**
 * Rodapé da home Boutique — escuro (noite), fechando a página como as seções escuras de cima. Logo oficial completa
 * (símbolo + ARQUÉTYPUS + PARFUM, versão dourada), colunas de links com título em dourado, atendimento, selos de
 * pagamento em bege escuro e a faixa legal. -mb-24 cobre o pb-24 do container do Layout.
 */
/** Ícones de traço dos canais do rodapé, em latão (marcas simplificadas, 24×24). Também em /sobre, com `cor` e
 * tamanho próprios (sobre fundo claro usa latao-texto). */
export function IconeContato({
  rede,
  cor = 'var(--color-latao)',
  className = 'size-[18px]',
}: {
  rede: (typeof CONTATOS)[number]['rede']
  cor?: string
  className?: string
}) {
  const props = { viewBox: '0 0 24 24', className, fill: 'none', stroke: cor, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
  if (rede === 'instagram')
    return (
      <svg {...props}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill={cor} />
      </svg>
    )
  if (rede === 'tiktok')
    return (
      <svg {...props}>
        <path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8" />
        <path d="M14 3.5c.4 2.6 2.2 4.4 4.8 4.7" />
      </svg>
    )
  if (rede === 'whatsapp')
    return (
      <svg {...props}>
        <path d="M4.2 20l1.2-4.1A8.3 8.3 0 1 1 8.6 19z" />
        <path d="M9.3 8.6c.2-.5.6-.5.9-.5.3 0 .5.4.8 1.2.2.5-.4.9-.5 1.1.4 1 1.3 1.9 2.4 2.4.2-.2.6-.8 1.1-.6.8.4 1.2.6 1.2.9 0 .4-.1.8-.5 1.1-.5.4-1.4.5-2.6 0a7.6 7.6 0 0 1-3.6-3.6c-.4-1-.4-1.8-.2-2z" />
      </svg>
    )
  return (
    <svg {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

const WHATSAPP = CONTATOS.find((c) => c.rede === 'whatsapp')!

export function FooterBoutique() {
  const titulo = 'font-label text-[10px] tracking-[0.3em] text-latao uppercase'
  const lista = 'mt-4 flex flex-col gap-2.5 text-sm text-papel-inv/60'
  const link = 'transition-colors hover:text-papel-inv'
  return (
    <footer
      id="rodape"
      className="relative z-20 -mb-24 bg-noite px-5 pt-8 pb-[calc(1.25rem+6rem)] text-papel-inv md:px-10 lg:pt-12"
      style={{
        // degrau invertido, como as seções escuras: o rodapé fica por cima do cupom, com filete dourado
        boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
        borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-x-12">
          {/* marca: logo, assinatura e redes (padrão de loja: redes junto da marca, links em colunas por assunto) */}
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <img loading="lazy" src={logoDourado} alt="Arquétypus Parfum" className="h-auto w-44 lg:w-52" />
            <p className="mt-5 max-w-[30ch] font-display text-lg leading-snug text-papel-inv/80 italic">
              Você não escolhe um perfume. Você reconhece o seu.
            </p>
            <p className={`mt-7 ${titulo}`}>Nossas redes</p>
            {/* só os ícones, lado a lado; o usuário/número aparece no title e é lido pelo aria-label */}
            <ul className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
              {CONTATOS.map((c) => (
                <li key={c.rede}>
                  <a
                    href={c.href}
                    aria-label={c.aria}
                    title={c.rotulo}
                    {...(c.rede === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="grid size-10 place-items-center rounded-full ring-1 ring-latao/40 transition-colors hover:bg-latao/15 hover:ring-latao"
                  >
                    <IconeContato rede={c.rede} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* links em 4 colunas (2×2 no celular): Loja, Institucional, Ajuda, Políticas */}
          <nav aria-label="Loja" className="lg:col-span-2">
            <p className={titulo}>Loja</p>
            <ul className={lista}>
              <li><Link to="/#catalogo" className={link}>Os 9 arquétipos</Link></li>
              <li><Link to="/#segmentos" className={link}>Coleções</Link></li>
              <li><Link to="/#familias" className={link}>Famílias olfativas</Link></li>
            </ul>
          </nav>
          <nav aria-label="Institucional" className="lg:col-span-2">
            <p className={titulo}>Institucional</p>
            <ul className={lista}>
              <li><Link to="/sobre" className={link}>Sobre nós</Link></li>
              <li><Link to="/criadores" className={link}>Seja criador</Link></li>
            </ul>
          </nav>
          <nav aria-label="Ajuda" className="lg:col-span-2">
            <p className={titulo}>Ajuda</p>
            <ul className={lista}>
              <li><Link to="/perguntas-frequentes" className={link}>Perguntas frequentes</Link></li>
              <li><Link to="/entrega-e-frete" className={link}>Entrega e frete</Link></li>
              <li><Link to="/trocas-e-devolucoes" className={link}>Trocas e devoluções</Link></li>
              <li>
                <a href={WHATSAPP.href} target="_blank" rel="noopener noreferrer" className={link}>
                  Fale conosco
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Políticas" className="lg:col-span-2">
            <p className={titulo}>Políticas</p>
            <ul className={lista}>
              <li><Link to="/privacidade" className={link}>Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className={link}>Termos de uso</Link></li>
              <li><Link to="/regras-do-site" className={link}>Regras do site</Link></li>
              <li>
                <button type="button" onClick={openCookiePreferences} className={`text-left ${link}`}>
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* outros canais de venda (out/2026): Mercado Livre, Shopee e TikTok Shop — CANAIS_VENDA em data/empresa.ts */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-papel-inv/10 pt-8 lg:flex-row lg:justify-between">
          <p className={titulo}>Também à venda em</p>
          <CanaisVenda tom="escuro" className="justify-center" />
        </div>

        {/* formas de pagamento */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-papel-inv/10 pt-8 lg:flex-row lg:justify-between">
          <p className={titulo}>Formas de pagamento</p>
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Formas de pagamento aceitas">
            {PAGAMENTOS.map((p) => (
              <li
                key={p.nome}
                title={p.nome}
                className="flex h-7 w-12 items-center justify-center rounded-md bg-mesa text-noite ring-1 ring-black/5"
              >
                <span className="sr-only">{p.nome}</span>
                <span aria-hidden className="flex items-center">{p.glifo}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1.5 border-t border-papel-inv/10 pt-6 text-center text-[11px] text-papel-inv/40 lg:flex-row lg:justify-between lg:text-left">
          <p>© 2026 Arquétypus Parfum. Todos os direitos reservados.</p>
          <p>{EMPRESA_LINHA}</p>
        </div>
      </div>
    </footer>
  )
}
