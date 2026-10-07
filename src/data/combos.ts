/**
 * Combo editorial da PDP ("Combina com", out/2026) — aprovado na Sereia e espelhado pros 9. `comboDe(a)` monta o combo:
 * entrada própria em COMBOS (hoje só a Sereia, com copy do usuário) ou, sem ela, o padrão tirado dos dados — duo com o
 * par de layering (`a.par`), texto = frase de layering (`a.layer`) + o fechamento do usuário, card com o epíteto
 * (`ep`), a família e 4 notas da fórmula. Nada de copy inventada nos padrões.
 *
 * O combo vende repertório de uso e identidade, não economia: sem "oferta", "economize", porcentagem ou "os dois
 * por" em destaque — o preço aparece numa linha discreta depois do botão. Copy escrita pelo usuário.
 *
 * Fotos: natureza-morta de produto por arquétipo em `assets/fotos/combo/{id}.jpg` (sem pessoas — frasco protagonista,
 * ingredientes, tecido creme e travertino, luz de janela pela esquerda; geradas por IA no Higgsfield, só Sereia e
 * Afrodite por enquanto), com uma faixa de fundo desfocado acrescentada no topo pro nome e a frase do card não caírem
 * no frasco (o card recorta ancorado em cima). Sem arquivo, o card mostra o mockup (caixa tracejada) até a foto ser
 * gerada.
 */
import type { Archetype } from '@/types/archetype'
import { fotosPorId, type Foto, type FotoBruta } from '@/lib/foto'

const FOTOS = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/combo/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const comboFoto = (id: string): Foto | undefined => FOTOS[id]
/** Card do celular (horizontal): `combo/{id}-mobile.jpg` é uma natureza-morta 16:9 da mesma sessão, com o frasco no
 *  terço direito e a esquerda livre pro texto (gerada por IA, out/2026); sem ela, mockup. */
export const comboFotoMobile = (id: string): Foto | undefined => FOTOS[`${id}-mobile`]

export interface Combo {
  /** id do arquétipo que forma o duo (pode ser diferente de `a.par`, que é o par de layering) */
  par: string
  /** `\n` marca onde a linha quebra */
  headline: string
  /** parágrafos curtos; cada item vira um <p>, `\n` quebra a linha dentro dele */
  texto: string[]
  /** card de cada um, por id: frase no topo (abaixo do nome), frase do momento e 4 notas em destaque (da fórmula) */
  cards: Record<string, { legenda: string; descricao: string; notas: string[] }>
}

export const COMBOS: Record<string, Combo> = {
  sereia: {
    par: 'afrodite',
    headline: 'Duas fragrâncias. Dois momentos.\nUma rotina completa.',
    texto: [
      'Tem dias em que você quer leveza.\nEm outros, quer presença.',
      'Sereia acompanha o lado que flui.\nAfrodite, o lado que aproxima.',
      'Duas fragrâncias para vestir diferentes momentos — sem deixar de ser você.',
    ],
    cards: {
      sereia: {
        legenda: 'Para quando você quer leveza.',
        descricao: 'Frescor para os dias leves.',
        notas: ['Limão siciliano', 'Melão', 'Jasmim', 'Cedro'],
      },
      // descrição da Afrodite é rascunho no mesmo molde da Sereia — confirmar com o usuário
      afrodite: {
        legenda: 'Para quando você quer ser lembrada.',
        descricao: 'Presença para os dias de encontro.',
        notas: ['Lichia', 'Rosa turca', 'Peônia', 'Caramelo'],
      },
    },
  },
}

/** Fechamento comum a todos os combos (copy do usuário, out/2026). */
const FECHAMENTO = 'Duas fragrâncias para vestir diferentes momentos — sem deixar de ser você.'
const HEADLINE = 'Duas fragrâncias. Dois momentos.\nUma rotina completa.'

/** Card padrão de um arquétipo, só com dados existentes: epíteto, família e 4 notas da fórmula (2 do topo, 1 do
 *  coração, 1 do fundo). */
function cardPadrao(x: Archetype) {
  const notas = (camada: string) => camada.split(',').map((n) => n.trim())
  const topo = notas(x.topo)
  return { legenda: x.ep, descricao: x.fam, notas: [...topo.slice(0, 2), notas(x.coracao)[0], notas(x.fundo)[0]] }
}

/** Combo de um arquétipo: a entrada de COMBOS (a Sereia) ou o padrão tirado dos dados, com o par de layering. */
export function comboDe(a: Archetype, buscar: (id: string) => Archetype | undefined): { combo: Combo; par: Archetype } | undefined {
  const proprio = COMBOS[a.id]
  const par = buscar(proprio?.par ?? a.par)
  if (!par) return undefined
  if (proprio) return { combo: proprio, par }
  return {
    par,
    combo: {
      par: par.id,
      headline: HEADLINE,
      texto: [a.layer, FECHAMENTO],
      cards: { [a.id]: cardPadrao(a), [par.id]: cardPadrao(par) },
    },
  }
}
