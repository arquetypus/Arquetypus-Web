import { readFile, writeFile } from 'node:fs/promises';
const base = new URL('../evidence/', import.meta.url);
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const metrics = {
  fcpMs: 'first-contentful-paint', lcpMs: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift', tbtMs: 'total-blocking-time',
};
const results = [];
for (const route of ['home', 'zeus']) {
  const runs = [];
  for (let run = 1; run <= 3; run++) {
    const report = JSON.parse(await readFile(new URL(`lighthouse-${route}-${run}.json`, base), 'utf8'));
    if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
    const values = Object.fromEntries(Object.entries(metrics).map(([key, audit]) => [key, report.audits[audit].numericValue]));
    if (Object.values(values).some(v => !Number.isFinite(v))) throw new Error(`Missing metrics: ${route} ${run}`);
    const resources = report.audits['resource-summary'].details.items;
    const bytes = Object.fromEntries(['document', 'script', 'stylesheet'].map(type => {
      const row = resources.find(item => item.resourceType === type);
      return [type, { transferBytes: row?.transferSize ?? 0, resourceBytes: row?.resourceSize ?? null, requests: row?.requestCount ?? 0 }];
    }));
    runs.push({ run, ...values, bytes, performanceScore: report.categories.performance.score,
      fetchTime: report.fetchTime, finalUrl: report.finalDisplayedUrl,
      lighthouseVersion: report.lighthouseVersion, userAgent: report.userAgent,
      environment: report.environment, settings: report.configSettings, warnings: report.runWarnings });
  }
  results.push({ route, runs, medians: {
    ...Object.fromEntries(Object.keys(metrics).map(key => [key, median(runs.map(r => r[key]))])),
    transferBytes: Object.fromEntries(['document', 'script', 'stylesheet'].map(type => [type, median(runs.map(r => r.bytes[type].transferBytes))])),
  } });
}
await writeFile(new URL('performance-summary.json', base), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results.map(r => ({ route: r.route, medians: r.medians, warnings: r.runs.map(x => x.warnings) })), null, 2));
