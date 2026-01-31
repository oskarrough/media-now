# media-now

Parse URLs to extract provider and identifier. Fetch metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys.

![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

## Usage

```js
import { getMedia, parseUrl } from 'media-now'

parseUrl('https://vimeo.com/123456789')  // { provider: 'vimeo', id: '123456789' }
parseUrl('https://example.com')          // null

const media = await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// { provider, id, url, title, thumbnail, author, payload }
```

All results include `provider`, `id`, `url`, `title`, `payload`.

## Providers

```js
import { youtube, vimeo, spotify, discogs, musicbrainz, soundcloud } from 'media-now/providers'

youtube.fetch(id)
youtube.search(query)
vimeo.fetch(id)
spotify.fetch(id)
soundcloud.fetch(id) // id is 'user/track'
discogs.fetch(id)
discogs.fetchMaster(id)
musicbrainz.search(query)
musicbrainz.fetchRecording(id)
musicbrainz.fetchRelease(id)
```

## Utilities

```js
import { parseTitle, cleanTitle, discoverDiscogsUrl } from 'media-now'

parseTitle('Nikolaj Nørlund - Hvid røg og tekno')
// { artist: 'Nikolaj Nørlund', title: 'Hvid røg og tekno', original: '...' }

cleanTitle('Bohemian Rhapsody (Official Video) [HD]')
// 'Bohemian Rhapsody'

await discoverDiscogsUrl('Massive Attack - Teardrop')
// 'https://www.discogs.com/release/...'
```

## History

We wrote this kind of package several times in the past:

- [media-now](https://github.com/internet4000/media-now)
- [media-now-deno](https://github.com/radio4000/media-now-deno/)
- [media-url-parser](https://github.com/internet4000/media-url-parser)
