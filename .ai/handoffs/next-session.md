# Next Session Handoff

## Last Session: 2026-04-09

## Current Repo / Deploy State

- Live URLs:
  - Admin: `https://ally-admin.p3solutionsgroup.com/`
  - API Swagger: `https://ally-admin.p3solutionsgroup.com/api/spec`
- Cloud Run default URL has been disabled successfully.
- API is now intended to be reachable only through the GCP load balancer path.
- Prisma schema exists in the repo at `prisma/schema.prisma`.
- Geospatial slice is implemented:
  - shared proximity helper
  - worker stop detail shows proximity in miles
  - admin route timeline can render proximity info from event payloads
- Worker mobile navigation was improved with clearer `Back`, `Home`, `Refresh Assignment`, and `Change Operator` actions.
- Admin and mobile clients were changed to be production-first for API URLs, with localhost fallback only in development mode.

## Commits Added This Session

- `893a5bc` `feat(infra): add prisma schema and preserve lb-only api path`
- `bad0e78` `docs(plan): prioritize geospatial realtime and offline work`
- `c8f5cd5` `feat(geospatial): add stop proximity signals`
- `3cf812a` `feat(mobile): improve navigation and phoenix proximity demo`
- `da524e1` `fix(config): default clients to production api urls`
- `8230a48` `ci(admin-web): publish static assets on main`

## Important Findings

- The mobile app uses `apps/worker-mobile/.env` and currently points to:
  - `EXPO_PUBLIC_API_URL=https://ally-admin.p3solutionsgroup.com/api`
- The admin app had stale production assets at one point, which caused production to still request `localhost:8080`.
- A workflow change was added so `main` pushes now also build and upload `apps/admin-web/dist` to the frontend GCS bucket.
- That workflow failed because the GitHub Actions service account lacks GCS bucket permissions.

## Current Blocker

GitHub Actions admin-web publish step fails with:

- missing permission on bucket `ally-waste-admin-assets-<PROJECT_ID>`
- specifically `storage.buckets.get`

Likely fix:

- grant the GitHub Actions service account bucket-scoped storage permissions on the frontend bucket
- rerun the workflow

## What Still Needs To Be Done

### 1. Fix admin-web deployment permissions

The workflow at `.github/workflows/ci-cd.yml` now uploads admin-web assets, but the service account needs GCS permissions on the frontend bucket.

After permissions are fixed:

- rerun Actions
- hard refresh production admin
- verify production no longer requests `localhost:8080`
- verify API requests go to `https://ally-admin.p3solutionsgroup.com/api/...`

### 2. Fix SPA deep-link routing

Production direct loads like `/workers` were returning `404`.

This is separate from the API URL problem.

Need to verify/fix the load balancer + backend bucket SPA fallback so:

- `/api/*` goes to Cloud Run
- all non-API frontend routes serve `index.html`

### 3. Next implementation priorities

Final agreed high-value build order:

1. geospatial / logistics feature
2. small WebSocket real-time event stream
3. offline mobile refinement

Geospatial is partially done. The next real feature should be the WebSocket event stream unless deploy/regression issues take priority.

### 4. Offline refinement target

The user wants production-grade offline discussion and likely implementation around:

- durable outbox
- client-generated action IDs
- action states: `pending`, `syncing`, `synced`, `failed`
- last successful sync time
- worker-visible sync state
- retry handling
- idempotent backend processing

## Current Local Worktree State

- Only untracked draft file left:
  - `ally-waste-butal-feedback.md`

## Key Files To Inspect Next

- `.github/workflows/ci-cd.yml`
- `apps/admin-web/src/api/client.ts`
- `apps/worker-mobile/src/api/client.ts`
- `apps/worker-mobile/src/screens/StopDetailScreen.tsx`
- `apps/api/src/modules/routes/routes.service.ts`
- `apps/api/src/seed/seed-data.ts`
- `prisma/schema.prisma`

## Suggested First Move Next Session

1. Fix the GCS bucket IAM for the GitHub Actions service account.
2. Rerun the workflow.
3. Verify production admin requests the correct `/api` host.
4. Fix SPA route fallback if `/workers`, `/routes`, etc. still 404 on direct load.
5. Then continue with WebSockets.
