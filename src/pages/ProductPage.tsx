import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ARCHETYPES, getArchetype, getArchetypeBySlug, produtoNome, productPath } from '@/data/archetypes'
import type { Archetype } from '@/types/archetype'
import { FAQ_PDP as FAQ } from '@/data/faq'
import { FRASCO_CUT_IMG, FRASCO_FOTO } from '@/data/home'
import { PDP_REPRESENTACAO_FOTO } from '@/data/productMedia'
import { PiramideOlfativa } from '@/components/PiramideOlfativa'
import { ComboEditorial } from '@/components/ComboEditorial'
import { slidesDoCombo } from '@/data/combos'
import { CONDICOES, parcela, precoPix } from '@/data/empresa'
import { useCart } from '@/context/CartContext'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { DEGRAU_CLARO, Glow, Ornament, SectionEyebrow } from '@/components/ui/Editorial'
import { brl, ProductPurchase } from '@/components/ProductPurchase'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Preco } from '@/components/ui/Preco'
import { BotaoComprar } from '@/components/ui/BotaoComprar'
import { Avaliacao } from '@/components/ui/Avaliacao'
import { IconeTraco } from '@/components/ui/IconeTraco'
import { rolarTrilho, useArrasteMouse } from '@/lib/useArrasteMouse'
import { useCupom } from '@/context/CupomContext'

/** Teste (out/2026, pedido do Fábio): no lugar dos 3 benefícios genéricos ("O que {nome} faz por você"), os cinco
 * traços do arquétipo (`tracos` em data/archetypes.ts). `false` volta aos benefícios. */
const SHOW_TRACOS = true

// ícones de traço fino (gota, ciclo, camadas), no mesmo estilo dos selos da coluna de compra
const BENEFITS = [
  { n: '01', title: '10% de essência', body: 'Mais intensidade e presença do que um body splash tradicional, que costuma ter cerca de 4%.', icon: 'M12 3c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0C6 10.6 8.5 7.2 12 3z' },
  { n: '02', title: 'Leve o bastante para reaplicar', body: 'Não satura. Pode voltar a usar depois da academia, antes do jantar, quando quiser.', icon: 'M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4' },
  { n: '03', title: 'Combina em vez de brigar', body: 'Construído para sobrepor com os outros oito. Camada, não substituição.', icon: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5' },
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

/**
 * Barra fixa de compra (out/2026): aparece quando o botão de comprar da coluna (#pdp-comprar) sai da tela por
 * cima ao rolar, e some ao voltar e quando o rodapé entra — celular e desktop iguais (pedido do usuário, out/2026;
 * antes, no celular, ficava à vista também antes de chegar no botão). Miniatura, nome, preço e o mesmo botão — hoje
 * o `BotaoComprar` (sem checkout: põe na sacola, ver CLAUDE.md). Presa no pé da tela; no desktop centralizada no grid da página.
 */
function PdpStickyBar({ a }: { a: Archetype }) {
  const { precoFinal } = useCupom()
  const [visivel, setVisivel] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const cta = document.getElementById('pdp-comprar')
    if (!cta) return
    // some também quando o rodapé entra na tela, pra não cobrir os links do fim
    const rodape = document.querySelector('footer')
    let ctaAcima = false
    let rodapeVisivel = false
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === cta) ctaAcima = !e.isIntersecting && e.boundingClientRect.top < 0
        else rodapeVisivel = e.isIntersecting
      }
      setVisivel(ctaAcima && !rodapeVisivel)
    })
    obs.observe(cta)
    if (rodape) obs.observe(rodape)
    return () => obs.disconnect()
  }, [a.id])

  return (
    <div
      aria-hidden={!visivel}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-linha bg-papel/95 shadow-[0_-12px_24px_-16px_rgba(40,46,41,0.4)] backdrop-blur-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
        visivel ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      {/* tamanhos em três degraus (out/2026): celular pequeno (< 390 px) como está; celular maior (390+) e desktop um
          pouco maiores — barra, miniatura, nome, preço e botão */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 min-[390px]:py-3 lg:gap-6 lg:px-12 lg:py-4">
        {FRASCO_CUT_IMG[a.id] && (
          // celular bem estreito (< 360 px, ex.: 320): a miniatura sai pra sobrar espaço pro nome
          <img src={FRASCO_CUT_IMG[a.id]} alt="" loading="lazy" className="h-12 w-auto shrink-0 rounded-md max-[359px]:hidden min-[390px]:h-14 lg:h-[4.5rem]" />
        )}
        <div className="min-w-0 flex-1">
          {/* celular: nome e sobrenome em linhas separadas (numa linha só o nome era cortado em tela pequena, out/2026);
              lg: os dois na mesma linha */}
          <p className="font-display text-[19px] leading-tight lg:truncate lg:text-[22px]" style={{ color: a.cor }}>
            <span className="block truncate lg:inline">{a.nome}</span>{' '}
            <span className="block truncate text-[12px] text-tinta-3 min-[390px]:text-[13px] lg:inline lg:text-[length:inherit]">{a.sobrenome}</span>
          </p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[12px] text-tinta-2 lg:mt-1 lg:text-[13px]">
            <Preco a={a} semSelo classeRiscado="text-[0.65em]" className="text-[15px] min-[390px]:text-[17px] lg:text-xl" />
            <span className="hidden sm:inline">{brl(precoPix(precoFinal(a.preco)))} no Pix</span>
          </p>
        </div>
        <BotaoComprar
          tabIndex={visivel ? 0 : -1}
          onClick={() => {
            addItem({ key: `${a.id}-full`, archetypeId: a.id, label: `${a.nome} · ${a.vol}`, variant: a.vol, unitPrice: a.preco })
            setAdicionado(true)
            setTimeout(() => setAdicionado(false), 2000)
          }}
          adicionado={adicionado}
          className="shrink-0 px-4 py-4 text-xs max-lg:tracking-[0.08em] min-[390px]:px-5 min-[390px]:py-[1.1rem] min-[390px]:text-[13px] lg:px-14 lg:py-5 lg:text-[15px]"
        />
      </div>
    </div>
  )
}

