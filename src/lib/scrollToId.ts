let preservedHydrationScroll = false

/** Guarda a interação anterior ao JS contra o salto nativo de fragmento no DOMContentLoaded. */
export function preserveHydrationScroll(root: HTMLElement) {
  const container = root.querySelector<HTMLElement>('[data-scroll-container]')
  if (!window.location.hash || !container || container.scrollTop === 0) return
  preservedHydrationScroll = true
  const top = container.scrollTop
  let interrupted = false
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown']
  const interrupt = () => { interrupted = true }
  for (const event of events) container.addEventListener(event, interrupt, { passive: true })
  const restore = () => requestAnimationFrame(() => {
    if (!interrupted && container.isConnected) container.scrollTo({ top, behavior: 'instant' })
    for (const event of events) container.removeEventListener(event, interrupt)
  })
  if (document.readyState === 'complete') restore()
  else document.addEventListener('DOMContentLoaded', restore, { once: true })
}

export function hasPreservedHydrationScroll() {
  return preservedHydrationScroll
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  const container = document.querySelector('[data-scroll-container]')
  if (!el || !container) return
  // desconta o header fixo (56px no celular, 64px no lg+) pra seção não começar escondida atrás dele
  const headerH = container.querySelector('header')?.offsetHeight ?? 60
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const offset = elRect.top - containerRect.top + container.scrollTop - headerH
  container.scrollTo({ top: offset, behavior: 'smooth' })
}
