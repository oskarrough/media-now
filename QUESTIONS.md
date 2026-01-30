# Questions

## Test Coverage Gap

The specs/README.md states "100% test coverage required for all source files" but currently only `parse-url.ts` and `parse-title.ts` have tests. The following files have no test coverage:

- `errors.ts` (type-only, no logic)
- `types.ts` (types only)
- `get-media.ts` (needs network mocking)
- `discover.ts` (needs network mocking)
- `providers/youtube.ts` (needs network mocking)
- `providers/vimeo.ts` (needs network mocking)
- `providers/spotify.ts` (needs network mocking)
- `providers/discogs.ts` (needs network mocking)
- `providers/musicbrainz.ts` (needs network mocking)
- `providers/soundcloud.ts` (needs network mocking)

Should we:
1. Add unit tests with mocked `fetch` for all providers?
2. Update the coverage requirement to exclude network-dependent code?
3. Add integration tests that run against real APIs (slower, potentially flaky)?

---

All implementation tasks in specs/ are complete according to PROGRESS.md. This coverage question is the only outstanding issue.

<!--
How to use this file:
- Coders: Add questions here when you need manager guidance
- Manager: Answer questions, update specs, then delete the resolved items
- Keep this file clean - resolved decisions belong in specs/
-->
