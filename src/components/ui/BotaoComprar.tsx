import { VENDAS_ATIVAS } from '@/data/empresa'

/**
 * Botão de compra do produto (PDP, pop-up e barra fixa) — out/2026, ativado a pedido do usuário pra trabalhar o
 * destaque: dourado (latão) cheio, texto claro, sombra dourada e brilho que atravessa de tempos em tempos
 * (.cta-compra-sheen, index.css). Hover: a cor não muda (preto e dourado escurecido foram descartados pelo
 * usuário) — o brilho atravessa na hora, a sombra dourada cresce e o botão sobe 1 px. Depois do clique, 2 s em verde (`ok`) com "Adicionado à sacola ✓". Ainda não existe checkout: o clique põe na sacola (memória). Com
 * `VENDAS_ATIVAS = false` (data/empresa.ts) volta ao "Em breve" desligado.
 * Tamanho/espaçamento vêm de quem usa (`className`).
 */
export function BotaoComprar({
  onClick,
  adicionado = false,
  id,
  tabIndex,
  className = '',
}: {
  onClick?: () => void
  adicionado?: boolean
  id?: string
  tabIndex?: number
  className?: string
}) {
  if (!VENDAS_ATIVAS) {
    return (
      <button id={id} disabled tabIndex={tabIndex} className={`rounded-lg bg-tinta font-medium tracking-[0.12em] text-papel uppercase opacity-40 ${className}`}>
        Em breve
      </button>
    )
  }
  return (
    <button
      type="button"
      id={id}
      tabIndex={tabIndex}
      onClick={onClick}
      aria-live="polite"
      className={`group relative isolate overflow-hidden rounded-lg font-semibold tracking-[0.14em] text-papel uppercase transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.985] ${
        adicionado
          ? // confirmação (2 s): verde do "Em estoque" (token ok), sombra verde, sem brilho nem hover
            'bg-ok shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--color-ok)_90%,black)]'
          : 'bg-latao shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--color-latao)_90%,black)] hover:-translate-y-px hover:shadow-[0_18px_36px_-12px_color-mix(in_srgb,var(--color-latao)_100%,transparent)] active:translate-y-0'
      } ${className}`}
    >
      {!adicionado && <span aria-hidden className="cta-compra-sheen pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2" />}
      {adicionado ? (
        // celular: rótulo curto — o longo quebrava/cortava ao lado do seletor de quantidade (out/2026)
        <>
          <span className="lg:hidden">Adicionado ✓</span>
          <span className="max-lg:hidden">Adicionado à sacola ✓</span>
        </>
      ) : (
        'Comprar agora'
      )}
    </button>
  )
}
