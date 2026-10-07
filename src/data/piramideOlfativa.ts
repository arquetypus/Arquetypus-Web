import type { Archetype } from '@/types/archetype'
import { fotosPorId, type Foto, type FotoBruta } from '@/lib/foto'
import { PDP_NOTAS_FOTO } from '@/data/productMedia'

/**
 * Pirâmide olfativa da PDP (out/2026) — o que varia por arquétipo na seção `PiramideOlfativa`. A estrutura é uma só
 * pros 9; aqui ficam só dados e imagens. As notas vêm de `topo`/`coracao`/`fundo` em data/archetypes.ts (fórmula da
 * Scentec), nunca daqui.
 *
 * Quatro fotos por arquétipo (lidas por pasta, arquivo = id do arquétipo — trocar ou pôr foto nova não pede código):
 * - mainVisual: `assets/fotos/piramide/principal/{id}.jpg` — foto de campanha vertical (4:5), frasco protagonista,
 *   4 a 6 elementos com profundidade. Sem arquivo, usa a foto das notas da galeria (`pdp-notas/`).
 * - top/heart/baseVisual: `assets/fotos/piramide/camadas/{id}-{topo|coracao|fundo}.jpg` — mini natureza-morta 4:3 de
 *   cada camada, 2 a 4 ingredientes sobrepostos, NÃO recortada: fotografada sobre superfície creme lisa (#ebe1d3), luz
 *   lateral da esquerda, sombra de contato suave, margem creme em volta (a borda se dissolve no fundo da seção por
 *   máscara). As três da mesma "sessão": mesmo prompt-base, só muda o assunto. Sem arquivo, a linha fica sem imagem.
 */

export type CamadaChave = 'topo' | 'coracao' | 'fundo'

/** As três camadas — rótulo e título iguais em todas as fragrâncias. */
export const CAMADAS: { chave: CamadaChave; label: string; titulo: string }[] = [
  { chave: 'topo', label: 'Topo', titulo: 'O primeiro contato' },
  { chave: 'coracao', label: 'Coração', titulo: 'Quando a fragrância se revela' },
  { chave: 'fundo', label: 'Fundo', titulo: 'O rastro que permanece' },
]

interface PiramideConteudo {
  /** 2 a 3 linhas sobre a evolução na pele. Sem ela, a seção usa `cheiro[0]` do arquétipo. */
  descricao?: string
  /** três palavras por camada (sem "Oriental"/"Aquático" — regra da marca). Camada sem descritores não mostra a linha. */
  descritores?: Partial<Record<CamadaChave, [string, string, string]>>
  /** descrição de cada mini composição pra leitor de tela — o que aparece na foto, não a lista de notas */
  alt?: Partial<Record<CamadaChave, string>>
}

// Copy da Sereia escrita pelo usuário (out/2026); "Aquático" trocado por "Cítrico" por regra da marca.
// Os outros 8 (out/2026): descrição = `cheiro[0]` do arquétipo (copy existente); descritores são RASCUNHO técnico tirado
// das notas de cada camada, no mesmo molde da Sereia — revisar com o usuário. Mini fotos ainda não geradas: a seção
// mostra o mockup (caixa tracejada) até o arquivo entrar em `piramide/camadas/`.
export const PIRAMIDE: Record<string, PiramideConteudo> = {
  sereia: {
    descricao: 'Fresca no primeiro instante. Floral quando se aproxima. Cedro, almíscar e âmbar ficam quando o resto já passou.',
    descritores: {
      topo: ['Fresco', 'Luminoso', 'Cítrico'],
      coracao: ['Floral', 'Delicado', 'Envolvente'],
      fundo: ['Amadeirado', 'Limpo', 'Quente'],
    },
    alt: {
      topo: 'Bambu, maçã vermelha, limão siciliano cortado e uma fatia de melão, com gotas de água',
      coracao: 'Rosa branca, flores de jasmim e paus de canela, com pétalas soltas',
      fundo: 'Lascas de cedro e pedras de âmbar sobre um tecido claro',
    },
  },
  afrodite: { descritores: { topo: ['Frutado', 'Cítrico', 'Vibrante'], coracao: ['Floral', 'Romântico', 'Envolvente'], fundo: ['Amadeirado', 'Cremoso', 'Quente'] } },
  imperatriz: { descritores: { topo: ['Cítrico', 'Frutado', 'Luminoso'], coracao: ['Floral', 'Radiante', 'Elegante'], fundo: ['Ambarado', 'Baunilhado', 'Envolvente'] } },
  cleopatra: { descritores: { topo: ['Frutado', 'Suculento', 'Intenso'], coracao: ['Floral', 'Aveludado', 'Sedutor'], fundo: ['Atalcado', 'Baunilhado', 'Amadeirado'] } },
  fada: { descritores: { topo: ['Luminoso', 'Cítrico', 'Delicado'], coracao: ['Floral', 'Leve', 'Etéreo'], fundo: ['Amadeirado', 'Limpo', 'Macio'] } },
  zeus: { descritores: { topo: ['Cítrico', 'Aromático', 'Fresco'], coracao: ['Especiado', 'Floral', 'Marcante'], fundo: ['Amadeirado', 'Resinoso', 'Quente'] } },
  guerreiro: { descritores: { topo: ['Fresco', 'Frutado', 'Picante'], coracao: ['Aromático', 'Verde', 'Firme'], fundo: ['Amadeirado', 'Ambarado', 'Seco'] } },
  imperador: { descritores: { topo: ['Cítrico', 'Fresco', 'Vibrante'], coracao: ['Especiado', 'Floral', 'Intenso'], fundo: ['Ambarado', 'Amadeirado', 'Profundo'] } },
  fenix: { descritores: { topo: ['Especiado', 'Floral', 'Luminoso'], coracao: ['Ambarado', 'Radiante', 'Quente'], fundo: ['Resinoso', 'Adocicado', 'Amadeirado'] } },
}

const PRINCIPAL = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/piramide/principal/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
const MINIS = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/piramide/camadas/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))

/** Tudo o que a seção precisa de um arquétipo, já com os padrões aplicados. */
export function piramideDe(a: Archetype) {
  const c = PIRAMIDE[a.id] ?? {}
  const notas: Record<CamadaChave, string> = { topo: a.topo, coracao: a.coracao, fundo: a.fundo }
  return {
    descricao: c.descricao ?? a.cheiro[0],
    foto: (PRINCIPAL[a.id] ?? PDP_NOTAS_FOTO[a.id]) as Foto | undefined,
    camadas: CAMADAS.map((k) => ({
      ...k,
      notas: notas[k.chave].split(',').map((n) => n.trim()),
      descritores: c.descritores?.[k.chave],
      mini: MINIS[`${a.id}-${k.chave}`] as Foto | undefined,
      miniAlt: c.alt?.[k.chave] ?? '',
    })),
  }
}
