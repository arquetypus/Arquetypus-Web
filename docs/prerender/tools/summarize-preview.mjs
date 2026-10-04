// Read-only comparison of the Etapa 0 SPA preview. Not SSG acceptance.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../../../', import.meta.url);
const evidence = new URL('docs/prerender/evidence/', root);
const http = JSON.parse(await readFile(new URL('preview-http-baseline.json', evidence), 'utf8'));
const metadata = JSON.parse(await readFile(new URL('preview-metadata-client.json', evidence), 'utf8'));
const local = await readFile(new URL('dist/index.html', root));
const home = await readFile(new URL('preview-index.html', evidence));
const suffix = home.subarray(local.length).toString('utf8');
const products = metadata.rows.filter(row => row.route.startsWith('/loja/'));
const report = {
  collectedAt: new Date().toISOString(), origin: http.origin,
  publicRouteCount: http.routes.length, responseCount: http.responses.length,
  publicRoutes200: http.responses.filter(row => http.routes.includes(row.route)).every(row => row.chain[0].status === 200),
  allResponses200: http.responses.every(row => row.chain[0].status === 200),
  allResponsesNoindex: http.responses.every(row => row.chain[0].headers['x-robots-tag'] === 'noindex'),
  allResponsesRootEmpty: http.responses.every(row => row.rootEmpty && row.rawH1Count === 0),
  jsCssIdentical: http.assets.every(row => row.identical && row.status === 200),
  clientMetadataAll18Equal: metadata.comparison.length === 18 && metadata.comparison.every(row => row.differences.length === 0),
  allNineProductsShowPrice7990: products.length === 9 && products.every(row => row.hasPrice7990),
  homeDifference: {
    prefixEqualsLocal: home.subarray(0, local.length).equals(local), suffix,
    onlyVercelFeedbackAppend: /^<script async data-explicit-opt-in="true" data-deployment-id="[^"]+" src="https:\/\/vercel.live\/_next-live\/feedback\/feedback.js"><\/script>$/.test(suffix),
    reportedPreviewDeploymentId: suffix.match(/data-deployment-id="([^"]+)"/)?.[1],
  },
  staticFiles: [],
};
for (const asset of ['/robots.txt', '/sitemap.xml', '/llms.txt']) {
  const res = await fetch(http.origin + asset, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  const bytes = Buffer.from(await res.arrayBuffer());
  const before = await readFile(fileURLToPath(new URL('dist' + asset, root)));
  report.staticFiles.push({
    path: asset, status: res.status, contentType: res.headers.get('content-type'),
    xRobotsTag: res.headers.get('x-robots-tag'), identical: bytes.equals(before),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
await writeFile(new URL('preview-validation.json', evidence), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
