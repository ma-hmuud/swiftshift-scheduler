# Employee Scheduler (Swift Shift)

A Next.js app for scheduling shifts across managers and employees: communities, calendars, availability, and shift requests, backed by PostgreSQL, Drizzle ORM, and tRPC.

## Requirements

### Runtime and tooling

- **Node.js** (LTS recommended)
- **pnpm** `10.x` (see `packageManager` in `package.json`)
- **PostgreSQL** for `DATABASE_URL`

### Environment variables

Variables are validated at build/runtime via `src/env.js`. Create a `.env` in the project root (you can start from `.env.example` and align names with the schema below).

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `BETTER_AUTH_URL` | Base URL of the app for auth (e.g. `http://localhost:3000` in dev) |
| `BETTER_AUTH_SECRET` | Required in **production**; optional in development |
| `BETTER_AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `BETTER_AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

For CI or Docker builds where env is injected later, you can set `SKIP_ENV_VALIDATION` to skip validation (see `env.js`).

### Install and run

```bash
pnpm install
cp .env.example .env   # then fill values to match src/env.js
pnpm db:push             # or db:migrate after generating migrations
pnpm dev
```

Other useful scripts: `pnpm build`, `pnpm check` (eslint + TypeScript), `pnpm db:studio`.

## Project structure (`src/`)

High-level layout (see `src/file-tree.md` for a full generated tree).

| Area | Purpose |
|------|---------|
| **`app/`** | Next.js App Router: landing, `login`, `dashboard`, role layouts under `employee/` and `manager/`, `onboarding/` (create/join community), and API routes |
| **`app/api/`** | `auth/[...all]` (Better Auth), `trpc/[trpc]` (tRPC handler) |
| **`components/`** | UI: `landing/`, `layout/` (sidebars, shell), `features/` (availability, dashboard, shifts), `calendar/`, `brand/`, shared `ui/` |
| **`lib/`** | Client/shared helpers: calendar visuals, invite codes, datetime, Zod schemas, shift time/overlap utilities |
| **`server/`** | `api/` tRPC routers, procedures, repositories; `better-auth/`; `db/` Drizzle schemas; `community/` membership |
| **`styles/`** | Global CSS |
| **`trpc/`** | React Query client setup for tRPC |

## Stack

- **Framework:** Next.js 16 (App Router), React 19  
- **API:** tRPC 11, TanStack React Query  
- **Auth:** Better Auth (Google OAuth), Drizzle adapter  
- **Data:** Drizzle ORM, PostgreSQL  
- **UI:** Tailwind CSS 4, Radix UI, FullCalendar  

## Expected future plan

Work is organized in vertical slices so each role-specific flow is usable end-to-end before layering polish.

1. **Manager shift creation (finish Feature 2)** — Solidify create/list/edit flows in the manager calendar and dashboards; align UI with existing shift procedures.
2. **Employee shift requests (Feature 3)** — Surface available shifts, request actions, and “my shifts” / calendar views wired to `shiftRequests` and shifts APIs.
3. **Manager approvals (Feature 4)** — Complete the manager `requests` experience: pending list, approve/reject, and clear empty/loading states.
4. **Onboarding and communities** — Harden create/join community flows and invite-code behavior across manager and employee entry paths.
5. **Polish and consistency (Phase 4)** — Loading and error states, accessible feedback, and visual consistency across employee and manager shells.

The checklist below tracks historical phases; update it as milestones land.

### Development checklist

#### Phase 1: Foundation

- [x] Tech stack setup (Next.js, tRPC, Drizzle, etc.)
- [x] Define database schema in Drizzle

#### Phase 2: Core data layer (tRPC)

- [x] Auth — signup, login, session management
- [x] Manager setup — communities, employees
- [x] Shift CRUD (manager)
- [x] Availability
- [x] Shift requests — submit, approve/reject (by role)

#### Phase 3: UI (feature by feature)

- [x] Feature 1: Auth flow
- [x] Manager dashboard (in progress toward full “manager creates shifts” slice)
- [ ] Feature 2: Manager creates shifts — forms, list/calendar, end-to-end testing
- [ ] Feature 3: Employee requests shifts
- [ ] Feature 4: Manager approves requests

#### Phase 4: Polish

- [ ] Loading states, error handling, styling consistency

---
