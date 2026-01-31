# Media Now

![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

```js
import { getMedia, parseUrl } from 'media-now'

// Parse URLs to extract the "provider" and their identifier. 
parseUrl('https://vimeo.com/123456789')  // { provider: 'vimeo', id: '123456789' }
parseUrl('https://example.com')          // null

// Fetch metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys.
const media = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// { provider: 'youtube', id: '...', url: '...', title: '...', thumbnail: '...', author: '...', payload: {...} }
```

## API

```js
import { youtube, vimeo, spotify, discogs, musicbrainz, soundcloud } from 'media-now/providers'
import { parseTitle, cleanTitle } from 'media-now/parse-title'
import { discoverDiscogsUrl } from 'media-now/discover'
```

| | |
|-|-|
| `getMedia(url)` | Fetch metadata from any supported URL |
| `parseUrl(url)` | Extract `{ provider, id }` from URL |
| `youtube.fetch(id)` | → `thumbnail` `author` `duration?` |
| `youtube.search(query)` | Search videos |
| `vimeo.fetch(id)` | → `thumbnail` `author` `duration` |
| `spotify.fetch(id)` | → `thumbnail` `artist?` `duration?` `album?` `isrc?` |
| `discogs.fetch(id)` | → `year?` `genres[]` `styles[]` `artists[]` `labels[]` |
| `discogs.fetchMaster(id)` | Fetch master release |
| `musicbrainz.search(query)` | Search recordings |
| `musicbrainz.fetchRecording(id)` | → `artist` `releases[]` |
| `musicbrainz.fetchRelease(id)` | Fetch release details |
| `soundcloud.fetch(id)` | → `thumbnail?` `author` `description?` (id = `user/track`) |
| `parseTitle(str)` | Split `"Artist - Title"` → `{ artist, title, original }` |
| `cleanTitle(str)` | Strip `(Official Video)`, `[HD]`, `feat. X` |
| `discoverDiscogsUrl(title)` | Find Discogs URL via MusicBrainz |

All results include `provider`, `id`, `url`, `title`, `payload`. `?` = optional, `[]` = array, `duration` in seconds.

## Prior work

- https://github.com/internet4000/media-now
- https://github.com/radio4000/media-now-deno/
- https://github.com/radio4000/r4-sync-tests
