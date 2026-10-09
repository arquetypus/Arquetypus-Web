/**
 * Ícones dos arquétipos (out/2026, pedido do usuário pros cards da aplicação em /criadores): medalhões em traço
 * único (monoline), poucos traços, dentro de um círculo fino — concha (Afrodite), diadema (Imperatriz), olho de Hórus
 * (Cleópatra), estrela (Fada), cauda sobre as ondas (Sereia), raio na nuvem (Zeus), escudo com espada (Guerreiro),
 * louros com coroa (Imperador), fênix nas chamas (Fênix). Substituíram a 1ª versão em gravura, detalhada demais em
 * tela grande. Gerados por IA (Higgsfield, GPT Image 2.5) numa folha só 3×3, recortados, com traço levemente
 * engrossado e convertidos em PNG com fundo transparente (`assets/icones/{id}.png`, 360 px). Entram como máscara CSS, então pegam a cor de
 * `currentColor` (a cor do arquétipo). Não é arte oficial — trocar pelos da designer quando existirem.
 */
const ICONES: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('@/assets/icones/*.png', { eager: true, import: 'default' })).map(([caminho, url]) => [
    caminho.split('/').pop()!.replace('.png', ''),
    url,
  ]),
)

export function IconeArquetipo({ id, className = '' }: { id: string; className?: string }) {
  const url = ICONES[id]
  if (!url) return null
  const mascara = `url(${url})`
  return (
    <span
      aria-hidden
      className={`block bg-current ${className}`}
      style={{
        maskImage: mascara,
        WebkitMaskImage: mascara,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}
