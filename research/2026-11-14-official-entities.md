# 官方角色与奇波资料核对

核对日期：2026-11-14（北京时间）。本记录只保存官方页面公开的名称、分类、所属/相关地区和简短介绍，不推断技能、数值、养成材料、强度或获取地点。

## 中国大陆官网

- 页面：[国服官网首页](https://azurpromilia.manjuu.com/home/)
- 核对方式：读取首页前端页面与静态脚本中的角色、奇波展示区块。
- 角色展示：艾妮丝（Anais）、姬瑟贝露（Cathbelle）、西夫未瑟（Symphoria）、忒拉拉（Terara）。
- 奇波展示：星鳐（STARAY）、绒心布里尼（DOWNYBRINNY）、菜鸡（CABBIRD）、布鲁达（BLUDA）、怯影之翼（VESPERVAMP）。
- 奇波分类与简介按官网脚本中的 `typeName`、`desc` 记录；角色的英文标识和所属标签按官网角色图卡记录。

## 日本官网

- 角色列表：[https://azurpromilia.jp/character](https://azurpromilia.jp/character)
- 奇波列表：[https://azurpromilia.jp/kibo](https://azurpromilia.jp/kibo)
- 角色详细页：
  - [アニス（Anais）](https://azurpromilia.jp/character/anais)：カルノン療養院、所属/ゆかりの地はフリス。
  - [キャスベル（Cathbelle）](https://azurpromilia.jp/character/cathbelle)：領主の命により仕える人物、所属/ゆかりの地はフリス。
  - [シンフォーリア（Symphoria）](https://azurpromilia.jp/character/symphoria)：训练有素的弓手，所属/ゆかりの地はローズランサ。
  - [テララ（Terara）](https://azurpromilia.jp/character/terara)：出生于シャルル村、村里最优秀的猎人。
- 奇波详细页：
  - [メテオール（STARAY）](https://azurpromilia.jp/kibo/staray)
  - [モフリーネ（DOWNYBRINNY）](https://azurpromilia.jp/kibo/downybrinny)
  - [キャバード（CABBIRD）](https://azurpromilia.jp/kibo/cabbird)
  - [ブルーダ（BLUDA）](https://azurpromilia.jp/kibo/bluda)
  - [ナイトフォール（VESPERVAMP）](https://azurpromilia.jp/kibo/vespervamp)
- 日本官网角色列表当前还列出メーツァ（Metsa）。本轮按用户指定的 4 个角色与中国大陆官网当前 4 个角色展示收录前四项，不把额外角色扩展进本轮数据。

## 编辑边界

官网页面没有在本轮核对中提供完整的角色技能倍率、养成材料、强度结论或奇波获取点位，因此站内目录只展示官方简介和分类，并明确链接原始页面。后续出现正式公告或可复核实测时，再按实体 ID 增量修订。

## 图片核对与本地化

- 日本官网角色列表与奇波列表引用的静态资源均可正常获取，9 个图片请求均返回 HTTP 200。
- 本站使用官方 CDN 的本地副本：4 张角色 JPEG 海报与 5 张奇波 PNG 透明素材，分别映射到对应实体 ID。
- 本轮未使用第三方图片；图片版权及使用权归官方权利方所有，卡片保留官方页面链接作为来源入口。
