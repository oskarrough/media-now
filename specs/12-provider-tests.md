# Provider Tests

> Integration tests for providers — run manually against real APIs

## Background

Mocked fetch tests are high-maintenance and can drift from real API behavior. Since providers are thin wrappers around fetch, we trust TypeScript for type safety and use integration tests for verification.

## What's Already Tested

- `parse-url.ts` ✅ unit tests
- `parse-title.ts` ✅ unit tests

## Requirements

Create an integration test script that:
- Calls each provider method with known IDs
- Logs results for manual inspection
- Validates response shapes match TypeScript types
- **Not run in CI** — manual verification only

## Implementation

- [ ] Create `scripts/test-providers.ts` (or `test/integration.ts`)
- [ ] Add test cases for each provider:
  - `youtube.fetch("dQw4w9WgXcQ")` — Rick Astley
  - `vimeo.fetch("76979871")` — known video
  - `spotify.fetch("4cOdK2wGLETKBW3PvgPWqT")` — known track
  - `discogs.fetch("1")` — first release
  - `discogs.fetchMaster("1")` — first master
  - `musicbrainz.search("Bohemian Rhapsody")`
  - `musicbrainz.fetchRecording("...")` — known UUID
  - `soundcloud.fetch("forss/flickermood")` — known track
- [ ] Add npm script: `"test:integration": "bun run scripts/test-providers.ts"`
- [ ] Log payload shapes for documentation

## Future: Record/Replay (Optional)

If we want faster CI tests later, consider:
- Record real API responses to `fixtures/` directory
- Replay in tests using custom fetch wrapper or `msw`
- Re-record when APIs change

Not required now — add when/if needed.

## Out of Scope

- Mocked fetch unit tests
- Running integration tests in CI
- 100% coverage for provider files

## Coverage Update

Update `specs/README.md` to clarify:
- 100% coverage for **pure functions** (parse-url, parse-title)
- Integration tests for **network code** (not counted in coverage)
