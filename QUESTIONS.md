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

**Decision:** Option 1 - Unit tests with mocked `fetch` for all providers and entry points.

- Mocked tests are fast, deterministic, CI-friendly
- Can test edge cases (errors, malformed responses)
- Type-only files (`errors.ts`, `types.ts`) are exempt - no runtime logic

**Action:** Updated `specs/README.md` with clarified testing requirements. Coder should create a new spec or add tests to existing provider specs.
