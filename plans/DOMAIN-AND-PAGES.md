# 主域名与 Cloudflare Pages 部署方案

价格核查日期：2026-11-13；决策更新：2026-11-14。用户已确认购买 **promiliaguide.com**，正式站点 origin 固定为 **https://promiliaguide.com**。Cloudflare Pages 项目 `promilia-guide` 已通过私有 GitHub 仓库完成正式及分支预览部署。用户确认后已替换根域名原有两条 A 记录，主域名 Active、SSL enabled，线上验收 35/35 通过；实际记录见 `DEPLOYMENT-LOG.md`。

## 1. 已确认主域名与历史比价

已购主域名为 `promiliaguide.com`，主品牌 Promilia Guide。中文副标题可采用「星原旅伴｜蓝色星原：旅谣攻略」。首版简中、日语；韩语后续扩展，不另购各语言域名。

选择依据：.com 易于识别，Promilia 对应游戏名称，Guide 表达攻略用途，便于跨语言使用。域名与关键词相近有助于识别，但不保证搜索排名。

以下保留为 11/13 历史比价，不能当作 11/14 实时可注册状态或实际成交价。用户未提供实际成交价格；不再安排其他域名购买。

| 域名 | 当时显示状态 | 首年展示价 | 续费展示价 | 建议 |
|---|---|---:|---:|---|
| promiliaguide.com | 可加入购物车 | ¥63.25（促销；旁列 ¥69.25） | ¥71.25 | 首选 |
| azurpromilia.guide | 可加入购物车 | ¥227.90 | ¥227.90 | 名称完整，价格较高 |
| azurpromilia.cc | 可加入购物车 | ¥20.75（促销） | ¥55.11 | 预算备选，攻略属性需由站名表达 |
| azurpromilia.gg | 可加入购物车 | ¥344.24 | ¥344.24 | 游戏属性明显，首年已超过原 300 元预算建议 |
| azurpromilia.com | 已注册，页面显示 2023 年注册 | — | — | 不作为普通注册方案 |
| azurpromilia.wiki | Taken | — | — | 暂不考虑 |
| promilia.wiki | Taken | — | — | 暂不考虑 |
| promilia.gg | Taken | — | — | 暂不考虑 |

