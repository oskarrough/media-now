# Project Setup

> Initialize TypeScript project with vitest and ESM configuration.

## Requirements

- Create package.json with name `media-now`, type `module`, exports field
- Create tsconfig.json targeting ES2022, ESM output, strict mode
- Create vitest.config.ts
- Create src/index.ts with placeholder export
- Setup Biome for linting/formatting (no semicolons)

## Implementation Notes

- Use `"type": "module"` for ESM
- Exports field should point to `./dist/index.js` (built output)
- tsconfig should enable `"strict": true`, `"moduleResolution": "bundler"`
- Use standard `typescript` package
- This is the foundation - keep it minimal

### Biome Setup

Install: `bun add -d @biomejs/biome`

Config (`biome.jsonc`):
```jsonc
{
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded"
    }
  },
  "linter": { "enabled": true },
  "formatter": { "enabled": true, "indentStyle": "tab" }
}
```

Add scripts: `"lint": "biome check src/"`, `"format": "biome format --write src/"`

## Testing Strategy

### Unit tests (100% coverage)

- **Pure functions** (`parse-url.ts`, `parse-title.ts`) - Direct unit tests
- Run with `bun test` and `bun test --coverage`

### Integration tests (manual, not in CI)

- **Provider modules** - Test against real APIs
- **Entry points** (`get-media.ts`, `discover.ts`)
- Create `scripts/test-providers.ts` with known IDs:
  - `youtube.fetch("dQw4w9WgXcQ")`
  - `vimeo.fetch("76979871")`
  - `spotify.fetch("4cOdK2wGLETKBW3PvgPWqT")`
  - `discogs.fetch("1")`
  - `musicbrainz.search("Bohemian Rhapsody")`
  - `soundcloud.fetch("forss/flickermood")`
- Add script: `"test:integration": "bun run scripts/test-providers.ts"`

### Exempt from coverage

- **Type-only files** (`types.ts`, `errors.ts`) - No runtime logic
- **Network code** (providers) - Covered by integration tests

## Out of Scope

- Actual library code
- CI/CD configuration
- Publishing configuration
