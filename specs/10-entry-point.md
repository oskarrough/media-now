# Entry Point

> Main `getMedia()` function that routes URLs to providers.

**Requires:** all previous specs

## Requirements

- [ ] Create `src/get-media.ts`
- [ ] `getMedia(url: string)` → `Promise<MediaResult>` - parse URL and fetch from appropriate provider

## getMedia() Behavior

1. Parse URL using `parseUrl()`
2. If `null`, throw `ProviderError('unknown', 'Unrecognized URL')`
3. Route to appropriate provider's `.get()` method
4. Return the result

## Out of Scope

- Re-exports (users import directly from each module)
- HTTP server
- CLI interface
