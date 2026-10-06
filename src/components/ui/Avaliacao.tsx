import { getReview, SHOW_RATINGS } from '@/lib/reviews'

/** Fileira de 5 estrelas num elemento só (out/2026): a estrela é máscara CSS (`.estrelas` em index.css) repetida
 *  5 vezes com 1px entre elas, na cor do texto. Eram 5 SVGs por fileira — centenas de elementos na home. */
function Estrelas({ className }: { className: string }) {
  return <span className={`estrelas ${className}`} />
}

/**
 * Nota do produto no estilo Judge.me (out/2026): ★★★★★ 4,8 (37). Estrelas em latão com suporte a meia
 * estrela (a fileira cheia é recortada pela nota arredondada a 0,5), nota com 1 casa e a contagem em cinza.
 * O tamanho vem do className (estrela = 1em). `tom="escuro"` pra fundo noite/foto. Dados em lib/reviews.ts.
 */
export function Avaliacao({ id, tom = 'claro', className = '' }: { id: string; tom?: 'claro' | 'escuro'; className?: string }) {
  const r = SHOW_RATINGS ? getReview(id) : null
  if (!r) return null
  const meia = Math.round(r.rating * 2) / 2
  const nota = r.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const escuro = tom === 'escuro'
  return (
    <span
      className={`inline-flex items-center gap-1.5 leading-none ${className}`}
      role="img"
      aria-label={`Nota ${nota} de 5, ${r.count} avaliações`}
    >
      <span className="relative inline-flex" aria-hidden>
        <Estrelas className={escuro ? 'text-papel-inv/20' : 'text-linha-2'} />
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(meia / 5) * 100}%` }}>
          <Estrelas className="text-latao" />
        </span>
      </span>
      <span aria-hidden className={`tabular-nums ${escuro ? 'text-papel-inv/90' : 'text-tinta'}`}>{nota}</span>
      <span aria-hidden className={escuro ? 'text-papel-inv/55' : 'text-tinta-3'}>({r.count})</span>
    </span>
  )
}
