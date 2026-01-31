# Media Now

Parse URLs to extract the provider and their identifier. 

Fetch metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys.

![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

## Usage

```js
import { getMedia, parseUrl } from 'media-now'

parseUrl('https://vimeo.com/123456789')  // { provider: 'vimeo', id: '123456789' }
parseUrl('https://example.com')          // null

const media = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// { provider: 'youtube', id: '...', url: '...', title: '...', thumbnail: '...', author: '...', payload: {...} }
```

## API

```js
import { getMedia, parseUrl, parseTitle, cleanTitle, discoverDiscogsUrl } from 'media-now'
```

- `parseUrl(url)` extract `{ provider, id }` from URL
- `parseTitle(str)` split `"Artist - Title"` → `{ artist, title, original }`
- `cleanTitle(str)` strip `(Official Video)`, `[HD]`, `feat. X`
- `getMedia(url)` fetch metadata from any supported URL 
- `discoverDiscogsUrl(title)` finds Discogs URL via MusicBrainz

All results include `provider`, `id`, `url`, `title`, `payload`. 

You can also use these methods directly, if you prefer. 

```js
import { youtube, vimeo, spotify, discogs, musicbrainz, soundcloud } from 'media-now/providers'
```

| | |
|-|-|
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

## Prior work

- https://github.com/internet4000/media-now
- https://github.com/radio4000/media-now-deno/
- https://github.com/internet4000/media-url-parser
