# Discovery Chain

> Discover Discogs URL for a track via MusicBrainz.

**Requires:** 03-title-parsing, 07-discogs, 08-musicbrainz

## Requirements

- [ ] Create `src/discover.ts`
- [ ] `discoverDiscogsUrl(title: string)` → `Promise<string | null>`

## Data Flow

```
title → parseTitle() → musicbrainz.search()
      → recording → getRecording() → releases[]
      → for each release: getRelease() → url-rels
      → find discogs.com URL → return first match (or null)
```

## Implementation Notes

- Stop searching once a Discogs URL is found
- Return `null` if no Discogs URL is found after exhausting all releases
- Throw `ProviderError` on network/API errors (don't silently swallow)
- MusicBrainz rate limiting is handled by the provider

## Out of Scope

- Caching
- Multiple Discogs URLs
- Confidence scoring
