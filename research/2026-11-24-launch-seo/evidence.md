# 2026-11-24 公测 SEO 方案的观察依据

日期与排期使用 Asia/Shanghai。本轮目标为了解项目并制定公测内容策略。以下明确区分本日实际观察、历史研究和待验证假设。

## 当前仓库

- 工作分支：`codex/gsc-core-guides-20261123`，HEAD `8af44cb`；开始时工作区干净。
- 读取 README、当前状态、11/21 复盘、11/23 GSC 与 Trends 更新记录、旧内容日历与内容扩充队列，抽查内容和 Astro SEO/正文模板。
- 本日执行 `content-report.mjs status --json`：26 篇语言稿全部满足本地发布条件，待审 0、过期 0；33 来源/29 verified，28 事实/20 有效。
- 同报告的中文实体行：5 名角色和5种奇波可公开目录摘要，全部详情不可索引；另有1名角色仅编辑预览可见。README 中“4 名角色”是旧描述。
- 本轮状态报告使用本机 Node 25.9.0；只用于读取报告，不记为项目指定 Node 22.23.4 下的完整发布验收。

## 本日生产 HTTP 抽查

通过只读 GET 读取下列资源，均返回 HTTP 200：

- [build-info.json](https://promiliaguide.com/build-info.json)：`mode: production`，26 个文章路由，SHA `faadaa515f57e768fbc597cc90eda03fed891e02`；`generatedAt: 2026-11-23T15:43:51.653Z`。
- `git ls-remote origin HEAD refs/heads/main` 返回同 SHA。本地内容分支 HEAD 与线上 main 不同，本轮没有同步、切换、推送或部署。
- [robots.txt](https://promiliaguide.com/robots.txt)：允许正文抓取，禁止两个语言的站内搜索路径，列出正式 Sitemap。
- [sitemap.xml](https://promiliaguide.com/sitemap.xml)：包含当前两语言攻略，未列实体详情；当前不输出 lastmod。
- [日本容量页](https://promiliaguide.com/ja/guides/requirements/)与[下载页](https://promiliaguide.com/ja/guides/download/)：自引用 canonical、`index,follow`，响应没有额外 X-Robots-Tag。
- 另读取[首日页](https://promiliaguide.com/ja/guides/getting-started/)与[战斗页](https://promiliaguide.com/ja/systems/combat/)的正文结构：首日页在正文前有长事实摘要；战斗页主要是可复核观察方法。容量页事实已折叠，正文直接说明本次尚未确认日本版完整安装空间。

以上是生产抽查，不构成全部 URL、Google 索引状态、真实设备、目标网络或性能验收。

## 本日浏览器读取的日本官方材料

1. 打开[日本官网](https://azurpromilia.jp/)，可见事前登録、App Store、Google Play，以及「集まれ！キボの巣穴探索」等官方活动入口。
2. 从该入口打开[巢穴探索活动](https://kiboadventure.azurpromilia.jp/)，读取「イベントルール」弹层，无需登录。
3. 当前弹层原文包括：
   - 活动期间：`2026年11月20日21:00～2026年12月31日13:00（日本時間）`。
   - `2026年11月24日16:00（日本時間）の事前ダウンロード開始後は、任務②と⑥に参加できるようになり、任務①には参加できなくなります。`
   - 探索奖励在正式服务开始后由游戏内邮件发放。
   - 奖励发往参加活动的 Yostar ID 首个创建的游戏角色，首次游戏登录后 365 日内领取。
4. 这次复读与仓库已登记的日本活动条款相符；仅确认原文当前可见，没有完成日本商店下载安装或服务器登录，不能由计划时刻断言实际开放。
5. 本轮没有重新全面读取国服、繁中公告或日本全部发行公告，没有新确认开服小时、PC 安装器、完整空间、正式卡池数值与账号重置流程。

浏览器动态规则按实际可见文字转写；不声称保存了整站快照。没有登录、参加活动、邀请他人或提交信息。

## 历史数据的使用范围

- 11/23 GSC 本机基线覆盖 11/14—11/22，是早期小样本，不能用于认定 11/23 更新效果。具体业务指标保留本机忽略目录，不写入公开研究文件。
- 日语容量/配置、首抽和兑换码已获得相关搜索信号；台湾国家筛选的可见查询与页面行不足以解释国家汇总，不能断言需要繁中站才能获得点击。
- [11/23 Trends 摘录](../2026-11-23-trends-content/queries.json)是全球游戏主题近月研究，不是各国语言的搜索量。PC、官网、发行和预约是可用意图线索；指数和 BREAKOUT 不换算流量。
- [既有竞品记录](../../plans/COMPETITOR-ANALYSIS.md)所保留的主要竞品观察来自 11/13，本轮未重新排名或取得其流量。方案中的可执行流程机会属于产品判断，不宣称全网没有同类攻略。

## 本轮产出

[公测前后 SEO 内容行动方案](../../plans/LAUNCH-SEO-ACTION-PLAN-2026-11-24.md)。只新增策略/研究文件及既有策略入口，没有改动公开攻略、数据、审核署名或应用代码。未执行完整应用回归；文档仅检查本地链接、补丁格式与私有指标隔离。
