import type { ReactNode } from 'react'

/**
 * Contém o conteúdo de uma seção em tablet/desktop (até max-w-7xl), sem
 * limitar o fundo — a seção continua ocupando a tela toda.
 */
export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 md:px-10 ${className}`}>{children}</div>
}
