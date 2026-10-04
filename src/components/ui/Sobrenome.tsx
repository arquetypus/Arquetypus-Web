import type { Archetype } from '@/types/archetype'

/**
 * Sobrenome do body splash (ex.: Fada → "First Kiss"), na linha abaixo do nome.
 * Vai dentro do elemento do nome: o tamanho é relativo a ele (em), herda cor e
 * fonte, e fica com menos peso e opacidade. Sem sobrenome no dado, não aparece.
 */
export function Sobrenome({
  a,
  size = 'text-[0.55em]',
  className = '',
}: {
  a: Pick<Archetype, 'sobrenome'>
  /** tamanho relativo ao nome — trocar aqui em vez de passar outro text-* no className */
  size?: string
  className?: string
}) {
  if (!a.sobrenome) return null
  return (
    <span className={`mt-[0.15em] block ${size} leading-tight font-normal opacity-65 ${className}`}>
      {a.sobrenome}
    </span>
  )
}
