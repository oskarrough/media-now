# Title Parsing

> Parse track titles to extract artist and title. Goal: maximize extraction rate from real r4 data.

**Requires:** 00-project-setup

## Requirements

- [ ] `parseTitle(title)` → `{ artist: string | null, title: string, original: string }`
- [ ] `cleanTitle(title)` → `string` (cleaned for search)

## Separators (in precedence order)

### Primary: dash + spaces (regex)

Pattern: `\s+[-–—]+\s+` — matches any dash-like chars with spaces on both sides.

Covers: ` - `, ` -- `, ` – `, ` — `, `  -  `, etc.

### Secondary

1. `: ` (colon with space)
2. ` | ` (pipe with spaces)
3. ` by ` (case insensitive, reversed: "Title by Artist")

### Lenient fallbacks (typo tolerance)

4. Dash with space on one side: `- ` or ` -`
5. En/em-dash without spaces: `–` or `—` (not hyphen — used in compound words)

Split on FIRST match. Left = artist, right = title (cleaned).

## Cleaning Rules

Applied to get a clean search string:

1. Truncate at `//`, `\\`, `||`, `--`
2. Remove trailing `(...)` and `[...]`
3. Remove `feat.`, `ft.`, `featuring`, `with` + everything after
4. Remove trailing `remix`, `edit`, `version`, `mix`, `dub`
5. Trim and collapse whitespace

## Examples

```typescript
parseTitle('Daft Punk - Get Lucky (feat. Pharrell)')
// → { artist: 'Daft Punk', title: 'Get Lucky', original: '...' }

parseTitle('Seu Jorge- Tive Razao')  // typo: missing space
// → { artist: 'Seu Jorge', title: 'Tive Razao', original: '...' }

parseTitle('Def Leppard — Animal')  // em-dash
// → { artist: 'Def Leppard', title: 'Animal', original: '...' }

cleanTitle('Title -- 2024 (Official)')
// → 'Title'
```

## Out of Scope

Investigated and rejected (2026-01-30):

- **Multiple-space separators** (~400 tracks) - reversed order "Title   Artist", unreliable
- **Tilde ` ~ `** (~111 tracks) - inconsistent order (~30-40% reversed), some non-music entries
- **Underscore ` _ `** (18 tracks) - too few to justify complexity
- **Asterisk ` * `** (7 tracks) - too few to justify complexity
- **Slash ` / `** (~87 tracks) - too noisy, conflicts with other uses

**Truly unparseable**: ~7,066 tracks (17.9%) are just song titles without artist info or artist+title concatenated without any delimiter. Would require ML/fuzzy matching.
