# English launch essentials — 2026-11-25 (Asia/Shanghai)

The project owner requested implementation of the proposed English launch scope and deployment: “按照你上面的规划来补充内容，补充完成后执行部署到线上”. This records publication authorization for the current batch, not an independent English review or installation/gameplay test.

## Published scope

- `/en/`: English homepage and guide index, regional scope, editorial policy and correction route.
- `/en/guides/global-release/`: Japan/China date and time, UTC conversion, Traditional Chinese app identities and limits of global English evidence.
- `/en/guides/download/`: official regional distribution routes, Japan PC launcher sequence, additional resources, account boundaries and regional troubleshooting.
- `/en/guides/requirements/`: PC/Android/iOS tables, China-only HarmonyOS fields, recommended free storage versus store payload.
- `/en/search/`: English-only Pagefind results; noindex and excluded from Sitemap.

No English character, Kibo, system or FAQ catalog is generated. The homepage provides the guide index. The site-wide language menu uses exact article counterparts when published; otherwise it explicitly links to the language homepage without creating a false hreflang counterpart. Existing Chinese/Japanese direct switching remains available.

## Evidence and freshness

The English guides adapt the existing source-backed regional articles (Chinese source revisions: release 11, download 14, requirements 10). Shared claim revision pins and source status checks apply to English too. Original source dates and verification dates were retained; adding English source labels did not constitute rechecking the official sites.

The November 24 regional FAQs schedule China for November 26, 10:00 UTC+8 and Japan for 11:00 JST, both 02:00 UTC. These are schedules, not observed server availability. Mobile 55GB+ and PC 120GB+ are recommended free-space allowances, not measured total download or installed sizes. No global English release date, English-client support, universal store eligibility or cross-region progress is inferred.

## SEO and publication

- Explicit `en` language tag, English title/description, Article language and source labels.
- Reciprocal three-language article hreflang and self canonical; homepage language set includes English and root x-default.
- Four additional indexable Sitemap URLs; search remains crawlable to expose noindex.
- A separate English release plan requires all three substantive guides and their key claims. Missing/draft English articles or stale translations cannot pass the production release gate.
- The existing Cloudflare Pages Git production workflow is retained. No deployment infrastructure change.

## Validation

Full `verify:release` includes Astro check, unit tests, preview isolation, desktop/mobile browser cases and a fresh production build. New coverage includes actual article language switching, fallback links, English search, stored language preference, regional/storage statements and 320px/768px overflow checks. Dependency withdrawal and revision changes are tested against the English publication gate. Hosted verification is performed against the actual merged deployment commit; local checks do not establish deployed availability or search-engine indexing.

Private Google Search Console observations remain outside tracked research files. This batch does not claim search volume, rankings, index inclusion or game installation success.
