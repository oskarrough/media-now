# Rename Provider Methods: get → fetch

> Align implementation with spec - rename `get` to `fetch` across all providers

## Background

Specs defined provider API as `fetch(id)` but implementation used `get(id)`. This creates inconsistency with the documented API.

## Requirements

Rename methods to match original spec:

| Provider | Current | Target |
|----------|---------|--------|
| youtube | `get` | `fetch` |
| vimeo | `get` | `fetch` |
| spotify | `get` | `fetch` |
| discogs | `get` | `fetch` |
| discogs | `getMaster` | `fetchMaster` |
| musicbrainz | `getRecording` | `fetchRecording` |
| musicbrainz | `getRelease` | `fetchRelease` |
| soundcloud | `get` | `fetch` |

## Implementation Checklist

- [ ] Rename `get` → `fetch` in `src/providers/youtube.ts`
- [ ] Rename `get` → `fetch` in `src/providers/vimeo.ts`
- [ ] Rename `get` → `fetch` in `src/providers/spotify.ts`
- [ ] Rename `get` → `fetch` in `src/providers/soundcloud.ts`
- [ ] Rename `get` → `fetch`, `getMaster` → `fetchMaster` in `src/providers/discogs.ts`
- [ ] Rename `getRecording` → `fetchRecording`, `getRelease` → `fetchRelease` in `src/providers/musicbrainz.ts`
- [ ] Update all imports/usages in `src/get-media.ts`
- [ ] Update all imports/usages in `src/discover.ts`
- [ ] Update exported objects: `youtube = { fetch, search }`, etc.
- [ ] Run `bun run build && bun test` to verify

## Out of Scope

- Renaming `search` methods (already correct)
- Renaming `parseUrl` (already correct)
