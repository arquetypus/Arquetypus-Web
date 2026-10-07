import type { Archetype } from '@/types/archetype'
import { ARCHETYPES } from '@/data/archetypes'
import { FAMILIAS_BY_SLUG } from '@/data/families'

/**
 * Busca do site (out/2026): procura nos 9 Body Splash Premium por várias palavras-chave — nome, sobrenome, famílias
 * olfativas, notas (topo, coração, fundo), energia, gênero, epíteto e os textos de cada arquétipo — mais um pequeno
 * dicionário de sinônimos ("doce", "madeira", "masculino"…) e de momentos e estações ("noite", "verão", "trabalho"…).
 * Sem acento, sem diferença de maiúscula e com plural simples. Cada palavra da busca precisa casar com algo do produto (E); o peso de onde casou ordena os resultados.
 * Tudo no navegador: são só 9 produtos, não precisa de servidor.
 */

/** minúsculas, sem acento, só letras/números/espaço */
export const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim()

/** forma base da palavra: tira plural simples ("rosas" → "rosa", "florais" → "floral") */
const raiz = (p: string) => (p.length > 4 && p.endsWith('ais') ? p.slice(0, -3) + 'al' : p.length > 3 && p.endsWith('s') ? p.slice(0, -1) : p)

const GENERO: Record<Archetype['seg'], string> = {
  F: 'feminino feminina mulher ela para ela',
  M: 'masculino homem ele para ele',
  U: 'unissex unisex todos compartilhado',
}

// momentos e estações → famílias olfativas (e energia), usados nos sinônimos abaixo
const DIA = ['frescos luminosos', 'frutados citricos', 'florais elegantes']
const NOITE = ['ambarados adocicados', 'amadeirados especiados', 'seducao']
const VERAO = ['frescos luminosos', 'frutados citricos']
const INVERNO = ['ambarados adocicados', 'amadeirados especiados']

/**
 * Sinônimos → termos que aparecem nos dados. Ex.: quem busca "doce" encontra baunilha, caramelo, açúcar e a família
 * Ambarados & Adocicados; "noite" encontra as famílias mais quentes. Só vocabulário de cheiro, categoria e momento de
 * uso — nada de efeito ou promessa (regra 4).
 */
const SINONIMOS: Record<string, string[]> = {
  doce: ['adocicado', 'baunilha', 'caramelo', 'acucar', 'fava tonka'],
  adocicado: ['baunilha', 'caramelo', 'acucar'],
  baunilhado: ['baunilha'],
  madeira: ['amadeirado', 'cedro', 'sandalo', 'vetiver', 'patchouli', 'gaiaco'],
  amadeirado: ['madeira', 'cedro', 'sandalo', 'vetiver'],
  fruta: ['frutado', 'lichia', 'maca', 'pera', 'ameixa', 'pessego', 'melao', 'damasco', 'cassis', 'groselha'],
  frutado: ['fruta'],
  frutal: ['frutado'],
  flor: ['floral', 'rosa', 'jasmim', 'peonia', 'orquidea', 'violeta', 'lirio', 'flor de laranjeira', 'neroli'],
  floral: ['flor'],
  citrico: ['bergamota', 'limao', 'tangerina', 'mandarina', 'toranja', 'laranja'],
  limao: ['citrico'],
  laranja: ['tangerina', 'mandarina', 'flor de laranjeira'],
  fresco: ['frescos luminosos', 'citrico', 'bambu', 'hortela'],
  refrescante: ['fresco'],
  leve: ['fresco', 'luminoso'],
  especiado: ['especiarias', 'canela', 'pimenta', 'cardamomo', 'noz moscada', 'gengibre', 'acafrao'],
  especiaria: ['especiado'],
  picante: ['pimenta', 'gengibre', 'notas picantes'],
  ambar: ['ambarado', 'ambar cinzento', 'amberwood'],
  ambarado: ['ambar'],
  almiscar: ['almiscarado', 'almiscar branco'],
  intenso: ['amadeirado', 'ambarado', 'couro', 'patchouli'],
  marcante: ['intenso'],
  sedutor: ['seducao'],
  sensual: ['seducao'],
  poderoso: ['poder'],
  forte: ['forca'],
  misterioso: ['misterio'],

  // momentos e estações → famílias olfativas (e energia). Sugestão de uso, não promessa de efeito (regra 4)
  dia: DIA,
  diurno: DIA,
  manha: DIA,
  tarde: DIA,
  noite: NOITE,
  noturno: NOITE,
  verao: VERAO,
  calor: VERAO,
  praia: VERAO,
  primavera: ['florais elegantes', 'frutados citricos'],
  outono: ['amadeirados especiados', 'ambarados adocicados'],
  inverno: INVERNO,
  frio: INVERNO,
  trabalho: ['frescos luminosos', 'florais elegantes'],
  escritorio: ['frescos luminosos', 'florais elegantes'],
  academia: ['frescos luminosos'],
  treino: ['frescos luminosos'],
  esporte: ['frescos luminosos'],
  casual: ['frescos luminosos', 'frutados citricos'],
  encontro: ['seducao', 'florais elegantes', 'ambarados adocicados'],
  date: ['seducao', 'florais elegantes', 'ambarados adocicados'],
  romantico: ['seducao', 'florais elegantes'],
  festa: ['ambarados adocicados', 'amadeirados especiados', 'seducao', 'poder'],
  balada: ['ambarados adocicados', 'amadeirados especiados', 'seducao', 'poder'],
}

