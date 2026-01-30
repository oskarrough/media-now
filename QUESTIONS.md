# Questions

(none pending)

---

## Resolved

### 06-spotify: spotifly library broken, needs guidance

**Date:** 2026-01-30

**Resolution:** Use oEmbed only. Updated spec 06-spotify.md:

1. **Use oEmbed** - it's stable and doesn't require credentials
2. **Make `artist` and `duration` optional** in `SpotifyResult` type - oEmbed can't provide these
3. **Remove spotifly** - it's broken and we won't use it

The spec now reflects this approach. Proceed with oEmbed implementation.
