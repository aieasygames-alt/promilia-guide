# Cloudflare Pages 发布与恢复手册

更新：2026-11-14。仅适用于私有仓库 `aieasygames-alt/promilia-guide`、Pages 项目 `promilia-guide`。站点为 Astro 静态输出；不涉及数据库迁移。

## 发布前与发布后

1. `npm run check`、`npm test`、`npm run build:release` 通过；预览构建和浏览器检查通过。
2. 推送预览分支，记录实际部署 URL 与完整 SHA。执行 `site:verify --mode preview --commit FULL_SHA`，确认 noindex、安全响应头、空 Sitemap、工作台和真实 404。
3. 推送 main。`Validate site` 先做质量检查，再等待同 SHA、main 分支、Cloudflare 官方 App 的 Pages check 成功。生产 origin 的 manifest 必须提供相同 SHA，才运行页面及跳转验收。
4. 查看 Actions 中 `Verify production deployment` 和 `production-deployment-verification` artifact；包含部署 ID、日志地址、SHA、清单与逐项验收。失败不能记为发布验收完成。
5. 保存上一成功生产部署的 ID、SHA、不可变 URL 与验收记录。预览部署不能作为 Pages 的生产回滚目标。

## 当前已核验的历史生产候选

| 项目 | 值 |
| --- | --- |
| 完整 SHA | `6e5b9dfe0085fbde0e52b836b4ed5bcf3ea9b901` |
| 生产部署 ID | `738c5a9f-31dd-4c1a-9e26-49cf7a99e590` |
| 不可变 URL | https://738c5a9f.promilia-guide.pages.dev |
| 当时验收 | 主域名 35/35；12 篇审核文章、34 个 HTML |

该候选早于 manifest 的 `commitSha` 功能，回滚到它时须在控制台核对部署 SHA，并在正式主域名使用不带 `--commit` 的技术验收。此后的版本必须同时检查 manifest SHA。历史来源和游戏信息可能随时间过期，回滚前需检查是否适合恢复公开。

2026-11-14 复核：历史不可变 URL 仍返回 production 清单、12 篇正文和 200，但 Cloudflare 在该地址加 `X-Robots-Tag: noindex`。直接将此地址当作可索引正式入口运行 production 验收会失败，这是正确拦截；不能将它记为生产索引验收通过。回滚后的索引策略必须在正式主域名复核。

## 站点故障时回滚

1. 确认问题来自构建产物；查看当前 main、Pages 部署和失败报告。记录故障版本。暂停继续推送 main，避免新的自动部署覆盖恢复结果；确有持续覆盖风险时再临时关闭项目生产自动部署并记录原设置。
2. 在 Pages 项目 **Deployments → All deployments** 找到上一成功 **Production**，核对 SHA、创建时间和不可变 URL。
3. 打开该部署三点菜单，选择 **Rollback to this deployment**，核对目标后确认。不得选 Preview，也不删除部署、DNS 或仓库历史。
4. 在正式主域名执行完整验收。新版本示例：

```sh
npm run site:verify -- --url https://promiliaguide.com --mode production --commit TARGET_FULL_SHA --redirects --json > rollback-verification.json
```

5. 同时检查中日文更新页、核心文章和搜索。成功后记录目标部署与报告；失败则按问题类型继续修复，不能仅凭控制台显示 Success 结束。
6. Dashboard 回滚不会改变 main。对故障提交用 `git revert` 创建正常修复提交，先推送预览检查，再推送 main。不要 force push、reset 主分支或删除历史。恢复生产自动部署（如曾临时关闭），确认自动验收重新通过。

Dashboard 回滚不会触发新的 main push，因此须手动运行 `Verify hosted site`：URL 填正式主域名，mode 选 production，填写回滚版本 SHA，勾选 redirects。旧候选缺 SHA 字段时按上文例外处理。下一次 Git 发布仍需通过全部检查。

## 域名或重定向故障

Bulk Redirects 和 DNS 是独立配置，不随 Pages 产物回滚。若主域名正常、只有别名跳转异常，在账户 **Bulk redirects** 检查专用规则 `Promilia canonical domains` 与列表 `promilia_canonical`。期望值见 `DOMAIN-AND-PAGES.md` 第 10 节。

只修正本项目的条目；排查时可暂时禁用本项目规则，之后恢复并执行 `--redirects`。不改根域名原先已替换的 DNS，不恢复无关历史 IP。主域名 DNS/证书故障应先检查 Pages Custom domains 和对应 CNAME；产物回滚无法修复 DNS。

301 可能被浏览器缓存。排查用全新请求与 `site:verify` 的 manual redirect 响应，不仅依赖已打开的标签页。源域名禁止包含预览子域名，主域名禁止作为跳转来源，防止误跳转或循环。

## 安全演练范围

本轮先以分支预览验证新产物、同 SHA 清单、草稿隔离和不可变预览 URL；保留旧生产候选并核对其仍可访问。生产切换回滚不为了演练而执行。实际预览与历史候选的核验结果记录在 `DEPLOYMENT-LOG.md`。这验证恢复前检查和验收路径，不等同于已经实操生产回滚按钮。

官方依据：[Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)（2026-11-14 核对）。成功生产部署可作为回滚目标，预览部署不可作为目标。
