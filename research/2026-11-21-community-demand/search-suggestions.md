# 搜索联想词完整整理

采集日期：2026-11-21。公开接口 + 可见浏览器补采，均无强制IP地理定位。语言参数只代表请求偏好；Google三种输入共用中文界面，不是三个国家独立抽样。Yahoo以带尾随空格的日语种子触发联想。

**6个引擎，103条原始联想出现记录；排除2条噪声后101条，保守去重为77个词面。**不合并内部空格、错拼和同义词，因此77不是77个独立需求。Google PAA 4条、Yahoo AI提示3条、相关搜索10条另存，不计入联想数量。

搜索量和关键词难度未获取，结构化字段为null；联想次序不等于搜索量排序。词面中的PS5、Steam、角色名、全球服等均不是游戏事实确认。

## 引擎覆盖

| 引擎 | 采集输入/偏好 | 联想出现记录 | 方法与状态 |
|---|---|---:|---|
| google | en, ja, zh | 30 | 接口3次超时；改为搜索框可见联想，含2条排除噪声 |
| bing | en, ja, zh | 36 | osjson接口，三个market参数 |
| baidu | zh | 10 | 公开JSONP接口，GB18030解码 |
| sogou | zh | 10 | QQ域移动联想接口；保存原始响应，修正JSONP解析 |
| 360 | zh | 10 | 公开接口，提取word字段 |
| yahoo-japan | ja | 7 | 接口超时；Yahoo日本页面可见联想 |
| DuckDuckGo | zh/ja/en种子 | 未取得 | 三次接口超时，不作无需求推断 |

## 按需求簇整理

每个词后的“引擎#序号”保留原始出现位置；完整观察ID、语言与原始词面在 [keywords.json](keywords.json)。目标中的`{locale}`只指本站现有简中/日语对应页；英文词用于研究，不自动创建英文页。

### 发行日期与开放状态

现有承接页：`/{locale}/guides/launch/`。15个去重词面。

- `蓝色星原什么时候公测` — bing#8(A02)
- `蓝色星原旅谣什么时候上线` — bing#11(A02)
- `アズールプロミリア リリース日` — bing#2(A05)
- `アズールプロミリア いつ` — bing#3(A05)
- `azur promilia release date` — bing#2(A08)、google#6(U01)
- `蓝色星原官网什么时候出` — 360#6(A12)
- `蓝色星原什么时候上线` — 360#8(A12)、google#3(U02)
- `蓝色星原什么时候内测` — 360#10(A12)
- `蓝色星原公测时间` — google#4(U02)
- `蓝色星原旅谣什么时候出` — google#7(U02)
- `蓝色星原上线时间` — google#8(U02)
- `アズールプロミリアいつ` — google#3(U03)
- `アズールプロミリアリリース日` — google#4(U03)
- `アズールプロミリア 正式` — google#7(U03)
- `アズールプロミリア リリース` — yahoo-japan#7(U04)

### 地区与全球发行

现有承接页：`/{locale}/guides/global-release/`。7个去重词面。

- `azur promilia sea` — bing#5(A08)
- `azur promilia jp` — bing#6(A08)
- `azur promilia global` — bing#7(A08)
- `azur promilia sea server` — google#5(U01)
- `azur promilia sea release date` — google#10(U01)
- `蓝色星原有国际服吗` — google#5(U02)
- `蓝色星原旅谣国际服` — google#6(U02)

### 官网、下载与预约

现有承接页：`/{locale}/guides/download/`。13个去重词面。

- `蓝色星原官网` — bing#2(A02)、baidu#5(A10)、sogou#1(A11)、360#2(A12)、google#9(U02)
- `蓝色星原旅谣下载` — bing#7(A02)、baidu#6(A10)、sogou#7(A11)
- `蓝色星原官网下载` — bing#9(A02)
- `アズールプロミリア 事前登録` — bing#8(A05)
- `azur promilia download` — bing#3(A08)
- `蓝色星原旅遥官网` — baidu#3(A10)、sogou#4(A11)
- `蓝色星原:旅谣官网` — baidu#4(A10)、sogou#2(A11)、360#3(A12)
- `蓝色星原官网入口` — sogou#8(A11)
- `蓝色星原旅谣官网` — 360#4(A12)
- `azur promilia official website` — google#4(U01)
- `アズールプロミリア公式` — google#8(U03)
- `アズールプロミリア事前登録` — google#9(U03)
- `アズールプロミリア 公式` — yahoo-japan#2(U04)

### 平台支持与互通

现有承接页：`/{locale}/guides/platforms/`。7个去重词面。