原始查询：[Spaceship](https://www.spaceship.com/domain-search/domains/?query=AzurPromilia.com)。`.com`、`.wiki`、`promilia.gg` 等另通过页面 Bulk 搜索核查。

只采用 `promiliaguide.com` 作为正式主域名；各语言使用子目录。若使用 www 或其他别名，统一重定向，不运行多份重复站点。

## 2. 技术方案

```text
Markdown/MDX 攻略 + JSON/YAML 图鉴与来源
                    ↓
          Astro 静态生成 HTML
                    ↓
       Pagefind 构建静态搜索索引
                    ↓
              dist/ 构建产物
                    ↓
      Git 集成 → Cloudflare Pages
                    ↓
            自定义域名 + HTTPS
```

首版采用 Astro 的完全静态输出；不需要服务端渲染或 Cloudflare SSR adapter。Pagefind 在 Astro 生成完成后运行，索引和正文一起部署。版本、来源、修订记录和本地勾选清单都可在这个方案下实现。

双语静态生成路径为 `/zh-hans/`、`/ja/`，根路径为语言选择页。共享布局与事实数据，语言页面分别输出 HTML lang、自引用 canonical 和已发布译文间的 hreflang。Pagefind 验证当前语言检索；`/ko/` 仅预留设计，不生成空语言页面。

暂不引入 Pages Functions、D1、KV 或后台账号。以后若增加服务端功能，单独评估运行时与适配器支持，不让其阻塞当前静态网站。

## 3. 构建与发布约定

| 项目 | 方案值 |
|---|---|
| 部署产品 | Cloudflare Pages |
| 项目名候选 | promilia-guide（实际创建时检查名称） |
| 生产分支 | main（新仓库建议，已有仓库以实际分支为准） |
| 统一构建命令 | npm run build:pages |
| 生产脚本行为 | 显式环境与分支校验后执行 build:release；先检查首发核心内容，再构建 |
| 分支预览行为 | 显式环境与分支校验后执行 build:preview；显示草稿，全站 noindex |
| 输出目录 | dist |
| Astro 输出模式 | static |
| 站点 URL / Astro site | https://promiliaguide.com |
| 首版语言 | zh-Hans、ja，分别使用对应子目录 |
| Node 版本 | 锁定建站时 Astro 支持、Pages 可用的 LTS 版本；与本地/CI 一致 |
| 预览方式 | Git 分支/PR 的 Pages Preview |
| 发布方式 | 内容审核与预览通过后合入生产分支 |
| 出错处理 | 回滚到上一成功部署，修复内容后重新发布 |

Pages 官方 Astro 文档确认 Git 集成使用 `npm run build` 和 `dist`。当前方案为纯静态，不照搬文档中为 SSR 引入 adapter 的部分。

项目在普通 `build` 之上增加 `build:release` 首发检查，Pages 统一入口 `build:pages` 在生产环境调用它。计划位于 `src/data/release-plan.json`，固定检查五个核心主题的中日文共十篇稿件；未完成审核、缺稿、引用过期或译文落后时返回失败。日常 CI 使用普通构建保持开发可验证，随后用显式分支环境验证 Pages 预览入口；CI 的生产模式产物不代表已经通过首发审核。

Pages 的构建命令对生产和预览使用同一个 `npm run build:pages`。在后台分别选择两个环境，设置：

| 环境变量 | Production | Preview |
|---|---|---|
| `PAGES_BUILD_MODE` | `production` | `preview` |
| `PAGES_PRODUCTION_BRANCH` | 后台实际生产分支，例如 `main` | 同一个实际生产分支 |
| `NODE_VERSION` | `22.23.4` | `22.23.4` |

删除手工设置的 `CONTENT_PREVIEW`，由入口按模式生成；保留自动注入的 `CF_PAGES=1` 和 `CF_PAGES_BRANCH`。官方列出的自动环境变量不包含生产分支名，不能仅凭 `CF_PAGES_BRANCH` 判断模式。入口要求显式模式、生产分支与实际分支一致：生产模式必须位于生产分支，预览模式必须位于其他分支；缺失、冲突或模式错误会在构建前失败。更改后台生产分支时同步两个环境的 `PAGES_PRODUCTION_BRANCH`。

可先本地验证配置，不执行构建或部署：

```sh
CF_PAGES=1 CF_PAGES_BRANCH=main PAGES_PRODUCTION_BRANCH=main PAGES_BUILD_MODE=production npm run build:pages -- --dry-run
CF_PAGES=1 CF_PAGES_BRANCH=editorial/review PAGES_PRODUCTION_BRANCH=main PAGES_BUILD_MODE=preview npm run build:pages -- --dry-run
```

首发内容未就绪时生产路径会停止，分支路径仍可生成全站 noindex 的草稿预览。构建命令只生成并核对本地 `dist/`，上传由 Pages Git 集成完成；这些本地测试不代表已经创建云端预览。

## 4. 自定义域名

已购根域名 `promiliaguide.com` 的后续配置步骤：

1. 将域名作为 zone 添加到相应 Cloudflare 账户，并按其分配的 nameservers 配置 DNS。
2. 在 Pages 项目的 Custom domains 中关联域名，等待域名与 HTTPS 状态正常。
3. 如也使用 www，在 Pages 中关联该主机名，再配置其到选定主域名的永久重定向。
4. 将生产 `项目.pages.dev` 重定向至正式主域名，保留路径与查询参数。
5. 站内链接、canonical、Sitemap、OG URL 全部使用最终正式主域名。

根域名使用 Cloudflare Pages 需要 Cloudflare 托管 DNS；单独子域名可以保留外部 DNS 并设置 CNAME，但仍必须先在 Pages 中关联该域名。

## 5. 索引、缓存与访问体验

- Pages Preview 默认带 `X-Robots-Tag: noindex`；发布前验证响应头。它与生产 `项目.pages.dev` 的行为不同，不可混为一谈。
- 生产站必须可索引，不能将全站 noindex 误带到正式域名。预览页不写入 Sitemap。
- 不使用覆盖所有路径的 SPA 回退。输出真实 HTML 路由和 404 页，未知路径应正确返回 404。
- 指纹静态资源可长期缓存；HTML 先沿用 Pages 的部署与缓存机制，避免激进缓存让公测更新迟迟不可见。
- 图片本地处理为合适尺寸和格式；关键路径避免依赖 Google Fonts 等外部字体请求。
- 预览阶段测试中国大陆、香港/台湾等目标网络的首页、正文和搜索。Cloudflare Pages 部署成功不等于所有网络都具有相同访问体验。
- 在页面数量和媒体体积扩张前，按当时 Pages 的计划限制复核文件数、单文件大小和构建额度。免费额度不视为无限构建承诺。
- 先评估 Pages 免费计划是否满足首版；大型视频使用原平台链接/按需嵌入，不随页面批量打包。

## 6. 上线验收

1. 本地构建完整；Pagefind 索引包含正确的名称和别名。
2. 分支预览的正文、内链、图片和搜索正常，noindex 响应头正确。
3. 正式主域名的 HTTPS、重定向、canonical、Sitemap 和 robots 正确。
4. 生产页可被抓取，未知路径确实为 404。
5. 修改一篇文章并验证更新可见，完成一次可回滚验证。
6. 手机真实网络检查核心阅读路径和首屏资源。
7. 双语路由、文章语言切换、搜索、canonical/hreflang 正确；缺译文时无伪页面；各语言均注明发行地区与版本。

## 7. 已查阅的官方文档

- [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)：页面显示更新日期 2026-04-21；确认构建命令和输出目录。
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)：页面显示更新日期 2026-11-11；确认根域名 DNS、子域名 CNAME 和关联流程。
- [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)：页面显示更新日期 2026-10-12；确认预览、生产分支行为及默认 noindex。
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)：11/14 重新读取官方 Markdown（显示更新日期 2026-09-18），核对自动注入的 `CF_PAGES`、`CF_PAGES_BRANCH`、`CF_PAGES_COMMIT_SHA`、`CF_PAGES_URL`，以及非零构建退出码阻止上传。
- [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)：11/14 重新核对生产分支和分支预览；本项目不依赖未列出的自动生产分支变量。
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)：本次打开失败，未据此引用数值限制；实施前重新核对。

