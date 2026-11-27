# Webmaster priorities implemented — 2026-11-27

The project owner requested implementation in the recommended order and has authorized production deployment and verification in this conversation. This is publication authorization, not an independent language review or a game installation/play test.

## Decision basis

The five November 27 CSV exports contain daily observations from November 20 through November 25. All 3,794 clicks occur on November 25. They do not measure the November 26 launch or November 27 image changes. The exports do not identify the search engine, provide query-by-page mappings, or cross-tabulate country and language.

- The Chinese `global-release` URL accounts for 3,574 clicks, 94.2% of the total. Preserve the URL and strengthen its existing regional-entry intent.
- Japan/international-edition query groups account for 3,056 exported query clicks. The generic official-site query has 63,469 impressions but only 141 clicks; keep clear fan-site identification and useful direct official links.
- Desktop accounts for 3,240 clicks (85.4%). Make PC download stages, the actual installation drive and account checks easy to find.
- The two exported English pages have 34 clicks. Improve the existing English core routes selectively; these data do not justify assuming all US users want English or mass-producing new translations.

Country rank values of zero are unavailable data, and `ww` is an unspecified group. Query and page exports omit some clicks; subgroup shares must state their denominator.

## Implemented order

1. Add a compact, server-rendered regional gateway before the Chinese, Japanese and English release-guide prose. Use verified source-ledger URLs for Japan, China and Traditional Chinese official sites, with Japan Windows and device-specific guide links. Preserve region/device selections through the existing bilingual download filter. Browser verification uncovered that the three-language selector lost these selections; it now preserves them for Chinese/Japanese filter pages, while English keeps its valid prose-based destination. English gateway links target actual installation sections. All official links and source records remain available without JavaScript.
2. Update the three download and three requirements articles. Prioritize official routes, account/drive preparation and launcher → client → extra resources → login completion checks. Move individual player reports into troubleshooting. Put hardware tables ahead of secondary cloud/performance discussion. Replace outdated instructions to wait for the scheduled opening with current-notice checks.
3. Connect the regional-entry and beginner guides to existing rewards, banner rules, character/Kibo catalogs, support and localized farming/system explanations. Distinguish published identities from tested builds, capture routes or unlock chains.
4. Update the existing English release, download, requirements and beginner pages with corresponding paths. Correct the stale English statement that Japan's banner guarantees were unverified, linking the already published regional banner evidence. Label non-English farming references by language and retain the lack of a tested English route.

Twelve existing article editions are updated. No new indexed article or competing Japan/international URL is introduced. All four source revisions and their existing translations advance together. The public total remains 41 articles; pending entity details retain their existing noindex/search/sitemap safeguards.

## Evidence boundaries

This refresh reorganizes and connects the already checked sources listed on the articles. It does not introduce a new official-source retrieval date. November 26 service-start notices were checked on November 27 in `research/2026-11-27-post-launch/README.md`; FAQ, homepage, store and download observations retain their own November 14–24 dates in the source ledger.

The Japan client's Chinese-language support, worldwide English service, per-account store eligibility, successful installer acquisition, game login, exact unlock quests, capture coordinates, complete build rankings and timed farming routes remain unverified here. A Traditional Chinese official link is not a complete operating-region list. User-reported resource loops and frame drops remain attributed individual reports, not universal bugs or confirmed fixes.

## Verification

Content validation checks sources, claims, all translation revision pairs and publication readiness. Browser coverage exercises regional/device paths, language-switch persistence, English section destinations, no-JavaScript official links and source anchors, published downstream destinations and narrow mobile overflow. Standard type, unit, preview/release build and existing browser checks remain required. Deployment evidence and measured results are stored locally under `artifacts/webmaster-priority-2026-11-27/`; source exports stay untouched and out of Git.

Local result: 41/41 articles publishable; Astro check has zero errors/warnings (one existing deprecated clipboard API hint); 71/71 unit tests and 118/118 desktop/mobile browser cases pass. Preview and production builds pass their internal-link, anchor, canonical, hreflang, image, sitemap and publication-isolation checks; the production build has 92 HTML files and 58 search-indexed pages. Desktop and mobile gateway screenshots were inspected. Hosted deployment and IndexNow results are recorded separately after publication.

Post-change CTR and ranking impact require later Webmaster data. IndexNow acceptance and successful deployment do not establish indexing or traffic gains.
