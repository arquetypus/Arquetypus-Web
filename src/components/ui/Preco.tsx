import type { Archetype } from '@/types/archetype'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Preço do produto (out/2026): preço cheio riscado em cinza claro + preço com desconto em destaque
 * (latão, semibold). O tamanho vem do className de quem usa — o riscado é relativo (em). Se o
 * preço cheio não for maior que o de venda, mostra só o de venda. `tom="escuro"` pra fundo noite/foto.
 */
export function Preco({
  a,
  tom = 'claro',
  className = '',
}: {
  a: Pick<Archetype, 'preco' | 'precoCheio'>
  tom?: 'claro' | 'escuro'
  className?: string
}) {
  const temDesconto = a.precoCheio > a.preco
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {temDesconto && (
        <s className={`text-[0.72em] font-normal ${tom === 'escuro' ? 'text-papel-inv/45' : 'text-tinta-3'}`}>
          <span className="sr-only">De </span>
          {brl(a.precoCheio)}
        </s>
      )}
      <span className={`font-semibold ${tom === 'escuro' ? 'text-latao' : 'text-latao-texto'}`}>
        {temDesconto && <span className="sr-only">por </span>}
        {brl(a.preco)}
      </span>
    </span>
  )
}
