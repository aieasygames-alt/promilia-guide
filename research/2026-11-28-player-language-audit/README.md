# 全站攻略表达与本地化审计

日期：2026-11-28（Asia/Shanghai）

**结论：SHIP 本轮表达与浏览改造；FIX 后续玩法深度缺口。** 本轮可上线的结论针对文案、页面组织与浏览功能，不表示所有攻略已有实机验证、完整游戏数据或独立母语审校。

用户要求全面审查站点的任务式表达、本地化和玩家阅读体验。沿用用户此前明确的开发、上线及线上验证授权。审计采用 content-quality-auditor 的 CORE-EEAT 项目作为检查框架，结合源码、发布产物与浏览器实际阅读检查；没有将未取得的数据填成通过。

## 范围与证据

- 41个已发布语言版本：简中16、日文16、英文9，覆盖16个主题。不是41个独立主题，也未将缺少英文的主题标为已翻译。
- 逐页清单见 [pages.md](pages.md)。改前标题、章节及内部口吻摘录保存在 [before.json](before.json)；改后清单见 [after.json](after.json)。
- 共用界面包含三语首页、攻略与系统目录、图鉴与实体介绍、FAQ、公开更新、搜索和纠错入口。编辑规范与关于页面保留合理的编辑方法说明。
- 扫描生成的所有语言玩家页面，包括 noindex 的资料介绍页。扫描来源于生产 HTML；来源列表不当作正文，折叠的共享公告摘要也接受措辞检查。
- 13篇语言版本进行了主要结构重写：中日开服、三语新手、中日战斗、中日家园、中日刷初始、中日奇波。其余页面完成针对性措辞、冗余段落和元数据整理。

## 主要问题与已实施修正

| 问题 | 原有表现 | 本轮处理 |
| --- | --- | --- |
| 将编辑研究当攻略 | 战斗页“先完成一场可复核的战斗”“元素说明需要哪些证据” | 收窄为技能不触发、命中和操作设置排查；清单改为键位、目标、资源、设备检查 |
| 建议先验证再给答案 | 家园强调生产闭环、收集条件、反复记录 | 先提供种子、岗位、食物、计时、仓储的排查顺序，缺粮时优先检查供给与额外岗位 |
| 反复讲编辑未做什么 | 本轮未取得、不会生成、HEAD 403、文件字段、授权审校历史 | 删除正文研究日志；旧审核授权历史留在源码，公开内容更新使用独立 readerUpdates |
| 开服后仍按准备期写作 | 公测前准备、记录版本、整理开服证据 | 首页与开服页直接说明已上线，接下载、主线、邮箱福利、抽卡和日常 |
| 正文答案被证据占据 | 下载筛选和长共享摘要先于主体 | 正文在前，设备矩阵放后；参考来源与共享公告可展开，保留原链接与日期 |
| 日语机械翻译与地区顺序 | 主線、先讲国服才讲日本、研究说明句 | 主线统一为メインストーリー；日本版能回答的问题先讲日本，外区经验单独标地区 |
| 英语像审计报告 | does not establish、does not supply invented 等反复出现 | 改直接回答和具体适用条件，保留未确认的语言支持、跨区和账号边界 |
| 不同页面答案矛盾 | 英文FAQ称输入入口未知；旧福利段称票券用途未知 | FAQ同步官方日服菜单；福利与现有卡池规则对齐 |
| 承诺超出正文 | 战斗与元素入门、图鉴培养暗示完整攻略 | 改为战斗卡点排查、官方介绍；明确缺少完整技能、材料和捕获路线 |
| 研究统计进入玩家更新 | 更新页显示审核稿件数、核对动作 | 改成新增的入口、福利、卡池和读者可用变化 |
| 错拼关键词堆砌 | 每篇页底重复游戏拼写别名 | 删除可见堆词，搜索框正规化 Azur/Azure/Promillia 与藍色星原等查询 |
| 纠错入口暴露实现状态 | “接收渠道尚未配置” | 明确表单可复制保存且不会发送，增加现有GitHub纠错入口 |

共享事实仅调整中日摘要的读者措辞：原定时间写为“原定／当初”，安装器测试范围改为简短说明。原始证据 detail、日期、数值、URL、验证状态和事实修订号保留；没有将历史计划提升为当前在线实测。

## 本地化处理原则

