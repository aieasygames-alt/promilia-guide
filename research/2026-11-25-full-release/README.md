# 2026-11-25 全部当前开发内容发布

用户明确要求“将所有开发内容都部署到线上，上线后做好线上验证，我是独立开发者内容可以先上线，后续验证有问题可以逐步修复。”据此发布全部当前开发，并为8篇中日文新稿／修订记录本次会话发布确认，不另称独立语言审校或游戏实机验证完成。

发布包括双语图鉴、每语言26问FAQ、攻略／系统任务导航、相关问题、更新页、Metsa地区筛选、标题搜索、官方FAQ失效引用维护，以及客服指南和新手／下载／配置修订。逐篇前后SHA256见[发布授权](release-approval.json)。30/30篇攻略可发布、待审0、过期0；每语言12篇攻略和3篇系统指南，5名角色和5种奇波的资料介绍、5处日本官网地区设定。实用实体详细机制仍待补证，索引门槛保留。

`PLAYWRIGHT_PORT=4344 npm run verify:release`通过：Astro/TypeScript 0错误、0警告，1条既有API弃用提示；66/66单元测试、62/62桌面及手机浏览器测试；编辑预览80 HTML，正式76 HTML，两种构建44搜索页。内链、锚点、canonical、hreflang、JSON-LD、Sitemap、草稿隔离及发布门槛通过。完整日志保留在本机忽略目录`artifacts/playthrough-2026-11-24/verify-release-20261125.log`。

[覆盖率](coverage.json)、[文章状态](content-status.json)、[核心发布门槛](readiness.json)为本次发布前实际文件报告。上一日研究目录的待审和未部署说明保留为开发阶段历史。

已通过[PR #7](https://github.com/aieasygames-alt/promilia-guide/pull/7)合并并由现有Git集成部署至Cloudflare Pages。功能发布SHA为`f8a3e5f3ab362c59bc59821699740075c486641b`，[main质量检查与生产部署验收](https://github.com/aieasygames-alt/promilia-guide/actions/runs/45521932954)均成功。主域名同SHA技术检查98/98，全文、发布状态与内容边界检查160/160通过，4份下载文件字节一致；双语标题搜索、同篇语言切换、320px问答深链接与角色筛选实际交互通过。

[验收摘要](verification.json)、[技术检查明细](production-technical.json)、[正文及边界明细](production-content.json)、[浏览器点验记录](browser-verification.json)均保存。本目录`verify-live.mjs`可用完整生产SHA复验。后续记录维护提交同样触发部署；最新版本以线上`build-info.json`及对应main Actions为准，不将旧SHA验收冒充后续提交验收。
