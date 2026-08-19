import { Link } from 'react-router-dom'

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
      { label: 'Fazer o teste', to: '/teste' },
      { label: 'Os 9 arquétipos', to: '/#catalogo' },
      { label: 'Kit Descoberta', to: '/kit-descoberta' },
    ],
  },
  {
    title: 'Comprar',
    links: [
      { label: 'Feminino · 200 ml', to: '/#segmentos' },
      { label: 'Masculino · 220 ml', to: '/#segmentos' },
      { label: 'Unissex', to: '/#segmentos' },
      { label: 'Perfumes', to: '/#catalogo' },
      { label: 'Kits e combos', to: '/kit-descoberta' },
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

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-md">
      {/* Backdrop — cobre tudo, fecha ao clicar */}
      <div
        className="absolute inset-0 bg-tinta/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel lateral */}
      <nav className="relative z-10 flex h-full w-72 flex-col overflow-y-auto bg-papel p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.22em] uppercase">Arquetypus</span>
          <button aria-label="Fechar menu" onClick={onClose} className="text-lg">
            ✕
          </button>
        </div>

        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mt-6 mb-1 font-mono text-[9.5px] tracking-[0.2em] text-latao uppercase">
              {group.title}
            </p>
            {group.links.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={onClose}
                  className="block border-b border-linha py-3.5 text-[17px]"
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.label}
                  aria-disabled="true"
                  className="block cursor-not-allowed border-b border-linha py-3.5 text-[17px] text-tinta-3"
                >
                  {link.label}
                  <span className="ml-2 font-mono text-[9px] tracking-wide uppercase">
                    Em breve
                  </span>
                </span>
              ),
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
