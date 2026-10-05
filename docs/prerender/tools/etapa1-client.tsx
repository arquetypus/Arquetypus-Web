import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Fixture } from './etapa1-fixture'
import { openCookiePreferences } from '../../../src/lib/consent'

const params = new URLSearchParams(location.search)
const mode = params.get('case') ?? 'normal'
const report = document.getElementById('qa-report')!
const result: Record<string, unknown> = JSON.parse(report.textContent!)
const errors: string[] = []
const publish = () => { report.textContent = JSON.stringify(result, null, 2) }
const originalError = console.error
console.error = (...args: unknown[]) => {
  errors.push(args.map(String).join(' '))
  originalError(...args)
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function until(predicate: () => boolean) {
  const limit = performance.now() + 2000
  while (!predicate() && performance.now() < limit) await delay(20)
}

async function test() {
  if (mode === 'slow') {
    await delay(2500)
    result.beforeLateHydration = {
      state: document.documentElement.dataset.reveal,
      revealOpacity: getComputedStyle(document.querySelector('#reveal-probe')!).opacity,
      heroOpacity: getComputedStyle(document.querySelector('#inicio h1')!).opacity,
      formDisabled: [...document.querySelectorAll<HTMLButtonElement | HTMLInputElement>('form input, form button')].every(el => el.disabled),
    }
  }
  const begun = performance.now()
  const root = hydrateRoot(document.getElementById('root')!, <StrictMode><Fixture /></StrictMode>, {
    onRecoverableError: error => errors.push(String(error)),
  })
  await delay(100)
  const clocks = JSON.parse(report.textContent!)
  result.mediaStarts = clocks.mediaStarts
  result.heroTimers = clocks.heroTimers
  const hero = document.querySelector<HTMLElement>('#inicio')!
  const bar = hero.querySelector('.hero-timer-bar')!
  const gallery = document.querySelector('#gallery-probe')!
  result.afterHydration = {
    elapsedMs: Math.round(performance.now() - begun),
    state: document.documentElement.dataset.reveal,
    heroStarted: hero.dataset.heroStarted,
    heroAnimate: hero.dataset.heroAnimate,
    barAnimation: getComputedStyle(bar).animationName,
    barDuration: getComputedStyle(bar).animationDuration,
    formEnabled: [...document.querySelectorAll<HTMLButtonElement | HTMLInputElement>('form input, form button')].every(el => !el.disabled),
    galleryHint: !!gallery.querySelector('.gallery-hint'),
    galleryAnimation: getComputedStyle(gallery.querySelector('[aria-roledescription="slide"]')!).animationName,
    mobileMedia: matchMedia('(max-width: 1023.98px)').matches,
    reducedMedia: matchMedia('(prefers-reduced-motion: reduce)').matches,
    theme: document.querySelector('#theme-probe')!.textContent,
    cookieVisible: !!document.querySelector('[aria-label="Cookies neste site"]'),
  }
  const form = document.querySelector('form')!
  let prevented = false
  form.addEventListener('submit', e => queueMicrotask(() => { prevented = e.defaultPrevented }), { once: true })
  form.querySelector<HTMLButtonElement>('button[type="submit"]')!.click()
  await delay(0)
  result.submitPrevented = prevented
  if (mode !== 'accepted' && mode !== 'refused') {
    const banner = document.querySelector('[aria-label="Cookies neste site"]')!
    const accept = [...banner.querySelectorAll<HTMLButtonElement>('button')].find(el => el.textContent === 'Aceitar')!
    accept.click()
    await until(() => !document.querySelector('[aria-label="Cookies neste site"]'))
    result.acceptCloses = !document.querySelector('[aria-label="Cookies neste site"]')
  }
  openCookiePreferences()
  await until(() => !!document.querySelector('[aria-label="Cookies neste site"]'))
  result.reopenWorks = !!document.querySelector('[aria-label="Cookies neste site"]')
  const refuse = [...document.querySelectorAll<HTMLButtonElement>('[aria-label="Cookies neste site"] button')].find(el => el.textContent?.includes('Recusar'))!
  refuse.click()
  await until(() => !document.querySelector('[aria-label="Cookies neste site"]'))
  result.refuseCloses = !document.querySelector('[aria-label="Cookies neste site"]')
  if (mode !== 'blocked') {
    result.savedRefusal = JSON.parse(localStorage.getItem('arq_consent')!).analytics === false
  }
  await delay(2200)
  result.galleryHintFinished = !gallery.querySelector('.gallery-hint')
  if (mode === 'reduced') {
    result.reducedAnimations = [...document.querySelectorAll('.reveal-init, .hero-fade-up, .hero-timer-bar, .gallery-hint')]
      .every(el => getComputedStyle(el).animationName === 'none')
  }
  const reveal = document.querySelector('#reveal-probe')!
  const revealed = new Promise<void>(resolve => {
    // O scroll é feito pela própria página de ensaio, sem alterar a UI do produto.
    reveal.scrollIntoView()
    setTimeout(() => {
      result.revealOpacity = getComputedStyle(reveal).opacity
      resolve()
    }, 700)
  })
  await revealed
  result.errors = errors
  result.status = errors.length ? 'FAIL' : 'DONE'
  publish()
  // Mantém o ensaio navegável; expõe somente operação explícita de remontagem para QA manual.
  document.getElementById('qa-unmount')!.onclick = () => root.unmount()
}
void test().catch(error => {
  result.status = 'FAIL'
  result.error = String(error)
  publish()
})
