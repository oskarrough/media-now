# Provider API Audit

> Document and validate return types for all provider async methods

## Provider Method Reference

| Provider | Method | Return Type | Notes |
|----------|--------|-------------|-------|
| **youtube** | `fetch(id)` | `Promise<YouTubeResult>` | oEmbed API |
| **youtube** | `search(query)` | `Promise<SearchResult[]>` | youtubei API |
| **vimeo** | `fetch(id)` | `Promise<VimeoResult>` | oEmbed API |
| **spotify** | `fetch(id)` | `Promise<SpotifyResult>` | oEmbed API |
| **discogs** | `fetch(id)` | `Promise<DiscogsResult>` | Release API |
| **discogs** | `fetchMaster(id)` | `Promise<DiscogsResult>` | Master API |
| **musicbrainz** | `search(title)` | `Promise<MusicBrainzResult[]>` | Recording search |
| **musicbrainz** | `fetchRecording(id)` | `Promise<MusicBrainzResult>` | Recording lookup |
| **musicbrainz** | `fetchRelease(id)` | `Promise<MusicBrainzRelease>` | Release lookup (local type) |
| **soundcloud** | `fetch(id)` | `Promise<SoundCloudResult>` | oEmbed API |

## Payload Shapes

Currently `payload: unknown` in `MediaResult`. Document actual shapes:

### youtube.fetch → OEmbedResponse
```ts
{
  title: string
  author_name: string
  author_url: string
  thumbnail_url: string
  thumbnail_width: number
  thumbnail_height: number
  html: string           // embed iframe
  width: number
  height: number
  version: string
  provider_name: string
  provider_url: string
  type: string
}
```

### youtube.search → YouTubeiResponse (nested)
Complex nested structure — `payload` not included in SearchResult.

### vimeo.fetch → OEmbedResponse
```ts
{
  title: string
  author_name: string
  author_url: string
  thumbnail_url: string
  thumbnail_width: number
  thumbnail_height: number
  duration: number       // seconds
  html: string
  width: number
  height: number
  version: string
  provider_name: string
  provider_url: string
  type: string
  video_id: number
}
```

### spotify.fetch → OEmbedResponse
```ts
{
  title: string          // "Artist - Track" format
  thumbnail_url: string
  thumbnail_width: number
  thumbnail_height: number
  html: string
  width: number
  height: number
  version: string
  provider_name: string
  provider_url: string
  type: string
}
```

### discogs.fetch → DiscogsReleaseResponse
```ts
{
  id: number
  title: string
  year?: number
  genres?: string[]
  styles?: string[]
  artists?: { name: string }[]
  labels?: { name: string }[]
  uri: string
  // ... many more fields in full API response
}
```

### discogs.fetchMaster → DiscogsMasterResponse
```ts
{
  id: number
  title: string
  year?: number
  genres?: string[]
  styles?: string[]
  artists?: { name: string }[]
  uri: string
  // ... many more fields in full API response
}
```

### musicbrainz.search → MBRecordingSearchResult
```ts
{
  id: string             // UUID
  title: string
  "artist-credit"?: { name: string; artist: { id: string; name: string } }[]
  releases?: { id: string; title: string }[]
}
```

### musicbrainz.fetchRecording → MBRecordingResponse
```ts
{
  id: string
  title: string
  "artist-credit"?: { name: string; artist: { id: string; name: string } }[]
  releases?: { id: string; title: string }[]
}
```

### musicbrainz.fetchRelease → MBReleaseResponse
```ts
{
  id: string
  title: string
  relations?: { type: string; url?: { resource: string } }[]
}
```

### soundcloud.get → OEmbedResponse
```ts
{
  title: string
  author_name: string
  author_url: string
  thumbnail_url?: string
  description?: string
  html: string
  width: string | number
  height: string | number
  version: string
  provider_name: string
  provider_url: string
  type: string
}
```

## Issues to Address

### 1. MusicBrainzRelease not in types.ts

`MusicBrainzRelease` is defined locally in `musicbrainz.ts` but not exported from `types.ts`. This inconsistency should be fixed.

### 2. Payload typed as `unknown`

Consider exporting payload types so consumers can access raw API data with type safety. Options:
- Export each provider's response interface from types.ts
- Use generics: `MediaResult<TPayload = unknown>`
- Keep as `unknown` if payload is considered internal

## Validation Tasks

Run each provider method against real APIs and verify:
- [ ] Response shape matches TypeScript interface
- [ ] All required fields are present
- [ ] Optional fields behave as expected
- [ ] Error cases throw correct error types
- [ ] **Payload shapes match documented interfaces above**

### Per-Provider Validation

- [ ] **youtube.get** - Verify YouTubeResult + payload fields
- [ ] **youtube.search** - Verify SearchResult[] fields
- [ ] **vimeo.get** - Verify VimeoResult + payload fields
- [ ] **spotify.get** - Verify SpotifyResult + payload fields
- [ ] **discogs.get** - Verify DiscogsResult + payload fields (check for undocumented fields)
- [ ] **discogs.getMaster** - Verify DiscogsResult + payload fields
- [ ] **musicbrainz.search** - Verify MusicBrainzResult[] + payload fields
- [ ] **musicbrainz.getRecording** - Verify MusicBrainzResult + payload fields
- [ ] **musicbrainz.getRelease** - Verify MusicBrainzRelease + payload fields
- [ ] **soundcloud.get** - Verify SoundCloudResult + payload fields

### Payload Documentation Task

- [ ] Create a validation script that logs raw payloads from each provider
- [ ] Compare actual responses with documented shapes above
- [ ] Note any additional fields returned by APIs (Discogs especially returns many more)
- [ ] Decide: export payload types or keep as `unknown`?

## Implementation Notes

- Use a simple script or test file to call each method with known IDs
- Log raw payloads to compare with typed interfaces
- Consider adding runtime validation (e.g., Zod schemas) if types drift

## Out of Scope

- Changing existing type definitions (unless bugs found)
- Adding new provider methods
