# Spotify Provider

> Fetch Spotify track metadata via oEmbed (no API key required).

**Requires:** 01-types
**Priority:** Low

## Requirements

- [ ] Create `src/providers/spotify.ts` using oEmbed API only
- [ ] `spotify.get(id)` → `SpotifyResult` - track metadata from oEmbed
- [ ] Update `SpotifyResult` type: make `artist` and `duration` optional

## Implementation Notes

**Use oEmbed only** (`https://open.spotify.com/oembed?url=...`)

oEmbed provides:
- `title` (track name)
- `thumbnail_url`

oEmbed does NOT provide (these become optional):
- `artist` - not available without API credentials
- `duration` - not available without API credentials

Do NOT use spotifly - it's broken (requires auth cookie now).

## Error Handling

- `MediaNotFoundError` for invalid track/playlist ID
- `ProviderError` for network errors

## Out of Scope

- Playlist fetching (may add later)
- Album fetching
- Audio features/analysis
- Search (requires API key)
