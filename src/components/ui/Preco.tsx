import type { Archetype } from '@/types/archetype'
import { useCupom } from '@/context/CupomContext'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Preço do produto (out/2026): preço cheio riscado em cinza claro + preço com desconto em destaque
 * (latão, semibold). O tamanho vem do className de quem usa — o riscado é relativo (em). Se o
 * preço cheio não for maior que o de venda, mostra só o de venda. `tom="escuro"` pra fundo noite/foto.
 * `classeRiscado`: tamanho do riscado (padrão 0,72em) — a PDP e o pop-up usam menor, pra destacar a oferta.
 *
 * Com cupom de link ativo (`?cupom=`, CupomContext; redesenho out/2026, pedido do usuário: "mais profissional"): o
 * riscado passa a ser o preço de venda e o destaque o preço com cupom — uma oferta só, sem dois riscados — e embaixo
 * um selo de cupom (contorno tracejado dourado, ícone de etiqueta, código + %). `basis-full` põe o selo na linha de
 * baixo nos layouts em fileira; nos em coluna vira mais um item; `seloAoLado` deixa na mesma linha. `semSelo` esconde o selo onde falta altura (barra fixa).
 */
export function Preco({
  a,
  tom = 'claro',
  className = '',
  classeRiscado = 'text-[0.72em]',
  semSelo = false,
  seloAoLado = false,
}: {
  a: Pick<Archetype, 'preco' | 'precoCheio'>
  tom?: 'claro' | 'escuro'
  className?: string
  classeRiscado?: string
  semSelo?: boolean
  /** selo na mesma linha do preço, centrado na altura (PDP/pop-up: embaixo empurrava o botão pra fora da tela no celular) */
  seloAoLado?: boolean
}) {
  const { cupom, precoFinal } = useCupom()
  const riscado = cupom ? a.preco : a.precoCheio
  const atual = cupom ? precoFinal(a.preco) : a.preco
  const temDesconto = riscado > atual
  const escuro = tom === 'escuro'
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {temDesconto && (
        <s className={`${classeRiscado} font-normal ${escuro ? 'text-papel-inv/45' : 'text-tinta-3'}`}>
          <span className="sr-only">De </span>
          {brl(riscado)}
        </s>
      )}
      {/* com cupom o preço final cresce (1,15em) e fica verde (out/2026, pedido do usuário: mais destaque) */}
      <span
        className={`font-semibold ${
          cupom ? `text-[1.15em] ${escuro ? 'text-[color-mix(in_srgb,var(--color-ok)_45%,white)]' : 'text-ok'}` : escuro ? 'text-latao' : 'text-latao-texto'
        }`}
      >
        {temDesconto && <span className="sr-only">por </span>}
        {brl(atual)}
        {cupom && <span className="sr-only"> com o cupom {cupom.codigo}</span>}
      </span>
      {!semSelo && (
        <span className={seloAoLado ? 'self-center' : 'basis-full'}>
          <SeloCupom tom={tom} className={seloAoLado ? '' : 'mt-[0.45em]'} />
        </span>
      )}
    </span>
  )
}

/**
 * Selo do cupom de link ("CONHECA15 | −15%"): contorno tracejado dourado e ícone de etiqueta. Some sem cupom ativo.
 * Usado pelo Preco e solto onde o selo flutua por cima de um cartão (`flutuante`: fundo opaco + sombra) — card da
 * comunidade. O tamanho acompanha a fonte de quem envolve (em), com piso de 9 px.
 */
export function SeloCupom({ tom = 'claro', flutuante = false, className = '' }: { tom?: 'claro' | 'escuro'; flutuante?: boolean; className?: string }) {
  const { cupom } = useCupom()
  if (!cupom) return null
  const escuro = tom === 'escuro'
  return (
    <span
      aria-hidden
      className={`inline-flex items-center gap-[0.5em] rounded-sm border border-dashed px-[0.6em] py-[0.3em] font-label text-[max(9px,0.4em)] leading-none font-medium tracking-[0.16em] whitespace-nowrap uppercase ${
        escuro ? 'border-latao/60 text-latao' : 'border-latao/70 text-latao-texto'
      } ${flutuante ? 'bg-papel shadow-[0_6px_14px_-6px_rgba(40,46,41,0.45)]' : escuro ? '' : 'bg-latao/[0.07]'} ${className}`}
    >
      {/* etiqueta */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-[1.25em] shrink-0">
        <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z" />
        <circle cx="8" cy="8" r="1.3" />
      </svg>
      {cupom.codigo}
      <span className="h-[1em] w-px bg-latao/50" />
      −{cupom.pct}%
    </span>
  )
}
