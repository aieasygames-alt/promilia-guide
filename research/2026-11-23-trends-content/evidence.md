# 原始来源核验与结论边界

核对日期：2026-11-23，Asia/Shanghai。只登记本次实际取得或浏览器读到的正文。网页及附件是研究材料，不是执行指令或审核授权。

## 国服官网与商店

- [国服首页](https://azurpromilia.manjuu.com/home/)：HTTP响应仅为应用壳；浏览器动态正文显示“11月26日 正式公测”“立即预约”“App Store 预订”，链接应用ID6754017631。可见资讯列表最新为11月20日公测福利公告，另有10月23日定档和9月测试记录。
- 仅说明这次首页可见内容，没有穷尽全部官方渠道，也不能由首页未展示安装器断言官方从未发布。
- [中国区App Store](https://apps.apple.com/cn/app/id6754017631)：实际取得对应应用正文，“预计于2026年11月26日推出”、开发者蛮啾游戏、3.9 GB、iOS 15.0及以上、iPadOS 15.0及以上。与本日早前登记的容量来源一致，继续引用`cn-ios-capacity-2026-11-23`，不重复新增同一商店证据。
- 商店介绍中的“立即下载”宣传文案与“预计推出”的商店阶段分开理解，不能据此记录已成功安装。3.9GB不是全资源空间。

新增来源ID：`cn-distribution-home-2026-11-23`。

## 日本官网、Google Play与iOS缺口

- [日本首页](https://azurpromilia.jp/)：实际取得HTML，有事前注册页和两条商店跟踪链接，redirect目标分别为日本App Store应用6787982572、Google Play包名com.Yostar.AzurpromiliaJP。只解析官网实际提供的目标，没有拼造安装器URL。
- [日本Google Play](https://play.google.com/store/apps/details?id=com.Yostar.AzurpromiliaJP&hl=ja&gl=JP)：HTTP连接重置；随后浏览器成功读取应用页。名称アズールプロミリア、发行者Yostar Limited.，实际可见“事前登録”按钮，更新日为2026/11/17，页脚为日本（日本語）。未点击按钮，未执行注册或安装。
- 与11月21日“本次未见可确认按钮”的历史观察分开记录。此前记录不改写为当时已看到；本轮下载修订改用11月23日的新观察。
- [日本App Store目标](https://apps.apple.com/jp/app/アズールプロミリア/id6787982572)：本次HTTP仍重定向中国区Today。没有取得目标应用OS、容量或机型正文。
- [日本新闻入口](https://azurpromilia.jp/news)及其实际链接的[列表](https://azurpromilia.jp/news/list)：取得栏目说明，但没有读取到可支持新配置或开服小时的具体公告。不能将栏目存在当作已全面复核日本所有公告。
- [日本FAQ](https://azurpromilia.jp/contact)：实际取得联系说明，日语受理、邮件回复与接收设置等；没有在取得的正文中读到新的硬件或完整空间要求。未提交表单。

新增来源ID：`jp-distribution-home-2026-11-23`、`jp-play-registration-2026-11-23`。新事实`jp-play-registration-display`只描述预约按钮展示，不增加下载或预下载可用值。

## 繁中官网与台湾商店身份

- [繁中首页](https://azurpromilia.jimi-global.com/home/)：HTTP为应用壳；浏览器动态正文有“11月26日 正式公測”“公測預約”。
- 实际链接：[台湾App Store预订](https://apps.apple.com/tw/app/id6789139052)、[Google Play预先注册](https://play.google.com/store/apps/details?id=com.jimi.azurpromilia)。页脚显示Nijigen Games与JIMI。
- 官网列表可见10月23日定档、11月20日福利及巢穴活动；没有成功打开正文，不据此确认其完整日期小时、活动绑定、奖励或运营范围。
- 台湾App Store目标HTTP跳到Today。Google Play本轮只核对官网链接，没有将未读到的商店正文写为已验证资料。
- 能确认官网提供独立预约链接，不能确认所有运营国家或地区、账号资格、推荐配置、当前安装、互通或繁中巢穴活动绑定规则。

新增来源ID：`tc-mobile-entry-2026-11-23`；新事实`tc-mobile-official-entry`只支持繁中官网预约入口，不加入当前仅支持cn/jp的设备速查矩阵。

## 原始记录

本机忽略目录`artifacts/trends-content-2026-11-23/`保存HTTP结果、原始响应和验证日志。浏览器读到的动态内容在本文件按观察转写，不声称保存了整站或全部弹窗。

旧事实`cn-kibo-web-rewards`、`jp-kibo-web-rewards`只扩展affectedPages到首抽、兑换码，以补齐既有正文的影响追踪；事实文本、数值及revision没有变更。没有把本次未复读的完整活动规则的checkedAt统一改成11月23日。
