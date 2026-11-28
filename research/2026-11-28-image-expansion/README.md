# Supplied artwork expansion — 2026-11-28

The site owner supplied ten PNG images in this conversation and requested publication for image SEO. These are user-supplied artwork, not additional independently verified gameplay sources. Original game logos, visible copyright notices and the Japanese development disclaimer are retained. Embedded promotional text does not establish current event availability, eligibility, rewards or a regional release date.

## Assets and placement

All placements are available in Simplified Chinese, Japanese and English, with localized HTML alt text and captions.

| Supplied image (clipboard prefix) | Published asset in `/images/feature/` | Full dimensions | Placement |
| --- | --- | --- | --- |
| e74351ee | azur-promilia-horned-character-meadow.webp | 1280×720 | Character catalog representative image |
| e66e0666 | azur-promilia-tushan-xiaoyu-profile.webp | 640×360 | Character gallery; name transcribed from visible Chinese and Latin lettering |
| 8a3a8955 | azur-promilia-blue-haired-character-riverside.webp | 1280×720 | Character scene gallery; Manjuu/Yostar credit retained |
| 054a0a3b | azur-promilia-kibo-night-gathering.webp | 640×360 | Kibo catalogs and Kibo system guides |
| d1b83c36 | azur-promilia-elf-and-fairy.webp | 1600×838 | Character scene gallery |
| 5f619eef | azur-promilia-elf-portrait.webp | 415×739 | Character portrait gallery |
| 0508408f | azur-promilia-fox-eared-character-fireworks.webp | 466×658 | Character portrait gallery |
| a3918a77 | azur-promilia-moren-japanese-preview.webp | 405×720 | Character portrait gallery; visible モーレン label described without inventing an English or China name mapping |
| 76204433 | azur-promilia-winged-fairy-illustration.webp | 1600×900 | Character scene gallery; fairy is not classified as a Kibo species |
| 7fb94f31 | azur-promilia-japanese-kibo-challenge-visual.webp | 1200×675 | Launch guide supplementary artwork; caption directs readers to regional announcements for event conditions |

Unknown character names are left undesignated rather than inferred from appearance. The supplied portrait and landscape images do not alter character records, skills, rarity, acquisition information or the Kibo catalog count. The preceding roster and practical guide content remain above the supplementary galleries.

## Transformations

`assets.json` records original filenames, SHA-256 hashes, dimensions, byte counts, crop coordinates and every output asset. Original PNGs total **10,435,770 bytes**. The ten full-size WebP outputs total **848,920 bytes**, a **91.9% reduction**. Including responsive variants, 22 files total 1,259,720 bytes. No output is larger than its source dimensions.

Sharp WebP encoding uses quality 82 and effort 6. The Xiaoyu image has only the 60-pixel top and bottom black letterbox bars removed; its character name and logo remain inside the crop. The two 1920-pixel images are reduced to 1600 pixels; other full-size outputs retain their original dimensions. Wide images have 400/800-pixel variants where appropriate; 640-pixel artwork has a 400-pixel variant. The small portraits retain their native resolution.

## Search and rendering integration

- The shared visual registry supplies descriptive filenames, dimensions, localized alt/captions and responsive `srcset` entries.
- Character catalogs use the visible 1280-pixel meadow image for Open Graph, Twitter and the primary ImageObject. The previous ensemble image remains visible in the scene gallery.
- Article schema includes all displayed article artwork; page-specific image sitemap entries match images present in HTML.
- Existing indexable-page `max-image-preview:large` is retained. Preview and unpublished pages remain noindex.
- Only the representative image requests eager loading and high priority. Supplementary gallery and guide images load lazily with reserved intrinsic dimensions.

Google chooses whether to display a thumbnail or index an image. No image ranking, thumbnail appearance or CTR improvement is claimed from implementation alone. IndexNow notifies participating search engines about updated page URLs; it is not a Google indexing submission.

## Verification

Run the project release suite (`PLAYWRIGHT_PORT=4337 npm run verify:release`), including content/type checks, unit tests, browser checks in desktop and mobile profiles, production build validation and reader-copy audit. Artwork browser checks cover metadata/visible-image agreement, three-language alt/captions, cropping dimensions, credit retention, responsive loading and overflow across the affected catalogs and guides.

Additional local and production evidence is kept in ignored `artifacts/image-expansion-2026-11-28/`: a 320/1365-pixel image audit, screenshot checks, sitemap/asset response verification, the deployed commit check and IndexNow response log. Source article dates are not refreshed for illustration-only changes.
