import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { FRASCO_CUT_IMG, JOURNAL, REWARD_FREIGHT, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'
import { useInfiniteCarousel } from '@/lib/useInfiniteCarousel'
import { useCoverflow } from '@/lib/useCoverflow'
import { CarouselDots } from '@/components/ui/CarouselDots'

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
              {a.cod} · {a.energia} · {a.fam}
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl leading-none text-tinta lg:text-7xl">{a.nome}</h2>
          <p className="mt-4 text-lg text-tinta-2">{a.ep}</p>
          <p className="mt-3 text-sm leading-relaxed text-tinta-2">{a.cheiro[1]}</p>
          <div className="mt-6 rounded-2xl bg-papel p-4">
            <span className="block text-2xl font-semibold text-tinta">{brl(a.preco)}</span>
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
  const trilho = useInfiniteCarousel(total)
  // cards de trás bem apagados: o do centro é o protagonista
  useCoverflow(trilho.container, { minOpacity: 0.15 })

  // 1ª seção depois do hero (sobe por cima dele). Cada experiência é um "vídeo" (2:3, mais largo que o 9:16 pra caber na altura da tela) com o produto num cartão
  // à parte, sobreposto à base do vídeo (metade dentro, metade fora) — o vídeo é a prova, o cartão é a compra.
  // Tamanho do card = o que sobra da altura da tela (94svh) tirando título, cartão, pontinhos e texto (~23–24rem),
  // em 2:3 — o maior possível sem a seção passar da altura da tela (regra de out/2026). Teto: 34rem de altura no desktop.
  // Hoje são fotos (UGC_IMG); quando os vídeos chegarem, trocar o <img> por <video> mudo em loop.
  return (
    <section
      id="comunidade"
      className="relative z-20 rounded-t-2xl bg-papel pt-8 pb-10 [--ugc-w:min(66vw,calc((94svh-22rem)*2/3),270px)] lg:pt-9 lg:pb-12 lg:[--ugc-w:calc(min(34rem,94svh-23rem)*2/3)]"
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
      <h2 className="px-4 text-center font-display text-[30px] leading-[1.1] text-tinta md:px-10 lg:text-4xl">Coleção Arquétypus</h2>
      <div
        ref={trilho.containerRef}
        className="no-scrollbar relative mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-9 lg:mt-7 lg:gap-5"
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
                  alt={`${v.creator} segurando o body splash ${arq.nome}`}
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
              <div className="ugc-pop relative z-10 mx-1.5 -mt-10 rounded-xl bg-papel p-2 ring-1 ring-latao/45">
                <div className="flex items-center gap-2.5">
                  {FRASCO_CUT_IMG[arq.id] && (
                    <img src={FRASCO_CUT_IMG[arq.id]} alt="" className="h-16 w-12 shrink-0 rounded-md object-cover lg:h-20 lg:w-14" />
                  )}
                  <span className="min-w-0 flex-1">
                    <b className="block truncate font-display text-[17px] leading-tight font-normal text-tinta lg:text-lg">{arq.nome}</b>
                    <span className="block truncate text-[11px] text-tinta-2 lg:text-xs">{arq.fam}</span>
                    {/* quebra em 2 linhas no card estreito em vez de cortar */}
                    <span className="block font-label text-[8.5px] leading-snug tracking-[0.15em] text-tinta-3 uppercase">
                      {arq.tipo} · {arq.vol}
                    </span>
                    <span className="mt-1 block text-[13px] leading-none text-tinta">{brl(arq.preco)}</span>
                  </span>
                </div>
                <Link
                  to={`/loja/${arq.id}`}
                  state={{ backgroundLocation: location }}
                  tabIndex={ativo ? 0 : -1}
                  aria-label={`Descobrir ${arq.nome}`}
                  className="mt-2 block w-full rounded-full border border-latao/50 py-2 text-center font-label text-[10px] tracking-[0.2em] text-tinta uppercase transition-colors duration-300 hover:border-latao hover:bg-latao hover:text-papel"
                >
                  Descobrir
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {/* setas sem moldura, na mesma linha dos pontinhos — visíveis também no celular (além do deslizar) */}
      <div className="flex items-center justify-center gap-3 lg:gap-5">
        <button
          type="button"
          onClick={() => trilho.step(-1)}
          aria-label="Experiência anterior"
          className="-my-2 flex size-10 cursor-pointer items-center justify-center text-tinta-2 transition-[color,transform] duration-300 hover:text-latao-texto active:scale-90"
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
          className="-my-2 flex size-10 cursor-pointer items-center justify-center text-tinta-2 transition-[color,transform] duration-300 hover:text-latao-texto active:scale-90"
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

/** Rodapé de loja: benefícios em destaque, colunas de links, pagamentos e dados da empresa. */
export function FooterBoutique() {
  const beneficios = [
    { t: 'Envio em 24 h úteis', d: `Frete grátis acima de ${brl(REWARD_FREIGHT)}` },
    { t: '7 dias de garantia', d: 'Mesmo com o frasco aberto' },
    { t: 'Pagamento seguro', d: 'Pix · Visa · Master · Elo · Boleto' },
  ]
  return (
    <footer className="-mb-24 bg-papel-2 px-4 pt-12 pb-[calc(2.5rem+6rem)] text-tinta md:px-10 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        <ul className="grid gap-3 md:grid-cols-3">
          {beneficios.map((b) => (
            <li key={b.t} className="rounded-2xl bg-papel p-5 ring-1 ring-linha">
              <b className="block text-sm font-semibold">{b.t}</b>
              <span className="text-xs text-tinta-2">{b.d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-2xl font-semibold">Arquétypus</p>
            <p className="mt-2 text-sm text-tinta-2">Você não escolhe um perfume. Você reconhece o seu.</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Loja</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-tinta-2">
              <li><Link to="/#catalogo" className="hover:text-tinta">Os 9 arquétipos</Link></li>
              <li><Link to="/#segmentos" className="hover:text-tinta">Coleções</Link></li>
              <li><Link to="/#diario" className="hover:text-tinta">Diário olfativo</Link></li>
              <li><Link to="/criadores" className="hover:text-tinta">Seja criador</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Ajuda</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-tinta-2">
              <li><Link to="/privacidade" className="hover:text-tinta">Privacidade</Link></li>
              <li className="text-tinta-3" aria-disabled="true">Trocas e devoluções · em breve</li>
              <li className="text-tinta-3" aria-disabled="true">Termos · em breve</li>
              <li>
                <button type="button" onClick={openCookiePreferences} className="text-left hover:text-tinta">
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Atendimento</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-tinta-2">
              <li>sac@arquetypus.com.br</li>
              <li>Instagram · TikTok · Pinterest</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-linha-2 pt-6 text-xs text-tinta-3">
          Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP
        </p>
      </div>
    </footer>
  )
}