- 网站语言与游戏地区分开：英语攻略不代表英语客户端已经发行，PlayPark SEA与英语版目标季节分别说明。
- 日语默认设备筛选为日本；中文为中国大陆，用户显式选择及语言切换时继续保留参数。
- 菜单保留可对照的地区原文，例如日本代码入口「設定→アカウント→引き換えコード」。未确认的跨区角色名不编译成“官方英文名”。
- 地区活动期限保持原时区；日服 AZPR1126 的原文期限仍为2027-11-26 23:59，不因看似异常擅自改年。
- 韩国、繁中社区的日常、种子和捕获经验保持署名与地区，不改写成日服已验证机制。
- 中国大陆的下载优化仍写为进行中。官网介绍不自动视为卡池可抽；展示地区不自动视为捕获坐标。

## CORE-EEAT 检查摘要

以下是全站聚合的编辑判断，不是逐页80项自动评分。Pass=10，Partial=5，Fail=0；N/A不计分。没有足够外部权威数据，因此不提供可与完整SEO审计比较的加权总分。内容类型为攻略、排查说明、FAQ与资料目录的混合；不能拿一篇长攻略的字数门槛评价角色索引。

### C — 问题与读者

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| C01 | Intent Alignment | Pass | 战斗标题已收窄，页面不再承诺完整元素与配队。 |
| C02 | Direct Answer | Pass | 开服、下载、新手、代码先回答问题再展开。 |
| C03 | Query Coverage | Partial | 发行与安装较完整；养成材料、配队、捕获路线仍缺。 |
| C04 | Definition First | Partial | 票券、保底、商店空间分别解释；部分游戏术语仍需更多实例。 |
| C05 | Topic Scope | Pass | 地区、版本、预览与实装、建议与事实分别说明。 |
| C06 | Audience Targeting | Pass | 改为玩家卡点，日文先日本，英文区分英语与SEA。 |
| C07 | Semantic Coherence | Pass | 主体阅读顺序调整，删除研究流程打断。 |
| C08 | Use Case Mapping | Pass | 下载阶段、奖励来源、战斗和生产问题各有对应表。 |
| C09 | FAQ Coverage | Pass | FAQ与相关文章连接，英语代码答复同步正文。 |
| C10 | Semantic Closure | Partial | 多数可接后续指南；完整数值玩法仍需后续资料。 |

本维度可评价项目：10/10；编辑判断得分：85.0/100。

### O — 组织与浏览

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| O01 | Heading Hierarchy | Pass | 保留单页H1、H2目录和层级。 |
| O02 | Summary Box | Pass | 开头直接答案；首页和发行页保留简明入口。 |
| O03 | Data Tables | Pass | 地区、配置、票券、奖励表保留单位和条件。 |
| O04 | List Formatting | Pass | 清单改为可用的入门和操作备忘。 |
| O05 | Schema Markup | Pass | 生产构建检查Article与JSON-LD。 |
| O06 | Section Chunking | Pass | 13个语言稿结构重写，其他稿精简。 |
| O07 | Visual Hierarchy | Partial | 正文优先；长表格、图片仍需持续移动阅读观察。 |
| O08 | Anchor Navigation | Pass | 目录、FAQ直达与参考资料锚点保留。 |
| O09 | Information Density | Partial | 去研究过程与重复声明；部分长福利页仍偏长。 |
| O10 | Multimedia Structure | Partial | 图鉴、文章配图已有；步骤实机截图仍不足。 |

本维度可评价项目：10/10；编辑判断得分：85.0/100。

### R — 依据与一致性

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| R01 | Data Precision | Pass | 55/120GB为建议空位，90/80/30为地区明确规则，期限保留时区。 |
| R02 | Citation Density | Pass | 关键条件原链接保留，参考资料可展开。 |
| R03 | Source Hierarchy | Pass | 官方资料与社区帖子继续标注区别。 |
| R04 | Evidence-Claim Mapping | Pass | 共享事实修订引用和来源锚点继续通过构建校验。 |
| R05 | Methodology Transparency | Pass | 方法记录留在编辑规范，攻略保留必要条件。 |
| R06 | Timestamp & Versioning | Pass | 有实质改稿才更新文章日期；历史来源原日期保留。 |
| R07 | Entity Precision | Pass | 不猜测未证实的中日角色名与奇波形态对应。 |
| R08 | Internal Link Graph | Pass | 目录、FAQ、相关文章和语言互链均接受检查。 |
| R09 | HTML Semantics | Pass | 使用article、section、table、details与time。 |
| R10 | Content Consistency | Pass | 修正代码入口与票券用途两处已发现矛盾；自动验证引用一致性。 |

