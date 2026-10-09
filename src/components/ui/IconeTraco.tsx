import type { ReactNode } from 'react'

/**
 * Ícones dos cinco traços do arquétipo na PDP ("Quem é {nome}", out/2026, pedido do usuário: um ícone por traço no
 * lugar do número). Traço fino 24×24 em `currentColor`, no mesmo desenho dos ícones de benefício e dos selos da
 * coluna de compra. Cada traço escolhe o seu em `tracos[].icone` (data/archetypes.ts); dentro de um arquétipo os cinco
 * são diferentes, entre arquétipos podem se repetir. Desenhados à mão — trocar pelos da designer quando existirem.
 */
const ICONES = {
  coracao: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  gota: <path d="M12 3.5c3 3.8 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.5-6.2 5.5-10z" />,
  labios: (
    <>
      <path d="M3 12c2.5-3 4.5-4.5 6.5-4 1 .3 1.8.9 2.5.9s1.5-.6 2.5-.9c2-.5 4 1 6.5 4" />
      <path d="M3 12c3 3.6 6 5 9 5s6-1.4 9-5" />
      <path d="M6 12c2 .6 4 .9 6 .9s4-.3 6-.9" />
    </>
  ),
  espelho: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V21M9.5 21h5" />
    </>
  ),
  ima: <path d="M5 4h4v8a3 3 0 0 0 6 0V4h4v8a7 7 0 0 1-14 0zM5 8h4M15 8h4" />,
  ramo: (
    <>
      <path d="M6 20C10 15 13 10 14 4" />
      <path d="M9.2 15.5c-2.2-.2-3.6-1.3-4.2-3 2.2 0 3.6 1 4.2 3zM11.3 11.5c-2-.6-3.1-2-3.3-3.8 2 .5 3.1 1.8 3.3 3.8zM10.6 15.8c2.2-.5 3.8.1 5 1.6-2 .6-3.7.1-5-1.6zM12.7 11.4c1.9-1 3.6-.8 5 .4-1.8 1-3.5.9-5-.4z" />
    </>
  ),
  lua: <path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z" />,
  taca: <path d="M7.5 3.5h9c0 5-1.8 8-4.5 8s-4.5-3-4.5-8zM12 11.5V20M8.5 20h7M7.8 6.5h8.4" />,
  diamante: <path d="M7 4h10l4 5-9 11L3 9zM3 9h18M9.5 4L8 9l4 11 4-11-1.5-5" />,
  casa: <path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5h4v5" />,
  coroa: <path d="M4 18.5h16M4.5 18.5L3.5 8l5 4 3.5-6.5 3.5 6.5 5-4-1 10.5" />,
  peao: (
    <>
      <circle cx="12" cy="6.5" r="2.5" />
      <path d="M9.5 10.5h5M10 10.5c0 3-1 5.5-2.5 7.5h9c-1.5-2-2.5-4.5-2.5-7.5M6 20.5h12" />
    </>
  ),
  presenca: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" />
    </>
  ),
  pena: <path d="M20 4c-7 0-12 5-13 12l-3 4.5M20 4c0 6-4.5 10.5-11 11M9.5 12.5h5M11.5 9.5h5" />,
  piramide: <path d="M3 19.5h18L12 5zM12 5l2.5 14.5" />,
  brilho: <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7zM19 16.5v3.5M17.25 18.25h3.5" />,
  flor: (
    <>
      <circle cx="12" cy="12" r="1.8" />
      {[0, 72, 144, 216, 288].map((g) => (
        <path key={g} transform={`rotate(${g} 12 12)`} d="M12 10.2c-1.5-2.2-1.5-4.5 0-6.7 1.5 2.2 1.5 4.5 0 6.7z" />
      ))}
    </>
  ),
  varinha: <path d="M4 20L14.5 9.5M17 3v4M15 5h4M20.5 9v2.5M19.25 10.25h2.5M12.5 3.5v2M11.5 4.5h2" />,
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  // veleiro (Liberdade da Sereia, mar aberto); pássaros e gaivota foram testados e liam como as ondas da Fluidez
  veleiro: <path d="M12 3.5v13M12 4.5l6.5 10.5H12M10.5 7.5L5.5 15h5M4 17h16l-2.2 3H6.2z" />,
  ondas: <path d="M3 8c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0M3 12c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0M3 16c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />,
  olho: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  porDoSol: <path d="M3 17h18M6.5 17a5.5 5.5 0 0 1 11 0M12 6.5v2M5.6 9.6l1.4 1.4M18.4 9.6L17 11M3.5 13.5H5M19 13.5h1.5M7 20.5h10" />,
  bandeira: <path d="M5 21V3.5M5 4.5h11l-2.5 4 2.5 4H5" />,
  coluna: <path d="M4.5 4h15M6 6.5h12M8 6.5v11M12 6.5v11M16 6.5v11M6 17.5h12M4.5 20h15" />,
  raio: <path d="M13.5 2.5L5 13.5h6l-1.5 8L19 10h-6.5z" />,
  estrela: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  escudo: <path d="M12 3.5l7.5 3v5.5c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6.5z" />,
  espada: (
    <>
      <path d="M12 2.5l2 3v10h-4v-10zM7.5 15.5h9M12 15.5v3.5" />
      <circle cx="12" cy="20.25" r="1.25" />
    </>
  ),
  ampulheta: <path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 4 4.5 5.5 4.5 8.5s-4.5 4.5-4.5 8.5M16.5 3.5c0 4-4.5 5.5-4.5 8.5s4.5 4.5 4.5 8.5M10 18h4" />,
  acao: <path d="M5 6l6 6-6 6M12 6l6 6-6 6" />,
  montanha: <path d="M2.5 19.5l7-12 4.5 7.5 2.5-3.5 5 8zM7.6 10.8l1.9 1.2 1.6-1.4" />,
  chama: (
    <>
      <path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.2 2.4-5 3.4-8.4 1.6 1.4 2.2 3.1 2.2 4.6 1-1 1.6-2.4 1.6-4.2 2.6 2 4.8 4.8 4.8 8 0 3.2-2.4 5.6-6 5.6z" />
      <path d="M12 21c-1.5 0-2.5-1-2.5-2.4 0-1.5 1.2-2.3 2.5-3.8 1.3 1.5 2.5 2.3 2.5 3.8 0 1.4-1 2.4-2.5 2.4z" />
    </>
  ),
  subida: <path d="M3.5 18l6-6 4 3.5 7-8M15.5 7.5h5v5" />,
  trofeu: <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6h-3c0 2.6 1.4 4 3.3 4.3M16.5 6h3c0 2.6-1.4 4-3.3 4.3M12 13.5V17M8.5 20.5h7l-1-3.5h-5z" />,
  medalha: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M9 10.6L6.5 3.5h4l1.5 4 1.5-4h4L15 10.6" />
    </>
  ),
  broto: <path d="M12 21v-9M12 12c0-4-2.8-6.5-7-6.5 0 4 2.8 6.5 7 6.5zM12 14.5c0-3.4 2.4-5.5 6-5.5 0 3.4-2.4 5.5-6 5.5zM8 21h8" />,
  infinito: <path d="M12 12c-1.8-2.4-3.4-3.5-5-3.5a3.5 3.5 0 0 0 0 7c1.6 0 3.2-1.1 5-3.5zm0 0c1.8 2.4 3.4 3.5 5 3.5a3.5 3.5 0 0 0 0-7c-1.6 0-3.2 1.1-5 3.5z" />,
  ciclo: <path d="M19.5 9A8 8 0 0 0 5 7.5M5 3.5v4h4M4.5 15A8 8 0 0 0 19 16.5M19 20.5v-4h-4" />,
} satisfies Record<string, ReactNode>

export type IconeTracoId = keyof typeof ICONES

export function IconeTraco({ id, className = '' }: { id: IconeTracoId; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {ICONES[id]}
    </svg>
  )
}
