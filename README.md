# Promilia Guide · 星原旅伴

蓝色星原：旅谣 / Azur Promilia 非官方攻略站。依据 `plans/` 中 2026-11-14 修订的规划开发：**Astro + TypeScript + Markdown 内容集合 + Pagefind + Cloudflare Pages**，纯静态输出，无账号、数据库或服务端适配器。

正式 origin：`https://promiliaguide.com`。首版语言：简体中文 `/zh-hans/`、日语 `/ja/`。根路径提供语言选择，不按 IP 自动跳转。

前期范围已确认：**不开发 CMS、站内账号和评论**。内容通过本地 Markdown/JSON 与 Git 维护；编辑工作台用于只读检查和预览。

## 本地运行

使用 Node **22.23.4 LTS**（见 `.nvmrc` / `.node-version`），npm 与 `package-lock.json`。

```sh
nvm use
npm ci
npm run dev
```

访问 `http://127.0.0.1:4321/zh-hans/`。`dev` 会显示编辑草稿，所有页面标记 noindex。开发服务器不生成 Pagefind 索引，需要验证搜索时使用完整构建预览：

```sh
npm run build:preview
npm run preview
```

`preview` 只读取上一次生成的 `dist/`。如需在开发服务器同时预览搜索，先 `build:preview`，再启动 `dev` 也不会自动提供 `dist/pagefind`；请使用上述静态预览流程。

## 当前交付范围

- 语言选择、双语首页、攻略/系统目录、正文与侧边目录、来源与修订、相关文章、关于/编辑规范/反馈/更新页、404。
- 手机导航、键盘 `/` 搜索快捷键、同篇文章语言切换和缺译文说明。
- Pagefind 中日文分词、简繁/日文/英文搜索别名、当前语言搜索与空结果提示。
- 本地准备清单：保存、重置、刷新恢复、跨语言共享任务 ID、跨标签页同步、存储不可用时降级。
- 来源、事实、术语和翻译修订号的数据层；构建时检查引用、路由与语言关系。
- 共享事实摘要与首页发行状态；文章固定引用事实修订号，事实更新后阻止旧稿发布。
- 下载/平台页的双语地区与设备速查：分别核对预约、预下载、正式下载；未知项无推测链接，关闭 JavaScript 仍可阅读。
- 编辑预览工作台 `/editorial/`、状态报告、来源/事实/主题的双语影响查询与本地 JSON 导出。
- canonical、hreflang、JSON-LD、robots、Sitemap、Pages 安全响应头。
- 首发五个核心主题的双语就绪检查、专用生产构建检查；编辑预览可查看和导出逐篇发布阻碍。
- 发布、分发入口与部署验收规则测试、桌面/手机端浏览器流程测试、构建产物内链与元数据检查、GitHub Actions。

现有 **9 篇简中 + 7 篇日语稿件**，其中六个核心主题的 **12 篇已根据项目负责人 2026-11-14 的会话确认记录人工审核完成并纳入发布**，首发五个主题的双语就绪检查为 **10/10**。审核署名为“项目负责人（会话确认）”，`reviewedAt` 记录确认日期。其余 4 篇战斗与资源/抽卡稿仍为资料待核验草稿，不进入正式构建。

已核对国服、繁中及日本官方资料，共 **11 个官方/商店来源**，登记 **14 个事实项，其中 9 个已核验**。12 篇核心语言稿已补入日本独立日程、手机事前注册与计划平台，并修订操作步骤和日语表达。人工审核完成不改变事实库中的未知项，也不意味着已经验证个人商店安装资格。

国服与日本分别有独立的 **2026-11-26** 官方日程，两份已读日期公告都未给出具体开服小时。中国区 App Store 的 iOS 15.0 / iPadOS 15.0 是该区兼容条件，不能用作推荐性能、完整空间或日本版要求。日本手机事前注册已确认；国服 PC/安卓和日本 PC 正式安装器、两地预下载、互通与完整配置仍待核验。详见[首轮官方来源记录](research/2026-11-14-official-sources.md)、[日本发行补证](research/2026-11-14-japan-release.md)及[人工审核交接清单](plans/CONTENT-REVIEW.md)。

正式构建排除所有未审核文章；两种语言首页都分别显示中国大陆与日本的共享发行事实及对应原文，不根据阅读语言代选地区。日期到来后也不会自动显示已开服。日文正式游戏名「アズールプロミリア」和「キボ」已从日本官网核验；角色与奇波目录仍只有收录标准和准备状态，设置 noindex，不进入 Sitemap，资料充足后再填充详情。

## 构建与正式发布检查

