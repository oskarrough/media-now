# Spotify Provider

> Fetch Spotify track/playlist metadata without API key.

**Requires:** 01-types

## Requirements

- [ ] Create `src/providers/spotify.ts`
- [ ] `spotify.get(id)` → `SpotifyResult` - track metadata only

## Implementation Notes

Uses [spotifly](https://www.npmjs.com/package/spotifly) library for keyless access. Verify this package is maintained and working before implementation—unofficial API packages can break.

## Error Handling

- `MediaNotFoundError` for invalid track/playlist ID
- `ProviderError` for network errors

## Out of Scope

- Playlist fetching (may add later)
- Album fetching
- Audio features/analysis
- Search (requires API key)