本维度可评价项目：10/10；编辑判断得分：100.0/100。

### E — 独有价值

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| E01 | Original Data | Fail | 缺少本站可复现的实机游戏数据。 |
| E02 | Novel Framework | Partial | 按问题的地区、阶段和领取条件对照有帮助，但不是独有机制研究。 |
| E03 | Primary Research | Partial | 有原始公告与社区原帖整理；本轮重点是表达审计。 |
| E04 | Contrarian View | N/A | 无需为攻略强行创造反常观点。 |
| E05 | Proprietary Visuals | N/A | 现有主要为官方和用户提供图片，不冒称独有实拍。 |
| E06 | Gap Filling | Partial | 解决多地区入口、票券混算与奖励来源；深度玩法缺口仍大。 |
| E07 | Practical Tools | Pass | 地区设备筛选、搜索、可保存清单与纠错文件可用。 |
| E08 | Depth Advantage | Partial | 地区对照较具体，角色与材料攻略不够深入。 |
| E09 | Synthesis Value | Pass | 官方条件、用户问题和不同地区入口有可用整合。 |
| E10 | Forward Insights | N/A | 不对未发布版本或未确认机制给无依据预测。 |

本维度可评价项目：7/10；编辑判断得分：57.1/100。

### Exp — 游戏经验与实证

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| Exp01 | First-Person Narrative | N/A | 资料汇编不需虚构第一人称游玩。 |
| Exp02 | Sensory Details | N/A | 不评价代入式游戏体验写作。 |
| Exp03 | Process Documentation | Partial | 保留原始资料与编辑记录；缺完整实机流程。 |
| Exp04 | Tangible Proof | Partial | 有官方截图和玩家原帖，缺本站完整实机证据。 |
| Exp05 | Usage Duration | N/A | 未声明游戏实测时长。 |
| Exp06 | Problems Encountered | Partial | 玩家问题有归因；非本站亲测。 |
| Exp07 | Before/After Comparison | Fail | 没有统一条件下的游戏效果前后对照。 |
| Exp08 | Quantified Metrics | Partial | 官方数值有来源，非本站采集。 |
| Exp09 | Repeated Testing | Fail | 没有多轮游戏内机制测试。 |
| Exp10 | Limitations Acknowledged | Pass | 未把网页阅读与部署测试当作游戏实测。 |

本维度可评价项目：7/10；编辑判断得分：42.9/100。

### Ept — 专业性与编辑

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| Ept01 | Author Identity | Pass | 标明Promilia Guide及独立开发者非官方身份。 |
| Ept02 | Credentials Display | N/A | 没有可核实专业资历，未编造。 |
| Ept03 | Professional Vocabulary | Partial | 三语术语统一和地区原名保留；没有独立母语审校。 |
| Ept04 | Technical Depth | Partial | 安装、配置、概率规则较细；完整战斗养成不足。 |
| Ept05 | Methodology Rigor | Pass | 来源、事实、文章发布检查与本轮表达检查分开。 |
| Ept06 | Edge Case Awareness | Pass | 渠道账号、不可逆删号、不同邮箱奖励有明确条件。 |
| Ept07 | Historical Context | Pass | 旧测试、历史预下载与正式服区分。 |
| Ept08 | Reasoning Transparency | Pass | 建议说明原因，未确认机制不升格为事实。 |
| Ept09 | Cross-domain Integration | Partial | 配置、账号与奖励串联合理；无硬件实测研究。 |
| Ept10 | Editorial Process | Pass | 保留政策与源码审核历史，公开更新只展示读者变化。 |

本维度可评价项目：9/10；编辑判断得分：83.3/100。

