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

最新发布批次：[2026-11-24全部开发内容发布](research/2026-11-24-full-release/README.md)。用户已明确要求全部上线及线上验证，22篇当前新稿／修订与9项共享事实一起转为正式版本；现28/28篇可发布、待审0，部署与验收以该批记录和main Actions为准。

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

当前数量与待处理项以[当前交付状态](plans/CURRENT-STATUS.md)和 `npm run content:status` 为准。2026-11-21 项目负责人在会话中确认本批全部18篇待审修订/新稿审核通过，并授权全量发布与线上验证；当前26/26篇语言稿满足发布条件、待审0、过期0。确认覆盖当前正文与译文，不将待核验码、卡池数值或未知游戏规则转为已确认事实。

来源修复过程见[核验记录](research/2026-11-21-evidence-repair.md)。国服福利新公告可支持登录 66 抽、探索与任务累计 510 抽以上；不能据此证明卡池保底、直播码、首日领取方式或日本规则。

11月24日已独立核对两地FAQ及后续预下载开始公告，新增开服计划小时、配置、建议空间与地区内进度共享说明。日本PC独立下载页已核实，国服官网已显示下载按钮，国服商店后续展示1.0.1。12篇当前修订及8项共享事实覆盖正在编辑预览中待审；生产仍为此前获确认版本。详见[最新内容与证据](research/2026-11-24-distribution-followup/README.md)及[人工审核交接清单](plans/CONTENT-REVIEW.md)。安装文件取得、完整下载/占用与可登录状态尚未验证；中国区条件不用于填补日本资料。

正式构建排除所有未审核文章；两种语言首页都分别显示中国大陆与日本的共享发行事实及对应原文，不根据阅读语言代选地区。日期到来后也不会自动显示已开服。日文正式游戏名「アズールプロミリア」和「キボ」已从日本官网核验；角色目录已收录 4 名官方公布角色，奇波目录已收录 5 种官方公布奇波，资料摘要详情保持 noindex，完整用途、技能倍率、养成材料、强度与获取地点仍等待独立证据和审核。

完整本地回归：`npm run verify:release`（类型检查、单元测试、预览构建、浏览器测试、严格正式构建）。首次运行前执行 `npx playwright install chromium`。最终 `dist/` 为正式模式。2026-11-21 按用户要求将仓库改为 public，原先受账单／额度阻止的 GitHub 托管 CI 已恢复启动；检查最终结果仍以对应提交的 Actions 为准，Pages 独立构建成功不等于 CI 已通过。

## 构建与正式发布检查

| 命令 | 包含草稿 | 索引策略 | 使用场景 |
| --- | --- | --- | --- |
| `npm run build` | 否 | 完整正式页可索引；搜索/空目录 noindex | 日常开发与 CI 生产模式校验 |
| `npm run build:preview` | 是 | 全站 noindex、robots 禁止抓取、空 Sitemap、额外 noindex 响应头 | 内部编辑预览与功能验收 |
| `npm run build:release` | 否 | 与普通正式模式一致 | 本地验证首发检查通过后才构建 |
| `npm run build:pages` | 按显式环境设置 | 生产执行首发检查，分支预览全站 noindex | Pages 统一构建入口；配置见下文 |

三个底层构建脚本都会执行内容检查 → Astro 静态生成 → Pagefind → 产物检查，`build:release` 另外在开始前执行首发检查，并拒绝 `CONTENT_PREVIEW=true`。**不要将带草稿的预览构建设为生产构建命令。** Pages 生产入口还会先运行类型检查与单元测试，任一失败均停止正式构建。Pages 分支预览默认的 noindex 与这里的编辑预览模式是两层不同的机制。

`build:pages` 根据 `PAGES_BUILD_MODE` 选择 `build:release` 或 `build:preview`，在 Pages 上还核对当前分支与显式配置的生产分支。缺失配置、分支不匹配或继承了冲突的 `CONTENT_PREVIEW` 都会使构建失败，不根据 URL 猜测模式。