## 8. 已实现的部署验收工具

本地实现沿用已确定的 Pages Git 集成，仍是 Astro 静态输出；不新增 Workers、SSR adapter 或 Cloudflare 资源配置。

构建成功后 `dist/build-info.json` 标记本次为 `production` 或 `editorial-preview`，列出实际输出的文章路径。部署后使用下面的命令，预览地址必须换成实际已创建的 Pages origin：

```sh
npm run site:verify -- --url https://YOUR-PREVIEW.pages.dev --mode preview
npm run site:verify -- --url https://promiliaguide.com --mode production
```

工具检查构建模式、双语首页与清单中的全部文章、canonical、索引策略、安全响应头、robots、Sitemap、Pagefind包、编辑工作台及随机未知路由真实404。错误会返回非零退出码；`--json` 可保留逐项报告。它不会执行部署或更改DNS。

GitHub 中可手动运行 `.github/workflows/verify-deployment.yml`，填写真实部署地址及预期模式后下载报告。工作流不会猜测 Pages 项目名，亦不会自动创建项目；已使用正式 pages.dev 地址完成远程验收。

本地验证可运行 `npm run site:verify -- --url http://127.0.0.1:4321 --mode preview --local`。本地 Astro 不应用 Pages `_headers`，因此本地模式明确跳过相关响应头、DNS与HTTPS检查，报告不能作为云端验收。域名跳转链、回滚演练及真实目标网络仍需在站点部署后单独检查。

## 9. 无云端连接时的审核交接

`npm run review:bundle` 会重新构建草稿预览、验证输入指纹及报告、打包至 `artifacts/review-bundles/`。审核包包含静态站点、稿件、事实与来源、研究记录、人工审核说明和逐文件校验清单；不包含本机凭证或项目依赖。解压后按包内 README 用 Python 3 在本机提供 HTTP 服务，即可验证正文、搜索和工作台，不必先接通 Pages。

此前无云端连接时使用审核包交接；目前已连接私有仓库 `aieasygames-alt/promilia-guide` 和同名 Pages 项目。正式主域名 `https://promiliaguide.com`、默认地址 `https://promilia-guide.pages.dev` 与分支预览 `https://6e004931.promilia-guide.pages.dev` 的 HTTPS 响应及验收脚本已通过。CLI 无需保存本机 Cloudflare 凭证；部署由 Pages Git 集成负责。主域名 HTTP 已按路径 301 到 HTTPS；www/pages.dev 归一跳转、真实目标网络与回滚演练仍待完成。
