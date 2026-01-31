# Interactive Demo Page

> Standalone HTML page to test library functions in the browser

## Prerequisites

Add to `src/index.ts` (root export):
```typescript
export { parseTitle, cleanTitle } from "./parse-title"
export { discoverDiscogsUrl } from "./discover"
```

## Requirements

- Single `index.html` at project root
- Loads library from `dist/index.js` (ESM import)
- Semantic HTML, no external dependencies, minimal inline CSS

### Sections

Each section has: input field(s), button, `<pre><code>` output area.

| Function | Input | Notes |
|----------|-------|-------|
| `parseUrl(url)` | URL text | Sync, returns JSON or `null` |
| `parseTitle(str)` | Title text | Sync, returns `{ artist, title, original }` |
| `cleanTitle(str)` | Title text | Sync, returns cleaned string |
| `getMedia(url)` | URL text | Async, show loading state |
| `discoverDiscogsUrl(title)` | Title text | Async, show loading state |

### Pre-populated Examples

- URL input: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Title input: `Rick Astley - Never Gonna Give You Up (Official Video)`

### Output Display

- Pretty-print JSON with 2-space indent
- Errors shown in red text within same output area
- Loading indicator while async functions run

## Implementation Notes

- Use native ES modules: `<script type="module">`
- Single import: `import { parseUrl, parseTitle, cleanTitle, getMedia, discoverDiscogsUrl } from './dist/index.js'`
- Works when served locally (e.g., `bunx serve` or `python -m http.server`)

## Out of Scope

- Styling beyond basic readability
- Provider-specific methods (youtube.fetch, etc.)
- Mobile-specific layout