## 目录

```text
plans/                         原始产品、内容、语言与部署规划
src/content/guides/{locale}/    Markdown 原稿与译稿
src/content.config.ts          Astro / Zod 元数据校验
src/data/sources.json          来源、原文、核对日期与状态
src/data/claims.json           结论、证据性质和影响主题
src/data/claim-revisions.json  随待审文章进入预览的共享事实修订
src/data/distribution.json     地区/设备与事实依赖（不另存下载地址）
src/data/release-plan.json     首发核心主题、必要事实与语言要求
src/data/terms.json            稳定术语 ID 与别名
src/data/entities.ts           角色与奇波稳定 ID、双语名称、简介和来源
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

已发布文章需要实质重写时，可以在`src/content/revisions/{locale}/`准备同URL的待审修订。生产仍读取`guides/`中的已审稿；`CONTENT_PREVIEW=true`时，Astro、CLI和审核包统一选择新修订。新修订必须递增`sourceRevision`、清空旧审核人及日期，并保留draft状态。使用`CONTENT_PREVIEW=true npm run content:status`查看本批待审状态。真实确认后再将修订提升到`guides/`并移除待审文件。见[本轮优化与复查方案](plans/GSC-REFRESH-2026-11-23.md)。

已有共享事实需要随新稿复核时，将完整新事实暂存`src/data/claim-revisions.json`，ID必须存在且revision必须递增。生产保留`claims.json`原值，预览统一覆盖；两种模式均检查修订结构。发布时须将获确认的文章与对应事实一起提升，清除已提升的覆盖项，复查全部依赖，再运行完整发布检查。本批交接见[11月24日修订](research/2026-11-24-preload-capacity/README.md)。

2026-11-23后续已按Trends与预下载需求补充9主题18篇中日文修订。用户在预览交付后明确要求上线，本批已转入正式稿并独立记录[当前发布确认](research/2026-11-23-trends-content/release-approval.json)，26篇攻略均满足发布条件。新增日本Play预约展示与繁中官网商店身份核验；完整空间、PC安装器及开服小时仍待依据。截图实为连写词AzurPromilia，另补游戏主题研究，见[本轮内容与研究交付](research/2026-11-23-trends-content/README.md)。

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

命令先重新构建编辑预览，再核对构建前后的源码与证据指纹，生成 `artifacts/review-bundles/` 中唯一命名的 `.tar.gz` 和同名 `.sha256`。需要本机有 `tar`；不会修改稿件审核状态或部署。包内包含完整预览、当前 Markdown 稿件、来源/事实/术语、核验记录、人工审核说明、同批状态报告和逐文件 SHA-256 清单；不复制 `.env`、Git 目录、项目依赖或部署凭证。源输入存在符号链接时拒绝打包。

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

公开 GitHub 仓库为 [aieasygames-alt/promilia-guide](https://github.com/aieasygames-alt/promilia-guide)，2026-11-21 按用户要求从 private 改为 public。GitHub Actions 运行质量检查；Cloudflare Pages Git 集成负责在推送生产分支或其他分支后分别构建生产/预览。实际部署与验收记录见 `plans/DEPLOYMENT-LOG.md`。

Pages 项目 `promilia-guide` 已连接仓库。正式站为 [promiliaguide.com](https://promiliaguide.com)，默认地址为 [promilia-guide.pages.dev](https://promilia-guide.pages.dev)，历史分支验收预览为 [6e004931.promilia-guide.pages.dev](https://6e004931.promilia-guide.pages.dev)。主域名 DNS 与 SSL 已生效，HTTP 按路径 301 到 HTTPS。生产 pages.dev 和 www 已通过 Cloudflare Bulk Redirects 归一到主域名，保留路径和查询参数；分支预览保持 noindex。最新验收见 `plans/DEPLOYMENT-LOG.md`，域名规则见 `plans/DOMAIN-AND-PAGES.md`，恢复步骤见 `plans/ROLLBACK-RUNBOOK.md`。

首批正文与日语人工审核已由项目负责人确认。仍需补充真实反馈入口、各地区客户端下载与游戏账号规则核验、真机/目标网络验收。目录内规划的内容数量是目标，不以空页面或未经审核译文补齐。

## 地区与设备入口

`src/data/distribution.json` 只配置地区、设备及依赖事实 ID，不另存下载 URL。中日文下载/平台文章共用 `DistributionMatrix`，从事实库读取日期、预约入口、预下载和OS兼容信息。核验缺失时不输出操作链接；`distributionScope` 必须同时匹配地区与 `public-launch`，且入口事实必须明确支持该设备。历史测试记录使用 `historical-test`，手机预约不能生成 PC 下载按钮。

启用 JavaScript 时速查默认展示中国大陆的三种设备，用户可切换地区。重复来源合并为组件底部的一份可展开列表，随筛选同步更新；`?region=cn&platform=ios` 等参数可分享、刷新并随同篇文章的语言切换保留。参数无效时回到明确的默认选项，不按IP或页面语言推断发行地区。关闭 JavaScript 仍显示全部六条记录，来源列表和手机目录可原生展开。手机目录新增速查/事实摘要锚点，点击后收起目录并将焦点移到目标标题。

入口事实通过 `value.availability` 区分 `reservation`、`preload`、`download`，必须同时提供原始 URL。下载/平台稿件必须引用速查组件的全部事实，构建时校验依赖和引用修订号，防止组件已更新而正文/来源列表漏审。

历史旅迹测试原文说明9月预下载面向获资格者、10月7日测试结束。旧测试的设备绑定条款不推定为11月公测规则。11月24日公测FAQ现已补核预下载计划、平台与配置；实际PC/安卓公开安装器仍未取得核对，相关新结论随本批待审修订进入预览。

## 部署后的技术验收

每次构建验证成功后生成 `dist/build-info.json`，记录构建模式、正式 origin、Pages/GitHub 注入的完整提交 SHA 和本次实际输出的文章路由；无 Git 环境的本地构建 SHA 为 null。验收命令会先核对模式，防止把草稿预览当作正式产物，再读取实际页面与响应：

```sh
# 本地静态预览；明确跳过 Pages 响应头、DNS 和 HTTPS 验收
npm run site:verify -- --url http://127.0.0.1:4321 --mode preview --local

