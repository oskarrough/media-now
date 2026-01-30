# Title Parsing

> Pure functions to parse and clean track titles for search queries.

**Requires:** 00-project-setup

## Requirements

- [ ] Create `src/parse-title.ts`
- [ ] `parseTitle(title)` → `{ artist: string | null, title: string, original: string }`
- [ ] `cleanTitle(title)` → `string` (cleaned for search)
- [ ] Add lenient separator support (see Parsing Rules v2)

## Parsing Rules

Split on separators (in order of precedence):

### Primary separators (strict)
1. ` -- ` (double-dash WITH spaces → separator, not truncation)
2. ` - ` (hyphen with spaces)
3. ` – ` (en-dash with spaces)
4. ` — ` (em-dash with spaces)
5. `: ` (colon with space)
6. ` | ` (pipe with spaces)
7. ` by ` (case insensitive)

### Lenient separators (fallback)
If no primary separator found, try these (typo tolerance):
8. `- ` (hyphen-space, no leading space)
9. ` -` (space-hyphen, no trailing space)
10. `–` (en-dash, no spaces)
11. `—` (em-dash, no spaces)

First part = artist, second part = title. If no separator found, return `artist: null`.

## Cleaning Rules (applied in order)

1. Remove everything after `//`, `\\`, `||` (album info, etc.)
2. Remove everything after non-spaced `--` (but NOT ` -- ` which is a separator)
3. Remove trailing parentheticals: `(feat. X)`, `(Official Video)`, etc.
4. Remove trailing brackets: `[Remix]`, `[HD]`, etc.
5. Remove feat/featuring info: `feat.`, `ft.`, `featuring`, `with`
6. Remove remix/edit suffixes: `remix`, `edit`, `version`, `mix`, `dub`
7. Trim whitespace

## Examples

```typescript
parseTitle('Daft Punk - Get Lucky (feat. Pharrell)')
// → { artist: 'Daft Punk', title: 'Get Lucky', original: '...' }

cleanTitle('Daft Punk - Get Lucky (feat. Pharrell) [Official Video]')
// → 'Daft Punk - Get Lucky'
```

## Implementation Notes

- These are pure sync functions
- Preserve original in output for debugging
- Cleaning should be aggressive for search purposes
- Consider edge cases like multiple separators
- **Double-dash logic:** Check for ` -- ` (spaced) as separator BEFORE truncating at non-spaced `--`. This handles both "Artist -- Title" (separator) and "Title -- 2024" (truncation) correctly.
- **Lenient matching:** Only try lenient separators (`- `, ` -`, bare dashes) if strict separators fail. This avoids false positives on hyphenated words.

## Out of Scope

- Language-specific parsing
- Fuzzy matching
- Multiple-space separators (e.g., `Title   Artist`) — too unreliable, often reversed order
