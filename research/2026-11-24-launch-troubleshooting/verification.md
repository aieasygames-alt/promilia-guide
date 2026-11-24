# 本批验证

2026-11-24，固定Node22.23.4。验证日志在本机忽略目录`artifacts/launch-troubleshooting-2026-11-24/`。

- `CONTENT_PREVIEW=true npm run validate:content`通过：26篇，6可发布、20待审，无引用／路由／翻译修订问题。
- `PLAYWRIGHT_PORT=4324 npm run verify:release`通过：类型检查0错误、0警告（既有复制API弃用提示1处），61/61单元、50/50桌面／手机浏览器回归。
- 预览72 HTML／34搜索页，正式68 HTML／34搜索页；内链、锚点、canonical、hreflang、sitemap、JSON-LD、搜索与草稿隔离通过。
- 状态报告：来源48／verified44，事实35；生产26篇可发布、有效事实27；预览6可发布／20待审、有效事实31；过期0。
- 已构建审核预览下另检6条路由×320px／390px，共12组无JavaScript检查：无整页横向溢出，noindex、来源原生展开、新事实可读正常；下载／配置页的8次TXT链接请求均可读，日语与中文手机截图已查看。
- 本批6篇指纹与20篇最新全量指纹已生成；原资料及内容不自动转为已审。

最终审核包使用通过检查的同一预览产物，加入本记录后重新封装并校验全部清单指纹；不重复修改正文。固定交接文件：`artifacts/review-bundles/promilia-review-launch-troubleshooting-2026-11-24.tar.gz`及其`.sha256`。本地预览运行于http://127.0.0.1:4328/，读取独立解压目录；项目dist恢复严格生产构建。

本轮没有推送、部署或用户咨询提交；没有安装器／正式客户端运行与故障修复成功的实测。独立日语校阅仍待当前稿确认。默认旧生产文章和共享事实覆盖隔离保持。
