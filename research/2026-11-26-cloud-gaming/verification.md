# Cloud guide delivery and validation — 2026-11-26

Delivered the three-language cloud guide based on the new mainland China official announcement, eight revisions to download/requirements/platform articles, three FAQ answers per language, three localized record sheets and discovery links. Chinese/Japanese now have 16 published topics each; English has 8. The published guide total is 40; FAQ totals are 29/29/15. The full topic inventory includes 16 topics; the eight remaining English topics are reported explicitly by the coverage script.

The article metadata, intro and FAQs scope the service to mainland China. A macOS cloud browser route is kept separate from a native Mac client or Japan service. Exact app sizes, queue deductions, latency, account compatibility and detailed billing terms are not invented. Original Chinese product names are retained in Japanese/English tables. The guide's cap example is labelled as arithmetic.

Validation evidence is in ignored `artifacts/content-next-2026-11-26/`:

- Content: 40/40 publishable articles, matching translation revisions, source/claim dependencies and valid routes.
- Astro: zero errors/warnings, one existing deprecated clipboard API hint.
- Unit tests: 71 passed, including withdrawal of cloud FAQs when the official source is removed.
- Preview: 94 HTML pages; internal links, anchors, alternates, search and indexing checks passed.
- Browser acceptance: 84 cases passed in the full run; the two additional cloud cases initially failed because a test asserted a paraphrase rather than the actual English sentence. Corrected the assertion and reran all four cloud desktop/mobile cases successfully, completing 86 distinct cases. No application change was needed for that assertion correction.
- Production build: 90 HTML pages, 56 searchable pages across three languages; internal links, anchors, canonical, reciprocal hreflang, Sitemap, JSON-LD and draft isolation passed. A final Japanese title adjustment preserves the same content and is included in the final production build.
- Browser tests use port 4396 to leave an existing service on 4321 intact.

CI, exact production commit, hosted verification and IndexNow results are recorded separately in ignored release artifacts after deployment. A local build alone is not evidence of deployment or indexing.
