/**
 * Kits de combinação (out/2026) — o "mapa de kits" do guia de arquétipos do Fábio: duas fragrâncias de caráter
 * diferente pra ocasiões opostas da mesma vida (ou, nos kits casal, ela + ele). Textos do guia: `headline` = headline
 * do banner, `texto` = "Texto do site" (a frase do bloco "Combina com", igual nas duas páginas da dupla), `momentoA`/
 * `momentoB` = a ocasião de cada lado. `prioridade` 1 = lançar primeiro.
 *
 * A PDP mostra no "Combina com" os kits do arquétipo em rotação, no máximo `MAX_KITS_PDP`, por prioridade (a Fênix,
 * em 3 kits, fica com Fogo e Aço + Do Brilho à Brasa — um masculino e um feminino, como o guia pede). O Imperador
 * só está em Dinastia: um kit, sem rotação. O site ainda não vende kit — o botão segue o do combo (CLAUDE.md).
 */
export interface Kit {
  prioridade: number
  nome: string
  /** os dois arquétipos, na ordem do guia: `a` = primeiro momento (dia / ela), `b` = segundo (noite / ele) */
  a: string
  b: string
  /** kit casal: um frasco pra cada pessoa, não dois momentos da mesma */
  casal?: boolean
  momentoA: string
  momentoB: string
  headline: string
  texto: string
}

export const KITS: Kit[] = [
  { prioridade: 1, nome: 'Duas Coroas', a: 'cleopatra', b: 'imperatriz', momentoA: 'Escritório, reunião', momentoB: 'Noite, rooftop', headline: 'Ela comanda a reunião. E a noite também.', texto: 'Cleópatra no escritório, Imperatriz à noite. A mesma mulher, duas coroas.' },
  { prioridade: 2, nome: 'Dinastia', a: 'imperatriz', b: 'imperador', casal: true, momentoA: 'Ela', momentoB: 'Ele', headline: 'Um império se constrói a dois.', texto: 'Imperatriz para ela, Imperador para ele. Um império se constrói a dois.' },
  { prioridade: 3, nome: 'Fogo e Aço', a: 'guerreiro', b: 'fenix', momentoA: 'Dia, treino e trabalho', momentoB: 'Noite, encontro', headline: 'De dia, aço. À noite, fogo.', texto: 'Guerreiro de dia, Fênix à noite. O fresco abre, o âmbar fecha.' },
  { prioridade: 4, nome: 'Do Brilho à Brasa', a: 'fada', b: 'fenix', momentoA: 'Manhã, café', momentoB: 'Festa, pista', headline: 'Ela acorda luz. E dorme fogo.', texto: 'Fada de manhã, Fênix à noite. Ela acorda luz e dorme fogo.' },
  { prioridade: 5, nome: 'Batalha e Trono', a: 'guerreiro', b: 'zeus', momentoA: 'Treino, trilha', momentoB: 'Terno, reunião', headline: 'No fim de semana ele luta. Na segunda, ele governa.', texto: 'Guerreiro no treino, Zeus na reunião. Ação e comando no mesmo homem.' },
  { prioridade: 6, nome: 'Brisa e Beijo', a: 'sereia', b: 'afrodite', momentoA: 'Praia, tarde livre', momentoB: 'Jantar, encontro', headline: 'De dia, ninguém a prende. À noite, ninguém a esquece.', texto: 'Sereia de dia, Afrodite à noite. Leveza para a tarde, presença para o encontro.' },
  { prioridade: 7, nome: 'Doce Encanto', a: 'fada', b: 'afrodite', momentoA: 'Brunch', momentoB: 'Jantar a dois', headline: 'De dia, ela encanta. À noite, ela conquista.', texto: 'Fada no brunch, Afrodite no jantar a dois. De dia encanta, à noite conquista.' },
  { prioridade: 8, nome: 'Sal e Brasa', a: 'sereia', b: 'fenix', momentoA: 'Praia, barco', momentoB: 'Luau, festa', headline: 'O mar te deixa livre. O fogo te deixa inesquecível.', texto: 'Sereia no mar, Fênix na festa da noite. Sal de dia, brasa à noite.' },
  { prioridade: 9, nome: 'Poder a Dois', a: 'cleopatra', b: 'zeus', casal: true, momentoA: 'Ela', momentoB: 'Ele', headline: 'Ela se impõe. Ele decide.', texto: 'Cleópatra para ela, Zeus para ele. Ela se impõe, ele decide.' },
]

/** quantos kits giram no "Combina com" de cada PDP (pedido do Fábio: 2, rotativos como o banner da home) */
export const MAX_KITS_PDP = 2

/** Kits de um arquétipo pra PDP, por prioridade. */
export const kitsDe = (id: string) =>
  KITS.filter((k) => k.a === id || k.b === id)
    .sort((x, y) => x.prioridade - y.prioridade)
    .slice(0, MAX_KITS_PDP)

/** O outro arquétipo do kit e o momento de cada lado, do ponto de vista de `id` (o dono da página vem primeiro). */
export const ladosDoKit = (kit: Kit, id: string) =>
  kit.a === id
    ? { outro: kit.b, momento: kit.momentoA, momentoOutro: kit.momentoB }
    : { outro: kit.a, momento: kit.momentoB, momentoOutro: kit.momentoA }
