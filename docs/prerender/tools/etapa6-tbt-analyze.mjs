// Leitura das evidências; não executa browser, build ou deployment.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const dir=path.join(root,'docs/prerender/evidence');
const readJson=async file=>JSON.parse(await readFile(path.join(dir,file),'utf8'));
const original=(await readJson('etapa6-pagespeed.json')).rows.filter(row=>row.route==='/loja/zeus');
const retest=(await readJson('etapa6-tbt-retest-pagespeed.json')).rows;
const local=await readJson('etapa6-tbt-local.json');
const median=values=>{const sorted=[...values].sort((a,b)=>a-b),m=Math.floor(sorted.length/2);return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2};
const percent=(value,base)=>base===0?null:100*(value/base-1);
function summarize(rows){
  const result={};
  for(const variant of ['baseline','ssg']){
    const samples=rows.filter(row=>row.variant===variant);
    result[variant]={n:samples.length};
    for(const metric of ['FCP','LCP','TBT','CLS']){
      const values=samples.map(row=>Number(row.metrics[metric]));
      assert(values.every(Number.isFinite));
      result[variant][metric]={median:median(values),min:Math.min(...values),max:Math.max(...values),values};
    }
  }
  result.deltaPercent=Object.fromEntries(['FCP','LCP','TBT'].map(metric=>[metric,percent(result.ssg[metric].median,result.baseline[metric].median)]));
  return result;
}
const tasks=[];
for(const row of retest){
  const items=[];
  if(row.snapshotFormat==='AX'){
    const lines=row.snapshot.split('\n');
    for(let i=0;i<lines.length;i++){
      const link=lines[i].match(/link Description: ((?:\/gtag\/js|\/gtm\.js|\/assets\/index-)[^,]+), Value:/);
      if(!link)continue;
      const times=lines.slice(i+1,i+10).map(line=>line.match(/\d+ text ([\d.]+)\s*ms/)).filter(Boolean).map(match=>Number(match[1].replaceAll('.','')));
      if(times.length>=2)items.push({url:link[1],startMs:times[0],durationMs:times[1]});
    }
  }else{
    for(const match of row.snapshot.matchAll(/- row "((?:\/gtag\/js|\/gtm\.js|\/assets\/index-)[^\n]+?) ([\d.]+)\s*ms ([\d.]+)\s*ms":/g)){
      items.push({url:match[1],startMs:Number(match[2].replaceAll('.','')),durationMs:Number(match[3].replaceAll('.',''))});
    }
  }
  if(items.length===0)assert(row.variant==='baseline'&&row.round===4,'Auditoria de tarefas ausente sem interrupção registrada');
  tasks.push({variant:row.variant,round:row.round,FCP:Number(row.metrics.FCP),TTI:Number(row.metrics.TTI),TBT:Number(row.metrics.TBT),items,
    available:items.length>0,
    ownLongTaskDuration:items.filter(task=>task.url.startsWith('/assets/')).reduce((sum,task)=>sum+task.durationMs,0),
    thirdPartyLongTaskDuration:items.filter(task=>!task.url.startsWith('/assets/')).reduce((sum,task)=>sum+task.durationMs,0)});
}
const baselineTemplate=await readFile(path.join(root,'node_modules/.tmp/etapa5-baseline/dist/index.html'),'utf8');
const ssgTemplate=await readFile(path.join(root,'dist/loja/zeus.html'),'utf8');
const consentScript=html=>[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]).find(script=>script.includes("gtag('consent', 'default'"));
const gtmScript=html=>html.match(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/)?.[0];
const normalize=script=>script.replaceAll('\r','').trim();
const trackerBaseline=execFileSync('git',['show','8a02e4a:src/components/RouteTracker.tsx'],{cwd:root,encoding:'utf8'});
const trackerCurrent=await readFile(path.join(root,'src/components/RouteTracker.tsx'),'utf8');
const withoutComments=text=>text.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^[ \t]*\/\/.*$/gm,'').replaceAll('\r','').split('\n').filter(line=>line.trim()).join('\n').trim();
assert.equal(withoutComments(trackerBaseline),withoutComments(trackerCurrent));
assert.equal(normalize(consentScript(baselineTemplate)),normalize(consentScript(ssgTemplate)));
assert.equal(normalize(gtmScript(baselineTemplate)),normalize(gtmScript(ssgTemplate)));
const hash=script=>createHash('sha256').update(normalize(script)).digest('hex');
const localRows=local.rows.map(row=>({variant:row.variant,round:row.round,viewport:row.viewport,fcp:row.fcp,hydratedAt:row.hydratedAt,errors:row.errors,
  firstPartyBlockingObservedAllTasks:row.longTasks.reduce((sum,task)=>sum+Math.max(0,task.duration-50),0),
  googleTagResources:row.resources.filter(resource=>/googletagmanager|google-analytics|vercel.live/.test(resource.name)).length}));
assert.equal(local.ready,true);
assert.equal(localRows.length,15);
assert(localRows.every(row=>row.errors.length===0&&row.googleTagResources===0));
const expectedRetestComplete=retest.length===10&&['baseline','ssg'].every(variant=>retest.filter(row=>row.variant===variant).map(row=>row.round).sort().join(',')==='1,2,3,4,5');
assert.equal(expectedRetestComplete,true,'Concluir cinco pares fixados antes do aceite');
assert(tasks.every(row=>row.available),'Completar as dez auditorias de tarefas');
assert([...original,...retest].every(row=>row.metrics.device==='mobile'&&row.metrics.version==='13.5.0'));
const all=summarize([...original,...retest]), latest=summarize(retest);
const zeusPerformanceComparisonAccepted=all.deltaPercent.LCP<=10&&all.deltaPercent.TBT<=10&&latest.deltaPercent.LCP<=10&&latest.deltaPercent.TBT<=10&&all.ssg.CLS.max<=0.02;
const result={collectedAt:new Date().toISOString(),primaryBrowser:'Google Chrome',expectedRetestComplete,
  original:summarize(original),retest:latest,all,tasks,
  staticTrackingEquivalence:{consentScriptIdentical:true,gtmScriptIdentical:true,consentSha256:hash(consentScript(ssgTemplate)),gtmSha256:hash(gtmScript(ssgTemplate)),routeTrackerExecutableCodeChanged:false},
  local:{n:15,rows:localRows,eligibleAsLighthouseGate:false,reason:'Iframe experiment has missing paint entries; no CPU/network throttling; large observed timing variance. Its fixed-window blocking sum is not Lighthouse TBT.'},
  fullTraceAvailable:false,
  exactCausalAttributionComplete:false,
  zeusPerformanceComparisonAccepted,
  acceptanceScope:'Observed LCP/TBT/CLS regression gate for Zeus; not global phase 6 sign-off or causal proof that hydration has zero overhead.',
  phase6FullyAccepted:false,
  limitations:['PSI long-task audit is not a complete Chrome trace with call stacks.','Production and preview use different hostnames.','No timing adjustment or analytics change was made.']};
await writeFile(path.join(dir,'etapa6-tbt-investigation-analysis.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({expectedRetestComplete,original:result.original.deltaPercent,retest:result.retest.deltaPercent,all:result.all.deltaPercent,localRuns:localRows.length,zeusPerformanceComparisonAccepted},null,2));
