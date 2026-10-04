import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { comMarca, useSeo } from '@/lib/seo'

/**
 * Página não encontrada (rota "*", out/2026). Com o vercel.json mandando toda rota pro index.html, a Vercel
 * responde 200 até pra endereço inexistente — por isso a página marca `robots: noindex` enquanto está aberta,
 * pro Google não indexar URL quebrada.
 */
export function NotFoundPage() {
  const { pathname } = useLocation()
  useSeo({
    title: comMarca('Página não encontrada'),
    description: 'A página que você procurou não existe ou mudou de endereço.',
    path: pathname,
  })
  useEffect(() => {
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex'
    document.head.appendChild(m)
    return () => m.remove()
  }, [])

  return (
    <section className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center lg:py-24">
      <Eyebrow>Erro 404</Eyebrow>
      <h1 className="mt-3 font-display text-[34px] leading-tight text-tinta lg:text-5xl">Página não encontrada</h1>
      <span aria-hidden className="mt-5 block h-px w-10 bg-latao/60" />
      <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-tinta-2">
        O endereço que você abriu não existe ou mudou de lugar. Mas a sua fragrância continua esperando por você.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-tinta px-10 py-3.5 text-xs font-medium tracking-[0.18em] text-papel uppercase transition-opacity hover:opacity-90"
      >
        Voltar para a home
      </Link>
      <Link to="/#catalogo" className="mt-5 border-b border-latao-texto/40 text-sm text-tinta-2 hover:text-tinta">
        Ver os 9 arquétipos
      </Link>
    </section>
  )
}
