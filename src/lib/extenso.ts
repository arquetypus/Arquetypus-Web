const FEMININO = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze']
const MASCULINO = ['zero', 'um', 'dois', ...FEMININO.slice(3)]

/** Número por extenso (até doze; acima disso, algarismos) — pra textos que contam itens dos dados, como "nove fragrâncias" */
export function porExtenso(n: number, genero: 'f' | 'm' = 'f'): string {
  return (genero === 'f' ? FEMININO : MASCULINO)[n] ?? String(n)
}

export const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
