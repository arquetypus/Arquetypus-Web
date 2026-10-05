// Instrumentação exclusiva do servidor local de QA. Nunca publicada em dist.
(() => {
  const mode = new URL(location.href).searchParams;
  const lean = mode.get('performance') === 'lean';
  // Reload de uma navegação SPA não deve apagar consentimento salvo.
  const choice = mode.get('consent') || 'keep';
  if (choice !== 'keep') {
    localStorage.removeItem('arq_consent');
    if (['accepted', 'refused', 'expired'].includes(choice)) localStorage.setItem('arq_consent', JSON.stringify({
      analytics: choice !== 'refused', marketing: choice !== 'refused', version: 1,
      updatedAt: new Date(Date.now() - (choice === 'expired' ? 366 * 864e5 : 0)).toISOString(),
    }));
  }
  if (choice === 'blocked') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('QA storage bloqueado', 'SecurityError'); } });
  if (mode.has('noObserver')) window.IntersectionObserver = undefined;
  if (mode.has('reduce')) {
    const original = window.matchMedia.bind(window);
    window.matchMedia = query => query.includes('prefers-reduced-motion') ? { ...original(query), matches: true, addEventListener() {}, removeEventListener() {} } : original(query);
  }
  const errors = [], longTasks = [], lcp = [], shifts = [], samples = [], submits = [];
  let firstHydrated, measurement;
  document.addEventListener('submit', event => submits.push({ action: event.target.action, fields: Array.from(new FormData(event.target).keys()), time: performance.now() }), true);
  for (const key of ['warn', 'error']) {
    const original = console[key];
    console[key] = (...args) => { errors.push({ kind: key, message: args.map(String).join(' ') }); original.apply(console, args); };
  }
  window.addEventListener('error', event => { if (event.error) errors.push({ kind: 'error', message: String(event.error) }); });
  window.addEventListener('unhandledrejection', event => errors.push({ kind: 'rejection', message: String(event.reason) }));
  for (const [type, target] of [['longtask', longTasks], ['largest-contentful-paint', lcp], ['layout-shift', shifts]]) {
    try { new PerformanceObserver(list => target.push(...list.getEntries().map(entry => ({
      startTime: entry.startTime, duration: entry.duration, value: entry.value, recentInput: entry.hadRecentInput,
      element: entry.element?.tagName, src: entry.element?.currentSrc,
    })))).observe({ type, buffered: true }); } catch { /* Navegador registra suporte em relatório. */ }
  }
  let originalH1, originalRoot, originalScroll, before;
  function capture() {
    originalRoot = document.getElementById('root'); originalH1 = originalRoot.querySelector('h1');
    originalScroll = document.querySelector('[data-scroll-container]')?.scrollTop;
    before = { h1: originalH1?.textContent, route: document.documentElement.dataset.rota ?? null, scroll: originalScroll };
  }
  window.addEventListener('qa:root-ready', capture);
  const text = node => {
    const copy = node?.cloneNode(true); if (!copy) return '';
    copy.querySelectorAll('script,style,noscript').forEach(item => item.remove());
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };
  const style = node => {
    const css = getComputedStyle(node), rect = node.getBoundingClientRect();
    return { opacity: css.opacity, visibility: css.visibility, display: css.display, filter: css.filter, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  };
  function report() {
    const root = document.getElementById('root'), scroller = document.querySelector('[data-scroll-container]');
    if (!root || !before) return;
    const data = window.dataLayer || [];
    const events = data.map(item => item.event ? { ...item } : Array.from(item));
    const hydrated = events.some(event => event.event === 'page_view');
    if (hydrated && !firstHydrated) firstHydrated = { time: performance.now(), nodePreserved: originalH1 === root.querySelector('h1'), scroll: scroller?.scrollTop, h1: root.querySelector('h1')?.textContent };
    if (!measurement && performance.now() >= 4000) measurement = {
      cutoffMs: 4000, fontsLoaded: document.fonts.status === 'loaded',
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
      lcp: lcp.filter(entry => entry.startTime <= 4000).at(-1)?.startTime ?? null,
      cls: shifts.filter(entry => entry.startTime <= 4000 && !entry.recentInput).reduce((sum, entry) => sum + (entry.value || 0), 0),
      blockingObserved: longTasks.filter(entry => entry.startTime <= 4000).reduce((sum, entry) => sum + Math.max(0, entry.duration - 50), 0),
    };
    const images = Array.from(document.querySelectorAll('img')).filter(img => {
      const r = img.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
    }).map(img => ({ src: img.currentSrc || img.src, complete: img.complete, width: img.naturalWidth }));
    const result = { before, now: {
      title: document.title, h1: Array.from(root.querySelectorAll('h1')).map(node => node.textContent),
      marker: document.documentElement.dataset.rota ?? null, canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      mainText: lean ? '' : text(root.querySelector('main')), root: style(root), scroll: scroller?.scrollTop ?? null,
      reveal: document.documentElement.dataset.reveal ?? null,
      revealHidden: Array.from(root.querySelectorAll('.reveal-init')).filter(node => getComputedStyle(node).opacity === '0').length,
      cookie: !!document.querySelector('[aria-label="Cookies neste site"]'), nodePreserved: originalH1 === root.querySelector('h1'),
      forms: Array.from(root.querySelectorAll('form')).map(form => ({ action: form.getAttribute('action'), method: form.method,
        fields: Array.from(form.elements).map(el => ({ tag: el.tagName, name: el.name, disabled: el.disabled, type: el.type })) })),
      images, carousel: lean ? [] : Array.from(root.querySelectorAll('#comunidade article')).slice(0, 12).map(node => ({ text: text(node).slice(0, 100), ...style(node) })),
      media: Array.from(root.querySelectorAll('video')).map(node => ({ src: node.currentSrc, currentTime: node.currentTime, readyState: node.readyState, paused: node.paused, preload: node.preload, ...style(node) })),
    }, events, errors, samples, submits, firstHydrated, measurement, viewport: { width: innerWidth, height: innerHeight }, performance: {
      paints: performance.getEntriesByType('paint').map(entry => ({ name: entry.name, time: entry.startTime })),
      lcp, shifts, longTasks, navigation: performance.getEntriesByType('navigation').map(entry => entry.toJSON()),
      resources: performance.getEntriesByType('resource').map(entry => ({ name: entry.name, initiatorType: entry.initiatorType,
        startTime: entry.startTime, duration: entry.duration, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })),
    }, ready: document.readyState === 'complete', hydrated };
    const node = document.getElementById('qa-report'); if (node) node.textContent = JSON.stringify(result);
  }
  let frame = 0;
  function sample() {
    const root = document.getElementById('root');
    if (root && before && frame++ < 100) samples.push({ time: performance.now(), h1: root.querySelector('h1')?.textContent, hidden: getComputedStyle(root).visibility === 'hidden', scroll: document.querySelector('[data-scroll-container]')?.scrollTop });
    if (!lean) report(); if (frame < 100 && !lean) requestAnimationFrame(sample);
  }
  document.addEventListener('DOMContentLoaded', () => { if (!before) capture(); requestAnimationFrame(sample); setInterval(report, 500); });
})();
