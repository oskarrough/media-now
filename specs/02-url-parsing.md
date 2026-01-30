# URL Parsing

> Sync functions to extract provider + ID from any media URL.

**Requires:** 00-project-setup

## Requirements

- [ ] Create `src/parse-url.ts` with `parseUrl(url)` returning `{ provider, id } | null`
- [ ] YouTube URL patterns: `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, with query params
- [ ] Vimeo URL patterns: `vimeo.com/{id}`, `/video/{id}`, player embeds
- [ ] Spotify URL patterns: `open.spotify.com/track/{id}` only (reject playlist/album URLs)
- [ ] Discogs URL patterns: `discogs.com/release/{id}`, `discogs.com/master/{id}`, with or without slug/locale

## Edge Cases to Handle

- http vs https
- with/without www
- trailing slashes
- extra query parameters
- URL-encoded characters

## Implementation Notes

- This is a pure sync function - no network calls
- Return `null` for unrecognized URLs (don't throw)
- Each provider pattern should be well-tested
- Consider using URL API for robust parsing

## Out of Scope

- Fetching metadata (that's for providers)
- Provider-specific ID validation
- MusicBrainz URLs (MusicBrainz is search-only, no URL→ID flow)
