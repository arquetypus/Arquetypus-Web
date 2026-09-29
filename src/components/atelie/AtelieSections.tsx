import { Link, useLocation } from 'react-router-dom'
import type { Archetype } from '@/types/archetype'
import { getArchetype } from '@/data/archetypes'
import { JOURNAL, UGC_IMG, UGC_VIDEOS } from '@/data/home'
import { openCookiePreferences } from '@/lib/consent'

/**
 * Seções da direção "Ateliê" (ThemeSwitcher) — mesma informação da home, diagramada como revista impressa:
 * papel claro, fio fino entre blocos, títulos grandes em serifa, números de página, legendas em caixa alta.
 * Nenhum texto novo de produto: tudo vem de data/.
 */

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[10px] tracking-[0.3em] text-tinta-2 uppercase">{children}</p>
}

/** Destaque como página dupla: foto emoldurada + nome enorme, frase e preço (regra 7: Pix e parcelas junto). */
export function FeaturedAtelie({ a, img }: { a: Archetype; img: string }) {
  const location = useLocation()
  return (
    <section id="destaque" className="bg-papel px-5 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-16">
        <figure className="lg:col-span-5">
          <div className="aspect-[4/5] overflow-hidden ring-1 ring-linha-2">
            <img src={img} alt={`Mão segurando o ${a.tipo.toLowerCase()} ${a.nome}`} className="h-full w-full object-cover object-[50%_20%]" />
          </div>
          <figcaption className="mt-3 flex justify-between font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
            <span>{a.cod} · {a.energia}</span>
            <span>{a.fam}</span>
          </figcaption>
        </figure>

        <div className="mt-10 lg:col-span-7 lg:mt-0">
          <Kicker>Arquétipo em destaque</Kicker>
          <h2 className="mt-4 font-display text-[88px] leading-[0.85] md:text-[140px] lg:text-[168px]" style={{ color: a.cor }}>
            {a.nome}
          </h2>
          <p className="mt-6 max-w-[26ch] font-display text-2xl leading-snug text-tinta italic lg:text-3xl">{a.ep}</p>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-tinta-2">{a.cheiro[1]}</p>

          <div className="mt-8 grid grid-cols-[auto_1fr] items-end gap-x-8 border-y border-tinta py-5">
            <span className="font-display text-4xl leading-none text-tinta">{brl(a.preco)}</span>
            <span className="text-xs leading-relaxed text-tinta-2">
              {brl(a.preco * 0.95)} no Pix
              <br />
              ou 6x de {brl(a.preco / 6)} sem juros · {a.tipo} {a.vol}
            </span>
          </div>
          <Link
            to={`/loja/${a.id}`}
            state={{ backgroundLocation: location }}
            className="group mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.2em] text-tinta uppercase"
          >
            <span className="border-b border-tinta pb-1">Conhecer {a.nome}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Comunidade como ensaio de retratos: grade de fotos com legenda, sem carrossel. */
export function CommunityAtelie() {
  const location = useLocation()
  return (
    <section className="bg-papel px-5 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <Kicker>A comunidade · Retratos</Kicker>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] text-tinta lg:text-7xl">Experiências Arquétypus</h2>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-tinta-2 lg:mt-0 lg:text-right">
            Pessoas reais. Diferentes fragrâncias, momentos e formas de expressão.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-14 lg:grid-cols-4 lg:gap-x-6">
          {UGC_VIDEOS.map((v, i) => {
            const arq = getArchetype(v.archetypeId)
            if (!arq) return null
            return (
              <Link key={v.creator} to={`/loja/${arq.id}`} state={{ backgroundLocation: location }} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-papel-3">
                  <img
                    src={UGC_IMG[v.archetypeId]}
                    alt={`${v.creator} segurando o body splash ${arq.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-2 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">
                  <span>Fig. {String(i + 1).padStart(2, '0')}</span>
                  <span className="truncate normal-case tracking-normal">{v.creator}</span>
                </p>
                <p className="mt-1 font-display text-xl text-tinta">
                  {arq.nome} <span className="text-sm text-tinta-3">· {arq.fam}</span>
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Diário como sumário de revista, no claro: número grande, título e linha fina de apoio. */
export function DiaryAtelie() {
  return (
    <section id="diario" className="bg-papel-2 px-5 py-14 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-4">
          <Kicker>Sumário · Descubra mais sobre perfumaria</Kicker>
          <h2 className="mt-4 font-display text-[40px] leading-[1.02] text-tinta lg:text-6xl">Diário olfativo</h2>
        </div>
        <ol className="mt-10 lg:col-span-8 lg:mt-0">
          {JOURNAL.map((j, i) => (
            <li key={j.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-tinta py-6 last:border-b lg:grid-cols-[6rem_1fr_auto] lg:gap-8">
              <span className="font-display text-4xl leading-none text-tinta-3 lg:text-6xl">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-2xl leading-snug text-tinta lg:text-3xl">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-2 lg:text-base">{j.body}</p>
              </div>
              {/* artigos ainda sem página: sem link */}
              <span className="hidden self-center font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase lg:block">Em breve</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Rodapé como expediente de revista: marca gigante em tipografia, colunas de links e créditos. */
export function FooterAtelie() {
  return (
    <footer className="-mb-24 border-t border-tinta bg-papel px-5 pt-14 pb-[calc(2.5rem+6rem)] text-tinta md:px-10 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-display text-[22px] leading-snug italic lg:text-3xl">
          Você não escolhe um perfume. <span className="text-latao-texto">Você reconhece o seu.</span>
        </p>
        <p aria-hidden className="mt-8 font-display text-[18vw] leading-[0.8] tracking-tight lg:text-[15vw] xl:text-[200px]">
          Arquétypus
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-tinta pt-8 lg:grid-cols-4">
          <div>
            <p className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">Explorar</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li><Link to="/#catalogo" className="hover:underline">Os 9 arquétipos</Link></li>
              <li><Link to="/#diario" className="hover:underline">Diário olfativo</Link></li>
              <li><Link to="/criadores" className="hover:underline">Seja criador</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">Ajuda</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li><Link to="/privacidade" className="hover:underline">Privacidade</Link></li>
              <li className="text-tinta-3" aria-disabled="true">Trocas e devoluções · em breve</li>
              <li className="text-tinta-3" aria-disabled="true">Termos · em breve</li>
              <li>
                <button type="button" onClick={openCookiePreferences} className="text-left hover:underline">
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">Redes</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>Instagram</li>
              <li>TikTok</li>
              <li>Pinterest</li>
            </ul>
          </div>
          <div className="col-span-2 text-xs leading-relaxed text-tinta-2 lg:col-span-1">
            <p className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">Expediente</p>
            <p className="mt-4">Pix · Visa · Master · Elo · Boleto</p>
            <p className="mt-1">sac@arquetypus.com.br</p>
            <p className="mt-1">Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