# 部署后将地址替换为真实 Pages 预览 origin
npm run site:verify -- --url https://YOUR-PREVIEW.pages.dev --mode preview

# 正式站点部署后运行
npm run site:verify -- --url https://promiliaguide.com --mode production --redirects
```

增加 `--json` 可导出报告。检查包含双语首页、构建清单中的全部文章、canonical、noindex、Pages 安全响应头、robots、Sitemap、搜索包、随机未知路由404，以及编辑工作台的预览存在/正式排除。

推送 main 后，`Validate site / Verify production deployment` 在质量检查通过后自动等待本次 SHA 的 Cloudflare Pages 生产检查成功，并等待主域名提供相同 SHA 的 production 清单，再检查全部页面和 15 组域名跳转。不以固定延时或旧站 200 判断部署成功；失败会使 Actions 失败，并保留部署信息与逐项报告。main 已前进时旧任务会跳过或被新任务取消。

`.github/workflows/verify-deployment.yml` 保留手动入口，可填写完整 `expected_commit` 和启用 `verify_redirects`，用于重查与回滚验收。CLI 对应 `--commit FULL_SHA`、`--redirects`；后者只接受正式主域名 production 模式。验收均只读取站点，不创建部署或更改 DNS，也不能替代人工正文/日语审核、真实设备与目标网络验收。实际执行结果见 `plans/DEPLOYMENT-LOG.md`。
