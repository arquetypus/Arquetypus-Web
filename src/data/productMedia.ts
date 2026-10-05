// Fotos 1:1 aprovadas da PDP. Galeria e SEO usam os mesmos imports do Vite.
const byId = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace('.jpg', ''), url]))

export const PDP_FRASCO = byId(import.meta.glob<string>('@/assets/fotos/pdp-frasco/*.jpg', { eager: true, import: 'default' }))
export const PDP_LIFESTYLE = byId(import.meta.glob<string>('@/assets/fotos/pdp-lifestyle/*.jpg', { eager: true, import: 'default' }))
