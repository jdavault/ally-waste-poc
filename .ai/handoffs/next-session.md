# Next Session Handoff

## Last Session: 2026-04-08 (Session 2 — Build Day)

## What Happened This Session

- **API Complete**: All 9 modules implemented with in-memory repositories, seed data, and DTO validation.
- **Backend Live**: Dockerized the API and deployed to **GCP Cloud Run** via GitHub Actions.
- **Admin Web Modernized**: Swapped Bootstrap for **Tailwind CSS**. Built full operational dashboard with search, filtering, and pagination.
- **Worker Mobile Functional**: 
  - Implemented React Navigation (Login → Home → Route → Stop Detail).
  - Built **Offline-First Outbox** with automatic/periodic sync logic.
  - Integrated **GPS capture** on stop actions.
  - Unified local development port to **8080** for consistency.
- **DevOps**: Established CI/CD pipeline (Lint → Build → Deploy) and verified Artifact Registry flow.

## What's Done ✅

- **Backend**: Modular NestJS API with event logging and batch sync support.
- **Frontend**: Responsive Tailwind Admin Dashboard with Sidebar and data-dense views.
- **Mobile**: Persistent Auth + Offline Store (Zustand + AsyncStorage).
- **Cloud**: Automated deployment to `https://ally-waste-api-399534668698.us-central1.run.app/spec`.

## Dev Workflow (Root Scripts)

```bash
npm run dev:api           # NestJS on :8080 (Watcher enabled)
npm run dev:admin         # Vite on :5173
npm run dev:mobile:clear  # Expo Bundler with cache clear
npm run ios:mobile        # Full Native Build & Install
```

## What's NOT Done Yet ⏳

- **GCP Networking**: Global Load Balancer, Serverless NEG, and Static IP reservation.
- **Frontend Deployment**: Host Admin Web on GCS or Firebase Hosting.
- **Native Assets**: iOS/Android icon and splash screen need a fresh native generation to show custom brand assets.
- **Persistence**: Prisma schema and Postgres migration (currently in-memory).

## Next Session: Thu 4/9 — Networking & Refinement

### 1. GCP Infrastructure (Morning)
- Reserve Global Static IP.
- Create Serverless NEG for the Cloud Run backend.
- Set up Load Balancer with URL Map (`/api/*` -> backend, `/*` -> frontend).
- Configure SSL certificate.

### 2. Frontend Cloud Deploy
- Build `admin-web` for production.
- Deploy to GCS Bucket or Firebase Hosting behind the Load Balancer.

### 3. Mobile "Fresh Start"
- Nuke `ios` folder and run `npx expo prebuild` to force brand asset generation.
- Refine "Report Issue" flow with photo upload capability (simulated or real GCS upload).

### 4. Data Layer (Interview Talking Point)
- Create Prisma schema matching in-memory models (properties, buildings, units, routes, stops, workers, schedules, pings, events).
- Document indexing strategy and migration path.
- Do NOT block on full Postgres integration — schema alone is a strong signal.

### 5. Final Polish (Afternoon)
- README with architecture overview, local setup, cloud deployment, module boundaries.
- Architecture diagram (modular monolith, Cloud Run, ALB, GCS).
- Prepare interview talking points: why modular monolith, why Zustand over Redux, offline-first outbox pattern, Cloud Run + ALB architecture.

## Decisions Made

- **Port Strategy**: API defaults to 8080 for Cloud Run production, but local `dev:api` runs on port 3000. Mobile API client uses 3000 for local dev, Cloud Run URL via env var for production.
- **Tailwind Pivot**: Moved away from Bootstrap for a more "senior" modern look.
- **Metro Config**: Forced React to resolve from mobile app's LOCAL node_modules (19.1.0) to avoid conflict with root's 19.2.4 (from admin-web). react-native resolves from root (hoisted by npm).
- **Dockerfile Structure**: Preserved workspace nested paths in `dist` to avoid startup failures.
- **shared-types**: Compiled to dist/ with commonjs output. API resolves via npm workspace symlink (no tsconfig paths needed).

## Resume Context

The core application is functionally complete. The backend is live and serving traffic. The Admin UI is premium and searchable. The Mobile app handles offline field work. Tomorrow (Day 3) is about production-grade networking and final polishing for the **Friday 4/10 2pm interview**.
