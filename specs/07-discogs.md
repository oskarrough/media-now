# Discogs Provider

> Fetch Discogs release metadata without API key.

**Requires:** 01-types

## Requirements

- [ ] Create `src/providers/discogs.ts`
- [ ] `parseUrl(url)` → `{ type: 'release' | 'master', id: string } | null` (for type detection)
- [ ] `fetch(id)` → `DiscogsResult` - release metadata
- [ ] `fetchMaster(id)` → `DiscogsResult` - master release metadata

## Relationship with Central URL Parsing

Central `parseUrl()` (02-url-parsing) returns `{provider: 'discogs', id}` for routing to the right provider. `discogs.parseUrl()` is needed separately to distinguish release vs master types, since they use different API endpoints.

## URL Patterns to Handle

- `discogs.com/release/123` (with or without slug like `-Artist-Title`)
- `discogs.com/Artist/release/123`
- `discogs.com/master/456` (with or without slug)

## API Endpoints

- `GET https://api.discogs.com/releases/{id}`
- `GET https://api.discogs.com/masters/{id}`
- Headers: User-Agent required (any string)

## Error Handling

- `MediaNotFoundError` for 404
- `ProviderError` for rate limits (429), network errors

## Out of Scope

- Search (requires API key)
- Marketplace/pricing data