type Campo = { peso: number; texto: string }

interface Indexado {
  a: Archetype
  campos: Campo[]
  notas: string[]
}

const INDICE: Indexado[] = ARCHETYPES.map((a) => {
  const notas = [a.topo, a.coracao, a.fundo].flatMap((c) => c.split(',').map((n) => n.trim()))
  const familias = a.familias.map((f) => FAMILIAS_BY_SLUG[f]?.nome ?? '')
  const campos: Campo[] = [
    { peso: 12, texto: a.nome },
    { peso: 9, texto: a.sobrenome ?? '' },
    { peso: 7, texto: familias.join(' ') },
    { peso: 6, texto: notas.join(' ') },
    { peso: 5, texto: `${a.energia} ${GENERO[a.seg]}` },
    { peso: 3, texto: `${a.ep} ${a.card} ${a.tipo} body splash ${a.vol}` },
    { peso: 1, texto: [...a.quem, ...a.cheiro, a.layer].join(' ') },
  ]
  return { a, notas, campos: campos.map((c) => ({ peso: c.peso, texto: normalizar(c.texto) })) }
})

/** palavras do texto já normalizado, com a forma base de cada uma */
const palavras = (t: string) => t.split(' ').filter(Boolean).map(raiz)

/** maior peso em que a palavra casa (início de palavra; termos com espaço casam como trecho) */
function pesoDe(item: Indexado, termo: string): number {
  let melhor = 0
  for (const c of item.campos) {
    const casa = termo.includes(' ') ? c.texto.includes(termo) : palavras(c.texto).some((p) => p.startsWith(termo))
    if (casa && c.peso > melhor) melhor = c.peso
  }
  return melhor
}

export interface ResultadoBusca {
  a: Archetype
  /** nota que casou com a busca, pra mostrar o motivo no resultado (ex.: "Nota: baunilha") */
  nota?: string
}

/** palavras que não ajudam a achar (conectivos e o que todo produto é) — saem da busca */
const NEUTRAS = new Set(
  ['para', 'de', 'da', 'do', 'das', 'dos', 'com', 'e', 'o', 'a', 'os', 'as', 'um', 'uma', 'que', 'em', 'no', 'na',
    'perfume', 'fragrancia', 'body', 'splash', 'premium', 'cheiro', 'aroma', 'arquetipo', 'arquetypu'].map(raiz),
)

function procurar(termos: string[], pesoMinimo: number) {
  const achados: { r: ResultadoBusca; pontos: number }[] = []
  for (const item of INDICE) {
    let total = 0
    let ok = true
    for (const t of termos) {
      // a palavra em si, ou o melhor de seus sinônimos (valendo um pouco menos)
      let p = pesoDe(item, t)
      for (const s of SINONIMOS[t] ?? []) p = Math.max(p, pesoDe(item, raiz(normalizar(s))) * 0.8)
      if (p < pesoMinimo || !p) {
        ok = false
        break
      }
      total += p
    }
    if (!ok) continue
    const nota = item.notas.find((n) => termos.some((t) => palavras(normalizar(n)).some((p) => p.startsWith(t))))
    achados.push({ r: { a: item.a, nota }, pontos: total })
  }
  return achados.sort((x, y) => y.pontos - x.pontos).map((x) => x.r)
}

export function buscar(consulta: string): ResultadoBusca[] {
  const todas = palavras(normalizar(consulta)).filter((t) => t.length >= 2)
  const termos = todas.filter((t) => !NEUTRAS.has(t))
  if (!termos.length) return todas.length ? ARCHETYPES.map((a) => ({ a })) : []
  // primeiro só o que casa nos campos fortes (nome, família, notas, gênero, epíteto…); os textos longos dos
  // arquétipos só entram se isso não achar nada
  const fortes = procurar(termos, 3)
  return fortes.length ? fortes : procurar(termos, 1)
}

/** sugestões rápidas quando o campo está vazio */
export const SUGESTOES_BUSCA = ['Floral', 'Cítrico', 'Doce', 'Amadeirado', 'Noite', 'Verão', 'Inverno', 'Masculino', 'Unissex']