- `アズールプロミリア pc` — bing#4(A05)、yahoo-japan#4(U04)
- `アズールプロミリア ps5` — bing#6(A05)、google#6(U03)、yahoo-japan#1(U04)
- `アズールプロミリア プラットフォーム` — bing#12(A05)
- `azur promilia download pc` — bing#8(A08)
- `azur promilia pc` — google#2(U01)
- `azur promilia ps5` — google#7(U01)
- `azur promilia steam` — google#9(U01)

### 设备配置

现有承接页：`/{locale}/guides/requirements/`。2个去重词面。

- `アズールプロミリア スペック` — bing#7(A05)、yahoo-japan#3(U04)
- `azur promilia spec requirements` — bing#13(A08)

### 角色、声优与人物资料

现有承接页：`/{locale}/characters/`。6个去重词面。

- `アズールプロミリア キャラ` — bing#9(A05)、yahoo-japan#5(U04)
- `アズールプロミリア 声優` — bing#10(A05)
- `azur promilia characters` — bing#9(A08)、google#1(U01)
- `蓝色星原米砂` — baidu#7(A10)
- `蓝色星原美图` — baidu#8(A10)
- `アズールプロミリアキャラ` — google#10(U03)

### 抽卡规则与付费

现有承接页：`/{locale}/guides/banner-rules/`。1个去重词面。

- `アズールプロミリア ガチャ` — yahoo-japan#6(U04)

### 社区与Wiki导航

现有承接页：`/{locale}/guides/getting-started/`。5个去重词面。

- `蓝色星原wiki` — bing#3(A02)、sogou#10(A11)、360#5(A12)
- `蓝色星原旅谣吧` — bing#6(A02)
- `azur promilia reddit` — bing#4(A08)
- `azur promilia wiki` — bing#10(A08)
- `蓝色星原 nga` — google#10(U02)

### 游戏身份、厂商与类型

现有承接页：`/{locale}/guides/getting-started/`。13个去重词面。

- `蓝色星原旅谣` — bing#1(A02)、360#1(A12)
- `アズールプロミリア` — bing#1(A05)
- `azur promilia` — bing#1(A08)
- `azur promilia storyline` — bing#12(A08)
- `蓝色星原` — baidu#1(A10)、google#1(U02)
- `蓝色星原:旅谣` — baidu#2(A10)、sogou#6(A11)
- `蓝色星原旅遥` — baidu#9(A10)、sogou#3(A11)
- `蓝色星原旅遥官方` — sogou#5(A11)
- `蓝色星原是哪个公司的` — 360#7(A12)
- `蓝色星原是什么游戏` — 360#9(A12)
- `azur promilia publisher` — google#3(U01)
- `azur promilia developer` — google#8(U01)
- `蓝色星原 旅谣` — google#2(U02)

### 网页活动与奖励

现有承接页：`/{locale}/guides/resources/`。1个去重词面。

- `蓝色星原网页活动` — baidu#10(A10)、sogou#9(A11)

### 历史测试与资格

现有承接页：`/{locale}/guides/download/`。5个去重词面。

- `蓝色星原旅谣测试资格` — bing#4(A02)
- `蓝色星原官网内测资格` — bing#5(A02)
- `蓝色星原测试` — bing#10(A02)
- `アズールプロミリア ベータテスト` — bing#5(A05)
- `アズールプロミリア cbt` — bing#11(A05)

### 资讯与舆情

现有承接页：`/{locale}/guides/global-release/`。2个去重词面。

- `azur promilia news` — bing#11(A08)
- `アズールプロミリア炎上` — google#5(U03)

## 排除及辅助观察

- U03第1条 `アズールプロミリア」`：异常闭合标点；第2条 `アズールプロミリア itu`：混合语言噪声。保留原始记录，不进入有效词库。
- U05 Google PAA：是否已发行、是否与Azur Lane有关、是否全球发行、是否抽卡游戏。
- U06 Yahoo AI提问：发行日、角色、官网。
- U07 Yahoo相关搜索：PS5、PC、速報、ガチャ、iOS、課金、まとめ、リリース、リリィ、5ch。
- 中文错写“旅遥”“米砂”等只作别名/编辑核对线索；没有官方名称证据时不改实体字段或生成错拼页面。

## 可复核文件

- [公开接口观察与请求状态](search-suggestions.json)，含UTC采集时间与响应路径。
- [浏览器观察转写](browser-suggestions.json)，只精确到日期；不是完整网页存档。
- [原始接口响应目录](raw/)。搜狗最初解析失败已从原响应修复；Google/Yahoo失败请求仍保留，补采观察另记。
- [结构化词库](keywords.json)：每次出现、排除理由、来源、排名、意图、目标和空值指标。
