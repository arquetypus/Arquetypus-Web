import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routeFile, verifyDocuments } from './prerender-utils.mjs';

process.env.NODE_ENV = 'production';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const renderer = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
const pages = [];
for (const route of [...renderer.routes, null]) {
  const file = route === null ? '404.html' : routeFile(route);
  pages.push({ route, file, html: await readFile(path.join(dist, file), 'utf8') });
}
const files = (await readdir(dist, { recursive: true, withFileTypes: true })).filter(file => file.isFile())
  .map(file => path.relative(dist, path.join(file.parentPath, file.name)).replaceAll(path.sep, '/')).sort();
assert.deepEqual(files.filter(file => file.endsWith('.html')), pages.map(page => page.file).sort(), 'HTML extra/obsoleto');
assert.ok(!files.some(file => /(?:entry-server|client-template|smoke-ssr|\.tsx?$)/.test(file)), 'Artefato privado na saída pública');
// Teto por imagem publicada (out/2026): rede de segurança da otimização do vite.config.ts — uma foto que escape da
// regra (ou entre em public/) derruba o build em vez de pesar no site. Subir o teto só com motivo.
const TETO_IMAGEM_KB = 400;
const imagens = files.filter(file => /\.(?:png|jpe?g|webp|avif|gif)$/i.test(file));
const pesadas = [];
for (const file of imagens) {
  const kb = (await readFile(path.join(dist, file))).length / 1024;
  if (kb > TETO_IMAGEM_KB) pesadas.push(`${file} (${Math.round(kb)} KB)`);
}
assert.deepEqual(pesadas, [], `Imagem acima de ${TETO_IMAGEM_KB} KB — otimizar antes de publicar`);
// Vídeo no HTML publicado (out/2026): sempre com foto do 1º quadro (poster) e sem download antecipado — senão
// ele disputa a conexão com o que monta a página. O vídeo do hero nem sai no HTML: entra depois do `load`
// (HeroCinema). Um <video> novo que caia no HTML inicial tem que seguir a mesma regra.
for (const page of pages) {
  for (const [tag] of page.html.matchAll(/<video\b[^>]*>/g)) {
    assert.match(tag, /\bposter="[^"]+"/, `Vídeo sem poster (foto do 1º quadro) em ${page.file}: ${tag}`);
    assert.match(tag, /\bpreload="(?:none|metadata)"/, `Vídeo com download antecipado em ${page.file} (usar preload="none" ou "metadata"): ${tag}`);
  }
}
// Imagens que baixam de cara (sem loading="lazy") por página (out/2026): só as da primeira tela — logos do header,
// foto do topo e o card central da comunidade. Imagem nova entra lazy (MediaSlot já é; <img> solto precisa do
// atributo); foto de topo usa MediaSlot `prioridade`. Passou do teto: alguma imagem fora da tela está competindo.
const TETO_IMAGENS_DE_CARA = 5;
for (const page of pages) {
  const deCara = [...page.html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag).filter(tag => !/\bloading="lazy"/.test(tag));
  assert.ok(deCara.length <= TETO_IMAGENS_DE_CARA,
    `${page.file}: ${deCara.length} imagens sem loading="lazy" (teto ${TETO_IMAGENS_DE_CARA}):\n${deCara.map(t => t.match(/src="([^"]+)"/)?.[1]).join('\n')}`);
}
// Foto grande sem srcset (out/2026): imagem publicada acima de 60 KB precisa sair em várias larguras, senão o
// celular baixa a versão de desktop. Resolver importando com `?responsiva` (ver src/lib/foto.ts).
const TETO_SEM_SRCSET_KB = 60;
const semSrcset = new Set();
for (const page of pages) {
  for (const [tag] of page.html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag.match(/\bsrc="(\/assets\/[^"]+)"/)?.[1];
    if (!src || /\bsrcset="/i.test(tag)) continue;
    const kb = (await readFile(path.join(dist, src))).length / 1024;
    if (kb > TETO_SEM_SRCSET_KB) semSrcset.add(`${src} (${Math.round(kb)} KB) em ${page.file}`);
  }
}
assert.deepEqual([...semSrcset], [], `Foto acima de ${TETO_SEM_SRCSET_KB} KB sem srcset — importar com ?responsiva (src/lib/foto.ts)`);
const report = await verifyDocuments(pages, renderer, dist);
await writeFile(path.join(root, 'dist-server/verify-prerender.json'), JSON.stringify({ ...report, inventory: files }, null, 2) + '\n');
console.log(`PASS artefatos: ${pages.length} HTMLs, ${report.resources.length} recursos, ${report.sitemap.length} canonicals no sitemap, ${imagens.length} imagens até ${TETO_IMAGEM_KB} KB.`);
