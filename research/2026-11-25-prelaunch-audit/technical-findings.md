# 公测前技术 SEO 审计（2026-11-25）

范围：`https://promiliaguide.com`，线上清单提交 `98f4ed93ea43848724ee7304c170eea2937879fa`；仓库代码只读检查。站点为双语游戏攻略发布站。本次没有使用 Search Console URL Inspection、Google Rich Results Test 或 CrUX，因此“可抓取、可索引”不代表“Google 已收录”，JSON-LD 能解析也不等于获得富结果。

## 结论

未发现会阻断当前攻略抓取、索引或语言互链的 P0 技术缺陷。线上抓取共 73 个内容 HTML：53 个可索引页面，与 Sitemap 的 53 个 URL 一致；另外 20 个角色／奇波摘要详情保持 noindex。2 个搜索页另行获取，均为 `noindex,follow` 且不在 Sitemap。技术基础已经能承接流量，公测窗口更值得投入具体答案和重点入口。

## P1：公测前值得完成的技术辅助

| 项目 | 直接证据 | 为什么现在做 | 修复与验收建议 |
| --- | --- | --- | --- |
| 为文章 Sitemap 添加真实实质更新日 | 线上 `/sitemap.xml` 共53个loc，lastmod为0；`src/pages/sitemap.xml.ts:15`仅拼接loc | 公测期间会连续更新旧URL，真实lastmod可给抓取系统提供更新提示；不保证加快收录或排名 | 给30篇文章URL使用各自`data.updatedAt`；静态栏目如无真实更新日可省略。不得统一填构建日期、抓取日期或来源checkedAt。保持预览空Sitemap，验证XML合法、无noindex URL、无未来日期、与文章元数据一致 |
| 让关键栏目标题说明游戏与用途 | 线上`/zh-hans/characters/`为“角色 \| Promilia Guide”，`/ja/kibo/`为“キボ \| Promilia Guide”；guides/systems/updates同样主要只有栏目词；来源`src/pages/[locale]/[page].astro:25,54` | 新用户从搜索结果进入目录时需要立刻识别游戏名及页面用途；此项是点击意图优化，不是索引修复 | 只为攻略、系统、角色、奇波和更新等主要承接栏目增加自然游戏名和用途，保留UI短导航名。例：蓝色星原角色图鉴：已公布角色与官方资料；アズールプロミリアのキボ図鑑｜名前と公式紹介。描述也说明资料/技能边界，避免暗示已有完整性能攻略 |
| 核对 Google 实际发现与抓取状态（待外部数据） | 本轮只能确认HTTP、meta与Sitemap；11/25新增FAQ/database/support已经在线，但无本轮GSC结果 | 剩余时间短，若核心旧页或新增入口未被Google发现，应先处理实际发现链路 | 查看现有Sitemap提交状态，以及两语言download/requirements/getting-started、FAQ/database/support的URL Inspection。已提交不等于已收录；报告分别写已发现、上次抓取、Google选择canonical、索引状态。不要用当天GSC延迟数据判断内容效果 |

## P2 / 后续维护

- 搜索页同时被 `robots.txt` Disallow 和页面 `noindex` 标记。当前2页已排除Sitemap，本轮未见搜索页被索引的证据；但若URL已经被Google发现/收录，Disallow会阻止其看到noindex，可能留下仅URL索引。可允许搜索页抓取并保留noindex；先确认GSC实际情况，不作为公测前阻塞项。位置：`src/pages/robots.txt.ts:5`。
- 文章已经有Article及BreadcrumbList，栏目为WebPage，首页为WebSite，均能解析。可以后续统一publisher/author实体ID，但不需要在公测前增加更多Schema类型。游戏站FAQ不应以Google FAQ富结果为增长承诺；不推荐新增已弃用HowTo。
- 没有llms.txt不是当前搜索抓取或公测流量的阻断项。优先实际内容、证据、内链与索引观察。

## 已通过项（本轮线上实测）

- 53个可索引URL全部返回200，均有自引用canonical、meta description和唯一H1；没有重复title。
- 53个可索引URL全部在Sitemap；Sitemap没有noindex或非200页面。沿站内链接未发现可索引孤页。
- 简中、日语的语言alternate目标均存在、可索引且互返；首页语言选择器使用root x-default，文章使用对应简中页x-default。
- 30篇攻略及新FAQ/database页可抓取；无编辑工作台泄漏。随机不存在URL返回真正404。
- 20个角色／奇波摘要详情均noindex且不进入Sitemap，未为资料短摘要批量打开索引。
- 2个搜索页noindex，搜索结果不进入Sitemap。目录、正文、关于与编辑规范由实际HTML链接连接，不依赖JS才可发现。
- 本次抓取的图片没有缺失alt属性。此项不代表全部alt文字都完成了独立语义审核，也不替代图片性能测量。
- JSON-LD均可解析；30篇Article包含标题、日期、作者、语言、正文URL和图片，BreadcrumbList存在。
- HTTP到HTTPS、www/Pages别名到正式主域的永久重定向覆盖路径和查询参数。首次98项现有验收中97项通过，1次Pages别名download请求`fetch failed`；同一URL随后连续两次复验均为301到准确主域目标、最终200，未发现可重复配置错误。保留初次失败，不把整个首次运行改写成98/98。

## 证据与限制

本机忽略目录（不含私有GSC数据）：

- `artifacts/prelaunch-audit-2026-11-25/technical-crawl.json`：73内容页及2搜索页的HTTP、标题、meta、canonical、语言互链、内链、Schema和图片属性记录。
- `artifacts/prelaunch-audit-2026-11-25/technical-verification.json`：现有验收脚本98项初次结果，含1次网络请求失败。
- `artifacts/prelaunch-audit-2026-11-25/redirect-retry.json`：失败别名URL的两次独立重试，均永久跳转正确。

抓取以Sitemap为起点、跟随同源HTML链接，上限500页、每批最多5个并发、批间1秒；跳过robots禁止的搜索路径，搜索页仅对明确已知的两个入口作索引策略验证。没有进行登录、提交工单、提交Google请求或云端部署，也未修改业务代码。
