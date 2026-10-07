import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/** quanto precisa arrastar (px) ou a velocidade (px/ms) pra soltar e fechar; abaixo disso o card volta */
const FECHA_PX = 110
const FECHA_VEL = 0.5
/** duração da saída — o navigate(-1) acontece no fim dela, com o card já fora da tela */
const SAIDA_MS = 340
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

/**
 * Casca do pop-up de compra (bottom sheet): fundo escurecido, puxador, fechar e link "Ver página completa".
 * Sempre aberto como rota com `state.backgroundLocation` (ver App.tsx) — a URL `fullPageTo` acessada direto
 * abre a página completa.
 *
 * Fechar sempre com a mesma saída animada (o card desce e o fundo some, depois volta a rota): ✕, toque no fundo,
 * Esc, arrastar o puxador pra baixo e, no celular, arrastar o conteúdo pra baixo quando ele já está no topo.
 * Durante o arraste o card acompanha o dedo e o fundo clareia; soltando antes do limite, ele volta com mola.
 * lg+: modal centralizado — a saída é um fade com leve descida.
 */
export function PurchaseSheet({ label, fullPageTo, children }: { label: string; fullPageTo: string; children: ReactNode }) {
  const navigate = useNavigate()
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const desktop = () => window.matchMedia('(min-width: 1024px)').matches

  const saiuRef = useRef(false)
  const sair = useCallback(() => {
    if (saiuRef.current) return
    saiuRef.current = true
    navigate(-1)
  }, [navigate])

  // a rota volta quando a transição de saída termina (onTransitionEnd do card); o timer é só reserva, pra
  // movimento reduzido ou se a transição não disparar
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setDragging(false)
    setClosing(true)
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(sair, reduz ? 0 : SAIDA_MS + 200)
  }, [sair])

  useEffect(() => {
    // trava o scroll da página por trás (o scroll vive no container do Layout)
    const scroller = document.querySelector<HTMLElement>('[data-scroll-container]')
    const prev = scroller?.style.overflowY
    if (scroller) scroller.style.overflowY = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      if (scroller) scroller.style.overflowY = prev ?? ''
      document.removeEventListener('keydown', onKey)
    }
  }, [close])

  // Arraste pra fechar (celular). Listeners nativos com passive: false pra poder segurar o scroll do conteúdo
  // enquanto o card desce. Vale no puxador sempre e no conteúdo só quando ele está no topo e o gesto é pra baixo.
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    let startY = 0
    let startX = 0
    let lastY = 0
    let lastT = 0
    let vel = 0
    let ativo = false // já está arrastando o card
    let candidato = false // começou num lugar que pode virar arraste

    function down(y: number, target: EventTarget | null, x = 0) {
      if (desktop() || closingRef.current) return
      const noPuxador = !!(target as HTMLElement | null)?.closest('[data-sheet-handle]')
      const noTopo = (scrollRef.current?.scrollTop ?? 0) <= 0
      candidato = noPuxador || noTopo
      ativo = false
      startY = lastY = y
      startX = x
      lastT = performance.now()
      vel = 0
    }
    function move(y: number, e: Event, x = startX) {
      if (!candidato) return
      const dy = y - startY
      if (!ativo) {
        // gesto mais horizontal que vertical (ex.: galeria de fotos) não é arraste do card
        if (Math.abs(x - startX) > Math.abs(dy)) {
          candidato = false
          return
        }
        // só vira arraste se for pra baixo (pra cima é scroll normal do conteúdo)
        if (dy > 6 && (scrollRef.current?.scrollTop ?? 0) <= 0) {
          ativo = true
          setDragging(true)
        } else if (dy < -6) {
          candidato = false
          return
        } else return
      }
      if (e.cancelable) e.preventDefault()
      const now = performance.now()
      vel = (y - lastY) / Math.max(1, now - lastT)
      lastY = y
      lastT = now
      // um pouco de resistência: o card anda um tiquinho menos que o dedo
      setDragY(Math.max(0, dy * 0.92))
    }
    function up() {
      if (!ativo) {
        candidato = false
        return
      }
      ativo = false
      candidato = false
      const dist = lastY - startY
      if (dist > FECHA_PX || vel > FECHA_VEL) close()
      else {
        setDragging(false)
        setDragY(0)
      }
    }

    const ts = (e: TouchEvent) => down(e.touches[0].clientY, e.target, e.touches[0].clientX)
    const tm = (e: TouchEvent) => move(e.touches[0].clientY, e, e.touches[0].clientX)
    const te = () => up()
    // mouse/caneta: só pelo puxador (no conteúdo, o mouse seleciona texto e rola com a roda)
    const pd = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (!(e.target as HTMLElement).closest('[data-sheet-handle]')) return
      down(e.clientY, e.target)
      const pm = (ev: PointerEvent) => move(ev.clientY, ev)
      const pu = () => {
        up()
        window.removeEventListener('pointermove', pm)
        window.removeEventListener('pointerup', pu)
      }
      window.addEventListener('pointermove', pm)
      window.addEventListener('pointerup', pu)
    }

    sheet.addEventListener('touchstart', ts, { passive: true })
    sheet.addEventListener('touchmove', tm, { passive: false })
    sheet.addEventListener('touchend', te)
    sheet.addEventListener('touchcancel', te)
    sheet.addEventListener('pointerdown', pd)
    return () => {
      sheet.removeEventListener('touchstart', ts)
      sheet.removeEventListener('touchmove', tm)
      sheet.removeEventListener('touchend', te)
      sheet.removeEventListener('touchcancel', te)
      sheet.removeEventListener('pointerdown', pd)
    }
  }, [close])

  const altura = sheetRef.current?.offsetHeight ?? 700
  const transformFechando = desktop() ? 'translateY(24px) scale(0.98)' : 'translateY(100%)'
  const sheetStyle: React.CSSProperties = {
    transform: closing ? transformFechando : dragY ? `translateY(${dragY}px)` : undefined,
    opacity: closing && desktop() ? 0 : undefined,
    transition: dragging ? 'none' : `transform ${SAIDA_MS}ms ${EASE}, opacity ${SAIDA_MS}ms ease-out`,
  }
  // o fundo clareia conforme o card desce
  const fundoOpacity = closing ? 0 : 1 - Math.min(1, dragY / altura) * 0.9

  return (
    // lg+: deixa de ser bottom sheet e vira modal centralizado, largo o bastante pra galeria + compra lado a lado
    <div className="fixed inset-0 z-40 flex items-end justify-center lg:items-center lg:p-8" role="dialog" aria-modal="true" aria-label={label}>
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="sheet-backdrop absolute inset-0 cursor-default bg-noite/60"
        style={{ opacity: fundoOpacity, transition: dragging ? 'none' : `opacity ${SAIDA_MS}ms ease-out` }}
      />
      <div
        ref={sheetRef}
        className="sheet-in relative flex max-h-[90svh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-papel shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.5)] will-change-transform md:max-w-xl lg:max-h-[88svh] lg:max-w-6xl lg:rounded-3xl lg:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
        style={sheetStyle}
        onTransitionEnd={(e) => {
          if (closing && e.target === e.currentTarget && e.propertyName === 'transform') sair()
        }}
      >
        {/* lg+: sem barra — o ✕ flutua no canto e o conteúdo começa no topo.
            Celular: a barra inteira é a área de arraste (data-sheet-handle), com o puxador no meio */}
        <div
          data-sheet-handle
          className="relative flex shrink-0 cursor-grab touch-none items-center justify-center border-b border-linha py-3 active:cursor-grabbing lg:absolute lg:top-0 lg:right-0 lg:z-10 lg:cursor-auto lg:border-0 lg:p-0"
        >
          {/* puxador só faz sentido no bottom sheet */}
          <span aria-hidden className="h-1 w-10 rounded-full bg-linha-2 lg:hidden" />
          <button
            type="button"
            onClick={close}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Fechar"
            className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-lg text-tinta-3 transition-colors hover:bg-papel-2 hover:text-tinta lg:static lg:mt-3 lg:mr-3 lg:size-10 lg:translate-y-0 lg:bg-papel/80 lg:backdrop-blur-sm"
          >
            ✕
          </button>
        </div>
        <div ref={scrollRef} className="overflow-y-auto overscroll-contain pb-6 lg:pb-0">
          {children}
          {/* lg: o ProductPurchase mostra o link na coluna da galeria — aqui só celular */}
          <div className="mt-4 px-4 text-center lg:hidden">
            <Link
              to={fullPageTo}
              replace
              className="inline-block py-2 font-label text-[10px] tracking-[0.18em] text-latao-texto uppercase"
            >
              <span className="border-b border-latao-texto/40 pb-0.5">Ver página completa</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
