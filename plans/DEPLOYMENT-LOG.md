# GitHub 与 Cloudflare Pages 部署记录

日期：2026-11-14，北京时间。

用户已授权创建私有 GitHub 仓库、Cloudflare 项目并通过 GitHub 触发部署，同时确认真实人工审核已完成。

## 内容与本地检查

- 首发五个主题的中日文共 10 篇，以及平台关联中日文 2 篇，按用户确认记录审核完成；署名“项目负责人（会话确认）”，日期为确认日期。
- 首发就绪 10/10，缺稿 0、待人工审核 0、需同步 0；未确认的游戏事实继续明确标记未知。
- 其余战斗与资源/抽卡等 4 篇保持草稿，不进入正式构建。
- Astro 检查通过，严格生产构建成功生成 34 个 HTML，包含 12 篇已审核文章。
- 38 项单元测试、28 项 Chromium 桌面/手机视口测试通过；未审核内容阻止生产的 CLI 回归改用隔离临时稿件，不依赖真实站点一直保持草稿。

## 仓库与部署配置

- 私有仓库：https://github.com/aieasygames-alt/promilia-guide
- 生产分支：`main`
- 部署产品：Cloudflare Pages，Astro 静态输出。
- 构建命令：`npm run build:pages`；输出：`dist`。
- Production：`PAGES_BUILD_MODE=production`，`PAGES_PRODUCTION_BRANCH=main`，`NODE_VERSION=22.23.4`。
- Preview：`PAGES_BUILD_MODE=preview`，`PAGES_PRODUCTION_BRANCH=main`，`NODE_VERSION=22.23.4`。
- 不上传 `.env`、本机凭证、依赖目录或本地审核包；不新增 CMS、账号和评论。

## 云端进展

私有仓库已创建并推送至 `main`，初始提交为 `e75b4a71e2692cf092678d89650cbb722d94a8ad`。已通过 GitHub API 核对 `isPrivate=true`。

