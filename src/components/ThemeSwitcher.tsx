import { useEffect, useState } from 'react'
import { CATALOGS, ESTILOS, HEROES, PALETAS, THEMES, clearPins, setPin, setTheme, useThemeState } from '@/lib/theme'

/**
 * Painel "Direção visual" — ferramenta interna pra comparar variações do site (ver lib/theme.ts).
 * Botão flutuante no canto abre uma sidebar à direita com os cinco parâmetros: estrutura, paleta, estilo,
 * hero e catálogo. Paleta/estilo/hero/catálogo seguem o padrão da estrutura até a pessoa escolher outro
 * — aí ficam fixados e valem em qualquer estrutura ("Usar padrão" solta um; "Restaurar padrões" solta
 * todos). "Copiar link" leva a combinação inteira na URL. Esc fecha. Desligar antes do lançamento.
 *
 * Cores fixas (não tokens): a ferramenta fica igual em qualquer direção. As amostras de paleta e estilo
 * usam data-paleta / data-estilo no próprio elemento (index.css aceita os dois fora do <html>).
 */
export const SHOW_THEME_SWITCHER = true

const OPEN_KEY = 'arq-painel-aberto'

function lerAberto() {
  try {
    return localStorage.getItem(OPEN_KEY) === '1'
  } catch {
    return false
  }
}

const SWATCH = ['--color-papel', '--color-tinta', '--color-latao', '--color-noite']

function Ico({ d, className = 'size-4' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={d} />
    </svg>
  )
}
const I = {
  paleta: 'M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-.9-.6-1.3-.6-2.1 0-.9.7-1.4 1.6-1.4H16a5 5 0 0 0 5-5C21 6.5 17 3 12 3ZM7.5 11.5h.01M10 7.5h.01M15 7.5h.01',
  fechar: 'M6 6l12 12M18 6L6 18',
  link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
  reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  check: 'M5 12.5l4.5 4.5L19 7',
  pin: 'M12 17v4M8 3h8l-1 6 3 3H6l3-3-1-6Z',
}

/** Cabeçalho de seção: título, ajuda e o estado (padrão da estrutura × fixado). */
function Cabeca({ titulo, ajuda, fixado, onSoltar }: { titulo: string; ajuda?: string; fixado?: boolean; onSoltar?: () => void }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[#1d1b20] uppercase">{titulo}</h3>
        {ajuda && <p className="mt-0.5 text-[11px] leading-snug text-[#7a7480]">{ajuda}</p>}
      </div>
      {fixado !== undefined &&
        (fixado ? (
          <button
            type="button"
            onClick={onSoltar}
            title="Voltar ao padrão da estrutura"
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#1d1b20] px-2 py-0.5 text-[10px] font-medium text-white hover:bg-[#3b3740]"
          >
            <Ico d={I.pin} className="size-3" /> Fixado · usar padrão
          </button>
        ) : (
          <span className="shrink-0 rounded-full bg-[#f1eff3] px-2 py-0.5 text-[10px] text-[#7a7480]">Padrão da estrutura</span>
        ))}
    </div>
  )
}

