# Skill Registry — project-admin

Generated: 2026-05-02

## Project Conventions

| File | Purpose |
|------|---------|
| `agents.md` | Project overview, stack, architecture, conventions, agent instructions |

### Key Conventions (from agents.md)
- Framework: Astro SSR (`output: 'server'`) + Vercel adapter
- Language: TypeScript strict mode
- Styling: Tailwind CSS v4
- DB: Turso (LibSQL) via Drizzle ORM — no raw SQL
- Mobile-first: every component must work on small screens
- No auth — single user personal tool
- `src/db/schema.ts` — all DB schema
- `src/db/queries/` — all DB queries
- `src/pages/api/` — server endpoints
- `src/components/` — shared components
- `src/layouts/` — layouts
- `src/types/` — TypeScript types

## User Skills

| Skill | Trigger |
|-------|---------|
| `go-testing` | Writing Go tests, using teatest, adding test coverage |
| `skill-creator` | Creating new AI skills, adding agent instructions, documenting patterns |
| `branch-pr` | Creating a pull request, opening a PR, preparing changes for review |
| `judgment-day` | "judgment day", "review adversarial", "dual review", "doble review", "juzgar" |
| `issue-creation` | Creating a GitHub issue, reporting a bug, requesting a feature |

## Compact Rules

### All agents working on this project MUST follow:

```
STACK: Astro SSR + TypeScript strict + Tailwind v4 + Turso + Drizzle ORM
DB: Use Drizzle for ALL DB operations — no raw SQL ever
STRUCTURE:
  - src/db/schema.ts → schema definitions
  - src/db/queries/ → all queries
  - src/pages/api/ → server endpoints
  - src/components/ → UI components
  - src/layouts/ → page layouts
  - src/types/ → TypeScript types
MOBILE: Every component must be mobile-first and responsive
AUTH: No auth system — single user personal tool
TYPES: All API responses must be typed
```
