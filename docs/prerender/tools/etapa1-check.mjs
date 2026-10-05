// Contratos de Etapa 1; usa apenas dependências existentes. Node não possui DOM.
import assert from 'node:assert/strict';
import { createServer, build } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const report = { collectedAt: new Date().toISOString(), checks: [] };
function pass(name) { report.checks.push(name); console.log(`PASS ${name}`); }
const template = await readFile(path.join(root, 'index.html'), 'utf8');
const bootstrap = template.match(/<script id="reveal-bootstrap">([\s\S]*?)<\/script>/)[1];
function boot({ io = true, reduced = false } = {}) {
  const dataset = {};
  const events = new Map();
  const timers = new Map();
  let id = 0;
  const context = {
    document: { documentElement: { dataset } },
    window: {
      ...(io ? { IntersectionObserver() {} } : {}),
      matchMedia: () => ({ matches: reduced }),
      addEventListener: (name, fn) => events.set(name, fn),
      removeEventListener: name => events.delete(name),
    },
    setTimeout: (fn, ms) => { timers.set(++id, { fn, ms }); return id },
    clearTimeout: id => timers.delete(id),
  };
  vm.runInNewContext(bootstrap, context);
  return { dataset, events, timers, fire: name => events.get(name)?.({}), expire: () => [...timers.values()].forEach(t => t.fn()) };
}
for (const options of [{ io: false }, { reduced: true }]) {
  const b = boot(options);
  assert.equal(b.dataset.reveal, undefined);
  assert.equal(b.timers.size, 0);
}
pass('IO ausente/movimento reduzido: sem ocultação ou watchdog');
const normal = boot();
assert.equal(normal.dataset.reveal, 'pending');
normal.fire('arq:reveal-ready');
assert.equal(normal.dataset.reveal, 'ready');
assert.equal(normal.timers.size, 0);
assert.equal(normal.events.size, 0);
pass('Prontidão cancela watchdog e listeners');
const slow = boot();
assert.equal([...slow.timers.values()][0].ms, 2000);
slow.expire();
slow.fire('arq:reveal-ready');
assert.equal(slow.dataset.reveal, 'released');
pass('Prazo excedido: conteúdo liberado, JS tardio não rearma');
const failed = boot();
failed.events.get('error')({ target: { tagName: 'SCRIPT', type: 'module' } });
assert.equal(failed.dataset.reveal, 'released');
pass('Falha de download de módulo libera conteúdo');

const server = await createServer({
  root, configFile: false, plugins: [react()], resolve: { alias: { '@': path.join(root, 'src') } },
  server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent',
});
try {
  const theme = await server.ssrLoadModule('/src/lib/theme.ts');
  const defaultSnapshot = theme.DEFAULT_THEME_STATE;
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  assert.deepEqual(theme.DEFAULT_HTML_ATTRIBUTES, {
    'data-estrutura': defaultSnapshot.theme, 'data-paleta': defaultSnapshot.paleta, 'data-estilo': defaultSnapshot.estilo,
  });
  pass('Tema importa sem DOM; atributos derivados do snapshot');
  const { Fixture } = await server.ssrLoadModule('/docs/prerender/tools/etapa1-fixture.tsx');
  const html = renderToString(createElement(Fixture));
  assert.equal(renderToString(createElement(Fixture)), html);
  assert.ok(html.includes(JSON.stringify(defaultSnapshot).replaceAll('"', '&quot;')));
  assert.ok(!html.includes('aria-label="Cookies neste site"'));
  for (const name of ['email', 'whatsapp']) {
    assert.ok(new RegExp(`<input(?=[^>]*name="${name}")(?=[^>]*disabled="")[^>]*>`).test(html), `${name} desabilitado`);
  }
  assert.match(html, /<button[^>]*type="submit"[^>]*disabled=""/);
  assert.ok(!html.includes('autoPlay=""'));
  assert.ok(html.includes('data-hero-started="false"'));
  assert.ok(!html.includes('class="w-full shrink-0 snap-center gallery-hint'));
  pass('Render repetível: cookies ausentes, cupom desabilitado, mídia/galeria sem autoplay');
  await writeFile(path.join(evidence, 'etapa1-fixture-ssr.html'), html);
  const built = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  for (const [name, value] of Object.entries(theme.DEFAULT_HTML_ATTRIBUTES)) assert.ok(built.includes(`${name}="${value}"`));
  for (const name of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
    assert.ok((await readFile(path.join(root, 'dist', name))).length > 0);
  }
  pass('Build cliente possui atributos e três arquivos SEO');
} finally { await server.close(); }

const outDir = path.join(root, 'node_modules/.tmp/etapa1-ssr-check');
await build({ root, logLevel: 'silent', build: { ssr: 'src/lib/arquivosSeo.ts', outDir, emptyOutDir: true } });
const files = await readdir(outDir);
assert.ok(!['robots.txt', 'sitemap.xml', 'llms.txt'].some(name => files.includes(name)));
pass('Build SSR do gerador não grava arquivos SEO');
const browser = JSON.parse(await readFile(path.join(evidence, 'etapa1-browser-local.json'), 'utf8'));
const cases = ['normal', 'slow', 'blocked', 'accepted', 'refused', 'missing-io', 'throwing-io', 'reduced'];
for (const name of cases) {
  const row = browser.hydration.find(row => row.case === name);
  assert.equal(row?.status, 'DONE', name);
  assert.deepEqual(row.errors, [], name);
  assert.equal(row.beforeHydration.formDisabled, true, name);
  assert.equal(row.beforeHydration.nativeClickSubmits, 0, name);
  assert.equal(row.beforeHydration.videoAutoplay, false, name);
  assert.equal(row.beforeHydration.barAnimation, 'none', name);
  assert.equal(row.afterHydration.formEnabled, true, name);
  assert.equal(row.afterHydration.cookieVisible, !['accepted', 'refused'].includes(name), name);
  assert.equal(row.submitPrevented, true, name);
  assert.equal(row.reopenWorks, true, name);
  assert.equal(row.refuseCloses, true, name);
  assert.equal(row.revealOpacity, '1', name);
  if (name !== 'reduced') assert.equal(row.galleryHintFinished, true, name);
  const play = row.mediaStarts[0];
  const timer = row.heroTimers[0];
  assert.equal(play.heroStarted, 'true', name);
  assert.equal(timer.duration, 11450, name);
  assert.ok(Math.abs(timer.time - play.time) < 16.7, `${name}: start dentro de um frame de 60 Hz`);
}
const late = browser.hydration.find(row => row.case === 'slow');
assert.equal(late.beforeLateHydration.state, 'released');
assert.equal(late.beforeLateHydration.revealOpacity, '1');
assert.equal(late.afterHydration.state, 'released');
assert.equal(late.afterHydration.heroAnimate, 'false');
assert.equal(browser.hydration.find(row => row.case === 'reduced').reducedAnimations, true);
for (const name of ['no-scripts', 'no-app', 'bundle-failed']) {
  const row = browser.static.find(row => row.case === name);
  assert.equal(row.disabled, true, name);
  assert.equal(row.heroOpacity, '1', name);
  assert.ok(row.opacity.every(value => value === '1'), name);
}
pass('Evidência browser: oito hidratações e três falhas/HTML estático aprovados');
await mkdir(evidence, { recursive: true });
await writeFile(path.join(evidence, 'etapa1-contracts.json'), JSON.stringify(report, null, 2) + '\n');