### A — 外部权威

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| A01 | Backlink Profile | N/A | 本轮未取得外链数据。 |
| A02 | Media Mentions | N/A | 无可评价的媒体引用资料。 |
| A03 | Industry Awards | N/A | 无可验证奖项资料。 |
| A04 | Publishing Record | Partial | 源码与公开更新有持续发布记录，尚是新站。 |
| A05 | Brand Recognition | N/A | 未取得品牌认知研究。 |
| A06 | Social Proof | N/A | 无可验证用户评价数据。 |
| A07 | Knowledge Graph Presence | N/A | 未检查知识图谱。 |
| A08 | Entity Consistency | Pass | 组织名、域名与非官方说明一致。 |
| A09 | Partnership Signals | N/A | 未宣称官方合作。 |
| A10 | Community Standing | N/A | 未取得可评价的社区声誉数据。 |

数据不足，不计算本维度分数，不计入站点总分。

### T — 信任与可用性

| ID | 检查项 | 结果 | 依据或局限 |
| --- | --- | --- | --- |
| T01 | Legal Compliance | Partial | 有非官方与素材说明；不对全部素材法律授权作结论。 |
| T02 | Contact Transparency | Pass | 纠错表单明确不发送，并提供可访问的GitHub入口。 |
| T03 | Security Standards | Pass | 现有构建及线上验收检查HTTPS、安全头和永久跳转。 |
| T04 | Disclosure Statements | Pass | 清楚说明非官方、辅助编辑与未实测范围。 |
| T05 | Editorial Policy | Pass | 编辑规范单独可读。 |
| T06 | Correction & Update Policy | Pass | 真实日期与读者更新记录，原始历史仍在源码。 |
| T07 | Ad Experience | Pass | 没有广告或订阅弹窗打断攻略阅读。 |
| T08 | Risk Disclaimers | Pass | 删号与账号奖励条件就近说明，减少无关重复。 |
| T09 | Review Authenticity | N/A | 没有给游戏虚构体验评分或母语审校背书。 |
| T10 | Customer Support | Partial | 能向站点报告纠错，游戏账号问题仍由区域官方处理。 |

本维度可评价项目：9/10；编辑判断得分：88.9/100。

## 后续仍需补齐的内容（按玩家价值）

1. **角色培养与开局选择**：逐角色技能、队伍适用场景、养成投入与首抽建议，需要完整地区数据与可复核案例。当前官网介绍不能替代这一层。
2. **奇波捕获与孵化**：具体位置、条件、卡片效果、常见失败原因；现有页面只是消耗判断与地区奖励条件，不是完整捕获图鉴。
3. **主线卡点与功能解锁**：准确任务名、解锁条件、游戏截图；不可用韩国或繁中帖子直接填日服等级。
4. **家园岗位和食物配置**：明确的工作适性、配方与产出数据，避免反复泛泛“先看提示”。
5. **移动阅读继续精简**：福利页可按玩家想领的奖励进一步拆分，但要有足够独立答案，避免新增薄内容页面。英文未覆盖的7个主题按英语玩家需求逐项开发，不复制空壳译文。

本轮没有借本地化名义补造上述机制，也没有将索引提交、测试通过或部署成功表述为排名与点击率提升。

## 验证与发布

实际命令、浏览器检查、部署提交与线上结果在完成后补于本节。原始日志与截图保存于忽略目录 `artifacts/player-language-2026-11-28/`。

已完成的本地验证：

- `npm run verify:release`：72/72单元测试、120/120桌面与手机浏览器检查、预览/生产构建通过。后续对首页与目录提示、实体页标题作少量收尾调整，再检查相关浏览器场景和生产构建。
- `npm run check`：0 errors、0 warnings；保留原有剪贴板兼容API弃用提示。
- 生产产物92个HTML，构建检查内链、锚点、canonical、hreflang、JSON-LD、站点地图、Pagefind与草稿隔离。
- 新增 `audit:copy`：84个玩家页面（简中35、日文35、英文14），含41篇正式攻略；规则未命中。已加入本地发布验证及CI。
- 额外浏览检查100/100：三语桌面/手机的正文和来源展开、84页320px无文档横向溢出、引用自动展开来源、禁用JavaScript的引用跳转及运行时错误。
- 已查看三语代表页面截图；截图与JSON记录位于 `artifacts/player-language-2026-11-28/`。截图检查不能代替真实设备或游戏实测。
- 部署沿用既有GitHub→Cloudflare Pages流程；合并后的生产版本与实际验证结果以对应Actions及本地 `production-*.json` 为准，不拿旧站200响应作为上线凭据。

最终收尾验证：62/62相关桌面与手机场景通过；最终类型检查、预览构建、生产构建与84页表达检查全部通过。
