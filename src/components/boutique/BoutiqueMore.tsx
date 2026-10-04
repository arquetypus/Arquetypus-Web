import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { FRASCO_CUT_IMG, JOURNAL, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import logoDourado from '@/assets/brand/logo-dourado.png'
import { useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import { useCoverflow } from '@/lib/useCoverflow'
import { CarouselDots } from '@/components/ui/CarouselDots'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'

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
  const location = useLocation()
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
              {brl(a.preco * 0.95)} no Pix · ou 6x de {brl(a.preco / 6)} sem juros · {a.tipo} {a.vol}
            </span>
          </div>
          <Link
            to={`/loja/${a.id}`}
            state={{ backgroundLocation: location }}
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
  const location = useLocation()
  // carrossel infinito com o card do centro em foco (mesmo esquema da comunidade do Editorial): 3 cópias, e o hook
  // reposiciona o scroll ao cruzar as bordas
  const total = UGC_VIDEOS.length
  const loop = [...UGC_VIDEOS, ...UGC_VIDEOS, ...UGC_VIDEOS]
  // mouseDrag: no desktop dá pra arrastar os cards com o mouse (out/2026)
  const trilho = useInfiniteCarousel(total, { mouseDrag: true })
  // cards de trás bem apagados: o do centro é o protagonista
  useCoverflow(trilho.container, { minOpacity: 0.15 })

  // 1ª seção depois do hero (sobe por cima dele). Cada experiência é um "vídeo" (2:3, mais largo que o 9:16 pra caber na altura da tela) com o produto num cartão
  // à parte, sobreposto à base do vídeo (metade dentro, metade fora) — o vídeo é a prova, o cartão é a compra.
  // Tamanho do card = o que sobra da altura da tela (94svh) tirando eyebrow, título, cartão, pontinhos e texto (~23,5–24,5rem),
  // em 2:3 — o maior possível sem a seção passar da altura da tela (regra de out/2026). Teto: 34rem de altura no desktop.
  // Celular: só a largura manda — min(66vw, 270px) × --ugc-escala (1.155, out/2026). Exceção pedida (out/2026) à
  // regra da altura: em celular baixo o card continua grande e proporcional, mesmo que a seção passe da tela.
  // Hoje são fotos (UGC_IMG); quando os vídeos chegarem, trocar o <img> por <video> mudo em loop.
  return (
    <section
      id="comunidade"
      className="relative z-20 rounded-t-2xl bg-papel pt-4 pb-5 [--ugc-w:min(66vw*var(--ugc-escala),270px*var(--ugc-escala))] [--ugc-escala:1.155] lg:pt-4.5 lg:pb-6 lg:[--ugc-w:calc(min(34rem,94svh-24.5rem)*2/3)]"
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
      <div className="relative mt-6 lg:mt-7">
      {/* desktop: setas grandes ao lado do card do centro, na altura do meio do vídeo (2:3 → metade = 0,75 × largura) */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => trilho.step(dir)}
          aria-label={dir < 0 ? 'Experiência anterior' : 'Próxima experiência'}
          className="absolute z-30 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-papel text-tinta shadow-[0_10px_24px_-10px_rgba(40,46,41,0.45)] ring-1 ring-latao/60 transition-[background-color,color,box-shadow,scale] duration-300 hover:bg-latao hover:text-papel hover:shadow-[0_14px_30px_-10px_rgba(40,46,41,0.55)] hover:ring-latao active:scale-90 lg:flex"
          style={{
            top: 'calc(var(--ugc-w) * 0.75)',
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
        className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-9 lg:gap-5"
        // padding lateral = metade da sobra, pra o primeiro e o último card também pararem no centro.
        // pb-9: o overflow do scroll corta tudo que passa da caixa — a folga embaixo deixa a sombra dos cartões inteira
        style={{ paddingInline: 'calc((100% - var(--ugc-w)) / 2)' }}
      >
        {loop.map((v, i) => {
          const arq = getArchetype(v.archetypeId)
          if (!arq) return null
          const ativo = i === trilho.activeIndex
          return (
            <article
              key={`${v.creator}-${i}`}
              ref={trilho.registerItem(i)}
              aria-current={ativo ? 'true' : undefined}
              // escala/opacidade/blur vêm do useCoverflow, contínuos conforme o scroll
              className="ugc group relative shrink-0 snap-center"
              style={{ width: 'var(--ugc-w)', willChange: 'transform, opacity' }}
            >
              {/* o vídeo */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-noite ring-1 ring-latao/30">
                <img
                  src={UGC_IMG[v.archetypeId]}
                  alt={`${v.creator} segurando o Body Splash Premium ${arq.nome}`}
                  loading={i === total ? 'eager' : 'lazy'}
                  decoding="async"
                  className="ugc-midia h-full w-full object-cover"
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
                    <img src={FRASCO_CUT_IMG[arq.id]} alt="" className="h-[68px] w-[51px] shrink-0 rounded-md object-cover lg:h-20 lg:w-14" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <b className="block truncate font-display text-[19px] leading-tight font-normal text-tinta lg:text-xl">
                        {arq.nome}
                        <Sobrenome a={arq} size="text-[0.7em]" />
                      </b>
                      <Preco a={arq} className="shrink-0 flex-col items-end gap-y-0.5 text-[15px] leading-none" />
                    </span>
                    <span className="block truncate text-[13px] text-tinta-2 lg:text-sm">{arq.fam}</span>
                    {/* só o tipo, sem o volume (out/2026): "BODY SPLASH PREMIUM" cabe numa linha também no card estreito do desktop */}
                    <span className="block font-label text-[9.5px] leading-snug tracking-[0.1em] whitespace-nowrap text-tinta-3 uppercase">
                      {arq.tipo}
                    </span>
                  </span>
                </div>
                <Link
                  to={`/loja/${arq.id}`}
                  state={{ backgroundLocation: location }}
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
      <div className="mt-5 px-4 text-center md:px-10 lg:mt-7">
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
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-left">
            <img src={logoDourado} alt="Arquétypus Parfum" className="h-auto w-44 lg:w-52" />
            <p className="mt-5 max-w-[30ch] font-display text-lg leading-snug text-papel-inv/80 italic">
              Você não escolhe um perfume. Você reconhece o seu.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <p className={titulo}>Loja</p>
            <ul className={lista}>
              <li><Link to="/#catalogo" className={link}>Os 9 arquétipos</Link></li>
              <li><Link to="/#segmentos" className={link}>Coleções</Link></li>
              <li><Link to="/criadores" className={link}>Seja criador</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className={titulo}>Ajuda</p>
            <ul className={lista}>
              <li><Link to="/privacidade" className={link}>Privacidade</Link></li>
              <li className="text-papel-inv/35" aria-disabled="true">Trocas e devoluções · em breve</li>
              <li className="text-papel-inv/35" aria-disabled="true">Termos · em breve</li>
              <li>
                <button type="button" onClick={openCookiePreferences} className={`text-left ${link}`}>
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-3">
            <p className={titulo}>Atendimento</p>
            <ul className={lista}>
              <li>
                <a href="mailto:contato@arquetypus.com.br" className={link}>contato@arquetypus.com.br</a>
              </li>
              <li>Instagram · TikTok · Pinterest</li>
            </ul>
          </div>
        </div>

        {/* formas de pagamento */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-papel-inv/10 pt-8 lg:flex-row lg:justify-between">
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
          <p>Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP</p>
        </div>
      </div>
    </footer>
  )
}
