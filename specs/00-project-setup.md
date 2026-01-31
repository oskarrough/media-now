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

## Out of Scope

- Actual library code
- CI/CD configuration
- Publishing configuration
