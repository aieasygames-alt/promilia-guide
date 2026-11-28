#!/usr/bin/env python3
"""Collect public search suggestions; no volume or user-location inference."""
import concurrent.futures, datetime, json, pathlib, re, sys, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent
markets = [
 ('cn','zh-CN','cn','zh-CN',['蓝色星原','蓝色星原 日服','蓝色星原 奇波']),
 ('tw','zh-TW','tw','zh-TW',['藍色星原','藍色星原 攻略']),
 ('hk','zh-TW','hk','zh-HK',['藍色星原']),
 ('jp','ja','jp','ja-JP',['アズールプロミリア','アズールプロミリア キボ','アズールプロミリア リセマラ']),
 ('kr','ko','kr','ko-KR',['아주르 프로밀리아','아주르 프로밀리아 키보']),
 ('us','en','us','en-US',['azur promilia','azur promilia global','azur promilia english']),
 ('gb','en','gb','en-GB',['azur promilia']),
 ('sg','en','sg','en-SG',['azur promilia','azur promilia sea']),
]
jobs=[]
for region,hl,gl,market,seeds in markets:
 for q in seeds:
  jobs.append(dict(engine='google',region=region,language=hl,seed=q,url='https://suggestqueries.google.com/complete/search?'+urllib.parse.urlencode(dict(client='firefox',q=q,hl=hl,gl=gl))))
 jobs.append(dict(engine='bing',region=region,language=hl,seed=seeds[0],url='https://api.bing.com/osjson.aspx?'+urllib.parse.urlencode(dict(query=seeds[0],market=market))))
for q in ['蓝色星原','蓝色星原 日服','蓝色星原 奇波']:
 jobs.append(dict(engine='baidu',region='cn',language='zh-CN',seed=q,url='https://suggestion.baidu.com/su?'+urllib.parse.urlencode(dict(wd=q,json=1))))
def fetch(item):
 result={**item,'observed_at':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')}
 try:
  req=urllib.request.Request(item['url'],headers={'User-Agent':'Mozilla/5.0 (compatible; PromiliaGuideResearch/1.0)'})
  with urllib.request.urlopen(req,timeout=22) as response:
   raw=response.read(); result['http_status']=response.status
   charset=response.headers.get_content_charset() or ('gb18030' if item['engine']=='baidu' else 'utf-8')
   text=raw.decode(charset,errors='replace')
  result['raw_response']=text
  if item['engine']=='baidu':
   payload=json.loads(text[text.index('{'):text.rindex('}')+1])
   suggestions=payload.get('s',[])
  else:
   payload=json.loads(text); suggestions=payload[1]
  result['suggestions']=[str(s) for s in suggestions]
  result['status']='ok' if suggestions else 'empty'
 except Exception as exc:
  result['status']='error'; result['error']=str(exc); result['suggestions']=[]
 return result
if '--from-saved' in sys.argv:
 results=[json.loads(path.read_text()) for path in sorted((ROOT/'autocomplete/raw').glob('*.json'))]
 for result in results:
  if result['engine']=='baidu' and 'raw_response' in result:
   text=result['raw_response']
   payload=json.loads(text[text.index('{'):text.rindex('}')+1])
   result['suggestions']=payload.get('s',[])
   result['status']='ok' if result['suggestions'] else 'empty'
else:
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  results=list(pool.map(fetch,jobs))
for i,r in enumerate(results,1):
 (ROOT/f'autocomplete/raw/{i:02d}-{r["engine"]}-{r["region"]}.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
normalized={
 'observation_date':'2026-11-28','timezone':'Asia/Shanghai',
 'limitations':['Public unauthenticated endpoint snapshot, not local-user or local-IP panel data.','hl/gl/market are request parameters; suggestions are not volume or popularity ranks.','Seeds were chosen by the researcher; only returned strings are observed autocomplete.','Empty/error responses do not demonstrate zero demand.'],
 'requests':[{k:v for k,v in r.items() if k!='raw_response'} for r in results]}
(ROOT/'autocomplete/snapshot.json').write_text(json.dumps(normalized,ensure_ascii=False,indent=2)+'\n')
lines=['# 搜索引擎实际联想快照 — 2026-11-28','','请求参数控制语言/地区，不代表当地IP或用户身份。排序不代表搜索量。失败或空响应不代表没有需求。','','| 引擎 | 地区参数 | 种子词（编辑选择） | 状态 | 实际返回联想 |','| --- | --- | --- | --- | --- |']
for r in results:
 lines.append('| '+ ' | '.join([r['engine'],r['region'],r['seed'],r['status'],'；'.join(r['suggestions']).replace('|','\\|') or r.get('error','空数组')])+' |')
(ROOT/'autocomplete/README.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'requests':len(results),'nonempty':sum(r['status']=='ok' for r in results),'empty':sum(r['status']=='empty' for r in results),'errors':sum(r['status']=='error' for r in results),'suggestions':sum(len(r['suggestions']) for r in results)},ensure_ascii=False))
for r in results:
 print(r['engine'],r['region'],r['seed'],r['status'],json.dumps(r['suggestions'],ensure_ascii=False))
