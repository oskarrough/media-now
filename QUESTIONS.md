# Questions

<!--
How to use this file:
- Coders: Add questions here when you need manager guidance
- Manager: Answer questions, update specs, then delete the resolved items
- Keep this file clean - resolved decisions belong in specs/
-->

(No open questions)

---

## Resolved

### Test Coverage Gap (2024-01-30)

**Question:** Should we add unit tests with mocked fetch, update coverage requirements to exclude network code, or add integration tests against real APIs?

**Decision:** Integration tests + trust TypeScript for network code.

- Mocked fetch is high-maintenance and drifts from real APIs
- Providers are thin wrappers — TypeScript provides type safety
- Pure functions (`parse-url`, `parse-title`) already have unit tests
- Integration test script for manual verification against real APIs

**Action:** Updated `specs/README.md` and `specs/12-provider-tests.md` with new approach.
