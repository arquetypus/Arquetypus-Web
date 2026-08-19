export function scrollToId(id: string) {
  const el = document.getElementById(id)
  const container = document.querySelector('[data-scroll-container]')
  if (!el || !container) return
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const offset = elRect.top - containerRect.top + container.scrollTop - 60
  container.scrollTo({ top: offset, behavior: 'smooth' })
}
