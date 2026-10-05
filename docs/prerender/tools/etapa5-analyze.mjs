// Resume evidências já coletadas; não confunde localhost com desempenho da Vercel.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const directory = new URL('../evidence/', import.meta.url);
const read = name => readFile(new URL(name, directory), 'utf8').then(JSON.parse);
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const input = await read('etapa5-performance.json');
const medians = [];
for (const route of ['/', '/loja/zeus']) for (const variant of ['baseline', 'ssg']) {
  const rows = input.rows.filter(row => row.route === route && row.variant === variant);
  assert.equal(rows.length, 3);
  assert.ok(rows.every(row => row.measurement.fontsLoaded && !row.errors.length));
  medians.push({ route, variant, runs: rows.length, ...Object.fromEntries(['fcp', 'lcp', 'cls', 'blockingObserved']
    .map(key => [key, median(rows.map(row => row.measurement[key]))])) });
}
const waterfall = input.rows.map(row => {
  const groups = new Map();
  const resources = row.performance.resources.filter(item => item.startTime <= 4000);
  for (const resource of resources) {
    const pathname = new URL(resource.name).pathname.replace('/__baseline-assets', '');
    const list = groups.get(pathname) ?? []; list.push(resource); groups.set(pathname, list);
  }
  const media = resources.filter(item => item.initiatorType === 'video');
  return { route: row.route, variant: row.variant, round: row.round,
    firstResources: [...resources].sort((a, b) => a.startTime - b.startTime).slice(0, 14),
    repeated: [...groups].filter(([, list]) => list.length > 1).map(([pathname, list]) => ({ pathname, count: list.length,
      initiators: list.map(item => item.initiatorType), transferred: list.reduce((sum, item) => sum + item.transferSize, 0) })),
    imagePreloadRequests: resources.filter(item => item.initiatorType === 'link' && /\.(png|jpg|webp)$/.test(new URL(item.name).pathname)).length,
    videoRequests: media.length, videoTransferred: media.reduce((sum, item) => sum + item.transferSize, 0),
    video: row.media,
  };
});
const suites = [];
for (const [file, count] of [['etapa5-matrix.json', 190], ['etapa5-hydration-final.json', 95],
  ['etapa5-failure.json', 57], ['etapa5-dom.json', 19], ['etapa5-urls.json', 89], ['etapa5-legacy.json', 10],
  ['etapa5-responsive.json', 16], ['etapa5-forms-static.json', 7]]) {
  const result = await read(file);
  assert.equal(result.rows.length, count, file);
  assert.ok(result.rows.every(row => row.passed === true || row.pass === true), file);
  suites.push({ file, cases: count, passed: true });
}
const ui = await read('etapa5-ui.json');
assert.ok(ui.rows.every(row => row.passed));
assert.ok((await read('etapa5-tracking.json')).pass);
assert.ok((await read('etapa5-forms-slow-after.json')).passed);
assert.ok((await read('etapa5-slow-media.json')).summary.passed);
const result = { collectedAt: new Date().toISOString(), conditions: input.conditions, medians, waterfall, suites,
  uiCases: ui.rows.length, uiPassed: true,
  limitations: [
    'Janela de 4s, loopback e sem throttling: não equivale a Lighthouse nem produção.',
    'blockingObserved soma excesso de long tasks acima de 50ms; não é TBT/INP.',
    'Resource Timing mostra início/duração/bytes; prioridade efetiva do escalonador não é exposta por esta API.',
    'Entradas repetidas de vídeo podem representar Range; conferir requisições antes de inferir download integral duplicado.',
    'GTM externo foi substituído por marcador; testes de tags reais permanecem na Etapa 6/7.',
  ] };
await writeFile(new URL('etapa5-analysis.json', directory), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ medians, suites, uiCases: ui.rows.length }, null, 2));
