import type { CSSProperties } from 'react'
import type { Archetype } from '@/types/archetype'
import { produtoNome } from '@/data/archetypes'
import { piramideDe } from '@/data/piramideOlfativa'
import { DEGRAU_CLARO, SectionEyebrow } from '@/components/ui/Editorial'
import { MediaSlot } from '@/components/ui/MediaSlot'
import { useInView } from '@/lib/useInView'

/** Ordem de entrada (stagger) — `--i` vira atraso em `.seq-anim` (index.css); `--y` 0 = só fade. */
const anim = (i: number, y?: number) => ({ '--i': i, ...(y === undefined ? {} : { '--y': `${y}px` }) }) as CSSProperties

/**
 * Mini natureza-morta sem moldura: a foto tem o fundo calibrado pro creme da seção (#ebe1d3) e as quatro bordas
 * esmaecem (20% nas laterais, que cobrem a luz lateral da foto; 14% em cima e embaixo), então não aparece caixa —
 * só os ingredientes apoiados na mesma superfície.
 */
const BORDAS = 'linear-gradient(to right, transparent, #000 20%, #000 80%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)'
const DISSOLVE: CSSProperties = {
  maskImage: BORDAS,
  maskComposite: 'intersect',
  WebkitMaskImage: BORDAS,
  WebkitMaskComposite: 'source-in',
}

/**
 * Pirâmide olfativa da PDP (out/2026): página editorial clara — foto da fragrância à esquerda (48%), "Como {nome} se
 * revela" e as três camadas à direita (52%). Mesma estrutura pros 9 arquétipos; o que muda vem de
 * `piramideDe(a)` (data/piramideOlfativa.ts): descrição, foto principal, descritores e mini composições.
 * Celular: título → descrição → foto → camadas. Entrada com fade discreto em sequência; sem animação contínua.
 */
export function PiramideOlfativa({ a }: { a: Archetype }) {
  const { ref, inView } = useInView<HTMLElement>()
  const { descricao, foto, camadas } = piramideDe(a)

  return (
    <section
      ref={ref}
      aria-labelledby="piramide-titulo"
      className={`relative overflow-hidden bg-papel-2 px-5 py-14 md:px-10 lg:py-11 xl:py-12 ${inView ? 'seq-on' : ''}`}
    >
      {/* degrau (sombra interna no topo) numa camada por cima: no desktop a foto cobre o fundo da seção e o esconderia */}
      <span aria-hidden className="pointer-events-none absolute inset-0 z-10" style={DEGRAU_CLARO} />
      <div className="mx-auto grid max-w-7xl md:grid-cols-[44fr_56fr] md:gap-x-8 lg:grid-cols-[48fr_52fr] lg:gap-x-14 xl:gap-x-20">
        <header className="md:col-start-2 md:row-start-1">
          <div className="seq-anim" style={anim(0, 0)}>
            <SectionEyebrow>Pirâmide olfativa</SectionEyebrow>
          </div>
          <h2 id="piramide-titulo" className="seq-anim mt-4 font-display text-[32px] leading-[1.08] text-tinta lg:text-[44px] xl:text-[48px]" style={anim(1)}>
            {/* nome na cor do arquétipo, como no H1 da PDP — único toque de cor própria na interface */}
            Como <span className="italic" style={{ color: a.cor }}>{a.nome}</span> se revela
          </h2>
          <p className="seq-anim mt-4 max-w-[46ch] text-[15px] leading-relaxed text-tinta-2 lg:text-base" style={anim(2)}>
            {descricao}
          </p>
        </header>

        {/* foto: no celular entre a descrição e as camadas; no tablet, coluna esquerda na altura do texto; no desktop
            sangra a seção (altura toda, encostada na borda esquerda, metade da largura) e se dissolve no creme por uma
            máscara só nos últimos ~40%: a foto some no fundo da própria seção, sem emenda, e o frasco, no meio da foto,
            fica intacto — como a foto de "Arquétipo {nome}".
            Interface igual pros 9 (creme, tinta, latão) — a individualidade de cada fragrância fica nas fotos e na cor do
            nome no título */}
        <figure className="seq-anim relative mt-8 md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:min-h-[30rem] lg:absolute lg:inset-y-0 lg:left-0 lg:min-h-0 lg:w-1/2" style={anim(2, 0)}>
          <MediaSlot
            aspect="auto"
            bg={a.bg}
            src={foto}
            alt={`${produtoNome(a)} entre alguns dos ingredientes da sua pirâmide olfativa`}
            sizes="(min-width: 1024px) 50vw, (min-width: 768px) 46vw, 100vw"
            requisito={`FOTO · 4:5 · PIRÂMIDE · ${a.nome.toUpperCase()}`}
            className="aspect-[5/4] w-full rounded-sm! md:absolute! md:inset-0 md:aspect-auto lg:rounded-none! lg:[mask-image:linear-gradient(to_right,#000_58%,transparent_97%)] [&_img]:object-[50%_20%] lg:[&_img]:object-[50%_22%]"
          />
        </figure>

        <ol className="mt-10 md:col-start-2 md:row-start-2 md:mt-10 lg:mt-9 lg:max-w-[38rem]">
          {camadas.map((c, i) => (
            <li
              key={c.chave}
              className="seq-anim grid grid-cols-[minmax(0,1fr)_9.75rem] items-center gap-x-3 border-t border-tinta/10 py-4 last:border-b sm:grid-cols-[minmax(0,1fr)_10rem] md:py-3 lg:grid-cols-[minmax(0,1fr)_11.5rem] lg:gap-x-8 xl:grid-cols-[minmax(0,1fr)_13rem]"
              style={anim(3 + i)}
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-label text-[10px] tracking-[0.24em] text-latao-texto uppercase">
                  <span>0{i + 1}</span>
                  <span aria-hidden className="h-px w-4 bg-latao" />
                  <span>{c.label}</span>
                </p>
                <h3 className="mt-1.5 font-display text-[19px] leading-snug text-tinta lg:text-[21px]">{c.titulo}</h3>
                <p className="mt-1 flex flex-wrap text-[14px] leading-relaxed text-tinta lg:text-[15px]">
                  {/* o "·" fica no fim da nota anterior: quando a linha quebra, a seguinte nunca começa com ele */}
                  {c.notas.map((n, k) => (
                    <span key={n} className="whitespace-nowrap">
                      {n}
                      {k < c.notas.length - 1 && <span aria-hidden className="mx-1.5 text-latao">·</span>}
                    </span>
                  ))}
                </p>
                {c.descritores && (
                  <p className="mt-1.5 font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">{c.descritores.join(' · ')}</p>
                )}
              </div>
              {/* sem a foto ainda: mockup (caixa tracejada com a especificação) no mesmo lugar e tamanho */}
              {!c.mini && (
                <MediaSlot
                  aspect="4/3"
                  bg="transparent"
                  alt=""
                  requisito={`FOTO 4:3 · ${c.label.toUpperCase()} · ${a.nome.toUpperCase()}`}
                  className="seq-anim w-full rounded-md! px-1! text-[7.5px]! leading-tight!"
                />
              )}
              {c.mini && (
                <img
                  src={c.mini.src}
                  srcSet={c.mini.srcSet || undefined}
                  sizes="(min-width: 1280px) 208px, (min-width: 1024px) 184px, (min-width: 640px) 160px, 156px"
                  alt={c.miniAlt}
                  loading="lazy"
                  decoding="async"
                  className="seq-anim -my-2 aspect-[4/3] w-full object-cover lg:-my-4"
                  style={{ ...anim(4 + i, 0), ...DISSOLVE }}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
