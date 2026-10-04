import { BENEFITS } from '@/data/home'

/** quantas vezes a lista se repete em cada metade da faixa — o bastante pra cobrir telas largas sem buraco */
const REPETE = 3

function Itens({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3">
      {Array.from({ length: REPETE }).flatMap((_, r) =>
        BENEFITS.map((b) => (
          // com movimento reduzido só a 1ª repetição aparece
          <li key={`${r}-${b.label}`} className={`flex shrink-0 items-center ${r > 0 ? 'motion-reduce:hidden' : ''}`}>
            <span className="flex items-center gap-3 px-7 lg:gap-4 lg:px-10">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-3.5 shrink-0 lg:size-4"
                fill="none"
                stroke="var(--color-latao)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={b.icon} />
              </svg>
              <span className="font-display text-lg whitespace-nowrap text-papel-inv italic lg:text-2xl">{b.label}</span>
            </span>
            {/* losango dourado entre os itens */}
            <span aria-hidden className="size-1 rotate-45 bg-latao/70" />
          </li>
        )),
      )}
    </ul>
  )
}

/**
 * H-20 Benefícios — faixa corrida (marquee) no lugar do bloco de garantia: garantia, envio, pagamento seguro,
 * parcelamento e desconto no Pix passando sem parar, em itálico com ícones de traço dourados, entre dois filetes.
 * Para no hover. Duas metades iguais deslizam -50% em loop (animação em index.css, .beneficios-marquee); as bordas
 * somem num degradê. Com movimento reduzido, a faixa fica parada e a lista quebra em linhas, centralizada.
 * Textos em BENEFITS (data/home.ts).
 */
export function BenefitsMarquee() {
  return (
    <section
      id="beneficios"
      aria-label="Benefícios"
      className="group relative z-20 overflow-hidden bg-noite py-4 lg:py-5"
      style={{
        // degrau invertido, como as seções escuras vizinhas, e filete dourado embaixo fechando a faixa
        boxShadow: '0 -14px 26px -10px rgba(37,46,40,0.5), 0 -4px 8px -3px rgba(37,46,40,0.35)',
        borderTop: '1px solid color-mix(in srgb, var(--color-latao) 70%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--color-latao) 40%, transparent)',
      }}
    >
      {/* máscara no wrapper parado (na faixa que anda, as bordas esmaecidas andariam junto) */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="beneficios-marquee flex w-max motion-reduce:w-auto motion-reduce:justify-center">
          <Itens />
          <div className="flex motion-reduce:hidden">
            <Itens hidden />
          </div>
        </div>
      </div>
    </section>
  )
}
