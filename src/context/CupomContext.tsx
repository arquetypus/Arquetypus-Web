import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { buscarCupom, precoComCupom, type Cupom } from '@/data/cupons'
import { BoasVindasCupom } from '@/components/ui/BoasVindasCupom'
import { grupoVipSemCadastroUrl } from '@/data/lead'

const CHAVE = 'arquetypus:cupom'
/** marca que o convite de boas-vindas já abriu nesta aba (não repete ao navegar/recarregar com o mesmo link) */
const CHAVE_CONVITE = 'arquetypus:cupom-convite'

interface CupomContextValue {
  /** cupom ativo (veio na URL e está cadastrado em data/cupons.ts), ou null */
  cupom: Cupom | null
  /** preço que vale pra conta de Pix e parcelas: com o cupom, se houver; senão o próprio valor */
  precoFinal: (v: number) => number
  /** liga um cupom cadastrado sem passar pela URL (cadastro da caixa de cupom da home). Cupons não se somam nem se
   * trocam (decisão do usuário, out/2026): com um cupom já ativo — ex.: CONHECA15, dos clientes Saniella — ele continua
   * e o novo não entra. Devolve o cupom que ficou valendo e se foi o pedido (`novo`). */
  ativarCupom: (codigo: string) => { cupom: Cupom | null; novo: boolean }
}

const CupomContext = createContext<CupomContextValue>({
  cupom: null,
  precoFinal: (v) => v,
  ativarCupom: () => ({ cupom: null, novo: false }),
})

/**
 * Cupom de link (out/2026): lê `?cupom=` da URL, confere no cadastro (data/cupons.ts) e deixa o desconto valendo
 * em todo preço do site (Preco + contas de Pix/parcelas). Lido só depois da hidratação — o HTML pré-renderizado
 * sai sempre sem cupom, então não há diferença entre servidor e cliente. Guardado no sessionStorage pra continuar
 * valendo ao navegar e recarregar na mesma aba (some ao fechar a aba); um `?cupom=` inválido não apaga o válido.
 * Na chegada pelo link abre o convite de boas-vindas (BoasVindasCupom), uma vez por aba.
 */
export function CupomProvider({ children }: { children: ReactNode }) {
  const [cupom, setCupom] = useState<Cupom | null>(null)
  const [convite, setConvite] = useState(false)
  const { search } = useLocation()

  useEffect(() => {
    const daUrl = buscarCupom(new URLSearchParams(search).get('cupom'))
    if (daUrl) {
      setCupom(daUrl)
      let jaViu = false
      try {
        sessionStorage.setItem(CHAVE, daUrl.codigo)
        jaViu = sessionStorage.getItem(CHAVE_CONVITE) === daUrl.codigo
      } catch {
        /* sem storage: vale só nesta visita */
      }
      // convite de boas-vindas: só quando o cupom chega pela URL, uma vez por aba, com um respiro depois da página aparecer
      if (!jaViu) {
        // a marca é gravada só quando abre (no StrictMode o efeito roda duas vezes e a 1ª é cancelada)
        const t = setTimeout(() => {
          setConvite(true)
          try {
            sessionStorage.setItem(CHAVE_CONVITE, daUrl.codigo)
          } catch {
            /* sem storage */
          }
        }, 700)
        return () => clearTimeout(t)
      }
      return
    }
    try {
      const salvo = buscarCupom(sessionStorage.getItem(CHAVE))
      if (salvo) setCupom(salvo)
    } catch {
      /* sem storage */
    }
  }, [search])

  function ativarCupom(codigo: string) {
    if (cupom) return { cupom, novo: cupom.codigo === codigo.trim().toUpperCase() }
    const novo = buscarCupom(codigo)
    if (!novo) return { cupom: null, novo: false }
    setCupom(novo)
    try {
      sessionStorage.setItem(CHAVE, novo.codigo)
    } catch {
      /* sem storage: vale só nesta visita */
    }
    return { cupom: novo, novo: true }
  }

  return (
    <CupomContext.Provider value={{ cupom, precoFinal: (v) => (cupom ? precoComCupom(v, cupom) : v), ativarCupom }}>
      {children}
      {convite && cupom && <BoasVindasCupom cupom={cupom} grupoVipUrl={grupoVipSemCadastroUrl()} fechar={() => setConvite(false)} />}
    </CupomContext.Provider>
  )
}

export const useCupom = () => useContext(CupomContext)
