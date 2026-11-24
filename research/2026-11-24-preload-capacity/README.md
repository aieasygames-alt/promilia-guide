# 11月24日：预下载、容量与开服FAQ内容更新

> 同日后续已在此12篇基础上继续补入开始公告、日本PC专页与商店版本变化，当前稿件与8项事实覆盖以[分发后续交接](../2026-11-24-distribution-followup/README.md)为准。本目录指纹及审核包保留第一轮快照，下面的6项覆盖描述属于较早批次。

本轮交付6个主题×中日文共12篇同URL修订：requirements、download、launch、platforms、global-release、getting-started。当前位于src/content/revisions，保留draft且无本批审核署名。正式构建继续使用guides中的26篇已审稿。逐篇修订与SHA-256见[changed-articles.json](changed-articles.json)。

| 搜索需求 | 本次内容 |
| --- | --- |
| 容量、推奨スペック、iPad、PC配置 | 直接回答手机建议55GB以上、PC120GB以上；完整最低/推荐表；单列国服鸿蒙与iOS RAM差异 |
| 预下载、PC版、下载失败 | 两地公告流程、Yostar启动器、本体后追加资源、旧国服旅迹测试不能直接升级；实际分发未验证 |
| 几点开服、リリース日 | 国服11/26 10:00 UTC+8、日本11:00 JST，各有独立FAQ；不自动宣称已开服 |
| 互通、日服、国际服 | 地区内同账号进度共享与渠道边界；跨区、付费货币、繁中规则仍单独核对 |
| 开服前准备 | 将空间、账号、正式客户端和追加资源接入现有准备清单，不伪写实测任务链 |

新增6条核验来源、5项事实；6项旧事实的新修订暂存src/data/claim-revisions.json。证据与访问限制见[evidence.md](evidence.md)。商店约3.64GB/3.9GB是分发体积，55GB/120GB是建议预留空间，尚无完整安装实测。

## 预览与发布边界

CONTENT_PREVIEW=true时，Astro、CLI与审核包共同选择文章及共享事实修订；普通生产模式继续使用原共享事实。这样预览首页时间、速查表和正文保持一致，生产稿不因新事实提前失去有效审核。

运行npm run review:bundle取得完整noindex审核站点。解压后按包内README用本地HTTP服务查看，不需安装项目依赖。检查结果见[verification.md](verification.md)。

当前批次得到真实发布确认后，再将12篇认可稿提升到guides，填写本批真实确认信息，将6条共享事实覆盖claims.json对应ID并清空claim-revisions.json；同步所有受影响稿件及测试中的批次状态断言，重新运行完整发布检查后再部署。不能只移文章而保留旧共享事实，也不能沿用11月23日的审核覆盖新稿。

没有新建近义薄页或改变原URL；本轮沿既有容量、下载页面承接临近公测的搜索意图。正式上线后才开始评估对应查询的曝光、点击和CTR，不能把本轮写稿数当获量结果。
