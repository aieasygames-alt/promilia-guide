import fs from 'node:fs';import {createHash} from 'node:crypto';import {load} from 'cheerio';
import {readEntries} from '../../scripts/content-validation.mjs';import {articlePath} from '../../src/lib/publication.mjs';
const sha=process.argv[2],origin=process.argv[3]||'https://promiliaguide.com';if(!/^[a-f0-9]{40}$/.test(sha||''))throw Error('Pass exact production SHA');
const checks=[],pages=new Map(),hash=b=>createHash('sha256').update(b).digest('hex'),norm=s=>s.replace(/\s+/g,' ').trim();
const check=(name,ok,detail='')=>checks.push({name,passed:!!ok,detail});
async function get(p){const r=await fetch(origin+p,{redirect:'manual',signal:AbortSignal.timeout(20000)});return {status:r.status,body:await r.text(),headers:Object.fromEntries(r.headers)}}
const entries=await readEntries(),paths=entries.map(e=>articlePath(e.data)),manifest=JSON.parse((await get('/build-info.json')).body);
check('same production SHA and complete manifest',manifest.mode==='production'&&manifest.commitSha===sha&&paths.length===30&&JSON.stringify([...paths].sort())===JSON.stringify([...manifest.articlePaths].sort()));
for(let i=0;i<entries.length;i+=4)await Promise.all(entries.slice(i,i+4).map(async e=>{
 const p=articlePath(e.data),r=await get(p),$=load(r.body),local=load(fs.readFileSync('dist'+p+'index.html','utf8'));pages.set(p,{$,r});
 check(p+' title and complete current body',r.status===200&&$('h1').first().text().trim()===e.data.title&&hash(norm($('.prose').text()))===hash(norm(local('.prose').text())));
 check(p+' publication and index state',e.data.status==='published'&&e.data.translationStatus==='published'&&!!e.data.reviewer&&!!e.data.reviewedAt&&!$('meta[name=robots]').attr('content')?.includes('noindex')&&!r.headers['x-robots-tag']?.includes('noindex'));
 check(p+' current source fact text',norm($('#claim-summary-details').text())===norm(local('#claim-summary-details').text()));
}));
const needles={
 '/zh-hans/guides/banner-rules/':['第90次','第80次','12月17日03:59','日本'],
 '/ja/guides/banner-rules/':['90','80','中国本土'],
 '/zh-hans/guides/recharge-return/':['55,000','97,500','365','飞信订约凭证'],
 '/ja/guides/recharge-return/':['中国本土','55,000','97,500','365'],
 '/zh-hans/guides/resources/':['星彩·浮云','全部解锁','纯粹忆痕'],
 '/ja/guides/resources/':['星彩·浮云','全解放','クロディーメ'],
 '/zh-hans/guides/download/':['重启启动器','重启客户端','闪退'],
 '/zh-hans/guides/support/':['主页面 → 设置 → 账户 → 用户中心 → 联系客服','实名','渠道','日语'],
 '/ja/guides/support/':['主页面 → 设置 → 账户 → 用户中心 → 联系客服','実名認証','日本語'],
 '/ja/guides/download/':['ランチャー','強制終了','日本語'],
 '/zh-hans/guides/reroll/':['即使误删','不支持跨账号'],
 '/ja/guides/reroll/':['誤って削除','別アカウント'],
};
for(const [p,words]of Object.entries(needles)){const text=pages.get(p).$('.prose').text();check(p+' released additions',words.every(w=>text.includes(w)),words.filter(w=>!text.includes(w)).join(', '));}
for(const locale of ['zh-hans','ja']){
 const r=await get(`/${locale}/`),$=load(r.body);check(locale+' regional launch state is not inferred open',$('[data-launch-region]').length===2&&$('[data-service-stage="open"]').length===0);
 check(locale+' official Japanese PC link',pages.get(`/${locale}/guides/download/`).$('a[href="https://azurpromilia.jp/PCdownload"]').length>0);
 const codes=load((await get(`/${locale}/guides/redeem-codes/`)).body);check(locale+' unverified codes have no copy action',codes('[data-copy-target]').length===0);
}
for(const f of fs.readdirSync('public/downloads')){const p='/downloads/'+f,r=await fetch(origin+p,{signal:AbortSignal.timeout(20000)}),bytes=Buffer.from(await r.arrayBuffer());check(p+' exact downloadable bytes',r.status===200&&hash(bytes)===hash(fs.readFileSync('public'+p)));}
const sitemap=(await get('/sitemap.xml')).body;check('sitemap contains all 30 guides',paths.every(p=>sitemap.includes(origin+p)));
for(const locale of ['zh-hans','ja'])for(const type of ['characters','kibo'])for(const item of fs.readdirSync(`dist/${locale}/${type}`,{withFileTypes:true}).filter(e=>e.isDirectory())){
 const p=`/${locale}/${type}/${item.name}/`,r=await get(p),$=load(r.body);check(p+' summary remains outside indexing and search',r.status===200&&$('meta[name=robots]').attr('content')?.includes('noindex')&&$('body').attr('data-pagefind-ignore')==='all'&&!sitemap.includes(origin+p));
}
for(const p of ['/editorial/','/editorial/fixtures/trust/','/ja/characters/hanyouyou/'])check(p+' remains unavailable',(await get(p)).status===404);
for(const locale of ['zh-hans','ja']){
 for(const hub of ['database','faq','updates']){
  const p=`/${locale}/${hub}/`,r=await get(p),$=load(r.body),local=load(fs.readFileSync('dist'+p+'index.html','utf8'));
  check(p+' complete released main content',r.status===200&&hash(norm($('main').text()))===hash(norm(local('main').text())));
  check(p+' canonical and index state',$('link[rel=canonical]').attr('href')===origin+p&&!$('meta[name=robots]').attr('content')?.includes('noindex')&&sitemap.includes(origin+p));
  if(hub==='faq')check(locale+' all 26 FAQ dependencies current',$('[data-faq-id]').length===26&&$('[data-answer-current="false"]').length===0);
  if(hub==='database')check(locale+' verified profile and world coverage',$('section[aria-labelledby="characters"] tbody tr').length===5&&$('section[aria-labelledby="kibo"] tbody tr').length===5&&$('.world-regions dt').length===5);
  if(hub==='updates')check(locale+' latest release date and total',$('[data-site-update]').first().attr('data-site-update')==='2026-11-25'&&$('[data-site-update]').first().text().includes('30'));
 }
 const r=await get(`/${locale}/characters/`),$=load(r.body);
 check(locale+' Metsa belongs to correct region',$('[data-filter-target="roselansa"] .filter-badge').text().trim()==='2'&&$('[data-entity-id="metsa"]').length===1);
}
const search=JSON.parse((await get('/pagefind/pagefind-entry.json')).body);check('two language search bundles',Object.keys(search.languages).sort().join(',')==='ja,zh-hans');
for(const [locale,item]of Object.entries(search.languages))check(locale+' search metadata delivered',(await get(`/pagefind/pagefind.${item.hash}.pf_meta`)).status===200);
const result={origin,commitSha:sha,generatedAt:new Date().toISOString(),passed:checks.every(c=>c.passed),checks};fs.mkdirSync('artifacts/full-release-2026-11-25',{recursive:true});fs.writeFileSync('artifacts/full-release-2026-11-25/production-boundaries.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:result.passed,total:checks.length,failed:checks.filter(c=>!c.passed)},null,2));if(!result.passed)process.exitCode=1;
