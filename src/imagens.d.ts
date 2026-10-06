// Imports de imagem com `?responsiva` (vite.config.ts) devolvem a saída `as=picture` do vite-imagetools.
declare module '*?responsiva' {
  const foto: import('@/lib/foto').FotoBruta
  export default foto
}
