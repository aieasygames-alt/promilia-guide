# 2026-11-28 技术 SEO、结构化数据与国际 SEO 审计

审计对象：`https://promiliaguide.com` 及其生产构建。当前构建共 92 个 HTML 页面，其中 68 个可索引页面、41 篇已发布语言稿。此报告负责技术元数据、结构化数据、canonical、hreflang、robots 和 sitemap；内容、图片与交互由同轮其他审计记录覆盖。

## 发现与实际修复

### 1. 实体详情被误标为 Open Graph article（已修复）

`Base.astro` 原来通过 `Array.isArray(schema)` 判断 `og:type`。文章传入 Article + BreadcrumbList 数组，角色和奇波详情也传入 Person / Thing + BreadcrumbList 数组，因此中日合计 20 个实体详情都错误输出 `og:type=article`。

现改为依据实际是否存在 Article 节点确定类型。41 篇文章维持 article，其余页面输出 website。该修复纠正分享元数据语义，不声称直接提高 Google 排名；这些实体详情仍按审核状态保持 noindex。

### 2. Article 发布方与页面标识信息不完整（已完善）

原有 Article 已具备标题、简介、语言、作者、日期和 mainEntityOfPage，但缺少 publisher、url 和稳定的 @id。现为 41 篇文章补充站点真实发布方 Promilia Guide、站点 URL、现有站点 logo，以及文章自身 canonical URL / `#article` 标识。

这是结构化数据完整性改进。没有添加虚构评分、评测、作者资质、游戏内数据或实际发布日期，也不代表保证获得富结果。

### 3. 构建检查只验证 JSON-LD 可解析，hreflang 只检查目标存在及回链（已加强）

`scripts/verify-build.mjs` 现在还检查：

- Open Graph 类型与实际 Article 节点一致。
- Article 标题匹配可见 H1；简介、语言、canonical URL、发布方与页面一致；日期格式及先后顺序符合现有内容契约。
- hreflang 语言不重复；除语言选择根页外必须含自身语言和自身 URL。
- hreflang 使用无查询、无片段的生产 URL；目标存在、可索引、使用自身 canonical，且目标 HTML lang 与 hreflang 一致。
- 非 x-default 目标以正确的源语言回链；语言选择根页作为 x-default 的特殊情况保留。

## 全量验证结果

`npm run build` 通过：41 篇稿件内容验证、92 页静态构建、三语 Pagefind 和增强后的全站验证全部成功。Pagefind 本次索引 58 个有正文标记的页面；它不需要与 sitemap 的 68 个页面数量相等。

构建后逐页统计：

| 项目 | 结果 |
| --- | --- |
| HTML 页面 | 92 |
| 可索引页面 | 68 |
| sitemap URL | 68 |
| 可索引但缺失于 sitemap 的页面 | 0 |
| Article 页面 | 41 |
| 含 hreflang 的页面 | 68 |
| OG 类型与 Schema 不一致 | 0 |
| 可索引页面重复 title / description | 0 / 0 |

既有构建规则还确认了唯一 H1、语言、canonical、自有资源、内部链接与锚点、真实图片与图片 sitemap、搜索页 noindex、预览隔离、未审实体详情 noindex 及 sitemap 排除。生产 robots 允许抓取搜索页，以便读取其 noindex；没有将 noindex 页面同时禁止抓取。

为确认新增检查确实能够阻止回归，在独立临时构建副本中分别注入四类错误：实体误标 article、Article 错误语言、hreflang 错误语言、hreflang 指向 noindex 实体页。四项均被构建验证按预期拒绝，源工作区的 dist 未受这些注入影响。

原始证据（本地 artifacts 不进入 Git）：

- `artifacts/full-site-audit-2026-11-28/technical/baseline.json`
- `artifacts/full-site-audit-2026-11-28/technical/after-build.json`
- `artifacts/full-site-audit-2026-11-28/technical/regression-checks.json`
- 根审计抓取的线上 92 页基线：`artifacts/full-site-audit-2026-11-28/baseline-crawl.json`

## 保留的发布边界

- 20 个官方介绍类实体详情没有完整技能、培养、实战攻略审核，继续 noindex、不进入搜索和 sitemap；不为增加索引数量开放。
- 英文只为真实存在的译文提供 hreflang；没有替不存在的英文分类、实体详情或攻略生成替身链接。
- 根语言选择页保留 x-default。其主标题为英文、HTML lang 原为 zh-Hans 的不一致已交根审计处理。
- 未添加 HowTo、FAQPage、Review 或其他与当前可见页面不符的结构化数据。
- 不虚构 Search Console 收录结果、Google 富结果展示、排名提升或真实用户 Core Web Vitals。本报告的成功结果为本地构建验证；部署后的线上核验由主任务统一执行。

## 修改文件

- `src/layouts/Base.astro`：OG 类型依据实际 Article 节点。
- `src/pages/[locale]/[section]/[slug].astro`：文章发布方与 canonical 标识。
- `scripts/verify-build.mjs`：Schema 语义与 hreflang 强校验。
