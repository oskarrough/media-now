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
   04    05    06    07        08       11
youtube vimeo spotify discogs musicbrainz soundcloud
    │     │     │     │         │        │
    └─────┴─────┴─────┴────┬────┴────────┘
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
10. [11-soundcloud](./11-soundcloud.md) ← (parallel, requires: 01)
11. [09-discovery-chain](./09-discovery-chain.md) ← requires: 03, 07, 08
12. [10-entry-point](./10-entry-point.md) ← requires: all above
13. [12-provider-tests](./12-provider-tests.md) ← requires: all providers implemented
14. [13-provider-api-audit](./13-provider-api-audit.md) ← requires: 14
15. [14-rename-get-to-fetch](./14-rename-get-to-fetch.md) ← do this first (spec violation fix)
16. [15-demo-page](./15-demo-page.md) ← standalone, requires: 10

## Parallel Work

After `00-project-setup`, coders can work on:
- **Wave 1:** 01, 02, 03 (types, url-parsing, title-parsing)
- **Wave 2:** 04, 05, 06, 07, 11 (youtube, vimeo, spotify, discogs, soundcloud) + 08 if 03 is done
- **Wave 3:** 09 (discovery-chain)
- **Wave 4:** 10 (entry-point)

## How to Use This Directory

- Each spec file defines WHAT to build (requirements)
- **No checkboxes** — specs are requirements, not progress trackers
- Coders track progress in PROGRESS.md (not here)
- Questions from coders go in QUESTIONS.md at project root

## Standards (applies to ALL specs)

### Test Coverage

#### Unit tests (100% coverage):
- **Pure functions** (`parse-url.ts`, `parse-title.ts`) - Direct unit tests

#### Integration tests (manual, not in CI):
- **Provider modules** - Test against real APIs via `bun run test:integration`
- **Entry points** (`get-media.ts`, `discover.ts`) - Included in integration tests

#### Exempt from coverage:
- **Type-only files** (`types.ts`, `errors.ts`) - No runtime logic
- **Network code** (providers, get-media, discover) - Covered by integration tests

Verify pure function coverage:
```sh
bun test --coverage
```
