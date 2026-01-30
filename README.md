# Media Now

A JavaScript library for extracting media metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys needed.

![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

## Usage

If you want to detect provider and/or id from a URL, use `parseUrl()`.
If you need more fields, fetch them from the provider's API via `getMedia()`.

```typescript
import { getMedia, parseUrl } from 'media-now'

// URL -> provider + id
parseUrl('https://vimeo.com/123456789')  // { provider: 'vimeo', id: '123456789' }
parseUrl('https://example.com')          // null

// URL -> parses URL + fetch payload from provider
const result = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
result.title      // "Rick Astley - Never Gonna Give You Up"
result.provider   // "youtube"
result.thumbnail  // "https://i.ytimg.com/..."
```

## Results

All results include `provider`, `id`, `url`, `title`, and `payload` (raw API response).

| Provider | Extra fields |
|----------|--------------|
| YouTube | `thumbnail` `author` `duration?` |
| Vimeo | `thumbnail` `author` `duration` |
| Spotify | `thumbnail` `artist?` `duration?` `album?` `isrc?` |
| Discogs | `year?` `genres[]` `styles[]` `artists[]` `labels[]` |
| MusicBrainz | `artist` `releases[]` |
| SoundCloud | `thumbnail?` `author` `description?` |

`?` optional `[]` array `duration` in seconds

## Error Handling

```typescript
import { getMedia, MediaNotFoundError, ProviderError } from 'media-now'

try {
  await getMedia(url)
} catch (e) {
  if (e instanceof MediaNotFoundError) {
    // Media doesn't exist (404)
  }
  if (e instanceof ProviderError) {
    // Rate limit, network error, unsupported URL, etc.
  }
}
```

## Exports

### Providers

Fetch by ID instead of URL.

```typescript
import { youtube } from 'media-now/providers/youtube'
import { vimeo } from 'media-now/providers/vimeo'
import { spotify } from 'media-now/providers/spotify'
import { discogs } from 'media-now/providers/discogs'
import { musicbrainz } from 'media-now/providers/musicbrainz'
import { soundcloud } from 'media-now/providers/soundcloud'
```

| Provider | Methods |
|----------|---------|
| youtube | `get(id)`, `search(query)` |
| vimeo | `get(id)` |
| spotify | `get(id)` |
| discogs | `get(id)`, `getMaster(id)` |
| musicbrainz | `search(query)`, `getRecording(id)`, `getRelease(id)` |
| soundcloud | `get(id)` — id is `username/track` |

### Utilities

```typescript
import { parseTitle, cleanTitle } from 'media-now/parse-title'
import { discoverDiscogsUrl } from 'media-now/discover'
```

| Export | Description |
|--------|-------------|
| `parseTitle(str)` | Split `"Artist - Title"` into `{ artist, title, original }` |
| `cleanTitle(str)` | Remove noise like `(Official Video)`, `[HD]`, `feat. X` |
| `discoverDiscogsUrl(title)` | Find Discogs URL via MusicBrainz lookup |

### Types

```typescript
import type {
  Provider,
  ParsedUrl,
  MediaResult,
  YouTubeResult,
  VimeoResult,
  SpotifyResult,
  DiscogsResult,
  MusicBrainzResult,
  SoundCloudResult,
  SearchResult,
  ParsedTitle,
} from 'media-now'
```

## Prior Work

- https://github.com/internet4000/media-now
- https://github.com/radio4000/media-now-deno/
- https://github.com/radio4000/r4-sync-tests
