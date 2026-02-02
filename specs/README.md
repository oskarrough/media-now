# Specs

## Dependency Graph

```
00-project-setup
       │
       ├───────────┬───────────┐
       ↓           ↓           ↓
  01-types    02-url-parsing  03-title-parsing
       │                       │
       └──────────┬────────────┘
                  │
    ┌─────┬─────┬─┴───┬─────────┬────────┐
    ↓     ↓     ↓     ↓         ↓        ↓
   04    05    06    07        08       09
youtube vimeo spotify discogs musicbrainz soundcloud
    │     │     │     │         │        │
    └─────┴─────┴─────┴────┬────┴────────┘
                           ↓
                 10-discovery-chain
                           ↓
                    11-entry-point
                           ↓
                    12-demo-page
```

## Implementation Order

1. [00-project-setup](./00-project-setup.md) - Foundation
2. [01-types](./01-types.md) ← (parallel)
3. [02-url-parsing](./02-url-parsing.md) ← (parallel)
4. [03-title-parsing](./03-title-parsing.md) ← (parallel)
5. [04-youtube](./04-youtube.md) ← (parallel, requires: 01)
6. [05-vimeo](./05-vimeo.md) ← (parallel, requires: 01)
7. [06-spotify](./06-spotify.md) ← (parallel, requires: 01)
8. [07-discogs](./07-discogs.md) ← (parallel, requires: 01)
9. [08-musicbrainz](./08-musicbrainz.md) ← (parallel, requires: 01, 03)
10. [09-soundcloud](./09-soundcloud.md) ← (parallel, requires: 01)
11. [10-discovery-chain](./10-discovery-chain.md) ← requires: 03, 07, 08
12. [11-entry-point](./11-entry-point.md) ← requires: all providers
13. [12-demo-page](./12-demo-page.md) ← requires: 11

## Parallel Work

After `00-project-setup`, coders can work on:
- **Wave 1:** 01, 02, 03 (types, url-parsing, title-parsing)
- **Wave 2:** 04-09 (all providers) — 08 requires 03
- **Wave 3:** 10 (discovery-chain)
- **Wave 4:** 11 (entry-point)
- **Wave 5:** 12 (demo-page)

## How to Use This Directory

- Each spec file defines WHAT to build (requirements)
- **No checkboxes** — specs are requirements, not progress trackers
- Coders track progress in PROGRESS.md (not here)
- Questions from coders go in QUESTIONS.md at project root
