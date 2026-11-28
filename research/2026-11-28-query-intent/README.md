# 2026-11-28 query-intent update

## Demand and scope

The user supplied a last-24-hour Search Console screenshot. Ten visible queries total 317 impressions and 4 clicks (~1.26% CTR), including two English global-release variants (125 impressions), four requirements/size variants (84), Japanese Metsa (39), Mac (27), serial codes (23) and the generic English guide query (19). These are this site's impressions, not total search volume. Position and query-to-page data are absent; no causal CTR claim or attribution of the Metsa impressions to its noindex detail URL is made.

The user authorized the proposed order and retains standing production deployment / verification / IndexNow authorization. This batch improves existing URLs rather than creating overlapping requirements pages.

## Evidence

- Game8 original: https://game8.jp/azurpromilia/846242 — read in browser, then original HTML saved privately in `artifacts/query-intent-2026-11-28/game8.html` and extracted text in `game8.txt`. Page visibly states 2026.11.28 21:11 update. Japanese launch guide, not a CBT-only article. Checked 2026-11-28.
- Observed coverage: wood/wind support, normal attack third-stage healing seed, fourth-stage defense debuff, skill charge seed, charged-attack collection, ultimate healing/wood-wind support; example Xiaoyu/Maple/Metsa team; Anima 新生 and 木漏れ日の眼差し; middle/late equipment 旅路の錬磨 and 慈悲の光; third-party CV and permanent-gacha listing. Paraphrased and attributed; source images and complete skill tables are not republished. No independent gameplay test. Numeric strength percentages, gacha probabilities and optimality claims are intentionally not inferred.
- Japanese FAQ: https://azurpromilia.jp/contact — rechecked by public HTTP on 2026-11-28, HTTP 200; private HTML/text in the same artifact directory. It lists Windows / Android / iOS, same-account progress across these devices, at least 120GB PC / 55GB mobile free storage recommended, PC minimum i5-9400F / GTX1060 / 16GB, and tells players to read the additional-data size in-game. It supplies no native Mac or Japan cloud route. The existing registered FAQ source retains its original check date to avoid silently refreshing all dependent claim reviews; this file records the focused recheck.
- Metsa official URL: https://azurpromilia.jp/character/metsa — browser title still names Metsa, but current rendered body showed homepage content / character slider. Do not call this a new official performance verification. Retain the documented 2026-11-23 official biography evidence; new gameplay comes from the attributed launch guide.
- English target window: existing source `en-release-window-2026-10-13`, checked earlier 2026-11-28: https://x.com/AzurPromilia_EN/status/2109992558004998420 . Summer 2027 is a target subject to change, not a confirmed day or SEA schedule.
- Code: existing official original `jp-redeem-azpr1126-2026-11-26`, checked earlier 2026-11-28: https://x.com/AzurPromilia_JP/status/2125892182511083828 . AZPR1126; 設定→アカウント→引き換えコード; literal expiry 2027年11月26日(金)23:59. No actual redemption, item quantities or explicit timezone verified. No claim that all active codes have been found.
- Mainland cloud announcement: https://azurpromilia.manjuu.com/home/news/detail/912757675975118848/ — original source and existing verification retained. Public HTTP returned an app shell, which does not independently reverify the notice text. No Japan cloud, Mac native client or cross-region save transfer inferred.

## Implementation

- English release answer precedes regional cards and is included in the TOC. Query-aligned title and description; SEA remains separate.
- English requirements title includes System Requirements & Size, early hardware/storage answer, and a table separating initial package, additional data, installed size and recommended headroom. No invented total install/download measurement.
- Japanese Mac page starts with Japan support and a regional/account comparison. It preserves the China cloud guide on its existing URL.
- Japanese code page uses シリアルコード（交換コード） and prioritizes the official menu and literal expiry. Old unverified code strings are not restored.
- Metsa existing bilingual detail URLs gain five linked sections, four practical combat steps, team/Anima/equipment choices, citations and locale-specific metadata. Revision 3 is published under the user's instruction, not represented as independent language review or game testing. Japanese names are preserved in Chinese for unverified cross-region mappings. Both detail URLs become indexable only once their official and new gameplay source checks match the publication record.
- The entity publication gate now validates every optional gameplay source and includes these sources in impact lookup. Tests cover unavailable, missing, stale and empty-evidence references. Other draft entity details remain gated.

## Validation

See `artifacts/query-intent-2026-11-28/` for release, local/production reading, crawl, image and deployment evidence. Final results recorded after deployment.

## Visual QA follow-up

The local visual check found that the old `metsa.webp` was only a decorative diamond, despite being labelled official character artwork. Used the seo-images workflow to replace it with actual official art and responsive 400/800/1200 variants under new `metsa-official` URLs. Original official image: https://webusstatic.yo-star.com/azurpromilia-jp/azurpromilia-jp-official-2026/prod/azurpromiliajpofficial2026/assets/bg-runtime-CZJgdu2g.webp . The official homepage's `Home-BcVWAGyL.js` imports `character-Dgl2-lVw.js`, which explicitly maps id r4, englishName METSA and nameText メーツァ to this image and avatar-D8mr6duj.png. Original resources saved privately alongside the other artifacts and visually inspected. The record is hidden in the current official slider (`hidden:true`); it establishes artwork identity, not current availability. The 3840×2160 source is cropped to a 2160 square at x=1400,y=0 and resized/compressed with Sharp WebP quality 82. No generative alteration and no third-party guide image reuse. Old image URLs remain available for existing links; rendered cards, details and metadata use the new asset.

For the newly published character guide, mobile layout now places the core article before the supplementary source sidebar.

The new Metsa artwork is also registered as the page's representative image for Open Graph, Twitter and sitemap image entries, matching the image visibly rendered on both localized detail URLs. Large search-image previews remain permitted; actual search thumbnail display is the search engine's decision.
