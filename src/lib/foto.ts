/**
 * Fotos responsivas (out/2026). Import com `?responsiva` (regra em vite.config.ts) gera a foto em várias larguras
 * (400/800/1200 px; 800 a 2400 nas `*-desktop.jpg`) e o navegador baixa só a que serve na tela. Aqui isso vira
 * `Foto`: `src` (maior versão, reserva e URL única pra SEO/og) + `srcSet` + dimensões.
 *
 * Foto de conteúdo que aparece grande na página entra assim — `verify-prerender` derruba o build se uma imagem
 * publicada passar de 60 KB sem `srcset`. Trocar o arquivo (mesmo nome) ou pôr foto nova numa pasta lida por
 * `fotosPorId` não pede mudança de código.
 */

/** Saída `as=picture` do vite-imagetools. */
export interface FotoBruta {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

export interface Foto {
  src: string
  srcSet: string
  w: number
  h: number
}

// Scripts do build que carregam os dados com um Vite sem o plugin de imagem (sitemap/llms.txt, tema inicial,
// configure-vercel) recebem a URL simples em vez do objeto: vira uma Foto de uma versão só.
export const foto = (p: FotoBruta | string): Foto =>
  typeof p === 'string'
    ? { src: p, srcSet: '', w: 0, h: 0 }
    : { src: p.img.src, srcSet: Object.values(p.sources)[0] ?? '', w: p.img.w, h: p.img.h }

/** Pasta lida por `import.meta.glob(..., { query: '?responsiva' })` → `{ [nome do arquivo sem extensão]: Foto }`. */
export const fotosPorId = (arquivos: Record<string, FotoBruta>): Record<string, Foto> =>
  Object.fromEntries(Object.entries(arquivos).map(([caminho, p]) => [caminho.split('/').pop()!.replace(/\.\w+$/, ''), foto(p)]))

/** Só a URL de cada foto (SEO, og, direções desligadas que ainda usam `src` simples). */
export const urls = (fotos: Record<string, Foto>): Record<string, string> =>
  Object.fromEntries(Object.entries(fotos).map(([id, f]) => [id, f.src]))