| 命令 | 包含草稿 | 索引策略 | 使用场景 |
| --- | --- | --- | --- |
| `npm run build` | 否 | 完整正式页可索引；搜索/空目录 noindex | 日常开发与 CI 生产模式校验 |
| `npm run build:preview` | 是 | 全站 noindex、robots 禁止抓取、空 Sitemap、额外 noindex 响应头 | 内部编辑预览与功能验收 |
| `npm run build:release` | 否 | 与普通正式模式一致 | 本地验证首发检查通过后才构建 |
| `npm run build:pages` | 按显式环境设置 | 生产执行首发检查，分支预览全站 noindex | Pages 统一构建入口；配置见下文 |

三个底层构建脚本都会执行内容检查 → Astro 静态生成 → Pagefind → 产物检查，`build:release` 另外在开始前执行首发检查，并拒绝 `CONTENT_PREVIEW=true`。**不要将带草稿的预览构建设为生产构建命令。** Pages 分支预览默认的 noindex 与这里的编辑预览模式是两层不同的机制。

`build:pages` 根据 `PAGES_BUILD_MODE` 选择 `build:release` 或 `build:preview`，在 Pages 上还核对当前分支与显式配置的生产分支。缺失配置、分支不匹配或继承了冲突的 `CONTENT_PREVIEW` 都会使构建失败，不根据 URL 猜测模式。

## 目录

```text
plans/                         原始产品、内容、语言与部署规划
src/content/guides/{locale}/    Markdown 原稿与译稿
src/content.config.ts          Astro / Zod 元数据校验
src/data/sources.json          来源、原文、核对日期与状态
src/data/claims.json           结论、证据性质和影响主题
src/data/distribution.json     地区/设备与事实依赖（不另存下载地址）
src/data/release-plan.json     首发核心主题、必要事实与语言要求
src/data/terms.json            稳定术语 ID 与别名
src/lib/publication.mjs        发布门槛、路由、hreflang 规则
src/lib/editorial-schema.mjs   构建、CLI、Astro 共用的内容与证据 schema
src/lib/editorial.mjs          依赖发布校验、影响追踪与共享发行状态
src/lib/i18n.ts                双语界面文案
src/components/                清单、搜索、反馈、卡片、图标
src/layouts/Base.astro         布局与公共元数据
src/pages/                     语言首页、栏目、文章和静态端点
public/                        本地 SVG、favicon、Pages 响应头
scripts/                       内容关系与构建产物检查
tests/                         发布规则与浏览器回归测试
research/                      官方原始来源核验与结论边界
```

## 内容编辑与发布

1. 在 `sources.json` 中录入原始资料。填写稳定 `id`、标题、发布者、来源类型 `kind`、HTTPS 原文 URL、发布日期、核对日期、地区/版本、状态及短摘录 `excerpt`；视频另记时间点。来源核验完成才设 `status: "verified"`。`planning-only` 的项目文档不能作为官方游戏事实。
2. 为具体事实更新 `claims.json`，记录证据类型、地区/版本、中日文说明、冲突和 `affectedPages`。稿件通过 `sourceRefs` 关联来源，通过 `claimRefs` 引用事实，并在 `claimRevisions` 固定已复查的事实修订号。待核验事实不可填写确定日期、URL、平台等可执行值。
3. 中文和日语文章共享 `contentId`；语言与 `gameRegion` 分开。路径由 `locale + section + slug` 组成，Astro 集合 ID 使用完整的 `locale/filename`，防止同 slug 覆盖语言稿。
4. 共享事实改变时递增该事实 `revision`，用 `content:impact` 查询全部语言稿，逐篇复查正文后更新 `claimRevisions`。中文正文变化时递增中文 `sourceRevision`，将译稿标记 `translationStatus: "needs-update"` 并保留旧 `translatedFromRevision`。译文校对完成后同步其 `sourceRevision` 和 `translatedFromRevision`。过期事实引用、落后于中文原稿的译文均不可发布。
5. 完成事实与语言审核后，记录**真实** `reviewer`、`reviewedAt`；两项状态同时设为 `status: "published"` 和 `translationStatus: "published"`。官方/测试类事实必须有已核验且带核对日期的原文来源，`pending` 稿不能发布。
6. `npm run check && npm test && npm run build`。正式构建会检查正文链接、段落锚点、canonical、双向 hreflang、Sitemap、JSON-LD、404 与草稿隔离。

`publishedAt` 在草稿阶段作为计划日期；首次实际发布时需改为真实发布日期。`updatedAt` 只反映正文实质变化。`checkedAt` 是来源检查日期，不能互相代替。

新增文章可复制一篇同类 Markdown；首版使用标准 Markdown，不需要 MDX。清单任务使用稳定 `id`，两种语言保持一致；浏览器存储不包含 locale。

