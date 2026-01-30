# Questions

*(No open questions)*

---

## Resolved

### 03-title-parsing: Spec update needed based on r4 dataset analysis

**Date:** 2026-01-30

**Resolution:** 2026-01-30 — Spec updated with decisions below.

| Pattern | Decision | Rationale |
|---------|----------|-----------|
| Em-dash `—` | ✅ Add | Standard typographic separator, +219 tracks |
| Hyphen typos (`- ` / ` -`) | ✅ Add as fallback | Obvious typos, +514 tracks. Try only if strict separators fail. |
| Double-dash ` -- ` | ✅ Separator first | Spaced ` -- ` is separator (high precedence). Non-spaced `--` remains truncation marker. |
| En-dash without spaces | ✅ Add as fallback | Consistent with existing support, +39 tracks |
| Multiple spaces (3+) | ❌ Skip | Reversed order (title first) is unreliable, too edge-case |

**Updated spec:** `specs/03-title-parsing.md` now includes:
- Primary separators (strict, including ` -- `, ` — `)
- Lenient separators (fallback: `- `, ` -`, bare `–`/`—`)
- Double-dash logic notes
- Multiple-space pattern explicitly out of scope

**Tests to update:** The 8 failing tests document the new expected behavior. Implement per spec, except remove the multiple-spaces test (that pattern is out of scope).

---

### 06-spotify: spotifly library broken, needs guidance

**Date:** 2026-01-30

**Resolution:** Use oEmbed only. Updated spec 06-spotify.md:

1. **Use oEmbed** - it's stable and doesn't require credentials
2. **Make `artist` and `duration` optional** in `SpotifyResult` type - oEmbed can't provide these
3. **Remove spotifly** - it's broken and we won't use it

The spec now reflects this approach. Proceed with oEmbed implementation.
