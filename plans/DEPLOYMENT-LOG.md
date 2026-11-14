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
