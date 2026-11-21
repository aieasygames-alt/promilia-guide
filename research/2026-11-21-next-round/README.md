# 第二轮内容开发交接

日期：2026-11-21。分支：`codex/community-content-expansion`。承接[上轮18篇待审稿](../2026-11-21-content-implementation/README.md)，按奖励领取→卡池完整规则核验→地区下载与登录执行。本轮没有新增公开主题，修改8个主题的16篇语言稿；这些均属于原18篇待审稿。

## 可以审核的结果

| 主题 | 本轮变化 | 当前边界 |
| --- | --- | --- |
| resources | 新增国服巢穴探索完整条款与领取流程；日本完整奖励、背包至邮件流程；双地区期限对照、助力计数、未到账排查 | 官方条款已核；没有登录参与或实机领取；国服其他福利仍缺各等级/补签/单项期限 |
| banner-rules | 切池、提前获得、到期与自选的逐项核查和记录示例 | 本轮仍未取得完整正式概率/保底/继承原文，不填数值或计算器 |
| launch / global-release / download / platforms / getting-started | 国服11/24 15:00 UTC+8计划入共享事实，与日本11/24 16:00 JST独立对照；下载六阶段排查；两地首个角色绑定提醒 | 计划有原文；当前PC/安卓安装器、完整设备条件、开服小时与通用互通仍待核 |
| kibo-guide | 加入国服活动「星彩·小星喵」来源及首个角色邮件条件 | 活动领取不等于野外捕获；不凭跨地区名称认定同实体 |

[16篇路径清单](changed-articles.json)。主预览路径为`/zh-hans/guides/resources/`和`/ja/guides/resources/`，其次检查`guides/banner-rules/`、`guides/download/`及`systems/kibo/`。全站待审稿可从`/editorial/`进入。

## 证据、事实与未完成项

- [官方核验原文与访问边界](evidence.md)：新增国服活动规则、复读日本规则、两地官网/资讯与日本联系页。
- 新来源：`cn-kibo-adventure-rules-2026-11-21`、`jp-contact-instructions-2026-11-21`。
- `cn-preload-status`由r3待核验提升r4官方计划，值为2026-11-24 15:00 Asia/Shanghai；未登记availability、platforms或安装器URL。10篇关联语言稿已同步引用。
- 新增`cn-kibo-web-rewards` r1，关联resources、getting-started、kibo-guide及两种语言。
- 日本原预下载r4、活动领取r1事实未变；补齐同一原文的奖励与任务明细，没有无故提高事实版本。
- [六项验证队列](verification-queue.json)：把已写、待证据、下一步分开。B02完整正式规则尚缺证据，不能因有核验表记为完整卡池完成。
- [测试→公测差异登记表](beta-release-differences.md)：仅登记当前证据与待核，不把三测坐标、数值、流程伪装成正式版实测。

国服规则写预下载后可参与“②至⑥”，日本写“②和⑥”；已保留原文差异，没有据此推断国服其他任务当前不可参加。活动结束、预约任务切换、首次游戏登录后365日是三个时间条件；实物/礼卡抽奖另有期限。

## 质量检查与预览

当前内容报告：26篇语言稿，8篇可发布、18篇待审，事实/译文过期0；23条来源中19条verified，22条共享事实中15条有效。未填写本修订的人工审核人或日期。

- `npm run validate:content`通过；事实、双语修订与来源引用一致。
- `npm run check`：0错误、0警告，1个已有复制API弃用提示。
- `npm test`：55/55通过。
- `npm run build:preview`：72 HTML、34搜索页面，链接/锚点/canonical/hreflang/JSON-LD/草稿隔离通过。
- `npm run test:browser`：46/46通过。检查见本轮最终运行日志`artifacts/next-round-browser-tests.log`，覆盖桌面/移动端。首轮6项失败来自新增来源和国服第二个时间元素后的旧断言，已改为精确核对计划日期、来源及不生成安装器按钮。
- 16篇正文段落长度均不超过240字符；`git diff --check`通过。

执行`npm run review:bundle`生成当前完整noindex审核压缩包与SHA-256。包内同时带源码、证据文档、验证队列、差异表和状态报告；具体文件以`artifacts/review-bundles/`最新本轮产物为准。

## 发布状态与下一步

生产仍为此前22篇，本轮没有推送、PR、远端CI、合并或部署。当前首发检查2/10就绪；技术回归通过不代表这批新内容已完成正文/日语审核，也不代表未取得的玩法事实已确认。

接下来先核单项福利门槛、两地完整卡池、设备分发及登录/互通原文；材料到达后用验证队列逐项补正文。正式版可操作后再验证首日任务、家园岗位、奇波捕获和完整日周周期。当前可交付的是条款驱动的具体指引与审核预览，不是正式版实机完测。