/** Card de um arquétipo no carrossel do fim da página: foto do catálogo, nome, nota e preço. */
/**
 * Card do carrossel "Continue descobrindo" (redesenho out/2026, mesma linguagem dos cards do combo): contorno fino,
 * cantos suaves, foto do frasco de ponta a ponta no topo e, embaixo, nome em preto + sobrenome, família, estrelas,
 * preço e parcelas (regra 7) e um "Ver fragrância →" discreto. O card inteiro é o link.
 */
function CardArquetipo({ x }: { x: Archetype }) {
  const { precoFinal } = useCupom()
  const foto = FRASCO_FOTO[x.id]
  return (
    <Link
      to={productPath(x)}
      className="group flex w-[68vw] max-w-[16rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-tinta/12 bg-papel/70 transition-shadow duration-500 hover:shadow-[0_18px_36px_-24px_rgba(43,29,22,0.45)] sm:w-[40vw] lg:w-auto lg:max-w-none"
    >
      <div className="overflow-hidden">
        <MediaSlot
          aspect="4/5"
          bg={x.bg}
          src={foto}
          alt={`Frasco do ${produtoNome(x)}`}
          sizes="(min-width: 1024px) 300px, 68vw"
          requisito={`FOTO · 4:5 · CATÁLOGO · ${x.nome.toUpperCase()}`}
          className="rounded-none! transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5 lg:px-5">
        <p className="font-label text-[9px] tracking-[0.18em] text-latao-texto uppercase">{x.fam}</p>
        <h3 className="mt-1.5 font-display text-[22px] leading-tight text-tinta">
          {x.nome}
          <Sobrenome a={x} />
        </h3>
        <Avaliacao id={x.id} className="mt-2 text-[11px]" />
        <div className="mt-3 border-t border-tinta/10 pt-3">
          {x.status === 'wait' ? (
            <span className="text-sm text-tinta-2">Em breve</span>
          ) : (
            <>
              <Preco a={x} className="text-[15px]" />
              <span className="mt-0.5 block text-[11px] text-tinta-2">
                {CONDICOES.parcelasSemJuros}x de {brl(parcela(precoFinal(x.preco)))} sem juros
              </span>
            </>
          )}
        </div>
        <span className="mt-auto pt-4 font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase transition-colors group-hover:text-tinta">
          Ver fragrância <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const a = slug ? getArchetypeBySlug(slug) : undefined
  const par = a ? getArchetype(a.par) : undefined
  // kits do arquétipo (data/kits.ts) em rotação no "Combina com"
  const kitSlides = a ? slidesDoCombo(a, getArchetype) : []
  const { addItem } = useCart()
  const trilho = useRef<HTMLDivElement>(null)
  // desktop: arrastar os cards com o mouse (toque e trackpad já rolam sozinhos)
  useArrasteMouse(trilho)

  // slug inexistente: 404 de verdade (a Vercel responde 404.html), nunca redirecionar pra home (soft 404)
  if (!a) return <NotFoundPage />

  // botão "Em breve" (sacola desativada): leva o tamanho cheio dos dois
  function levarOsDois(outro = par) {
    if (!outro || !a) return
    for (const x of [a, outro]) {
      addItem({ key: `${x.id}-full-layer`, archetypeId: x.id, label: `${x.nome} · ${x.vol}`, variant: x.vol, unitPrice: x.preco })
    }
  }

  // o par primeiro (layering), depois os outros na ordem do catálogo
  const outros = [...(par ? [par] : []), ...ARCHETYPES.filter((x) => x.id !== a.id && x.id !== par?.id)]

  return (
    <div className="-mb-24">
      {/* P-02 a P-09 — seção de compra (mesmo componente do pop-up da home), contida no grid da página */}
      <div className="bg-papel pb-10 lg:mx-auto lg:max-w-[100rem] lg:pt-4 lg:pb-16">
        <ProductPurchase key={a.id} a={a} />
      </div>

      {/* Quem é você — o arquétipo como identidade (textos `quem`/`cheiro` dos dados). Desde out/2026 a foto da
          representação sangra a seção — no desktop cobre a metade esquerda inteira, no celular o topo todo — e se
          dissolve no fundo por um degradê suave até o texto. Na maioria das fotos a pessoa fica à direita, então o
          degradê do desktop só começa nos últimos ~40% da foto, pra não apagá-la */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2">
        {/* degrau (sombra interna no topo) numa camada por cima de tudo: no fundo da seção a foto o escondia */}
        <span aria-hidden className="pointer-events-none absolute inset-0 z-10" style={DEGRAU_CLARO} />
        <div className="relative aspect-[4/5] w-full md:aspect-[16/10] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[56%]">
          <MediaSlot
            aspect="auto"
            bg={a.bg}
            src={PDP_REPRESENTACAO_FOTO[a.id]}
            alt={`${produtoNome(a)} com a representação do arquétipo ${a.nome} ao fundo`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            requisito={`FOTO · 1:1 · REPRESENTAÇÃO · ${a.nome.toUpperCase()}`}
            className="absolute! inset-0 rounded-none [&_img]:object-top"
          />
          {/* degradê bem esvaído na cor do fundo: celular pra baixo, desktop pra direita */}
          <div
            aria-hidden
            className="absolute inset-0 lg:hidden"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--color-papel-2) 35%, transparent) 62%, color-mix(in srgb, var(--color-papel-2) 80%, transparent) 82%, var(--color-papel-2) 100%)' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden lg:block"
            style={{ background: 'linear-gradient(to right, transparent 62%, color-mix(in srgb, var(--color-papel-2) 35%, transparent) 78%, color-mix(in srgb, var(--color-papel-2) 80%, transparent) 92%, var(--color-papel-2) 100%)' }}
          />
        </div>
        <div className="relative -mt-20 px-5 pb-14 md:mx-auto md:max-w-3xl md:px-10 lg:mt-0 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-16 lg:py-24">
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionEyebrow>Arquétipo {a.nome}</SectionEyebrow>
            <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">{a.ep}</h2>
            <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-tinta-2 lg:mt-8 lg:text-[17px]">
              {a.quem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 border-l-2 border-latao pl-4 font-display text-lg leading-snug text-tinta italic lg:text-xl">{a.cheiro[1]}</p>
          </div>
        </div>
      </Reveal>

      {/* Cinco traços do arquétipo (teste out/2026, SHOW_TRACOS) — mesma linguagem dos benefícios abaixo: claro,
          centrado, colunas com filetes latão (5 no desktop), um ícone de traço por traço (IconeTraco) num aro dourado. Celular: lista enxuta
          (respiros menores, sem ornamento) pra caber na tela */}
      {SHOW_TRACOS ? (
        <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-10 pb-10 md:px-10 md:pt-14 md:pb-14 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO} animateContent>
          <Glow className="top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 lg:size-[34rem]" forca={10} />
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center">
              <SectionEyebrow center>Cinco traços</SectionEyebrow>
              <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
                {/* nome na cor do arquétipo, como no H1 e em "Como {nome} se revela" */}
                Quem é <span className="italic" style={{ color: a.cor }}>{a.nome}</span>
              </h2>
              <Ornament className="mx-auto mt-6 hidden w-28 md:block lg:mt-8" />
            </div>
            <ol className="mt-5 divide-y divide-latao/25 border-y border-latao/25 lg:mt-14 lg:grid lg:grid-cols-5 lg:divide-x lg:divide-y-0 lg:border-y-0">
              {a.tracos.map((t) => (
                <li key={t.titulo} className="flex items-start gap-4 py-3 lg:flex-col lg:items-center lg:gap-0 lg:px-6 lg:py-2 lg:text-center">
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-papel-2 text-latao-texto ring-1 ring-latao/50 lg:size-14">
                    <IconeTraco id={t.icone} className="size-[18px] lg:size-6" />
                  </span>
                  <div className="min-w-0 lg:mt-5">
                    <h3 className="font-display text-[18px] leading-snug text-tinta lg:text-[22px]">{t.titulo}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-tinta-2 lg:mx-auto lg:mt-3 lg:text-[14px]">{t.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      ) : (
        // P-11 Benefícios — redesenho out/2026: claro, centrado e editorial (o bloco escuro destoava do resto da página).
        // Três colunas separadas por filetes latão; cada uma com ícone de traço num aro dourado, número discreto,
        // título em display e texto curto. Celular: lista com ícone à esquerda
        <Reveal as="section" className="relative overflow-hidden bg-papel px-5 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24" style={DEGRAU_CLARO} animateContent>
          <Glow className="top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 lg:size-[34rem]" forca={10} />
          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <SectionEyebrow center>Por que Arquétypus</SectionEyebrow>
              <h2 className="mt-4 font-display text-[30px] leading-[1.12] text-tinta lg:text-5xl">
                {/* nome na cor do arquétipo, como no H1 e em "Como {nome} se revela" */}
                O que <span className="italic" style={{ color: a.cor }}>{a.nome}</span> faz por você
              </h2>
              <Ornament className="mx-auto mt-6 w-28 lg:mt-8" />
            </div>
            <ol className="mt-8 divide-y divide-latao/25 border-y border-latao/25 lg:mt-14 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:border-y-0">
              {BENEFITS.map((b) => (
                <li key={b.n} className="flex items-start gap-5 py-5 lg:flex-col lg:items-center lg:gap-0 lg:px-10 lg:py-2 lg:text-center">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-papel-2 ring-1 ring-latao/50 lg:size-16">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="size-5 text-latao-texto lg:size-6">
                      <path d={b.icon} />
                    </svg>
                  </span>
                  <div className="min-w-0 lg:mt-6">
                    <span className="font-label text-[9px] tracking-[0.3em] text-latao-texto">{b.n}</span>
                    <h3 className="mt-1 font-display text-[19px] leading-snug text-tinta lg:mt-2 lg:text-2xl">{b.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-tinta-2 lg:mx-auto lg:mt-3 lg:max-w-[30ch] lg:text-[15px]">{b.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      {/* Pirâmide olfativa — editorial clara (out/2026), mesma estrutura pros 9; dados em data/piramideOlfativa.ts */}
      <PiramideOlfativa a={a} />

      {/* P-14 Combina com — editorial (aprovado na Sereia, out/2026, espelhado pros 9; dados em data/combos.ts) */}
      {kitSlides.length > 0 && <ComboEditorial key={a.id} a={a} slides={kitSlides} onLevar={(par) => levarOsDois(par)} />}

      {/* P-17 FAQ + P-18 Ficha técnica — claro; título à esquerda, acordeões à direita no desktop */}
      <Reveal as="section" className="relative overflow-hidden bg-papel-2 px-5 pt-14 pb-14 md:px-10 lg:pt-20 lg:pb-20" style={DEGRAU_CLARO}>
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
            {/* só 5 perguntas aqui (FAQ_PDP); o resto fica na página de perguntas frequentes */}
            <Link to="/perguntas-frequentes" className="mt-5 inline-block border-b border-latao/50 pb-0.5 font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase hover:border-latao">
              Ver todas as perguntas
            </Link>

            <div className="mt-12">
              <Eyebrow>Ficha técnica</Eyebrow>
              <div className="mt-3 border-t border-linha-2">
                <Accordion title={`${a.nome} · ${a.tipo} ${a.vol}`}>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 text-sm">
                    {[
                      ['Volume', a.vol],
                      ['Tipo', a.tipo],
                      ['Concentração', `${CONDICOES.essenciaPct}% de essência`],
                      ['Notificação Anvisa', a.anvisa],
                    ].map(([k, v]) => (
                      <div key={k} className="col-span-2 grid grid-cols-subgrid border-b border-linha py-2.5">
                        <dt className="font-label text-[10px] tracking-[0.14em] text-tinta-3 uppercase">{k}</dt>
                        <dd className="text-right text-tinta">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {/* INCI e alérgenos ficam na embalagem, conforme a regulamentação da Anvisa (decisão do usuário, out/2026) */}
                  <p className="mt-4 text-xs leading-relaxed text-tinta-2">
                    A composição completa (INCI), com os alérgenos de declaração obrigatória, está na embalagem do
                    produto, conforme a regulamentação da Anvisa.
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

      {/* Os outros arquétipos — redesenho out/2026 na estética das seções novas da PDP: claro (creme), título editorial,
          cards com contorno fino; trilho horizontal no celular, 4 por vez no desktop com setas; o par vem primeiro.
          pb maior no celular pra barra fixa de compra não cobrir o fim dos cards */}
      <Reveal as="section" className="relative overflow-hidden bg-papel pt-14 pb-28 text-tinta lg:pt-20 lg:pb-24" style={DEGRAU_CLARO} animateContent>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 px-5 md:px-10">
            <div>
              <SectionEyebrow>Continue descobrindo</SectionEyebrow>
              <h2 className="mt-4 font-display text-[30px] leading-[1.12] lg:text-5xl">
                Os outros <span className="text-latao-texto italic">arquétipos</span>
              </h2>
            </div>
            {/* desktop: setas pra passar os cards (no celular é o dedo) */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => rolarTrilho(trilho.current, dir)}
                  aria-label={dir < 0 ? 'Arquétipos anteriores' : 'Próximos arquétipos'}
                  className="grid size-11 cursor-pointer place-items-center rounded-full bg-papel text-latao-texto ring-1 ring-latao/50 transition-colors hover:bg-latao hover:text-papel"
                >
                  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d={dir < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div
            ref={trilho}
            data-drag-scroll
            className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 md:scroll-px-10 md:px-10 lg:mt-10 lg:grid lg:grid-flow-col lg:auto-cols-[calc((100%-3*1.25rem)/4)] lg:gap-5"
          >
            {outros.map((x) => (
              <CardArquetipo key={x.id} x={x} />
            ))}
          </div>
        </div>
      </Reveal>

      <PdpStickyBar a={a} />
    </div>
  )
}