缺少某语言文章时，切换按钮明确说明并前往目标语言首页；不生成假译文路径。只有满足发布门槛的真实对应版本才进入正式 hreflang，文章的 x-default 指向同篇简体版本。

## 编辑工作台与报告

`build:preview` 后启动静态预览，访问 `http://127.0.0.1:4321/editorial/`。可查看逐篇发布阻碍、核验提醒和来源摘录，按来源、事实或主题筛选受影响中日文稿，下载本地状态报告。工作台只在编辑预览生成，不进入搜索或 Sitemap，正式构建不输出该路由。

```sh
npm run content:status
npm run --silent content:status -- --json
npm run content:impact -- --source cn-launch-announcement-2026-10-23
npm run content:impact -- --claim cn-launch-date
npm run content:impact -- --content launch
npm run content:readiness
npm run --silent content:readiness -- --json
npm run release:check
```

这些命令只读取文件，不修改审核状态。来源不可用、官方证据不符、事实修订落后、译文过期或存在冲突时，已填写发布状态的稿件也会被阻止发布。待核验项可以明确作为未知项保留，但文章核心结论为 `pending` 时仍不能发布。

首发计划固定覆盖公测时间、发行地区、下载入口、配置、准备清单五个主题，中日文共十篇。`content:readiness` 在未审核时仍能正常生成报告；`release:check` 则在未就绪时返回非零退出码，`build:release` 随之停止。报告区分缺稿、审核缺项、过期事实/译文及必要事实引用缺失，并拒绝空正文或重复稿件。正文中明确保留的未知项作为提醒，不要求用猜测补齐。

## 本地审核交接包

```sh
npm run review:bundle
```

命令先重新构建编辑预览，再核对构建前后的源码与证据指纹，生成 `artifacts/review-bundles/` 中唯一命名的 `.tar.gz` 和同名 `.sha256`。需要本机有 `tar`；不会修改稿件审核状态或部署。包内包含完整预览、16 篇 Markdown、来源/事实/术语、核验记录、人工审核说明、同批状态报告和逐文件 SHA-256 清单；不复制 `.env`、Git 目录、项目依赖或部署凭证。源输入存在符号链接时拒绝打包。

审核人员解压后，在包内 README 所在目录执行以下命令，需要 Python 3，无须安装项目依赖：

```sh
python3 -m http.server 4322 --bind 127.0.0.1 --directory site
```

打开 `http://127.0.0.1:4322/editorial/` 查看逐篇阻碍并阅读正文、核对来源与搜索。请通过 HTTP 浏览，直接双击 HTML 不能验证搜索和脚本。审核结论需回填到项目原稿，由真实审核人记录日期；打包成功不等于审核通过。noindex 不提供访问权限，审核包应作为编辑材料交接。

## 反馈渠道

当前未提供站长的邮箱或反馈系统，因此表单只复制/下载纠错文本，并明确显示尚未发送。配置 `.env` 的 `PUBLIC_FEEDBACK_URL` 后，会显示真实反馈渠道链接；表单仍不会自动提交任何数据。没有后台接收器，也不收集账号密码。

## 检查

```sh
npm run check
npm test
npm run build
npm run build:preview
npx playwright install chromium
npm run test:browser
```

浏览器测试依赖包含编辑草稿的预览构建，覆盖桌面和手机视口、导航、跨语言清单恢复、缺译文、中文/日语/别名搜索、纠错下载、共享事实、工作台筛选/报告下载、地区设备筛选、无 JavaScript 阅读与 HTTP 404。`.github/workflows/check.yml` 先验证普通生产构建，再使用显式分支环境运行 `build:pages` 验证预览入口，并分别保存 `production-site`、`editorial-preview-noindex` 和 `editorial-status` 产物，便于审阅。

测试运行的是 Chromium，包括手机视口和触控模拟；不能替代 iOS Safari / Android 真机和中国大陆网络验收。上线后的 HTTPS、实际响应头、真实设备性能和索引状态也需要单独验证。

## Cloudflare Pages

项目坚持规划指定的 **Pages**，不使用 Workers 模板、SSR adapter 或 SPA fallback。配置如下：

| 项目 | 值 |
| --- | --- |
| 统一构建命令 | `npm run build:pages` |
| 输出目录 | `dist` |
| Node 环境变量 | `NODE_VERSION=22.23.4` |
| 正式 site / canonical | `https://promiliaguide.com` |
| `CONTENT_PREVIEW` | 两个环境均删除手工覆盖，由构建入口设置 |

在 Pages 的 Production 与 Preview 两个环境分别配置：

| 变量 | Production | Preview |
| --- | --- | --- |
| `PAGES_BUILD_MODE` | `production` | `preview` |
| `PAGES_PRODUCTION_BRANCH` | 后台实际生产分支，如 `main` | 同一个实际生产分支 |
| `NODE_VERSION` | `22.23.4` | `22.23.4` |

