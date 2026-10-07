import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { productPath } from '@/data/archetypes'
import { FRASCO_CUT_IMG } from '@/data/home'
import { buscar, SUGESTOES_BUSCA, type ResultadoBusca } from '@/lib/busca'
import { Preco } from '@/components/ui/Preco'
import { Sobrenome } from '@/components/ui/Sobrenome'

/**
 * Busca do header (out/2026). Desktop: o campo do header procura enquanto digita e abre um painel de resultados
 * embaixo (setas ↑↓ escolhem, Enter abre, Esc fecha). Celular: a lupa abre a busca em tela cheia. Resultado leva à
 * página completa do produto. Motor em lib/busca.ts (nome, família, notas, gênero, sinônimos…).
 */

const Lupa = ({ className }: { className: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" className={className}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5" />
  </svg>
)

/** sugestões (campo vazio) ou lista de resultados; `ativo` = índice destacado pelo teclado */
function Resultados({
  consulta,
  resultados,
  ativo,
  idLista,
  onEscolher,
  onSugestao,
}: {
  consulta: string
  resultados: ResultadoBusca[]
  ativo: number
  idLista: string
  onEscolher: () => void
  onSugestao: (s: string) => void
}) {
  if (!consulta.trim())
    return (
      <div className="p-5">
        <p className="font-label text-[10px] tracking-[0.2em] text-latao-texto uppercase">Experimente buscar</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SUGESTOES_BUSCA.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => onSugestao(s)}
                className="cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] text-tinta ring-1 ring-tinta/15 transition-colors hover:ring-latao hover:text-latao-texto"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] leading-relaxed text-tinta-3">Por nome, família, nota (baunilha, rosa, cedro…) ou gênero.</p>
      </div>
    )
  if (!resultados.length)
    return (
      <p className="p-5 text-[13px] leading-relaxed text-tinta-2">
        Nenhuma fragrância encontrada para “{consulta.trim()}”. Tente uma nota (baunilha, rosa, cedro) ou uma família (floral, cítrico,
        amadeirado).
      </p>
    )
  return (
    <ul id={idLista} role="listbox" aria-label="Resultados da busca" className="divide-y divide-tinta/[0.07] py-1">
      {resultados.map((r, i) => (
        <li key={r.a.id} role="option" aria-selected={i === ativo}>
          <Link
            to={productPath(r.a)}
            onClick={onEscolher}
            className={`flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-papel-2 ${i === ativo ? 'bg-papel-2' : ''}`}
          >
            {FRASCO_CUT_IMG[r.a.id] ? (
              <img src={FRASCO_CUT_IMG[r.a.id]} alt="" loading="lazy" className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-tinta/10" />
            ) : (
              <span aria-hidden className="size-12 shrink-0 rounded-lg" style={{ background: r.a.bg }} />
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[17px] leading-tight text-tinta">
                {r.a.nome}
                <Sobrenome a={r.a} />
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-tinta-2">
                {r.nota ? (
                  <>
                    Nota: <b className="font-medium text-tinta">{r.nota}</b> · {r.a.fam}
                  </>
                ) : (
                  r.a.fam
                )}
              </span>
            </span>
            <Preco a={r.a} className="shrink-0 flex-col items-end gap-y-0 text-[13px] leading-tight" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** estado comum aos dois formatos: consulta, resultados e navegação por teclado */
function useBusca(onFechar: () => void) {
  const [consulta, setConsulta] = useState('')
  const [ativo, setAtivo] = useState(-1)
  const resultados = useMemo(() => buscar(consulta), [consulta])
  const navigate = useNavigate()
  useEffect(() => setAtivo(-1), [consulta])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onFechar()
    } else if (e.key === 'ArrowDown' && resultados.length) {
      e.preventDefault()
      setAtivo((i) => (i + 1) % resultados.length)
    } else if (e.key === 'ArrowUp' && resultados.length) {
      e.preventDefault()
      setAtivo((i) => (i <= 0 ? resultados.length - 1 : i - 1))
    } else if (e.key === 'Enter' && resultados.length) {
      e.preventDefault()
      navigate(productPath(resultados[Math.max(0, ativo)].a))
      setConsulta('')
      onFechar()
    }
  }
  return { consulta, setConsulta, ativo, resultados, onKeyDown }
}

/** Desktop: campo no header + painel de resultados embaixo dele */
export function BuscaDesktop() {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const idLista = useId()
  const fechar = () => {
    setAberto(false)
    input.current?.blur()
  }
  const { consulta, setConsulta, ativo, resultados, onKeyDown } = useBusca(fechar)

  // clique fora fecha
  useEffect(() => {
    if (!aberto) return
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('pointerdown', fora)
    return () => document.removeEventListener('pointerdown', fora)
  }, [aberto])

  return (
    <div ref={raiz} className="relative hidden lg:block">
      <label className="flex w-56 items-center gap-2.5 border-b border-current/30 pb-1.5 opacity-80 transition-opacity focus-within:opacity-100 hover:opacity-100 xl:w-64">
        <Lupa className="size-4 shrink-0" />
        <input
          ref={input}
          type="search"
          role="combobox"
          aria-expanded={aberto}
          aria-controls={idLista}
          aria-label="Buscar fragrância"
          placeholder="Buscar fragrância"
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value)
            setAberto(true)
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={onKeyDown}
          className="w-full min-w-0 bg-transparent font-label text-[10.5px] tracking-[0.2em] uppercase outline-none placeholder:text-current placeholder:opacity-70 [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      {aberto && (
        <div className="absolute top-full right-0 z-50 mt-4 max-h-[min(32rem,70svh)] w-[26rem] overflow-y-auto rounded-2xl bg-papel text-tinta shadow-[0_24px_48px_-20px_rgba(43,29,22,0.45)] ring-1 ring-tinta/10">
          <Resultados
            consulta={consulta}
            resultados={resultados}
            ativo={ativo}
            idLista={idLista}
            onEscolher={() => {
              setConsulta('')
              setAberto(false)
            }}
            onSugestao={(s) => {
              setConsulta(s)
              input.current?.focus()
            }}
          />
        </div>
      )}
    </div>
  )
}

/** Celular: lupa no header que abre a busca em tela cheia */
export function BuscaMobile() {
  const [aberto, setAberto] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const idLista = useId()
  const fechar = () => setAberto(false)
  const { consulta, setConsulta, ativo, resultados, onKeyDown } = useBusca(fechar)

  useEffect(() => {
    if (!aberto) return
    input.current?.focus()
    // trava o scroll da página por trás (o scroll vive no container do Layout)
    const scroller = document.querySelector<HTMLElement>('[data-scroll-container]')
    const prev = scroller?.style.overflowY
    if (scroller) scroller.style.overflowY = 'hidden'
    return () => {
      if (scroller) scroller.style.overflowY = prev ?? ''
    }
  }, [aberto])

  return (
    <>
      <button type="button" aria-label="Buscar fragrância" onClick={() => setAberto(true)} className="grid size-10 place-items-center lg:hidden">
        <Lupa className="size-[19px]" />
      </button>
      {/* portal no <body>: o header tem backdrop-filter (fora do hero, ex.: PDP), e isso prende `position: fixed`
          dos filhos dentro dele — a tela cheia ficava espremida na altura do header */}
      {aberto && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Buscar fragrância" className="fixed inset-0 z-50 flex flex-col bg-papel text-tinta lg:hidden">
          <div className="flex items-center gap-3 border-b border-linha px-4 py-3">
            <Lupa className="size-5 shrink-0 text-latao-texto" />
            <input
              ref={input}
              type="search"
              role="combobox"
              aria-expanded
              aria-controls={idLista}
              aria-label="Buscar fragrância"
              placeholder="Buscar por nome, nota ou família"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              onKeyDown={onKeyDown}
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent py-2 text-[16px] outline-none placeholder:text-tinta-3 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="button" onClick={fechar} className="shrink-0 px-1 font-label text-[10px] tracking-[0.18em] text-tinta-2 uppercase">
              Fechar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Resultados
              consulta={consulta}
              resultados={resultados}
              ativo={ativo}
              idLista={idLista}
              onEscolher={() => {
                setConsulta('')
                fechar()
              }}
              onSugestao={(s) => {
                setConsulta(s)
                input.current?.focus()
              }}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
