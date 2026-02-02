# Discovery Chain

> Discover Discogs URL for a track via MusicBrainz.

**Requires:** 03-title-parsing, 07-discogs, 08-musicbrainz

## Requirements

- Create `src/discover.ts`
- `discoverDiscogsUrl(title: string)` → `Promise<DiscoverResult>`

### Return Type

```typescript
interface DiscoverResult {
  url: string | null                // The Discogs URL, or null if not found
  payload: {
    searchedTitle: string           // Original title that was searched
    parsedTitle?: ParsedTitle       // Result from parseTitle()
    releaseGroup?: MBReleaseGroup   // Raw MusicBrainz release group response (minimal transform)
  }
}
```

**Payload principle:** Return raw API responses with minimal transformation. Don't cherry-pick fields - pass through the MusicBrainz data as-is so callers have full context for debugging.

## Data Flow

```
title → parseTitle() → { artist, title }
      → search recordings via musicbrainz.search(title)
      → for each recording: fetchRecording() to get releases with metadata
      → score releases by: artist match, primarytype, secondarytypes, date
      → for top candidates: fetchRelease() with url-rels
      → find discogs.com URL → return highest-scoring result
```

## MusicBrainz Search Strategy

Uses Recording search (via `musicbrainz.search()`) which tries queries in order:
1. `artist:"X" AND recording:"Y"` (exact)
2. `artist:X AND recording:Y` (fuzzy)
3. `recording:"Y"` (title only, exact)
4. `recording:Y` (title only, fuzzy)

Then fetches each recording with `inc=releases+release-groups+artist-credits` to get release metadata for scoring.

### Scoring

Score releases to prioritize originals over compilations:

**Bonuses:**
- Artist name matches expected: +100
- Single or EP: +40
- Album: +30
- Earlier release date: up to +50 (older = better)
- Discogs master URL: +10

**Penalties:**
- "Various Artists": -200
- Compilation: -100
- DJ-mix: -80
- Remix: -50

## Implementation Notes

- Return `{ url: null, payload: {...} }` if no Discogs URL is found
- Throw `ProviderError` on network/API errors
- MusicBrainz rate limiting is handled by the provider
- Fetches only top candidates (positive scores, or top 5 if none)

## Out of Scope

- Caching
- Multiple Discogs URLs
- User-facing confidence scoring
