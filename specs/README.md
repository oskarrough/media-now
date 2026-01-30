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

## Parallel Work

After `00-project-setup`, coders can work on:
- **Wave 1:** 01, 02, 03 (types, url-parsing, title-parsing)
- **Wave 2:** 04, 05, 06, 07, 11 (youtube, vimeo, spotify, discogs, soundcloud) + 08 if 03 is done
- **Wave 3:** 09 (discovery-chain)
- **Wave 4:** 10 (entry-point)

## How to Use This Directory

- Each spec file defines WHAT to build
- Checkboxes represent individual commits
- Coders track progress in PROGRESS.md (not here)
- Questions from coders go in QUESTIONS.md at project root

## Standards (applies to ALL specs)

### Test Coverage

**100% test coverage required** for all source files with runtime logic.

#### What to test:
- **Pure functions** (parse-url, parse-title, etc.) - Direct unit tests
- **Provider modules** (youtube, vimeo, spotify, etc.) - Unit tests with mocked `fetch`
- **Entry points** (get-media, discover) - Unit tests with mocked `fetch`

#### Exempt from coverage:
- **Type-only files** (`types.ts`, `errors.ts`) - No runtime logic to test

#### Testing network code:
Mock `fetch` at the module level. Test:
- Successful responses (happy path)
- Error responses (4xx, 5xx)
- Malformed/unexpected response shapes
- Network failures

Verify before completing any spec:
```sh
bun test --coverage
```
