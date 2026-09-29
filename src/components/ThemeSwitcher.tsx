import { THEMES, setTheme, useTheme } from '@/lib/theme'

/**
 * Barra "Escolha a direção visual" — ferramenta interna pra comparar variações do site. A maioria muda
 * só tokens (paleta/fonte/cantos, html[data-theme] em index.css); "Ateliê" também troca a estrutura de
 * algumas seções (ver useTheme em lib/theme.ts). Inspirada na barra da LP de referência
 * (lab-fabio.vercel.app/arquetypus-lp). Desligar antes do lançamento.
 */
export const SHOW_THEME_SWITCHER = true

export function ThemeSwitcher() {
  const theme = useTheme()
  if (!SHOW_THEME_SWITCHER) return null

  return (
    <div
      role="region"
      aria-label="Direção visual"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-[90] flex justify-center px-3 pb-[env(safe-area-inset-bottom)]"
    >
      {/* cores fixas (não tokens): a barra é ferramenta, fica igual em qualquer direção */}
      <div className="pointer-events-auto flex max-w-full items-center gap-3 overflow-x-auto rounded-lg border border-[#ded9df] bg-white/95 px-2 py-1.5 text-[#302c34] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur [scrollbar-width:none] md:gap-5 md:px-4">
        <span className="hidden shrink-0 font-sans text-[9px] tracking-[0.14em] uppercase xl:block">Escolha a direção visual</span>
        <nav className="flex shrink-0 gap-1">
          {THEMES.map((t, i) => {
            const on = t.id === theme
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setTheme(t.id)}
                className={`shrink-0 cursor-pointer rounded border px-2.5 py-2 font-sans text-[10px] whitespace-nowrap md:px-3 md:text-[11px] ${
                  on ? 'border-[#302c34] bg-[#302c34] text-white' : 'border-transparent hover:border-[#ada3ae]'
                }`}
              >
                <b className={`mr-1 font-normal ${on ? 'opacity-60' : 'opacity-50'}`}>{String(i + 1).padStart(2, '0')}</b>
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
