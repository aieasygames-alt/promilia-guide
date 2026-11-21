# 全量内容发布：2026-11-21

用户已在本会话确认全部待审内容审核通过，并授权发布和上线验证。[approval.json](approval.json)保留原始授权、18篇当前修订、译文版本、事实引用与文件SHA-256。另8篇既有审核保持原状。

发布范围为26篇中日文文章和现有功能，包括此前三轮内容扩充。待核验实体、完整卡池数值、客户端真实开放与实机路线没有因内容审核而变为已核实事实。

流程：固定Node22.23.4完整本地验收→分支CI和Pages预览→PR合并→Pages生产→主域名同SHA技术与内容边界验证。生产结果见plans/DEPLOYMENT-LOG.md和本批PR，原始线上报告保存在artifacts/content-release-2026-11-21/。

实际结果：功能发布通过[PR #3](https://github.com/aieasygames-alt/promilia-guide/pull/3)合并，生产SHA为`6b165078973eb38ec3c5b07a980f5582fb3ade92`。[main CI及自动生产验证](https://github.com/aieasygames-alt/promilia-guide/actions/runs/44901140973)成功，独立正式域名检查82/82、内容与索引边界107/107通过。[verification.json](verification.json)记录部署ID、验证时间与数量；[verify-live.mjs](verify-live.mjs)可在仓库根目录用Node22.23.4和完整SHA复跑内容边界验收。

线上浏览器实测：中文福利→家园入口→日语切换正常，桌面排版正常；日本站搜索「キボ」返回12条结果，新奇波指南位列首项，家园与首日指南均出现。实际搜索结果数量按当前词与索引记录，不是文章总数。
