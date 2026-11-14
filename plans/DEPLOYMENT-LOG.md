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

`www.promiliaguide.com` 尚无 DNS 解析，本次仅切换已明确确认的根域名。生产 pages.dev 仍可直接访问；www/pages.dev 向主域名的跳转、真实目标网络和回滚演练保留为后续任务。未更改其他现有 Cloudflare 项目。
