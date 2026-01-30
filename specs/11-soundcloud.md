# SoundCloud Provider

> Fetch SoundCloud track metadata without API key.

**Requires:** 01-types

## Requirements

- [ ] Create `src/providers/soundcloud.ts`
- [ ] `soundcloud.get(id)` → `SoundCloudResult` - fetch track metadata via oEmbed

## URL/ID Format

SoundCloud IDs are `{username}/{track-slug}` (e.g., `ghostculture/lucky`).

Example URL: `https://soundcloud.com/ghostculture/lucky` → ID: `ghostculture/lucky`

## API Endpoint

`GET https://soundcloud.com/oembed?url=https://soundcloud.com/{id}&format=json`

Returns: title, author_name, thumbnail_url, description.

## Error Handling

- `MediaNotFoundError` for 404
- `ProviderError` for network errors

## Test Data

See `test-data/r4-tracks.json` - contains ~2.2% SoundCloud URLs.

## Out of Scope

- Private tracks
- Search (requires API key)
- Playlists/sets
