import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let observer: IntersectionObserver | undefined
    const liberar = () => {
      document.documentElement.dataset.reveal = 'released'
      window.dispatchEvent(new Event('arq:reveal-release'))
      setInView(true)
    }
    if (typeof IntersectionObserver === 'undefined') {
      liberar()
      return
    }
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer?.disconnect()
          }
        },
        { threshold: 0.15 },
      )
      observer.observe(el)
      // Só confirma prontidão depois de instalar o observador.
      window.dispatchEvent(new Event('arq:reveal-ready'))
    } catch {
      observer?.disconnect()
      liberar()
    }
    return () => observer?.disconnect()
  }, [])

  return { ref, inView }
}
