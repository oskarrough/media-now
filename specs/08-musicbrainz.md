# MusicBrainz Provider

> Search MusicBrainz for recordings and fetch release data.

**Requires:** 01-types, 03-title-parsing

## Requirements

- [ ] Create `src/providers/musicbrainz.ts`
- [ ] `musicbrainz.search(title)` → `MusicBrainzResult[]` - search recordings
- [ ] `musicbrainz.getRecording(id)` → `MusicBrainzResult` - get recording with releases
- [ ] `musicbrainz.getRelease(id)` → release with URL relationships (for finding Discogs links)

## API Endpoints

- Search: `GET https://musicbrainz.org/ws/2/recording?query={query}&fmt=json&limit=5`
- Recording: `GET https://musicbrainz.org/ws/2/recording/{id}?inc=releases&fmt=json`
- Release: `GET https://musicbrainz.org/ws/2/release/{id}?inc=url-rels&fmt=json`

Headers: User-Agent required (with contact info, e.g., `media-now/1.0.0`)

## Search Strategy

Uses `parseTitle()` to extract artist/title, then tries queries in order:
1. `artist:"X" AND recording:"Y"` (exact)
2. `artist:X AND recording:Y` (fuzzy)
3. `recording:"Y"` (title only, exact)
4. `recording:Y` (title only, fuzzy)

## Error Handling

- Empty array for no search results
- `ProviderError` for rate limits (503), network errors

## Rate Limiting

MusicBrainz requires max 1 request per second. Implement a simple delay (1s between requests) within the provider itself. This keeps the API simple for callers.

## Out of Scope

- Artist lookup
- Cover art
