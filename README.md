# Media Now

A JavaScript library for extracting media metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys needed.

![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

```typescript
import { getMedia, parseUrl } from 'media-now'

// Parse a URL to identify provider and id
parseUrl('https://vimeo.com/123456789')  // { provider: 'vimeo', id: '123456789' }
parseUrl('https://example.com')          // null

// Fetch full metadata from the provider
const media = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
media.provider   // "youtube"
media.title      // "Rick Astley - Never Gonna Give You Up"
media.thumbnail  // "https://i.ytimg.com/..."
```

## Response Format

All results include `provider`, `id`, `url`, `title`, and `payload` (raw API response).

| Provider | Extra fields |
|----------|--------------|
| YouTube | `thumbnail` `author` `duration?` |
| Vimeo | `thumbnail` `author` `duration` |
| Spotify | `thumbnail` `artist?` `duration?` `album?` `isrc?` |
| Discogs | `year?` `genres[]` `styles[]` `artists[]` `labels[]` |
| MusicBrainz | `artist` `releases[]` |
| SoundCloud | `thumbnail?` `author` `description?` |

`?` = optional, `[]` = array, `duration` in seconds

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

## Individual Providers

Fetch by ID when you already know the provider.

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
| youtube | `fetch(id)` `search(query)` |
| vimeo | `fetch(id)` |
| spotify | `fetch(id)` |
| discogs | `fetch(id)` `fetchMaster(id)` |
| musicbrainz | `search(query)` `fetchRecording(id)` `fetchRelease(id)` |
| soundcloud | `fetch(id)` — id is `username/track` |

## Utilities

```typescript
import { parseTitle, cleanTitle } from 'media-now/parse-title'
import { discoverDiscogsUrl } from 'media-now/discover'
```

| Function | Description |
|----------|-------------|
| `parseTitle(str)` | Split `"Artist - Title"` into `{ artist, title, original }` |
| `cleanTitle(str)` | Strip noise like `(Official Video)`, `[HD]`, `feat. X` |
| `discoverDiscogsUrl(title)` | Find Discogs URL via MusicBrainz lookup |

## Types

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
