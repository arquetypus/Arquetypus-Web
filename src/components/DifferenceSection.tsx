import { COMPARISON } from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import arquetypusImg from '@/assets/fotos/diferenca/arquetypus.jpg'
import splashComumImg from '@/assets/fotos/diferenca/splash-comum.jpg'

/** Dourado sobre o fundo escuro da seção */
const LATAO = 'var(--color-latao)'

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mt-[3px] size-3.5 shrink-0" fill="none" stroke={LATAO} strokeWidth="1.6">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mt-[3px] size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  )
}

/**
 * H-18 A diferença — comparativo simples em duas colunas, Arquétypus × Splash comum, as duas sempre visíveis
 * (inclusive no celular, sem chave pra alternar). Cada coluna abre com uma foto: a coleção Arquétypus de um lado,
 * um frasco genérico do outro. As linhas usam subgrid, então cada item fica alinhado com o par da outra coluna.
 * Seção discreta: sem cards por pilar nem fechamento. Texto vem de COMPARISON (data/home.ts).
 */
export function DifferenceSection() {
  const colunas = [
    { key: 'arquetypus', label: 'Arquétypus Parfum', img: arquetypusImg, alt: 'Frascos Arquétypus de Afrodite, Fênix e Sereia' },
    { key: 'comum', label: 'Splash comum', img: splashComumImg, alt: 'Frasco genérico de body splash' },
  ] as const

  return (
    <Reveal
      id="diferenca"
      as="section"
      className="relative z-20 bg-noite px-4 pt-14 pb-14 md:px-10 lg:pt-24 lg:pb-24"
      animateContent
      style={{
        // Degrau invertido, como o do catálogo: a seção fica por cima e projeta sombra na de cima
        boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
        // filete dourado como borda: um `absolute` aqui dentro ancoraria no wrapper animado do Reveal (transform)
        borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <Eyebrow className="" style={{ color: LATAO }}>
            A diferença
          </Eyebrow>
          <h2 className="mt-3 font-display text-[26px] leading-[1.15] text-papel-inv lg:text-4xl">
            {/* celular: o trecho em destaque sempre na linha de baixo */}
            Uma experiência que vai <span className="max-lg:block" style={{ color: LATAO }}>além do cheiro.</span>
          </h2>
        </div>

        {/* lg: colunas estreitas (max-w-2xl) — mais largas, cada item virava uma linha comprida e solta */}
        <div className="mx-auto mt-7 grid max-w-2xl grid-cols-2 grid-rows-[auto_repeat(6,auto)] gap-x-2.5 lg:mt-10 lg:gap-x-5">
          {colunas.map((col) => {
            const nossa = col.key === 'arquetypus'
            return (
              <div
                key={col.key}
                className={`row-span-7 grid grid-rows-subgrid overflow-hidden rounded-2xl ${
                  nossa ? 'bg-papel-inv/[0.06] ring-1 ring-latao/45' : 'ring-1 ring-papel-inv/10'
                }`}
              >
                <div>
                  <img
                    src={col.img}
                    alt={col.alt}
                    loading="lazy"
                    className={`aspect-[3/2] w-full object-cover ${nossa ? '' : 'opacity-85 grayscale-[30%]'}`}
                  />
                  <p
                    className="px-3 pt-3.5 pb-1 font-label text-[10px] tracking-[0.3em] uppercase lg:px-5 lg:pt-5 lg:text-[11px]"
                    style={{ color: nossa ? LATAO : 'color-mix(in srgb, var(--color-papel-inv) 45%, transparent)' }}
                  >
                    {col.label}
                  </p>
                </div>
                {COMPARISON.map((c, i) => (
                  <p
                    key={c.tema}
                    className={`flex gap-2 px-3 py-2.5 text-[12.5px] leading-snug lg:gap-3 lg:px-5 lg:py-3 lg:text-[14px] ${
                      i > 0 ? 'border-t border-papel-inv/10' : ''
                    } ${nossa ? 'text-papel-inv' : 'text-papel-inv/40'}`}
                  >
                    {nossa ? <Check /> : <Cross />}
                    <span>{nossa ? c.arquetypus : c.comum}</span>
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}