/** Linha de lista (hero/catálogo): rádio discreto. */
function Opcao({ ativo, padrao, onClick, children }: { ativo: boolean; padrao?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[12px] transition-colors ${
        ativo ? 'border-[#1d1b20] bg-[#1d1b20] text-white' : 'border-[#e7e4ea] bg-white text-[#2b2830] hover:border-[#b9b3bf]'
      }`}
    >
      <span className={`grid size-3.5 shrink-0 place-items-center rounded-full border ${ativo ? 'border-white' : 'border-[#b9b3bf]'}`}>
        {ativo && <span className="size-1.5 rounded-full bg-white" />}
      </span>
      <span className="flex-1">{children}</span>
      {padrao && <span className={`text-[10px] ${ativo ? 'text-white/60' : 'text-[#9a94a0]'}`}>padrão</span>}
    </button>
  )
}

export function ThemeSwitcher() {
  const s = useThemeState()
  const [aberto, setAberto] = useState(lerAberto)
  const [copiado, setCopiado] = useState(false)
  const estrutura = THEMES.find((t) => t.id === s.theme)!
  const temPins = Object.keys(s.pins).length > 0

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_KEY, aberto ? '1' : '0')
    } catch {
      /* sem storage */
    }
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aberto])

  if (!SHOW_THEME_SWITCHER) return null

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch {
      /* clipboard bloqueado: a URL já está na barra do navegador */
    }
  }

  return (
    <>
      {/* botão flutuante */}
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="painel-direcao"
        className={`fixed right-4 bottom-4 z-[95] flex cursor-pointer items-center gap-3 rounded-full border border-[#e7e4ea] bg-white py-2 pr-4 pl-2 font-sans text-[#1d1b20] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-opacity hover:border-[#b9b3bf] ${
          aberto ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span data-paleta={s.paleta} className="flex overflow-hidden rounded-full ring-1 ring-black/10">
          {SWATCH.map((v) => (
            <span key={v} className="h-7 w-2.5" style={{ background: `var(${v})` }} />
          ))}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] tracking-[0.08em] text-[#7a7480] uppercase">Direção visual</span>
          <span className="block text-[13px] font-semibold">
            {estrutura.label}
            {temPins && <span className="ml-1.5 text-[11px] font-normal text-[#7a7480]">+ {Object.keys(s.pins).length} fixado(s)</span>}
          </span>
        </span>
      </button>

      {/* fundo (só celular/tablet) */}
      {aberto && <div aria-hidden onClick={() => setAberto(false)} className="fixed inset-0 z-[96] bg-black/30 lg:hidden" />}

      <aside
        id="painel-direcao"
        aria-label="Direção visual"
        aria-hidden={!aberto}
        className={`fixed inset-y-0 right-0 z-[97] flex w-full max-w-[380px] flex-col border-l border-[#e7e4ea] bg-white font-sans text-[#2b2830] shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
          aberto ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        {/* cabeçalho */}
        <header className="border-b border-[#efedf1] px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] text-[#7a7480] uppercase">
                <Ico d={I.paleta} className="size-3.5" /> Direção visual
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#1d1b20]">{estrutura.label}</h2>
              <p className="text-[12px] text-[#7a7480]">
                {PALETAS.find((p) => p.id === s.paleta)?.label} · {ESTILOS.find((e) => e.id === s.estilo)?.label.split(' · ')[0]}
              </p>
            </div>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar painel" className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#7a7480] hover:bg-[#f1eff3] hover:text-[#1d1b20]">
              <Ico d={I.fechar} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={copiar} className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#1d1b20] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#3b3740]">
              <Ico d={copiado ? I.check : I.link} className="size-3.5" /> {copiado ? 'Link copiado' : 'Copiar link'}
            </button>
            <button
              type="button"
              onClick={clearPins}
              disabled={!temPins}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e7e4ea] px-3 py-2 text-[12px] font-medium text-[#2b2830] hover:border-[#b9b3bf] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#e7e4ea]"
            >
              <Ico d={I.reset} className="size-3.5" /> Restaurar padrões
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-width:thin]">
          {/* Estrutura */}
          <section>
            <Cabeca titulo="Estrutura" ajuda="O layout da home. Cada uma traz paleta, estilo, hero e catálogo próprios." />
            <div role="radiogroup" aria-label="Estrutura" className="grid grid-cols-2 gap-2">
              {THEMES.map((t, i) => {
                const on = t.id === s.theme
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTheme(t.id)}
                    className={`cursor-pointer rounded-xl border p-2.5 text-left transition-colors ${on ? 'border-[#1d1b20] ring-1 ring-[#1d1b20]' : 'border-[#e7e4ea] hover:border-[#b9b3bf]'}`}
                  >
                    {/* miniatura: as cores e a fonte padrão da estrutura */}
                    <span data-paleta={t.paleta} data-estilo={t.estilo} className="flex h-12 items-end justify-between overflow-hidden rounded-lg px-2 pb-1.5" style={{ background: 'var(--color-papel)' }}>
                      <span className="text-xl leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-tinta)' }}>
                        Aa
                      </span>
                      <span className="flex gap-1">
                        <span className="size-2.5 rounded-full" style={{ background: 'var(--color-latao)' }} />
                        <span className="size-2.5 rounded-full" style={{ background: 'var(--color-noite)' }} />
                      </span>
                    </span>
                    <span className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-[10px] text-[#9a94a0] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[12px] font-semibold text-[#1d1b20]">{t.label}</span>
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-[#7a7480]">{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Paleta */}
          <section>
            <Cabeca titulo="Paleta" ajuda="Só as cores. Escolher uma fixa a paleta em todas as estruturas." fixado={!!s.pins.paleta} onSoltar={() => setPin('paleta', null)} />
            <div role="radiogroup" aria-label="Paleta" className="grid grid-cols-2 gap-2">
              {PALETAS.map((p) => {
                const on = p.id === s.paleta
                const padrao = p.id === estrutura.paleta
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPin('paleta', padrao ? null : p.id)}
                    className={`cursor-pointer rounded-lg border p-1.5 text-left transition-colors ${on ? 'border-[#1d1b20] ring-1 ring-[#1d1b20]' : 'border-[#e7e4ea] hover:border-[#b9b3bf]'}`}
                  >
                    <span data-paleta={p.id} className="flex h-7 overflow-hidden rounded-md ring-1 ring-black/5">
                      {SWATCH.map((v) => (
                        <span key={v} className="flex-1" style={{ background: `var(${v})` }} />
                      ))}
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                      <span className="truncate text-[11px] text-[#2b2830]">{p.label.split(' · ')[0]}</span>
                      {padrao && <span className="shrink-0 text-[9px] text-[#9a94a0]">padrão</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Estilo */}
          <section>
            <Cabeca titulo="Estilo" ajuda="Fonte dos títulos e arredondamento dos cantos." fixado={!!s.pins.estilo} onSoltar={() => setPin('estilo', null)} />
            <div role="radiogroup" aria-label="Estilo" className="space-y-1.5">
              {ESTILOS.map((e) => {
                const on = e.id === s.estilo
                const padrao = e.id === estrutura.estilo
                const [nome, origem] = e.label.split(' · ')
                return (
                  <button
                    key={e.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPin('estilo', padrao ? null : e.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${on ? 'border-[#1d1b20] ring-1 ring-[#1d1b20]' : 'border-[#e7e4ea] hover:border-[#b9b3bf]'}`}
                  >
                    <span data-estilo={e.id} className="w-24 shrink-0 truncate text-[22px] leading-none text-[#1d1b20]" style={{ fontFamily: 'var(--font-display)' }}>
                      Arquétypus
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium">{nome}</span>
                      <span className="block truncate text-[10.5px] text-[#9a94a0]">{origem}</span>
                    </span>
                    {padrao && <span className="text-[9px] text-[#9a94a0]">padrão</span>}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Hero */}
          <section>
            <Cabeca titulo="Hero" ajuda="A primeira dobra da home." fixado={!!s.pins.hero} onSoltar={() => setPin('hero', null)} />
            <div role="radiogroup" aria-label="Hero" className="space-y-1.5">
              {HEROES.map((h) => {
                const padrao = h.id === estrutura.hero
                return (
                  <Opcao key={h.id} ativo={h.id === s.hero} padrao={padrao} onClick={() => setPin('hero', padrao ? null : h.id)}>
                    {h.label}
                  </Opcao>
                )
              })}
            </div>
          </section>

          {/* Catálogo */}
          <section>
            <Cabeca titulo="Catálogo" ajuda="Como os 9 arquétipos aparecem pra compra." fixado={!!s.pins.catalogo} onSoltar={() => setPin('catalogo', null)} />
            <div role="radiogroup" aria-label="Catálogo" className="space-y-1.5">
              {CATALOGS.map((c) => {
                const padrao = c.id === estrutura.catalogo
                return (
                  <Opcao key={c.id} ativo={c.id === s.catalogo} padrao={padrao} onClick={() => setPin('catalogo', padrao ? null : c.id)}>
                    {c.label}
                  </Opcao>
                )
              })}
            </div>
          </section>
        </div>

        <footer className="border-t border-[#efedf1] px-5 py-3 text-[10.5px] text-[#9a94a0]">
          Ferramenta interna de comparação · <kbd className="rounded border border-[#e7e4ea] px-1">Esc</kbd> fecha
        </footer>
      </aside>
    </>
  )
}
