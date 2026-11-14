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

私有仓库已创建。Pages Git 集成配置与首次线上验收进行中；在获得实际部署结果前，不把本地构建成功写作云端成功。
