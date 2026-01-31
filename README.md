![The Burning of the Library at Alexandria in 391 AD. Ambrose Dudley](http://i.imgur.com/2fvkbVem.jpg)

# media-now

Parse URLs to extract provider and identifier. Fetch metadata from YouTube, Vimeo, Spotify, Discogs, MusicBrainz, and SoundCloud. No API keys.

Meant to be useful for people dealing with music tracks in one shape or another (hello https://radio4000.com).

All functions return at least `provider`, `id` and `payload` (the original response).

```js
import { getMedia, parseUrl, parseTitle, cleanTitle, discoverDiscogsUrl } from 'media-now'

cleanTitle('Bohemian Rhapsody (Official Video) [HD]')
// 'Bohemian Rhapsody'

parseTitle('Nikolaj Nørlund - Hvid røg og tekno')
// { artist: 'Nikolaj Nørlund', title: 'Hvid røg og tekno', original: '...' }

parseUrl('https://vimeo.com/123456789')
// { provider: 'vimeo', id: '123456789' }

await getMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// { provider, id, url, title, thumbnail, author, payload }

await discoverDiscogsUrl('Massive Attack - Teardrop')
// 'https://www.discogs.com/release/...'
```

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

## History

We wrote this kind of package several times in the past: 
[media-now](https://github.com/internet4000/media-now), 
[media-now-deno](https://github.com/radio4000/media-now-deno/) & 
[media-url-parser](https://github.com/internet4000/media-url-parser).
