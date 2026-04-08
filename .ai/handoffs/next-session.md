# Next Session Handoff

## Last Session: 2026-04-07 (Session 1 — Scaffold Night)

## What Happened This Session

- Initialized git repo + npm workspaces monorepo
- Created `@ally-waste/shared-types` with all domain models, enums, DTOs, offline types
- Scaffolded NestJS API with 9 domain modules + health endpoint + Swagger at `/spec`
- Scaffolded admin-web with Vite + React + Bootstrap + TanStack Query + Zustand
- Scaffolded worker-mobile with Expo + dev-client for iOS simulator
- Downloaded iOS 26.4 simulator runtime and completed first native build
- All 3 apps verified running:
  - API: `http://localhost:3000/api` + `/api/health` + `/spec`
  - Admin: `http://localhost:5173`
  - Mobile: iOS simulator via `npx expo run:ios`
- Updated `.ai/` memory files for this project
- Pushed to `https://github.com/jdavault/ally-waste-poc`

## What's Done

- Monorepo structure with npm workspaces
- `packages/shared-types/` — complete domain type system
- `apps/api/` — NestJS with 10 modules (9 domain + health), Swagger, CORS, validation pipe
- `apps/admin-web/` — Vite + React with all deps, shared-types verified
- `apps/worker-mobile/` — Expo with dev-client, iOS native build done, shared-types verified in simulator
- Brand assets in `asset/images/` (logo, favicons, screenshots, mobile reference)
- Color palette: Navy `#101A30`, Green `#7EB141`, Accent `#00D084`, Gray `#F1F3F5`, Text `#32373C`
- Remote: `origin -> https://github.com/jdavault/ally-waste-poc`

## Dev Workflow (3 terminals)

```
npm run dev:api      # NestJS on :3000
npm run dev:admin    # Vite on :5173
npm run dev:mobile   # Expo dev-client (connects to iOS simulator)
```

First time mobile: `cd apps/worker-mobile && npx expo run:ios`
After that: `npm run dev:mobile` from root

## What's NOT Done Yet

- In-memory repository implementations (all modules are empty shells)
- Seed data
- REST endpoint implementations
- Admin dashboard pages (router, layout, dashboard, properties, routes, workers)
- Worker app screens (navigation, worker select, route view, stop actions)
- Offline-first outbox pattern
- GPS capture
- Docker
- GitHub Actions CI/CD
- Cloud Run deployment
- Prisma schema
- README

## Next Session: Wed 4/8 — Build Day (Full Day)

### Morning Priority: API (3-4 hours)

1. In-memory repositories for all 9 modules with seed data
   - 2 properties, 4 buildings, ~20 units, 3 workers, 2 routes with stops
2. All REST endpoints:
   - Properties: GET /properties, GET /properties/:id
   - Buildings: GET /properties/:id/buildings, GET /buildings/:id/units
   - Workers: GET /workers, GET /workers/:id/today-route
   - Routes: GET /routes, GET /routes/:id, GET /routes/:id/stops, POST /routes, POST /routes/:id/assign-worker
   - Route Stops: POST /route-stops/:id/complete, /miss, /issue
   - Sync: POST /sync/mobile-actions
   - Tracking: POST /workers/:id/location-ping
   - Events: GET /routes/:id/events
3. DTO validation with class-validator
4. Swagger decorators on all endpoints
5. Event logging on every mutation

### Afternoon Priority: Admin Web (3-4 hours)

1. React Router setup with layout (navy sidebar + content area)
2. Dashboard page (route summary cards, today's activity)
3. Properties list page
4. Routes list page with status badges
5. Route detail page (stop list, progress bar, event timeline)
6. Workers list page
7. All pages wired to API with TanStack Query
8. Ally Waste brand styling with Bootstrap

### Evening Priority: Worker Mobile (2 hours)

1. Navigation setup (Expo Router or React Navigation)
2. Worker select screen
3. Today's Route screen
4. Stop list + Stop detail with complete/miss/issue buttons
5. Wire to API with TanStack Query

## Decisions Made

- npm workspaces (not Turborepo)
- Modular monolith — clean module boundaries, one deployable
- In-memory repos behind `IRepository<T>`
- expo-dev-client for local iOS simulator dev (not Expo Go)
- Swagger at `/spec`, API prefix at `/api`
- Standard TS enums in shared-types (disabled `erasableSyntaxOnly` in Vite tsconfig)
- CORS enabled globally for dev
- Bootstrap (not Tailwind) per plan spec

## Resume Context

Everything is scaffolded, verified, and pushed. Tomorrow is the big build day — fill in the API with real endpoints and seed data first (both frontends depend on it), then build admin dashboard pages, then worker app screens.
