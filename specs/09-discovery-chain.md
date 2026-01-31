# Discovery Chain

> Discover Discogs URL for a track via MusicBrainz.

**Requires:** 03-title-parsing, 07-discogs, 08-musicbrainz

## Requirements

- [ ] Create `src/discover.ts`
- [ ] `discoverDiscogsUrl(title: string)` → `Promise<string | null>`

## Data Flow

```
title → parseTitle() → { artist, title }
      → searchReleaseGroups(artist, title)
      → filter: NOT secondarytype:compilation
      → score by: primarytype (Single > Album), firstreleasedate (older = better)
      → for top candidates: fetchReleaseGroup() with url-rels
      → find discogs.com URL → return best match (or null)
```

## MusicBrainz Search Strategy

Use **Release Group** search (not Recording search) with Lucene query:

```
artist:"{artist}" AND releasegroup:"{title}" AND NOT secondarytype:compilation
```

Release Groups represent "albums" in MusicBrainz terminology:
- A Single release group for "Never Gonna Give You Up" contains the original 1987 single
- Avoids DJ-mix/compilation recordings that pollute Recording search results

### Search Fields (Release Group)

| Field | Description |
|-------|-------------|
| `artist` | combined credited artist name |
| `releasegroup` | the release group's title |
| `primarytype` | Album, Single, EP, Broadcast, Other |
| `secondarytype` | Compilation, Soundtrack, Live, Remix, DJ-mix, etc. |
| `firstreleasedate` | earliest release date (e.g. "1987-07-27") |

### Scoring

Prefer releases in this order:
1. **Single** with matching title (highest confidence - it's THE release for that track)
2. **Album** without secondary types (original studio album)
3. **EP** without secondary types
4. Earlier `firstreleasedate` (original releases came first)

Reject:
- Any release with `secondarytype:compilation`
- "Various Artists" credited releases

## Implementation Notes

- Search release-groups first, fall back to recordings if no match
- Return `null` if no Discogs URL is found
- Throw `ProviderError` on network/API errors
- MusicBrainz rate limiting is handled by the provider
- Release groups can have Discogs URLs directly via `url-rels`

## Out of Scope

- Caching
- Multiple Discogs URLs
- User-facing confidence scoring
