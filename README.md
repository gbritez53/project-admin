# Project Admin

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

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate migrations
pnpm db:generate

# Push to database
pnpm db:push

# Run dev server
pnpm dev
```

## Environment Variables

Create a `.env` file:

```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

## Database

```bash
# Generate migrations
pnpm db:generate

# Push schema to Turso
pnpm db:push

# Run migrations
pnpm db:migrate
```

## Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## Project Structure

```
src/
├── db/
│   ├── client.ts       # Turso connection
│   ├── schema.ts     # Drizzle schema
│   └── queries/     # DB operations
├── lib/
│   ├── money.ts     # Money parsing/formatting
│   ├── ulid.ts    # ID generation
│   ├── test-db.ts  # Test helper
│   └── validation/  # Zod schemas
├── components/     # Astro components
├── layouts/      # Page layouts
└── pages/        # Routes
```

## Features

- **Projects** — Create and manage projects with name, description, status
- **Requirements** — Add, edit, and track requirements per project
- **Expenses** — Track costs and calculate totals per project
- **Links** — Save external links with title, URL, and description
- **Notes** — Quick notes and ideas per project

## API Endpoints

| Method | Path | Purpose |
|-------|------|---------|
| POST | `/api/projects` | Create project |
| PATCH | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/requirements` | Create requirement |
| PATCH | `/api/requirements/[id]` | Update requirement |
| DELETE | `/api/requirements/[id]` | Delete requirement |

## License

ISC