// Read-only HTTP baseline for the current SPA. Not an SSG acceptance verifier.
import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const out = path.join(root, 'docs/prerender/evidence');
await mkdir(out, { recursive: true });
const server = await createServer({
  root, configFile: false, appType: 'custom', logLevel: 'silent',
  server: { middlewareMode: true }, resolve: { alias: { '@': path.join(root, 'src') } },
});
let routes;
try {
  const { PAGINAS_PUBLICAS } = await server.ssrLoadModule('/src/data/rotas.ts');
  const { ARCHETYPES } = await server.ssrLoadModule('/src/data/archetypes.ts');
  routes = [...PAGINAS_PUBLICAS.map(p => p.path), ...ARCHETYPES.map(p => `/loja/${p.id}`)];
} finally { await server.close(); }
if (routes.length !== 18 || new Set(routes).size !== 18) throw new Error('Unexpected route inventory');
const localHtml = await readFile(path.join(root, 'dist/index.html'));
const sha = data => createHash('sha256').update(data).digest('hex');
const report = { collectedAt: new Date().toISOString(), routes, localHtmlSha256: sha(localHtml), responses: [], assets: [] };
const cases = [...routes, '/qualquer-coisa', '/loja/nao-existe', '/arquetipos/zeus', '/kit-descoberta', '/trocas', '/termos'];
for (const route of cases) {
  const chain = [];
  let url = `https://arquetypus.com.br${route}`;
  try {
    for (let i = 0; i < 5; i++) {
      const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      const headers = Object.fromEntries([...res.headers].filter(([k]) => ['location', 'content-type', 'cache-control', 'x-vercel-id', 'x-vercel-cache', 'server', 'etag'].includes(k)));
      chain.push({ url, status: res.status, headers });
      if ([301, 302, 303, 307, 308].includes(res.status) && headers.location) {
        await res.arrayBuffer();
        url = new URL(headers.location, url).href;
        continue;
      }
      const bytes = Buffer.from(await res.arrayBuffer());
      const html = bytes.toString('utf8');
      const item = {
        route, chain, bytes: bytes.length, sha256: sha(bytes), sameAsLocalHtml: bytes.equals(localHtml),
        rawTitle: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? null,
        rawCanonical: html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] ?? null,
        rootEmpty: /<div\s+id="root"\s*>\s*<\/div>/i.test(html),
        rawH1Count: (html.match(/<h1\b/gi) ?? []).length,
      };
      report.responses.push(item);
      if (route === '/') await writeFile(path.join(out, 'production-index.html'), bytes);
      console.log(`${route}: ${chain.map(r => r.status).join(' -> ')}; emptyRoot=${item.rootEmpty}; sameHtml=${item.sameAsLocalHtml}`);
      break;
    }
  } catch (error) { report.responses.push({ route, chain, error: String(error) }); console.log(`${route}: ${error}`); }
}
const assets = [...localHtml.toString('utf8').matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map(m => m[1]);
for (const asset of assets) {
  try {
    const res = await fetch(`https://www.arquetypus.com.br${asset}`, { signal: AbortSignal.timeout(20000) });
    const bytes = Buffer.from(await res.arrayBuffer());
    const local = await readFile(path.join(root, 'dist', asset.slice(1)));
    report.assets.push({ asset, status: res.status, remoteBytes: bytes.length, localBytes: local.length, remoteSha256: sha(bytes), localSha256: sha(local), identical: bytes.equals(local) });
  } catch (error) { report.assets.push({ asset, error: String(error) }); }
}
await writeFile(path.join(out, 'http-baseline.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.assets));
