import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { readEntries } from '../../scripts/content-validation.mjs';
import { articlePath } from '../../src/lib/publication.mjs';
const root=process.cwd();
const require=createRequire(root+'/package.json');
const {load}=require('cheerio');
const sha=process.argv[2];
if(!/^[a-f0-9]{40}$/.test(sha||''))throw new Error('Pass full production SHA');
const checks=[];
const check=(name,ok,detail='')=>checks.push({name,passed:!!ok,detail});
async function get(path){const res=await fetch('https://promiliaguide.com'+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});return {status:res.status,body:await res.text(),headers:Object.fromEntries(res.headers)}}
const manifest=JSON.parse((await get('/build-info.json')).body);
check('exact production version',manifest.commitSha===sha&&manifest.mode==='production',JSON.stringify(manifest));
const entries=await readEntries(root+'/src/content/guides');
const paths=entries.map(e=>articlePath(e.data));
check('all 26 reviewed articles in manifest',paths.length===26&&JSON.stringify([...paths].sort())===JSON.stringify([...manifest.articlePaths].sort()));
const pages=new Map();
for(let i=0;i<entries.length;i+=4)await Promise.all(entries.slice(i,i+4).map(async e=>{
 const path=articlePath(e.data);const r=await get(path);const $=load(r.body);pages.set(path,{$,r});
 check(path+' current title/body',r.status===200&&$('h1').first().text().trim()===e.data.title&&$('.prose').text().trim().length>300);
 check(path+' approved metadata and public index state',!$('meta[name=robots]').attr('content')?.includes('noindex')&&!r.headers['x-robots-tag']?.includes('noindex')&&e.data.status==='published'&&e.data.translationStatus==='published'&&Boolean(e.data.reviewer)&&Boolean(e.data.reviewedAt)&&!r.body.includes('当前显示未发布草稿')&&!r.body.includes('開発・編集用の下書きを表示'));
}));
const details={
 '/zh-hans/guides/resources/':['第2至7日','10、20、30、40','365','首个创建'],
 '/ja/guides/resources/':['2～7日目','10・20・30・40','365'],
 '/zh-hans/guides/banner-rules/':['1:16:52','字幕','未确认'],
 '/ja/guides/banner-rules/':['1:16:52','自動字幕','未確認'],
 '/zh-hans/guides/download/':['11月17日','15:00','16:00'],
 '/ja/guides/download/':['11月17日','15:00','16:00'],
 '/zh-hans/systems/home/':['种植孵化','验证目标'],
 '/ja/systems/home/':['栽培・孵化','確認目標'],
 '/zh-hans/systems/kibo/':['星结','待画面'],
 '/ja/systems/kibo/':['星结','照合待ち'],
 '/zh-hans/guides/getting-started/':['三个小闭环','不是已在正式服跑通'],
 '/ja/guides/getting-started/':['3つの小さな完了結果','正式版を実際に完走したルートではありません']
};
for(const [p,needles] of Object.entries(details)){const text=pages.get(p).$.text();check(p+' released additions and evidence boundaries',needles.every(s=>text.includes(s)),needles.filter(s=>!text.includes(s)).join(', '));}
for(const locale of ['zh-hans','ja']){
 const update=await get(`/${locale}/updates/`);check(locale+' current release update',update.body.includes('26')&&update.body.includes(locale==='ja'?'18本':'18篇'));
 const systems=await get(`/${locale}/systems/`);check(locale+' home and kibo in system catalog',systems.body.includes(`/${locale}/systems/home/`)&&systems.body.includes(`/${locale}/systems/kibo/`));
 const code=await get(`/${locale}/guides/redeem-codes/`);const $code=load(code.body);check(locale+' pending codes have no copy action',$code('[data-copy-target]').length===0);
 const home=await get(`/${locale}/`);const $home=load(home.body);check(locale+' no unverified launch countdown',$home('[data-launch-clock]').length===0);
 for(const [kind,ids] of [['characters',['anais','cathbelle','symphoria','terara']],['kibo',['staray','downybrinny','cabbird','bluda','vespervamp']]]){
  const cat=await get(`/${locale}/${kind}/`);const $cat=load(cat.body);check(locale+' '+kind+' verified catalog',cat.status===200&&$cat('[data-entity-id]').length===ids.length);
  await Promise.all(ids.map(async id=>{const p=`/${locale}/${kind}/${id}/`;const r=await get(p);const $=load(r.body);check(p+' summary stays noindex',r.status===200&&$('meta[name=robots]').attr('content')?.includes('noindex')&&$('body').attr('data-pagefind-ignore')==='all'&&$('[data-pagefind-body]').length===0)}));
 }
 for(const id of ['metsa','hanyouyou']){const r=await get(`/${locale}/characters/${id}/`);check(locale+' unverified entity hidden '+id,r.status===404)}
}
for(const path of ['/editorial/','/editorial/fixtures/trust/']){const r=await get(path);check('private preview route absent '+path,r.status===404)}
const sitemap=await get('/sitemap.xml');check('sitemap includes all 26 articles',paths.every(p=>sitemap.body.includes('https://promiliaguide.com'+p)));check('sitemap excludes summary/preview routes',!sitemap.body.includes('/editorial/')&&!sitemap.body.includes('/characters/anais/')&&!sitemap.body.includes('/kibo/staray/'));
const search=await get('/pagefind/pagefind-entry.json');const info=JSON.parse(search.body);check('search contains two languages',Object.keys(info.languages).sort().join(',')==='ja,zh-hans');
await Promise.all(Object.entries(info.languages).map(async([locale,item])=>{const p=`/pagefind/pagefind.${item.hash}.pf_meta`;const r=await get(p);check(locale+' search metadata delivered',r.status===200)}));
const result={origin:'https://promiliaguide.com',commitSha:sha,generatedAt:new Date().toISOString(),passed:checks.every(c=>c.passed),checks};
await mkdir(root+'/artifacts/content-release-2026-11-21',{recursive:true});
await writeFile(root+'/artifacts/content-release-2026-11-21/production-boundaries.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:result.passed,total:checks.length,failed:checks.filter(c=>!c.passed)},null,2));
if(!result.passed)process.exitCode=1;
