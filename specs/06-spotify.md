# Spotify Provider

> Fetch Spotify track metadata via oEmbed (no API key required).

**Requires:** 01-types
**Priority:** Low

## Requirements

- Create `src/providers/spotify.ts` using oEmbed API only
- `fetch(id)` → `SpotifyResult` - track metadata from oEmbed
- Update `SpotifyResult` type: make `artist` and `duration` optional

## Implementation Notes

**Use oEmbed only** (`https://open.spotify.com/oembed?url=...`)

oEmbed provides:
- `title` (usually "Artist - Track Name" format)
- `thumbnail_url`

Parse `artist` from the oEmbed title using dash separator. Falls back to `undefined` if no separator found.

`duration` is not available via oEmbed.

## Error Handling

- `MediaNotFoundError` for invalid track ID
- `ProviderError` for network errors

## Out of Scope

- Playlist fetching (may add later)
- Album fetching
- Audio features/analysis
- Search (requires API key)
