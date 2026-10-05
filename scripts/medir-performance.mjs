// Mede a performance do site NO AR com o Lighthouse e salva um retrato em perf/{data}-{rótulo}.json + .md, pra
// comparar antes/depois de uma mudança. Fora do pipeline de build: rodar à mão, depois do deploy terminar.
//
//   npm run perf -- antes            mede e salva com o rótulo "antes"
//   npm run perf -- depois antes     mede, salva e compara com o último retrato "antes"
//
// Padrão: Lighthouse local (npx, versão fixa, com o Chrome da máquina) — comparar só medições da MESMA máquina.
// Com PSI_KEY no ambiente (chave da API PageSpeed Insights), mede nos servidores do Google; sem chave a cota
// anônima da API costuma estar esgotada.
// O Lighthouse varia de uma rodada pra outra; por isso cada página é medida RODADAS vezes e fica a mediana.
import { exec } from 'node:child_process';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const LIGHTHOUSE = 'lighthouse@13.5.0';

const SITE = 'https://www.arquetypus.com.br';
const PAGINAS = ['/', '/body-splash/zeus-stormbreak', '/criadores'];
const ESTRATEGIAS = ['mobile', 'desktop'];
const RODADAS = 3;

const root = fileURLToPath(new URL('../', import.meta.url));
const pasta = path.join(root, 'perf');
const [rotulo = 'medicao', comparaCom] = process.argv.slice(2);

const METRICAS = [
  ['nota', 'Performance', v => String(v)],
  ['fcp', 'FCP (s)', v => (v / 1000).toFixed(2)],
  ['lcp', 'LCP (s)', v => (v / 1000).toFixed(2)],
  ['tbt', 'TBT (ms)', v => v.toFixed(0)],
  ['cls', 'CLS', v => v.toFixed(3)],
  ['si', 'Speed Index (s)', v => (v / 1000).toFixed(2)],
  ['peso', 'Peso total (KB)', v => v.toFixed(0)],
  ['semCache', '/assets/ sem cache longo', v => String(v)],
];
const mediana = xs => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const extrair = lh => {
  const a = lh.audits;
  return {
    nota: Math.round(lh.categories.performance.score * 100),
    fcp: a['first-contentful-paint'].numericValue,
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    si: a['speed-index'].numericValue,
    peso: a['total-byte-weight'].numericValue / 1024,
    // arquivos /assets/ que a página baixou — o cache deles é conferido à parte (ver cacheDosAssets)
    assets: [...new Set((a['network-requests']?.details?.items ?? []).map(i => i.url).filter(u => u.startsWith(SITE + '/assets/')))],
    maiores: (a['total-byte-weight'].details?.items ?? []).slice(0, 8)
      .map(i => ({ url: i.url.replace(SITE, ''), kb: Math.round(i.totalBytes / 1024) })),
  };
};

async function rodarPsi(url, strategy) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.search = new URLSearchParams({ url, strategy, category: 'performance', key: process.env.PSI_KEY });
  for (let tentativa = 1; ; tentativa++) {
    const res = await fetch(api);
    if (res.ok) return extrair((await res.json()).lighthouseResult);
    if (tentativa >= 3) throw new Error(`PSI ${res.status} em ${url} (${strategy}): ${(await res.text()).slice(0, 300)}`);
    await new Promise(r => setTimeout(r, 5000 * tentativa));
  }
}

async function rodarLocal(url, strategy) {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'arq-perf-'));
  const saida = path.join(tmp, 'lh.json');
  try {
    const args = ['--yes', LIGHTHOUSE, url, '--quiet', '--only-categories=performance',
      '--output=json', `--output-path=${saida}`, '--chrome-flags=--headless=new',
      ...(strategy === 'desktop' ? ['--preset=desktop'] : [])];
    await promisify(exec)(['npx', ...args].map(a => JSON.stringify(a)).join(' '), { maxBuffer: 64 * 1024 * 1024 });
    return extrair(JSON.parse(await readFile(saida, 'utf8')));
  } finally { await rm(tmp, { recursive: true, force: true }); }
}

