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
    ┌─────┬─────┬─┴───┬─────────┐
    ↓     ↓     ↓     ↓         ↓
   04    05    06    07        08
youtube vimeo spotify discogs musicbrainz
    │     │     │     │         │
    └─────┴─────┴─────┴────┬────┘
                           ↓
                 09-discovery-chain
                           ↓
                    10-entry-point
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
10. [09-discovery-chain](./09-discovery-chain.md) ← requires: 03, 07, 08
11. [10-entry-point](./10-entry-point.md) ← requires: all above

## Parallel Work

After `00-project-setup`, coders can work on:
- **Wave 1:** 01, 02, 03 (types, url-parsing, title-parsing)
- **Wave 2:** 04, 05, 06, 07 (youtube, vimeo, spotify, discogs) + 08 if 03 is done
- **Wave 3:** 09 (discovery-chain)
- **Wave 4:** 10 (entry-point)

## How to Use This Directory

- Each spec file defines WHAT to build
- Checkboxes represent individual commits
- Coders track progress in PROGRESS.md (not here)
- Questions from coders go in QUESTIONS.md at project root