保留 Pages 自动注入的 `CF_PAGES` 和 `CF_PAGES_BRANCH`。Pages 没有自动注入生产分支名，因此需显式填写 `PAGES_PRODUCTION_BRANCH`；更改后台生产分支时同步两个环境。首发未审核时，生产构建仍会失败，其他分支可以生成编辑预览供审核。可在本地只读检查配置（示例分支需替换为实际值）：

```sh
CF_PAGES=1 CF_PAGES_BRANCH=main PAGES_PRODUCTION_BRANCH=main PAGES_BUILD_MODE=production npm run build:pages -- --dry-run
```

该命令仅输出计划，不构建、不部署。本地单独测试预览入口可用 `PAGES_BUILD_MODE=preview npm run build:pages`。

私有 GitHub 仓库为 [aieasygames-alt/promilia-guide](https://github.com/aieasygames-alt/promilia-guide)。GitHub Actions 运行质量检查；Cloudflare Pages Git 集成负责在推送生产分支或其他分支后分别构建生产/预览。实际部署与验收记录见 `plans/DEPLOYMENT-LOG.md`。

上线顺序：建立仓库并连接 Pages → 检查分支预览默认 noindex → 在 Pages 关联自定义域名 → 完成根域名 DNS/HTTPS → 配置生产 pages.dev 与可选 www 到主域名的重定向 → 验证正式响应与回滚。实际 Pages 项目名和账号尚未提供，因此不写入猜测的重定向主机名。具体操作以 `plans/DOMAIN-AND-PAGES.md` 为准。

首批正文与日语人工审核已由项目负责人确认。仍需补充真实反馈入口、各地区客户端下载与游戏账号规则核验、真机/目标网络验收。目录内规划的内容数量是目标，不以空页面或未经审核译文补齐。

## 地区与设备入口

`src/data/distribution.json` 只配置地区、设备及依赖事实 ID，不另存下载 URL。中日文下载/平台文章共用 `DistributionMatrix`，从事实库读取日期、预约入口、预下载和OS兼容信息。核验缺失时不输出操作链接；`distributionScope` 必须同时匹配地区与 `public-launch`，且入口事实必须明确支持该设备。历史测试记录使用 `historical-test`，手机预约不能生成 PC 下载按钮。

启用 JavaScript 时速查默认展示中国大陆的三种设备，用户可切换地区。重复来源合并为组件底部的一份可展开列表，随筛选同步更新；`?region=cn&platform=ios` 等参数可分享、刷新并随同篇文章的语言切换保留。参数无效时回到明确的默认选项，不按IP或页面语言推断发行地区。关闭 JavaScript 仍显示全部六条记录，来源列表和手机目录可原生展开。手机目录新增速查/事实摘要锚点，点击后收起目录并将焦点移到目标标题。

入口事实通过 `value.availability` 区分 `reservation`、`preload`、`download`，必须同时提供原始 URL。下载/平台稿件必须引用速查组件的全部事实，构建时校验依赖和引用修订号，防止组件已更新而正文/来源列表漏审。

本轮另核对两份旅迹测试原文：9月预下载面向获资格者，官方确认10月7日测试结束。旧测试中的 Windows/Android/iOS 和设备绑定条款不推定为11月公测规则。目前仍未确认PC/安卓公开公测客户端下载和公测预下载安排。

## 部署后的技术验收

每次构建验证成功后生成 `dist/build-info.json`，记录构建模式、正式 origin 和本次实际输出的文章路由。验收命令会先核对模式，防止把草稿预览当作正式产物，再读取实际页面与响应：

```sh
# 本地静态预览；明确跳过 Pages 响应头、DNS 和 HTTPS 验收
npm run site:verify -- --url http://127.0.0.1:4321 --mode preview --local

# 部署后将地址替换为真实 Pages 预览 origin
npm run site:verify -- --url https://YOUR-PREVIEW.pages.dev --mode preview

# 正式站点部署后运行
npm run site:verify -- --url https://promiliaguide.com --mode production
```

增加 `--json` 可导出报告。检查包含双语首页、构建清单中的全部文章、canonical、noindex、Pages 安全响应头、robots、Sitemap、搜索包、随机未知路由404，以及编辑工作台的预览存在/正式排除。

`.github/workflows/verify-deployment.yml` 提供手动 Actions 入口，填写实际地址和预期模式后运行并保留验收报告；此流程只发出读取请求，不创建部署、不修改 DNS。它不能替代人工正文/日语审核、真实设备与目标网络验收，也不检查尚未配置的域名重定向链。实际执行结果见 `plans/DEPLOYMENT-LOG.md`。
