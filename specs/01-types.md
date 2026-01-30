# Types & Errors

> Define TypeScript interfaces and custom error classes.

**Requires:** 00-project-setup

## Requirements

- [ ] Create `src/types.ts` with `Provider`, `MediaResult`, and provider-specific result types
- [ ] Create `src/errors.ts` with `MediaNotFoundError`, `ProviderError`

## Types to Define

- `Provider` - union: `'youtube' | 'vimeo' | 'spotify' | 'discogs' | 'musicbrainz' | 'soundcloud'`
- `MediaResult` - base interface with: provider, id, url, title, payload (raw API response)
- `YouTubeResult` - extends MediaResult: thumbnail, author, duration?
- `VimeoResult` - extends MediaResult: thumbnail, author, duration
- `SpotifyResult` - extends MediaResult: thumbnail, artist, duration, album?, isrc?
- `DiscogsResult` - extends MediaResult: year?, genres[], styles[], artists[], labels[]
- `MusicBrainzResult` - extends MediaResult: artist, releases[]
- `SoundCloudResult` - extends MediaResult: thumbnail, author
- `SearchResult` - provider, id, title, thumbnail?, url
- `ParsedTitle` - artist (nullable), title, original
- `ParsedUrl` - { provider: Provider, id: string }

## Error Classes

- `MediaNotFoundError(provider, id)` - thrown for 404 / not found
- `ProviderError(provider, message)` - thrown for rate limits, network errors

## Implementation Notes

- All types should be exported
- `payload` must always contain the raw API response
- Error classes should include provider name for debugging

## Out of Scope

- Implementation of providers
- Validation logic
