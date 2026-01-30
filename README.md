# media-now

A library for extracting media metadata from YouTube, Vimeo, Spotify, Discogs, and MusicBrainz without API keys.

## Installation

```sh
bun add media-now
```

## Quick Start

```typescript
import { getMedia, parseUrl } from 'media-now'

// Fetch metadata from any supported URL
const result = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
console.log(result.title, result.provider)

// Parse URL without fetching
const parsed = parseUrl('https://vimeo.com/123456789')
console.log(parsed) // { provider: 'vimeo', id: '123456789' }
```

## API

### `getMedia(url: string): Promise<MediaResult>`

Fetches metadata from a media URL. Automatically routes to the appropriate provider.

**Arguments:**
- `url` - A YouTube, Vimeo, Spotify, or Discogs URL

**Returns:** `Promise<MediaResult>` - Provider-specific result object

**Throws:**
- `ProviderError` - If URL is unrecognized or provider fails
- `MediaNotFoundError` - If media doesn't exist

```typescript
const result = await getMedia('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')
// SpotifyResult { provider, id, url, title, thumbnail, artist, duration }
```

### `parseUrl(url: string): ParsedUrl | null`

Parses a media URL and extracts the provider and ID without making network requests.

**Arguments:**
- `url` - URL to parse

**Returns:** `{ provider: Provider, id: string } | null`

```typescript
parseUrl('https://youtu.be/dQw4w9WgXcQ')
// { provider: 'youtube', id: 'dQw4w9WgXcQ' }

parseUrl('https://example.com')
// null
```

## Types

### `Provider`

```typescript
type Provider = 'youtube' | 'vimeo' | 'spotify' | 'discogs' | 'musicbrainz'
```

### `MediaResult`

Base interface for all results:

```typescript
interface MediaResult {
  provider: Provider
  id: string
  url: string
  title: string
  payload: unknown  // Raw API response
}
```

### Provider-Specific Results

**YouTubeResult:**
```typescript
interface YouTubeResult extends MediaResult {
  provider: 'youtube'
  thumbnail: string
  author: string
  duration?: number
}
```

**VimeoResult:**
```typescript
interface VimeoResult extends MediaResult {
  provider: 'vimeo'
  thumbnail: string
  author: string
  duration: number
}
```

**SpotifyResult:**
```typescript
interface SpotifyResult extends MediaResult {
  provider: 'spotify'
  thumbnail: string
  artist: string
  duration: number
  album?: string
  isrc?: string
}
```

**DiscogsResult:**
```typescript
interface DiscogsResult extends MediaResult {
  provider: 'discogs'
  year?: number
  genres: string[]
  styles: string[]
  artists: string[]
  labels: string[]
}
```

**MusicBrainzResult:**
```typescript
interface MusicBrainzResult extends MediaResult {
  provider: 'musicbrainz'
  artist: string
  releases: string[]
}
```

## Errors

### `MediaNotFoundError`

Thrown when media doesn't exist (404).

```typescript
import { MediaNotFoundError } from 'media-now'

try {
  await getMedia('https://youtube.com/watch?v=nonexistent')
} catch (e) {
  if (e instanceof MediaNotFoundError) {
    console.log(e.provider, e.id) // 'youtube', 'nonexistent'
  }
}
```

### `ProviderError`

Thrown for provider issues (rate limits, network errors, unrecognized URLs).

```typescript
import { ProviderError } from 'media-now'

try {
  await getMedia('https://example.com/unknown')
} catch (e) {
  if (e instanceof ProviderError) {
    console.log(e.provider, e.message)
  }
}
```

## Supported URL Patterns

### YouTube
- `youtube.com/watch?v={id}`
- `youtu.be/{id}`
- `youtube.com/embed/{id}`
- `youtube.com/shorts/{id}`

### Vimeo
- `vimeo.com/{id}`
- `vimeo.com/video/{id}`
- `player.vimeo.com/video/{id}`

### Spotify
- `open.spotify.com/track/{id}` (tracks only)

### Discogs
- `discogs.com/release/{id}`
- `discogs.com/master/{id}`

## Direct Provider Access

For advanced use cases, import providers directly:

```typescript
import { youtube } from 'media-now/providers/youtube'
import { vimeo } from 'media-now/providers/vimeo'
import { spotify } from 'media-now/providers/spotify'
import { discogs } from 'media-now/providers/discogs'
import { musicbrainz } from 'media-now/providers/musicbrainz'

// YouTube
await youtube.get('dQw4w9WgXcQ')       // Fetch video by ID
await youtube.search('rick astley')    // Search videos

// Vimeo
await vimeo.get('123456789')           // Fetch video by ID

// Spotify
await spotify.get('4cOdK2wGLETKBW3PvgPWqT')  // Fetch track by ID

// Discogs
await discogs.get('123456')            // Fetch release by ID
await discogs.getMaster('456789')      // Fetch master release by ID

// MusicBrainz (lookup only, no URL parsing)
await musicbrainz.search('Artist - Title')    // Search recordings
await musicbrainz.getRecording('uuid')        // Fetch recording by ID
await musicbrainz.getRelease('uuid')          // Fetch release with URL relations
```

## Utility Functions

### `parseTitle(input: string): ParsedTitle`

Parses "Artist - Title" strings:

```typescript
import { parseTitle } from 'media-now/parse-title'

parseTitle('Daft Punk - Around The World')
// { artist: 'Daft Punk', title: 'Around The World', original: '...' }
```

### `cleanTitle(title: string): string`

Removes noise from titles (feat info, remix tags, brackets):

```typescript
import { cleanTitle } from 'media-now/parse-title'

cleanTitle('Song (Official Video) [HD] feat. Someone')
// 'Song'
```

### `discoverDiscogsUrl(title: string): Promise<string | null>`

Discovers Discogs URL via MusicBrainz lookup chain:

```typescript
import { discoverDiscogsUrl } from 'media-now/discover'

const url = await discoverDiscogsUrl('Daft Punk - Around The World')
// 'https://www.discogs.com/release/...' or null
```

## Prior Work

- https://github.com/internet4000/media-now
- https://github.com/radio4000/media-now-deno/
- https://github.com/radio4000/r4-sync-tests
