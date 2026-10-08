import type { Archetype } from '@/types/archetype'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Preço do produto (out/2026): preço cheio riscado em cinza claro + preço com desconto em destaque
 * (latão, semibold). O tamanho vem do className de quem usa — o riscado é relativo (em). Se o
 * preço cheio não for maior que o de venda, mostra só o de venda. `tom="escuro"` pra fundo noite/foto.
 * `classeRiscado`: tamanho do riscado (padrão 0,72em) — a PDP e o pop-up usam menor, pra destacar a oferta.
 */
export function Preco({
  a,
  tom = 'claro',
  className = '',
  classeRiscado = 'text-[0.72em]',
}: {
  a: Pick<Archetype, 'preco' | 'precoCheio'>
  tom?: 'claro' | 'escuro'
  className?: string
  classeRiscado?: string
}) {
  const temDesconto = a.precoCheio > a.preco
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {temDesconto && (
        <s className={`${classeRiscado} font-normal ${tom === 'escuro' ? 'text-papel-inv/45' : 'text-tinta-3'}`}>
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
