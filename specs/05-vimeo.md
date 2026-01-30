# Vimeo Provider

> Fetch Vimeo video metadata without API key.

**Requires:** 01-types

## Requirements

- [ ] Create `src/providers/vimeo.ts`
- [ ] `vimeo.get(id)` → `VimeoResult` - fetch video metadata via oEmbed

## API Endpoint

`GET https://vimeo.com/api/oembed.json?url=https://vimeo.com/{id}`

Returns: title, author_name, thumbnail_url, duration.

## Error Handling

- `MediaNotFoundError` for 404
- `ProviderError` for network errors

## Out of Scope

- Private videos
- Search (requires API key)
