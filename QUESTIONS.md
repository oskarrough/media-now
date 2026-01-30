# Questions

## 06-spotify: spotifly library broken, needs guidance

**Date:** 2026-01-30

**Context:** Spec 06-spotify requires using `spotifly` npm package for keyless Spotify access.

**Problem:** The `spotifly` library no longer works without authentication. It requires a Spotify cookie to function. Testing shows:

```
SyntaxError: Failed to parse JSON (at refreshToken)
```

This is because Spotify's `get_access_token` endpoint now requires authentication.

**oEmbed Alternative:** Spotify's oEmbed API works but provides very limited data:
- ✅ title (track name only, no artist in title string)
- ✅ thumbnail_url
- ❌ artist (not provided)
- ❌ duration (not provided)
- ❌ album (not provided)
- ❌ isrc (not provided)

The `SpotifyResult` type requires `artist` and `duration` fields.

**Options:**
1. Use oEmbed with empty/placeholder values for missing fields (artist: '', duration: 0)
2. Remove spotifly dependency and document limitations
3. Find an alternative library for keyless Spotify access
4. Require Spotify API credentials (changes scope significantly)

**Recommendation:** Please advise which approach to take.
