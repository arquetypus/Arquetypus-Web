import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import wordmarkPreto from '@/assets/brand/wordmark-preto.png'

interface DrawerLink {
  label: string
  to?: string
}

interface DrawerGroup {
  title: string
  links: DrawerLink[]
}

const GROUPS: DrawerGroup[] = [
  {
    title: 'Descobrir',
    links: [
      { label: 'Os 9 arquétipos', to: '/#catalogo' },
    ],
  },
  {
    title: 'Comprar',
    links: [
      { label: 'Feminino · 200 ml', to: '/#segmentos' },
      { label: 'Masculino · 220 ml', to: '/#segmentos' },
      { label: 'Unissex', to: '/#segmentos' },
      { label: 'Perfumes', to: '/#catalogo' },
    ],
  },
  {
    title: 'A marca',
    links: [
      { label: 'Diário olfativo', to: '/#diario' },
      { label: 'Seja criador', to: '/criadores' },
      { label: 'Sobre' },
      { label: 'Ajuda e trocas' },
    ],
  },
]

/**
 * Menu lateral do celular (aberto pelo botão do header no Layout). Fica sempre montado pra animar a entrada e a
 * saída; fechado, sai da árvore de foco (inert). Âncoras (/#id) passam pelo onNavClick do Layout, que rola o
 * container da página em vez da janela.
 */
export function Drawer({
  open,
  onClose,
  onNavClick,
}: {
  open: boolean
  onClose: () => void
  onNavClick: (e: React.MouseEvent, to: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-30 lg:hidden ${open ? '' : 'pointer-events-none'}`} inert={!open} aria-hidden={!open}>
      {/* fundo escurecido — fecha ao tocar */}
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-500 ease-out ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <nav
        aria-label="Menu"
        className={`relative flex h-full w-[84%] max-w-sm flex-col overflow-y-auto bg-papel text-tinta shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* topo com a mesma altura e o mesmo filete dourado do header */}
        <div className="relative flex h-14 shrink-0 items-center justify-between px-5">
          <img src={wordmarkPreto} alt="Arquétypus" className="logo-tinta h-9 w-auto" />
          <button ref={closeRef} type="button" aria-label="Fechar menu" onClick={onClose} className="-mr-2 grid size-10 cursor-pointer place-items-center">
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" className="size-[18px]">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-latao) 15%, transparent), var(--color-latao) 50%, color-mix(in srgb, var(--color-latao) 15%, transparent))' }}
          />
        </div>

        <div className="flex-1 px-5 pt-2 pb-10">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mt-7 mb-1 font-label text-[9.5px] tracking-[0.3em] text-latao-texto uppercase">{group.title}</p>
              {group.links.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={(e) => {
                      onNavClick(e, link.to!)
                      onClose()
                    }}
                    className="group flex items-center justify-between border-b border-linha py-3.5 font-display text-[19px]"
                  >
                    {link.label}
                    <span aria-hidden className="text-sm text-tinta-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                ) : (
                  <span key={link.label} aria-disabled="true" className="flex items-center justify-between border-b border-linha py-3.5 font-display text-[19px] text-tinta-3">
                    {link.label}
                    <span className="font-label text-[8.5px] tracking-[0.2em] uppercase">Em breve</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