const rodar = process.env.PSI_KEY ? rodarPsi : rodarLocal;

// O Lighthouse não aponta arquivo com "max-age=0, must-revalidate" (entende como escolha do site), então o cache
// é conferido direto nos cabeçalhos: conta os /assets/ sem max-age de pelo menos 30 dias.
async function cacheDosAssets(urls) {
  let sem = 0, exemplo;
  for (const url of urls) {
    const cc = (await fetch(url, { method: 'HEAD' })).headers.get('cache-control') ?? '';
    const maxAge = Number(cc.match(/max-age=(\d+)/)?.[1] ?? 0);
    if (maxAge < 30 * 24 * 3600) { sem++; exemplo ??= cc; }
  }
  return { semCache: sem, cacheExemplo: exemplo ?? null };
}

const ferramenta = process.env.PSI_KEY ? 'PageSpeed Insights' : `${LIGHTHOUSE} local (${os.hostname()})`;
const resultado = { rotulo, data: new Date().toISOString(), site: SITE, ferramenta, rodadas: RODADAS, paginas: {} };
for (const pagina of PAGINAS) {
  for (const estrategia of ESTRATEGIAS) {
    const runs = [];
    for (let i = 0; i < RODADAS; i++) {
      process.stdout.write(`${pagina} ${estrategia} ${i + 1}/${RODADAS}… `);
      runs.push(await rodar(SITE + pagina, estrategia));
      console.log(`nota ${runs.at(-1).nota}`);
    }
    const resumo = Object.fromEntries(METRICAS.filter(([k]) => k !== 'semCache').map(([k]) => [k, mediana(runs.map(r => r[k]))]));
    resultado.paginas[`${pagina} · ${estrategia}`] = {
      ...resumo, ...(await cacheDosAssets(runs[0].assets)), assets: runs[0].assets.length,
      maiores: runs[0].maiores, rodadas: runs.map(r => r.nota),
    };
  }
}

let base;
if (comparaCom) {
  const arquivos = (await readdir(pasta).catch(() => [])).filter(f => f.endsWith(`-${comparaCom}.json`)).sort();
  if (!arquivos.length) console.warn(`Nenhum retrato "${comparaCom}" em perf/ pra comparar.`);
  else base = JSON.parse(await readFile(path.join(pasta, arquivos.at(-1)), 'utf8'));
  if (base && base.ferramenta !== ferramenta) console.warn(`Atenção: "${comparaCom}" foi medido com ${base.ferramenta}; comparação pouco confiável.`);
}

const linhas = [`# Performance — ${rotulo}`, '', `${resultado.data} · ${SITE} · ${ferramenta}, mediana de ${RODADAS} rodadas`, ''];
if (base) linhas.push(`Comparado com "${base.rotulo}" de ${base.data}. Formato: antes → agora.`, '');
for (const [chave, r] of Object.entries(resultado.paginas)) {
  const b = base?.paginas[chave];
  linhas.push(`## ${chave}`, '', '| Métrica | Valor |', '|---|---|');
  for (const [k, nome, fmt] of METRICAS) linhas.push(`| ${nome} | ${b ? `${fmt(b[k])} → ` : ''}${fmt(r[k])} |`);
  linhas.push('', `Notas das rodadas: ${r.rodadas.join(', ')}`, '',
    `Cache dos /assets/: ${r.semCache} de ${r.assets} sem cache longo${r.cacheExemplo ? ` (ex.: \`${r.cacheExemplo}\`)` : ''}`,
    '', 'Maiores arquivos:', '');
  for (const m of r.maiores) linhas.push(`- ${m.kb} KB — ${m.url}`);
  linhas.push('');
}

await mkdir(pasta, { recursive: true });
const nome = `${resultado.data.slice(0, 10)}-${rotulo}`;
await writeFile(path.join(pasta, nome + '.json'), JSON.stringify(resultado, null, 2) + '\n');
await writeFile(path.join(pasta, nome + '.md'), linhas.join('\n'));
console.log(`\nSalvo em perf/${nome}.md e .json`);
