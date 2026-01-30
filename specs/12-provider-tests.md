# Provider Tests

> Add unit tests with mocked fetch for all provider modules and entry points

## Requirements

- All provider modules have test coverage for:
  - Successful API responses (happy path)
  - Error responses (4xx, 5xx status codes)
  - Malformed/unexpected response shapes
  - Network failures (fetch throws)
- Entry points (`get-media.ts`, `discover.ts`) have test coverage
- `bun test --coverage` shows 100% for all files with runtime logic

## Implementation Notes

- Mock `fetch` globally or per-test using Bun's built-in mocking
- Create fixture files for realistic API response shapes if helpful
- Test each provider independently
- Order doesn't matter - all providers can be tested in parallel

## Files to Test

- [ ] `src/providers/youtube.ts`
- [ ] `src/providers/vimeo.ts`
- [ ] `src/providers/spotify.ts`
- [ ] `src/providers/discogs.ts`
- [ ] `src/providers/musicbrainz.ts`
- [ ] `src/providers/soundcloud.ts`
- [ ] `src/get-media.ts`
- [ ] `src/discover.ts`

## Out of Scope

- Integration tests against real APIs (nice-to-have, not required)
- Testing `types.ts` or `errors.ts` (type-only, no runtime logic)
