# Spotify Provider

> Fetch Spotify track/playlist metadata without API key.

**Requires:** 01-types
**Priority:** Low - if blocked, use `test.todo()` and move on

## Requirements

- [ ] Create `src/providers/spotify.ts`
- [ ] `spotify.get(id)` → `SpotifyResult` - track metadata only

## Implementation Notes

Use keyless access via one of:
- [spotifly](https://www.npmjs.com/package/spotifly) - unofficial API wrapper
- Spotify oEmbed API (`https://open.spotify.com/oembed`) - limited but reliable

If spotifly doesn't work (broken, can't verify docs), oEmbed is acceptable. oEmbed returns less data (no duration) but is stable.

## Error Handling

- `MediaNotFoundError` for invalid track/playlist ID
- `ProviderError` for network errors

## Out of Scope

- Playlist fetching (may add later)
- Album fetching
- Audio features/analysis
- Search (requires API key)
