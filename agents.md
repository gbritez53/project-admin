# Project Admin — Agent Context

## Project Overview

Personal project manager to keep all project information organized in one place: requirements, expense calculations, external links, and quick notes. Accessible from any device including mobile.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro (SSR mode) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Turso (LibSQL) |
| ORM | Drizzle ORM |
| Deploy | Vercel |

## Core Features

1. **Projects** — Create and manage projects with name, description, status
2. **Requirements** — Add, edit, and track requirements per project
3. **Expenses** — Track costs and calculate totals per project
4. **Links** — Save external links with title, URL, and description
5. **Notes** — Quick notes and ideas per project

## Architecture

- Astro SSR via `output: 'server'` with Vercel adapter
- Server endpoints (`src/pages/api/`) for all data mutations
- Drizzle ORM for type-safe DB queries against Turso
- Mobile-first responsive UI

## Conventions

- All DB schema in `src/db/schema.ts`
- All DB queries in `src/db/queries/`
- API endpoints in `src/pages/api/`
- Shared components in `src/components/`
- Layouts in `src/layouts/`
- Types in `src/types/`

## Environment Variables

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Agent Instructions

- Always use TypeScript strict mode
- Use Drizzle for ALL database operations — no raw SQL
- All API responses must be typed
- Mobile-first: every component must work on small screens
- No auth for now — single user personal tool