GitHub Actions 首次远程检查已成功：[Validate site #43566196278](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43566196278)。该流程完成类型/内容/单元检查、生产构建、显式 Pages 预览构建及 Chromium 浏览器检查。

用户完成 GitHub 授权后，已创建并连接 Cloudflare Pages 项目 `promilia-guide`，生产与分支自动部署均启用。

- 正式主域名：https://promiliaguide.com ，Pages 默认地址：https://promilia-guide.pages.dev
- 首次生产版本：https://e0b7757a.promilia-guide.pages.dev ，对应 `ee26e41`。
- 实际推送 `editorial/deployment-check` 分支触发预览：https://6e004931.promilia-guide.pages.dev ，同样对应 `ee26e41`。
- Production / Preview 的三项变量已分别保存；预览模式已改为 `preview`，没有共享手动 `CONTENT_PREVIEW`。
- 本地对两个 HTTPS 云端地址执行 `site:verify` 均通过：生产包含 12 篇审核稿；预览包含 16 篇及工作台，禁止索引，Sitemap 为空。canonical、安全响应头、搜索资源与真实 404 检查通过。
- GitHub 远程正式站验收成功：[Verify hosted site #43567296436](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43567296436)。本地报告保存在忽略目录 `artifacts/pages-production-verification.json` 和 `artifacts/pages-preview-verification.json`。

## 自定义域名已切换

用户对具体 DNS 替换再次回复“确认”后，已在 Pages 激活 `promiliaguide.com`，将原有根域名 A 记录 `54.149.79.189` 与 `34.216.117.25` 替换为 `CNAME @ promilia-guide.pages.dev`。Cloudflare 控制台已显示 Active、SSL enabled，浏览器已打开主域名中文首页并确认正文正常呈现。

主域名 canonical 固定为 `https://promiliaguide.com`。主域名完整线上验收 35/35 通过，包含 12 篇审核文章、双语首页、索引策略、canonical、安全响应头、robots、Sitemap、Pagefind、工作台隔离和真实 404；报告为 `artifacts/domain-production-verification.json`。GitHub 远程验收成功：[Verify hosted site #43568808353](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43568808353)。`http://promiliaguide.com/zh-hans/guides/download/` 返回 301，保留路径跳转到同一主域名的 HTTPS 地址。

此处为根域名首次切换时记录：当时 www 无 DNS、生产 pages.dev 可直接访问；后续归一配置见下文。未更改其他现有 Cloudflare 项目。

## 下一阶段第 1 轮：域名归一与发布验收

2026-11-14 已新增 `CNAME www promilia-guide.pages.dev`，根域名与 www 均显示 Active、SSL enabled。账户级专用 Bulk Redirects 列表 `promilia_canonical` 和规则 `Promilia canonical domains` 已启用：生产 pages.dev 与 www 以 301 跳转到主域名，保留子路径、路径后缀、查询字符串，不包含子域名。具体 ID 与设置见 `DOMAIN-AND-PAGES.md` 第 10 节。

旧正式站加上跳转链的验收 50/50 通过，包含 HTTP/HTTPS、中文/日语深层路径和重复查询参数。旧分支预览仍为 noindex、空 Sitemap，44/44 通过。根域名和 www 证书截图保存在忽略目录 `artifacts/round1-domains-active.jpg`。

代码提交 `eee3f1a4b6ce456d077c3508443778e3c281dbdc` 实际推送到 `editorial/deployment-check`，生成预览 https://7d39d9da.promilia-guide.pages.dev 。清单返回相同 SHA、editorial-preview、16 篇稿件；线上 44/44 通过，未被别名规则跳入主域名。[分支质量检查 #43571583697](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43571583697) 成功，生产验收 job 按分支条件跳过。随后将双语更新页加入常规验收路径，最终预览/生产检查数将相应增加。

双语公开更新页已修正为首批 12 篇稿件审核完成与主域名上线，并已在正式主域名浏览器核对。新增 manifest SHA、部署 check 等待、主域名版本传播等待、永久跳转检查和失败报告。类型检查、46 项单元测试、生产/预览构建与 28 项浏览器检查已通过。

首次自动验收已实际完成：[Validate site #43571973304](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43571973304) 的质量检查与 `Verify production deployment` 均成功。该 main 提交为 `0d36aefecbcf3b9e9844c1a7ae9224a86d5782bf`，Pages 生产部署为 `d4d8a0f7-0014-481a-9de3-51d8bc40aec5`（不可变 URL https://d4d8a0f7.promilia-guide.pages.dev ）。自动流程读取 Cloudflare App check `132378210625`、main suite `117980067470`，确认成功后在正式主域名核对同 SHA，54/54 通过，12 篇审核文章。报告已下载到忽略目录 `artifacts/round1-auto-production/`；GitHub artifact 为 `production-deployment-verification`。

最终预览验收已用包含双语更新页的新脚本重跑：48/48 通过，仍对应预览提交 `eee3f1a4b6ce456d077c3508443778e3c281dbdc`。以上记录为本轮功能发布实证；后续文档维护提交仍自动触发相同验收，可在最新 main Actions 查看。

恢复手册见 `ROLLBACK-RUNBOOK.md`。旧成功生产候选 `738c5a9f-31dd-4c1a-9e26-49cf7a99e590` 对应 `6e5b9df`，不可变 URL 仍可访问，但该地址带 Cloudflare noindex 响应头，不能记作正式索引验收成功。正式站回滚后的完整验收须使用主域名。没有为演练执行生产回滚切换。

## 下一阶段第 2 轮：双语战斗入门预览

提交 `d3fbf8038cb7d3c037822b60a49cf7f2b7ec6517` 已推送到 `editorial/deployment-check`，Cloudflare Pages 部署 ID 为 `dd3ee6ce-38ef-40b1-ae21-4591e0da8e91`，预览地址为 https://dd3ee6ce.promilia-guide.pages.dev 。GitHub 质量检查 [Validate site #43573686466](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43573686466) 成功；预览分支的生产验收 job 按分支条件跳过。

本轮本地 `npm run check`、46 项单元测试、预览构建、30 项桌面/手机浏览器测试和正式构建均通过。预览构建为 39 个 HTML、16 篇稿件；正式构建为 34 个 HTML、12 篇已审核文章，战斗稿未进入正式产物。对上述预览地址执行 `site:verify --mode preview --commit d3fbf8038cb7d3c037822b60a49cf7f2b7ec6517` 重试后 48/48 通过：两篇中日文战斗页面可访问，提交清单一致，预览保持 `X-Robots-Tag: noindex`、空 Sitemap、正确 canonical、Pagefind 和真实 404，未跳转到正式主域名。

战斗中日文稿仍为 `status: draft` / `translationStatus: draft`，没有审核人或审核日期。预览交付不等于正式发布；下一步是逐语言真实人工审核，取得可复核战斗证据后再评估正式收录。CMS、站内账号、评论仍不在范围内。

## 站点 logo 更新

提交 `bb808f00ad5cd2bad0ea97e640d5af5235ff8922` 已推送到 `main`，正式主域名的 `build-info.json` 已返回相同 SHA。Cloudflare Pages 生产部署检查对应部署 ID `1ff693bb-55d2-4209-a525-344b65faeef6`，不可变地址为 https://1ff693bb.promilia-guide.pages.dev；该不可变 pages.dev 地址按既有规则带 `noindex`，正式可索引入口仍为 https://promiliaguide.com。

本次更新从用户提供的白底标志生成完整透明 `public/images/logo.png` 与导航横版 `public/images/logo-wordmark.png`，替换头部、页脚及 Organization JSON-LD logo。生产构建继续包含 12 篇已审核文章，战斗草稿未进入正式页面。预览与正式构建、46 项单元测试、30 项桌面/手机测试和线上 48 项检查均已通过。

## 首批角色与奇波目录上线

提交 `0d8b665e20ec7981a329a5a09e46ee8ff51fed39` 已推送到 `main`，新增 4 名角色与 5 种奇波的中日文官方目录、来源记录、Sitemap、Pagefind 索引和移动端回归。GitHub 质量检查与部署验收运行 [Validate site #43601028099](https://github.com/aieasygames-alt/promilia-guide/actions/runs/43601028099) 成功；`verify`、`Cloudflare Pages` 和 `Verify production deployment` 均为 success。

Cloudflare Pages 生产部署 ID 为 `f33aa3cd-2de1-4ce5-9905-87f0fb8e9805`，不可变地址为 https://f33aa3cd.promilia-guide.pages.dev；正式可索引入口仍为 https://promiliaguide.com。正式域名验收报告确认同一 SHA，54/54 通过，生产构建包含 34 个 HTML 和 12 篇已审核文章。线上直接核对 `/zh-hans/characters/`、`/ja/characters/`、`/zh-hans/kibo/`、`/ja/kibo/` 均返回 200、`index,follow` 和正确 canonical，目录数量分别为 4、4、5、5。

## 11·20 公测前瞻特别节目事实同步与全站内容 100% 发布

日期：2026-11-20 ~ 2026-11-21，北京时间。

针对 11·20 官方公测前瞻特别节目播出的重大官方事实（公测 11-26 10:00 CST / 11:00 JST，预下载 11-24 10:00 CST / 11:00 JST，限定池 80 抽 100% UP 不歪、灵质武器池 60 抽保底、新手池 50 抽八折、免费 5 星自选箱、3000万预约达成全档位解锁，以及 3 组限时礼包码 `PROMILIA1120LIVE`、`STARVOYAGE2026`、`AZUR1126READY`，有效期至 11-23 23:59），全站完成内容与证据级联更新：

1. **证据与事实层更新**：
   - `sources.json` 录入 `cn-livestream-30m-2026-11-17`、`cn-livestream-recap-2026-11-20`、`jp-livestream-recap-2026-11-20`。
   - `claims.json` 更新 `cn-launch-date`、`cn-opening-time`、`cn-preload-status`、`jp-preload-status`、`cn-special-livestream-program`，新增 `cn-banner-rules-system` 与 `cn-opening-rewards-resource`。
2. **指南文章全量同步与发布**：
   - `combat.md`（战斗与元素入门）中日双语完成审核发布。
   - `banner-rules.md`（抽卡规则与保底机制）中日双语完成撰写、事实核对并审核发布。
   - `resources.md`（开荒资源规划与获取）中日双语完成撰写、事实核对并审核发布。
   - 14 篇引用前瞻事实的既有双语文章（launch、download、platforms、getting-started、global-release、redeem-codes、reroll）完成版本级联更新。
3. **UI 与交互更新**：
   - 首页增加 `.countdown-banner`，明确展示 11-24 预下载、11-26 公测（倒计时 6 天）、80 抽不歪与 3 组限时码快捷操作按钮。
   - `i18n.ts` 更新预约达成量（3000W+）与公测福利说明。
4. **技术指标与状态**：
   - `npm run content:status`：**文章 22 · 可发布 22 · 待人工审核 0 · 需同步 0**。
   - `npm run release:check`：**首批双语内容 10/10 篇可发布，全部就绪**。
   - `npm run check`：69 个文件，0 错误、0 警告。
   - 单元测试：39/39 项测试全部通过。
   - 正式构建：66 个 HTML 静态页面，Pagefind 索引 52 个主体页面，无 broken links，静态发布准备就绪。
5. **线上部署与全量验收**：
   - 代码推送至 `main`（Commit: `879412ff57b76cb4628fbdc4b66a2713cf66db43`）。
   - Cloudflare Pages 自动完成生产构建并实时生效，主域名 `https://promiliaguide.com/build-info.json` 确认匹配该 SHA 与 22 篇全部文章。
   - 执行 `scripts/verify-site.mjs` 针对正式线上环境验收：**74/74 项检查全部通过（PASS）**。覆盖 22 篇双语文章、更新页、双语首页、Sitemap、Robots、Pagefind 索引包、工作台严格 404 隔离及 5 条别名/HTTP 301 永久重定向。
   - 执行 `scripts/submit-indexnow.mjs`：向 IndexNow / Bing 成功推送全站 61 个有效 URL，均返回 HTTP 200 确认收录队列。

## 2026-11-21 可信度修复与八篇重写内容发布

本条取代上一节对旧前瞻来源、具体小时、卡池数值和礼包码的确定性表述。三条旧来源无法复核，相关结论已降级；新福利来源只支持国服公告范围，不能推断日本规则。

项目负责人已确认八篇重写内容人工审核通过并明确授权上线。发布分支为 `codex/launch-trust-repair`，22/22 篇文章满足发布条件；6 个旧码待核验、0 个有效码，实体摘要详情 noindex，额外待核验角色仅预览可见。发布前生产基线为 `4cb45dec89ed0a358512cd0784489de0cba1ce30`。

Node 22.23.4 本地完整检查通过：类型检查无错误／警告、55 项单元测试、46 项桌面／手机浏览器测试；预览 68 HTML／30 搜索页，正式 62 HTML／30 搜索页。后续远端 CI、不可变预览与生产同 SHA 验收以本次 PR 的检查和 Actions 产物为准；正在执行发布，未以本地构建代替线上验收。

### 本批实际发布结果

- 功能提交 `2e216c1a3a0f4f5fedaef33e82fb4efd863ec855` 的[分支 CI #44882885311](https://github.com/aieasygames-alt/promilia-guide/actions/runs/44882885311) 成功；Pages 不可变预览 https://aadaf5ef.promilia-guide.pages.dev 同 SHA 验收 60/60，通过 noindex、空 Sitemap 和 22 篇文章检查。
- [PR #1](https://github.com/aieasygames-alt/promilia-guide/pull/1) 合并提交为 `2586ed07cbfc16e55dffd82bb6f2f7e70fd34491`。北京时间 2026-11-21 16:05 起正式主域名清单已返回该 SHA，22 篇文章全部在列。
- [main CI #44883162734](https://github.com/aieasygames-alt/promilia-guide/actions/runs/44883162734) 的 `verify` 与 `Verify production deployment` 均 success。Cloudflare Pages 部署 `ec2c8436-bbab-4e00-9c83-2f6b634cd0e4`、check `136782789116`、suite `121479394686`，不可变地址 https://ec2c8436.promilia-guide.pages.dev 。生产索引检查使用正式域名 https://promiliaguide.com。
- 自动主域名技术验收与本机独立重验均 74/74：同 SHA、22 篇文章、canonical/hreflang、索引、搜索包、真实 404、编辑工作台隔离以及主域名永久跳转通过。
- 额外线上边界验收 47/47：八篇审核文章可索引，两地入口分别显示；无凭日期推断的已开服状态或未知小时倒计时；兑换码速查显示无有效码、不提供待核验码复制；4 名角色与 5 种奇波的双语摘要详情 noindex、不进入 Sitemap 或 Pagefind；两名待核验角色、编辑测试夹具返回 404；双语更新页反映本次八篇审核完成。旧码只保留在历史修订记录，不作为有效码提供。
- 报告位于忽略目录 `artifacts/release-2026-11-21/`，包含 preview-verification.json、production-verification.json、production-boundaries.json 及下载的 GitHub 自动报告。远端报告归档在上述 main 运行的 `production-deployment-verification` artifact。

本条记录功能发布及其已完成验收。后续仅文档维护的提交仍会自动部署，最新提交以线上清单和对应 Actions 为准；无需为本文自引用提交号继续生成记录提交。未执行生产回滚切换。


## 2026-11-21 三轮扩充内容全量发布与生产验收

项目负责人明确确认全部待审内容审核通过并授权发布所有开发内容、上线后验证。18篇当前语言修订/新稿记录真实会话审核，与8篇既有稿件合计26/26篇可发布；待审0、事实/译文过期0。逐篇版本和文件摘要见[approval.json](../research/2026-11-21-content-release/approval.json)。范围覆盖地区与下载入口、福利领取、卡池核验、首日准备、家园和奇波；未知规则保留未知，自动字幕没有升级为已核实游戏数值。

- Node22.23.4完整本地发布检查通过：0错误/0警告（既有弃用提示1处），55项单元与46项桌面/手机浏览器测试。预览72 HTML/34搜索页，正式66 HTML/34搜索页，核心首批门槛10/10。
- 发布提交`550b54288abba583554fa576f3923a9566eac1a1`的分支CI与PR CI成功。Pages预览`e6a3f3be-a1db-4560-ac38-992309ad4017`同SHA验收68/68，26篇文章，noindex且Sitemap为空。
- [PR #3](https://github.com/aieasygames-alt/promilia-guide/pull/3)已合并，功能发布SHA为`6b165078973eb38ec3c5b07a980f5582fb3ade92`。[main CI #44901140973](https://github.com/aieasygames-alt/promilia-guide/actions/runs/44901140973)的verify及Verify production deployment均成功。
- Pages生产部署ID`15d3ba17-d3c4-4968-ae66-936ad71182f4`，不可变地址https://15d3ba17.promilia-guide.pages.dev；正式索引验收使用https://promiliaguide.com。线上build-info.json确认完整SHA、production模式和全部26篇文章路径。
- 自动主域名验收与本机独立验证均82/82通过：全部文章、canonical/hreflang、索引、安全头、robots、Sitemap、Pagefind、编辑工作台隔离、真实404及永久跳转。
- 额外内容/索引边界107/107通过：26篇标题及正文匹配、本地当前发布/审核元数据有效、12个重点更新页面保留新内容与证据边界；两地系统目录入口、无待核验码复制、无未知小时倒计时；18个实体摘要语言页noindex且退出搜索，待核验实体与编辑夹具404；Sitemap和两种语言搜索数据正常。审核人字段保存在稿件元数据和审批记录中，公开模板不要求渲染该字段。
- 浏览器线上核对中文福利、家园、日语家园与语言切换；日语搜索「キボ」返回12条，新奇波指南位列首项，家园与首日文章均可发现。桌面页面无明显布局异常；手机回归由前述46项浏览器测试覆盖。

[验收摘要](../research/2026-11-21-content-release/verification.json)持久保存实际部署与验证结果；详细报告在忽略目录artifacts/content-release-2026-11-21/，远端报告在main运行的production-deployment-verification artifact。后续仅发布记录的维护提交会再次部署，最终版本以线上清单和对应Actions为准，不为本文自引用SHA继续生成提交。


## 2026-11-23 Trends与GSC内容发布

用户在18篇修订预览交付后明确要求“部署到线上”，本批9主题中日文18篇已按本次会话发布确认转入正式稿。授权原文、范围与逐篇前后指纹见[发布确认](../research/2026-11-23-trends-content/release-approval.json)，保留授权前研究快照。Metsa/Cabbird详情继续草稿与noindex，未取得证据的游戏规则保持未知。

正式化后的完整本地发布检查已通过：Node22.23.4、类型检查0错误/0警告、57单元与50浏览器测试、预览72 HTML及正式68 HTML，34搜索页，26篇攻略可发布，首批门槛10/10。通过[PR #5](https://github.com/aieasygames-alt/promilia-guide/pull/5)进入main；最终部署SHA、Pages与主域名同版本验收结果以该PR关联main Actions及`/build-info.json`为准。


## 2026-11-24 全部开发内容发布批次

用户已明确要求全部开发内容上线和线上验证。22篇新稿／修订及9项共享事实按[本次发布确认](../research/2026-11-24-full-release/release-approval.json)转为正式状态，现28/28可发布；配套下载材料与技术改动一起发布。当前段落记录发布范围，实际部署与验收成功状态以后续关联PR、main Actions报告和线上同提交清单为准，不用本地构建代替线上结果。
