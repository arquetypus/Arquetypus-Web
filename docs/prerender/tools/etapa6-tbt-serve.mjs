// Experimento restrito a loopback. Não altera dist, aplicação ou deployment.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = path.join(root, 'docs/prerender/evidence');
const origins = {
  baseline: 'https://www.arquetypus.com.br',
  ssg: 'https://arquetypus-parfum-git-prerender-saniella.vercel.app',
};
const bases = {
  baseline: path.join(root, 'node_modules/.tmp/etapa5-baseline/dist'),
  ssg: path.join(root, 'dist'),
};
const proof = [];
const requests = [];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const stripToolbar = html => html.replace(/\s*<script\b(?=[^>]*\bsrc="https:\/\/vercel\.live\/[^"\s]*")[^>]*>[\s\S]*?<\/script>\s*/g, '').trim();
const templates = {};
for (const variant of ['baseline', 'ssg']) {
  const filename = variant === 'baseline' ? 'index.html' : 'loja/zeus.html';
  const local = await readFile(path.join(bases[variant], filename), 'utf8');
  const response = await fetch(origins[variant] + '/loja/zeus', { signal: AbortSignal.timeout(30000) });
  const remote = await response.text();
  const normalizedLocal = stripToolbar(local).replaceAll('\r', '');
  const normalizedRemote = stripToolbar(remote).replaceAll('\r', '');
  if (response.status !== 200 || normalizedLocal !== normalizedRemote) {
    await writeFile(path.join(evidence, `etapa6-tbt-${variant}-remote.html`), remote);
    let offset = 0;
    while (offset < Math.min(normalizedLocal.length, normalizedRemote.length) && normalizedLocal[offset] === normalizedRemote[offset]) offset++;
    console.log({ variant, status: response.status, localLength: normalizedLocal.length, remoteLength: normalizedRemote.length, firstDifference: offset, local: normalizedLocal.slice(offset,offset+150), remote:normalizedRemote.slice(offset,offset+150) });
    throw Error('HTML divergente: ' + variant);
  }
  proof.push({ variant, path: '/loja/zeus', status: response.status, sameAsLocal: true, normalization: 'HTML: toolbar removed and CR line endings normalized; experiment serves remote template', sha256: digest(remote), deploymentId: remote.match(/data-deployment-id="([^"]+)"/)?.[1] ?? null });
  for (const asset of [...remote.matchAll(/(?:src|href)="(\/assets\/[^"\s]+\.(?:js|css))"/g)].map(match => match[1])) {
    const upstream = await fetch(origins[variant] + asset, { signal: AbortSignal.timeout(30000) });
    const bytes = Buffer.from(await upstream.arrayBuffer());
    const localBytes = await readFile(path.join(bases[variant], asset.slice(1)));
    if (upstream.status !== 200 || !bytes.equals(localBytes)) throw Error('Asset divergente: ' + asset);
    proof.push({ variant, path: asset, status: upstream.status, sameAsLocal: true, sha256: digest(bytes), bytes: bytes.length });
  }
  templates[variant] = stripToolbar(remote);
}
await writeFile(path.join(evidence, 'etapa6-tbt-artifact-proof.json'), JSON.stringify(proof, null, 2));

const fixture = `(() => {
  const choice = new URL(location.href).searchParams.get('consent') || 'absent';
  localStorage.removeItem('arq_consent');
  if (choice !== 'absent') localStorage.setItem('arq_consent', JSON.stringify({version:1, analytics:choice==='accepted', marketing:choice==='accepted', updatedAt:new Date().toISOString()}));
  const tasks=[],lcp=[],shifts=[],errors=[];
  const visibilityAtStart=document.visibilityState;
  for (const [type,target] of [['longtask',tasks],['largest-contentful-paint',lcp],['layout-shift',shifts]]) {
    new PerformanceObserver(list=>target.push(...list.getEntries().map(e=>({startTime:e.startTime,duration:e.duration,value:e.value,recentInput:e.hadRecentInput,src:e.element?.currentSrc})))).observe({type,buffered:true});
  }
  window.addEventListener('error',e=>{if(e.error)errors.push(String(e.error));});
  window.addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));
  const originalError=console.error;
  console.error=(...args)=>{errors.push(args.map(String).join(' '));originalError.apply(console,args)};
  let originalH1,hydratedAt=null,preserved=null,originalTitle;
  document.addEventListener('DOMContentLoaded',()=>{
    originalH1=document.querySelector('main h1'); originalTitle=document.title;
    const timer=setInterval(()=>{
      if((window.dataLayer||[]).some(e=>e.event==='page_view')) {
        hydratedAt=performance.now(); preserved=originalH1===document.querySelector('main h1'); clearInterval(timer);
      }
    },10);
  });
  setTimeout(()=>{
    const fcp=performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null;
    const rows=(window.dataLayer||[]).map(e=>e.event?{event:e.event,page_path:e.page_path}:Array.from(e));
    const result={ready:true,url:location.href,visibilityAtStart,visibilityAtEnd:document.visibilityState,collectedAtMs:performance.now(),viewport:{width:innerWidth,height:innerHeight},cutoffMs:8000,fcp,lcp:lcp.at(-1)?.startTime??null,cls:shifts.filter(e=>!e.recentInput).reduce((s,e)=>s+(e.value||0),0),longTasks:tasks,blockingAfterFcpObserved:fcp===null?null:tasks.reduce((s,e)=>s+Math.max(0,Math.min(e.startTime+e.duration,8000)-Math.max(e.startTime+50,fcp)),0),hydratedAt,preserved,originalTitle,title:document.title,h1:document.querySelector('main h1')?.textContent,errors,events:rows,resources:performance.getEntriesByType('resource').map(e=>({name:e.name,startTime:e.startTime,duration:e.duration,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize}))};
    const pre=document.createElement('pre');pre.id='tbt-result';pre.hidden=true;pre.textContent=JSON.stringify(result);document.body.append(pre);
    parent.postMessage({qaTbt:result},location.origin);
  },8000);
})();`;

const driver = `<!doctype html><meta charset="utf-8"><title>Diagnóstico TBT Zeus no Chrome</title>
<h1>Diagnóstico local de Zeus</h1><p>15 amostras: baseline, SSG e CSR do mesmo bundle. Apenas scripts próprios; janela observada de 8 s, sem throttling. Não é TBT Lighthouse.</p>
<button id="run">Executar 5 trios sem GTM</button><p id="status">Aguardando</p><iframe id="frame" style="width:390px;height:844px;border:0"></iframe><pre id="result"></pre>
<script>
const rows=[];let step=0;
const queue=Array.from({length:5},(_,i)=>['baseline','ssg','csr'].map(variant=>({variant,round:i+1}))).flat();
function next(){if(step===queue.length){document.getElementById('status').textContent='Concluído: '+rows.length;return}const test=queue[step];document.getElementById('status').textContent=JSON.stringify(test);document.getElementById('frame').src='/loja/zeus?variant='+test.variant+'&tags=blocked&consent=absent&sample='+step;}
document.getElementById('run').onclick=()=>{document.getElementById('run').disabled=true;next()};
window.addEventListener('message',async e=>{if(e.origin!==location.origin||e.source!==document.getElementById('frame').contentWindow||!e.data.qaTbt)return;rows.push({...queue[step],...e.data.qaTbt});step++;const result={ready:step===queue.length,rows};document.getElementById('result').textContent=JSON.stringify(result);await fetch('/__tbt/results',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result)});next()});
</script>`;

const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.png':'image/png', '.ico':'image/x-icon', '.woff2':'font/woff2', '.mp4':'video/mp4', '.json':'application/json', '.webmanifest':'application/manifest+json', '.txt':'text/plain' };
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:4179');
    requests.push({method:req.method,path:url.pathname,query:url.search,time:new Date().toISOString()});
    res.setHeader('Cache-Control','no-store');
    if(url.pathname==='/__tbt/results'&&req.method==='POST') {
      if(req.headers.origin!==url.origin){res.writeHead(403);return res.end()}
      let body='';for await(const chunk of req){body+=chunk;if(body.length>262144){res.writeHead(413);return res.end()}}
      const result=JSON.parse(body);
      if(!Array.isArray(result.rows)||result.rows.length>15||result.rows.some(row=>!['baseline','ssg','csr'].includes(row.variant)))throw Error('Resultado inválido');
      await writeFile(path.join(evidence,'etapa6-tbt-local.json'),JSON.stringify(result,null,2));
      console.log('Amostras persistidas: '+result.rows.length+'; ready='+result.ready);return res.end('OK');
    }
    if(req.method!=='GET'){res.writeHead(405);return res.end()}
    if(url.pathname==='/__tbt'){res.setHeader('Content-Type',types['.html']);return res.end(driver)}
    if(url.pathname==='/loja/zeus') {
      const variant=url.searchParams.get('variant');
      if(!['baseline','ssg','csr'].includes(variant)){res.writeHead(400);return res.end('Variante inválida')}
      let html=templates[variant==='baseline'?'baseline':'ssg'];
      if(variant==='baseline')html=html.replaceAll('/assets/','/__baseline/assets/');
      if(variant==='csr') {
        const start=html.indexOf('<div id="root">'), end=html.lastIndexOf('</div>');
        if(start<0||end<start)throw Error('Root CSR não localizado');
        html=html.slice(0,start)+'<div id="root"></div>'+html.slice(end+'</div>'.length);
        if(!html.includes('<div id="root"></div>'))throw Error('Root CSR não esvaziado');
      }
      // Isola terceiros apenas nesta resposta diagnóstica, preservando Consent Mode e eventos.
      if(url.searchParams.get('tags')!=='live')html=html.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/,'<script>window.dataLayer.push({event:"gtm.js",qa:true})</script>');
      html=html.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/,'');
      html=html.replace('<head>','<head><script>'+fixture+'</script>');
      res.setHeader('Content-Type',types['.html']);return res.end(html);
    }
    const baseline=url.pathname.startsWith('/__baseline/');
    const base=bases[baseline?'baseline':'ssg'];
    const filename=decodeURIComponent(url.pathname.slice(baseline?'/__baseline/'.length:1));
    const absolute=path.resolve(base,filename);
    if(!absolute.startsWith(base+path.sep)){res.writeHead(400);return res.end()}
    const bytes=await readFile(absolute);
    res.setHeader('Content-Type',types[path.extname(filename)]??'application/octet-stream');res.end(bytes);
  }catch(error){res.writeHead(error.code==='ENOENT'?404:500);res.end(String(error))}
});
server.listen(4179,'127.0.0.1',()=>console.log('QA TBT: http://127.0.0.1:4179/__tbt'));
process.on('SIGINT',async()=>{await writeFile(path.join(evidence,'etapa6-tbt-local-requests.json'),JSON.stringify(requests,null,2));server.close(()=>process.exit());});
