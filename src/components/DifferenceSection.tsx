import { COMPARISON } from '@/data/home'
import { Eyebrow } from '@/components/ui/Eyebrow'
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
 * H-18 A diferença — comparativo simples em duas colunas, Arquétypus × Body splash comum, as duas sempre visíveis
 * (inclusive no celular, sem chave pra alternar). Cada coluna abre com uma foto: a coleção Arquétypus de um lado,
 * um frasco genérico do outro. As linhas usam subgrid, então cada item fica alinhado com o par da outra coluna.
 * Seção discreta: sem cards por pilar nem fechamento. Texto vem de COMPARISON (data/home.ts).
 * Sem animação de entrada (out/2026): a seção aparece na hora, sem esperar o scroll revelar.
 */
export function DifferenceSection() {
  const colunas = [
    { key: 'arquetypus', label: 'Arquétypus', img: arquetypusImg, alt: 'Frascos Arquétypus de Afrodite, Fênix e Sereia' },
    { key: 'comum', label: 'Marcas tradicionais', img: splashComumImg, alt: 'Frasco genérico de body splash' },
  ] as const

  return (
    <section
      id="diferenca"
      className="relative z-20 bg-noite px-4 pt-7 pb-7 md:px-10 lg:pt-12 lg:pb-12"
      style={{
        // Degrau invertido, como o do catálogo: a seção fica por cima e projeta sombra na de cima
        boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
        // filete dourado como borda
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
            O que torna <span className="max-lg:block" style={{ color: LATAO }}>Arquétypus diferente?</span>
          </h2>
        </div>

        {/* lg: colunas estreitas (max-w-2xl) — mais largas, cada item virava uma linha comprida e solta.
            A coluna Arquétypus é mais larga que a outra (destaque, out/2026) */}
        <div className="mx-auto mt-7 grid max-w-2xl grid-cols-[1.12fr_1fr] grid-rows-[auto_repeat(5,auto)] gap-x-2.5 lg:mt-10 lg:grid-cols-[1.2fr_1fr] lg:gap-x-5">
          {colunas.map((col) => {
            const nossa = col.key === 'arquetypus'
            return (
              <div
                key={col.key}
                className={`row-span-6 grid grid-rows-subgrid overflow-hidden rounded-2xl ${
                  nossa
                    ? 'bg-papel-inv/[0.09] shadow-[0_0_44px_-14px_var(--color-latao)] ring-2 ring-latao/80'
                    : 'ring-1 ring-papel-inv/10'
                }`}
              >
                <div>
                  <img
                    src={col.img}
                    alt={col.alt}
                    loading="lazy"
                    // mesma altura nas duas fotos (a coluna Arquétypus é mais larga) pra os rótulos ficarem na mesma linha
                    className={`h-32 w-full object-cover lg:h-52 ${nossa ? '' : 'opacity-85 grayscale-[30%]'}`}
                  />
                  <p
                    className={`px-2 pt-3.5 pb-1 text-center font-label whitespace-nowrap uppercase lg:px-5 lg:pt-5 ${
                      nossa
                        ? 'text-[11.5px] font-semibold tracking-[0.24em] lg:text-[13px] lg:tracking-[0.32em]'
                        : 'text-[9px] tracking-[0.08em] lg:text-[11px] lg:tracking-[0.3em]'
                    }`}
                    style={{ color: nossa ? LATAO : 'color-mix(in srgb, var(--color-papel-inv) 45%, transparent)' }}
                  >
                    {col.label}
                  </p>
                </div>
                {COMPARISON.map((c, i) => (
                  <p
                    key={c.tema}
                    className={`flex gap-2 px-3 py-2.5 leading-snug lg:gap-3 lg:px-5 lg:py-3 ${
                      nossa ? 'text-[13.5px] lg:text-[15px]' : 'text-[12.5px] lg:text-[14px]'
                    } ${
                      i > 0 ? 'border-t border-papel-inv/10' : ''
                    } ${nossa ? 'text-papel-inv' : 'text-papel-inv/40'}`}
                  >
                    {nossa ? <Check /> : <Cross />}
                    <span>
                      {nossa ? c.arquetypus : c.comum}
                      {/* descrição na linha de baixo, um pouco menor e mais apagada */}
                      <span className="mt-0.5 block text-[0.88em] opacity-70">{nossa ? c.arquetypusDesc : c.comumDesc}</span>
                    </span>
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
