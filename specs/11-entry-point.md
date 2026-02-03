# Entry Point

> Main `getMedia()` function that routes URLs to providers.

**Requires:** all previous specs

## Requirements

- Create `src/get-media.ts`
- `getMedia(input: string | ParsedUrl)` → `Promise<MediaResult>` - accept URL or parsed ref
- Create README.md with API overview (methods, args, return types)

## getMedia() Behavior

1. If `input` is string, parse using `parseUrl()`
2. If `null`, throw `ProviderError('unknown', 'Unrecognized URL')`
3. Route to appropriate provider's `fetch()` function using `{ provider, id }`
4. Return the result

Supports composition: `getMedia(parseUrl(url))`

## Out of Scope

- Re-exports (users import directly from each module)
- HTTP server
- CLI interface
