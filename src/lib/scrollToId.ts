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
