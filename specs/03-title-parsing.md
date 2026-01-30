# Title Parsing

> Pure functions to parse and clean track titles for search queries.

**Requires:** 00-project-setup

## Requirements

- [ ] Create `src/parse-title.ts`
- [ ] `parseTitle(title)` → `{ artist: string | null, title: string, original: string }`
- [ ] `cleanTitle(title)` → `string` (cleaned for search)

## Parsing Rules

Split on separators (in order of precedence):
1. ` - ` (hyphen with spaces)
2. ` – ` (en-dash with spaces)
3. `: ` (colon with space)
4. ` | ` (pipe with spaces)
5. ` by ` (case insensitive)

First part = artist, second part = title. If no separator found, return `artist: null`.

## Cleaning Rules (applied in order)

1. Remove everything after `//`, `\\`, `||`, `--` (album info, etc.)
2. Remove trailing parentheticals: `(feat. X)`, `(Official Video)`, etc.
3. Remove trailing brackets: `[Remix]`, `[HD]`, etc.
4. Remove feat/featuring info: `feat.`, `ft.`, `featuring`, `with`
5. Remove remix/edit suffixes: `remix`, `edit`, `version`, `mix`, `dub`
6. Trim whitespace

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

## Out of Scope

- Language-specific parsing
- Fuzzy matching
