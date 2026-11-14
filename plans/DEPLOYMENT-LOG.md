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

Cloudflare 控制台已进入 Pages Git 导入流程，并登录 GitHub `aieasygames-alt`。目前停在 **Cloudflare Workers and Pages 的 GitHub 应用最终“授权”页**，未点击授权，尚未创建 Pages 项目或触发云端构建。浏览器操作规则对授予持续账户访问的步骤要求当下单独确认；待用户确认后继续，并优先将仓库访问范围限定为 `promilia-guide`。

本次尚未更改域名、DNS 或其他现有 Cloudflare 项目。首次线上部署及响应头、HTTPS 等验收待集成授权后继续。
