# Interactive Demo Page

> Standalone HTML page with HMR to learn and test the library

## Prerequisites

Add to `src/index.ts` (root export):
```typescript
export { parseTitle, cleanTitle } from "./parse-title"
export { discoverDiscogsUrl } from "./discover"
```

## Requirements

### File Structure

```
demo/
  index.html          # main demo page
  Steps-Mono.otf      # fonts
  degheest-webfonts/  # more fonts
```

### Dev Server (server.ts)

Use Bun's fullstack dev server with HMR:

```typescript
import homepage from "./demo/index.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": homepage,
  },
  development: true,
});
```

Run with `bun run dev` (already in package.json).

### Demo Page (demo/index.html)

- Loads library from `../dist/media-now.js` (ESM import)
- Semantic HTML, no external dependencies, minimal inline CSS
- Organized to teach how functions relate

#### URL Input
Pre-populated: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

| Function | What it does | Returns |
|----------|--------------|---------|
| `parseUrl(url)` | Extract provider + id (sync) | `{ provider, id }` or `null` |
| `getMedia(url)` | Fetch full metadata (async) | `{ provider, id, url, title, thumbnail, ... }` |

#### Title Input
Pre-populated: `Rick Astley - Never Gonna Give You Up (Official Video)`

| Function | What it does | Returns |
|----------|--------------|---------|
| `parseTitle(str)` | Split artist/title (sync) | `{ artist, title, original }` |
| `cleanTitle(str)` | Strip junk like "(Official Video)" (sync) | cleaned string |
| `discoverDiscogsUrl(str)` | Search MusicBrainz → find Discogs link (async) | URL string or `null` |

### Output Display

- `<pre><code>` for JSON, pretty-printed with 2-space indent
- Errors in red text
- "Loading..." while async functions run

## Implementation Notes

- `<script type="module">`
- Font paths relative to `demo/` folder (e.g., `./Steps-Mono.otf`)
- HMR enabled via `development: true` in server

## Out of Scope

- Styling beyond basic readability
- Provider-specific methods (youtube.fetch, etc.)
- Mobile layout
- Multiple pages (structure supports MPA later)
