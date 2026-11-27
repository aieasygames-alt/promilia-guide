# Search image artwork — 2026-11-27

The owner supplied five PNG images in this conversation for site publication. They are recorded as user-supplied artwork, separately from source-verified character/Kibo records. No character, voice actor, regional release, acquisition route or event claim is added to the factual catalog based on these files.

| Artwork | Original | Published full size | Placement in zh-Hans / ja / en |
| --- | --- | --- | --- |
| Japanese-logo character ensemble | 480×360 | 480×270 | Character lists; only the 45px top and bottom black letterbox bars removed |
| Pink-haired character celebration | 640×488 | 640×488 | Character artwork gallery |
| Korean-logo holiday illustration | 1280×720 | 1280×720 | Home artwork section; copyright retained; caption distinguishes illustration from current event/release announcements |
| Rabbit-eared character and vegetable-like Kibo | 739×415 | 739×415 | Kibo lists and Chinese/Japanese Kibo system guides |
| Japanese ノノ / NONO profile | 640×480 | 640×480 | Character artwork gallery; image text described without establishing a China name mapping |

All five are encoded as WebP at original or smaller dimensions. The five full-size outputs total 351,280 bytes, compared with 3,418,596 bytes for the supplied PNGs (about 90% less). Smaller responsive variants are generated without upscaling. Original files and transformation report remain in ignored `artifacts/search-images-2026-11-27/`.

`src/lib/visuals.ts` connects visible artwork, localized alt/captions, dimensions and responsive variants. Page-specific representative images feed Open Graph, Twitter and ImageObject metadata. Related guide illustrations are included in Article structured data; the same image appears in the page HTML. Existing home landscape and launch visual are reused where relevant. Below-fold galleries are lazy-loaded, and only primary images request high priority.

Indexable pages permit `max-image-preview:large`. Preview and unreviewed pages retain noindex. The existing URL sitemap gains Google's image namespace and page-associated image locations, without adding unreviewed URLs or inventing lastmod dates. Google selects search result thumbnails independently; this work does not demonstrate thumbnail appearance, indexing or a CTR increase.

Validation includes existing editorial/unit checks, HTML build verification of metadata/visible-image/sitemap agreement and responsive asset existence, plus desktop/mobile browser checks of all three languages, actual image loading, localized captions, gallery priority and horizontal overflow. Deployment verification results are retained in the ignored artifact directory.
