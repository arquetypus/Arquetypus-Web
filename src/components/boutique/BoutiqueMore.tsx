import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { FRASCO_CUT_IMG, JOURNAL, REWARD_FREIGHT, SEALS, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'

/**
 * Mais seções da direção "Boutique" (ThemeSwitcher): destaque como banner de produto, comunidade como
 * "compre o look", diário como grade de artigos, rodapé de loja e a barra de avisos no topo.
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

/** Faixa preta fina acima do header, com frete grátis e selos passando em loop (pausa com movimento reduzido). */
export function AnnouncementBar() {
  // "Frete grátis acima de R$ 199" já é copy do FAQ da PDP; o valor vem de REWARD_FREIGHT
  const items = [`Frete grátis acima de ${brl(REWARD_FREIGHT)}`, 'Envio em 24 h úteis', '7 dias de garantia', ...SEALS]
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden bg-tinta text-papel" aria-label="Avisos da loja">
      <div className="boutique-marquee flex w-max gap-10 py-2 font-label text-[10px] tracking-[0.18em] whitespace-nowrap uppercase">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10" aria-hidden={i >= items.length}>
            {t}
            <span aria-hidden className="opacity-40">✦</span>
          </span>
        ))}
      </div>
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

/** Comunidade como "compre o look": foto do criador + etiqueta do produto com preço e botão. */
export function CommunityBoutique() {
  const location = useLocation()
  return (
    <section className="bg-papel px-4 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead kicker="A comunidade" title="Experiências Arquétypus" center />
        <p className="mt-3 text-center text-sm text-tinta-2">Pessoas reais. Diferentes fragrâncias, momentos e formas de expressão.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {UGC_VIDEOS.map((v) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <li key={v.creator} className="overflow-hidden rounded-2xl bg-papel-2 ring-1 ring-linha">
                <div className="relative aspect-[3/4]">
                  <img src={UGC_IMG[v.archetypeId]} alt={`${v.creator} segurando o body splash ${arq.nome}`} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-papel/90 px-2.5 py-1 text-[11px] text-tinta backdrop-blur">{v.creator}</span>
                </div>
                {/* etiqueta "compre o look" */}
                <Link to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="flex items-center gap-3 p-3 transition-colors hover:bg-papel-3">
                  {FRASCO_CUT_IMG[arq.id] && <img src={FRASCO_CUT_IMG[arq.id]} alt="" className="hidden h-12 w-9 shrink-0 rounded-md object-cover sm:block" />}
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-sm font-semibold text-tinta">{arq.nome}</b>
                    <span className="block text-xs text-tinta-2">{brl(arq.preco)}</span>
                  </span>
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-tinta text-sm text-papel">→</span>
                </Link>
              </li>
            )
          })}
        </ul>
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
