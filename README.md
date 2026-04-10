# Ally Waste POC

Ally Waste is a field-operations proof of concept for coordinating property collection routes, tracking service execution, and giving dispatchers live operational visibility across web and mobile clients.

## Overview

This repository is structured as a full-stack workspace:

- `apps/api`: NestJS backend with route management, event logging, sync ingestion, and location tracking.
- `apps/admin-web`: React/Vite operations dashboard for route oversight and live timeline monitoring.
- `apps/worker-mobile`: Expo/React Native field app for route execution, stop completion, and offline-first action capture.
- `packages/shared-types`: shared DTOs, enums, models, offline contracts, and geospatial utility logic used across all apps.

## API

The backend is a modular NestJS service that acts as the orchestration layer for routes, stops, workers, properties, tracking pings, sync batches, and event history.

Key technical responsibilities:

- Route lifecycle management: create routes, assign workers, start routes, complete or miss stops, and auto-close a route once every stop leaves the `PENDING` state.
- Event-driven audit trail: operational actions are persisted as event logs such as `ROUTE_STARTED`, `STOP_COMPLETED`, `STOP_ISSUE`, `STOP_MISSED`, `ROUTE_COMPLETED`, `LOCATION_PING`, and `SYNC_BATCH`.
- Geospatial classification: when a worker completes a stop or reports an issue, the API compares captured GPS coordinates against the target building coordinates using a shared Haversine implementation.
- Proximity scoring: events are enriched with distance in meters, distance in miles, and a human-readable proximity band:
  - `ON_SITE` for <= 40 meters
  - `NEARBY` for <= 150 meters
  - `FAR_AWAY` beyond that threshold
- Mobile sync ingestion: the API accepts batches of offline-captured mobile actions and replays them server-side so route state, event history, and tracking remain consistent.
- Real-time delivery: the event gateway broadcasts route-specific updates to Socket.IO rooms and also emits a global activity stream for broader admin visibility.

The API section is still evolving, but even in POC form it already demonstrates the important backend interview themes: modular boundaries, shared contracts, event broadcasting, and business logic that ties geospatial validation to operational workflow.

## Admin Webpage

The admin dashboard is designed as an operations control surface rather than a static CRUD frontend. The most important part of the web app is that it turns backend event flow into live route awareness.

What it solves:

- Gives dispatch or operations staff a live view of route progress.
- Lets them inspect route stop hierarchy in execution order.
- Surfaces stop outcomes, issues, misses, and completion timing without manual refresh.
- Makes geospatial validation visible in plain language so supervisors can reason about whether service happened on-site, nearby, or far away.

Key technical details worth talking through:

- Live route subscriptions over WebSockets:
  - The web app opens a Socket.IO connection using the same API environment base URL.
  - When a route detail page loads, the client joins a route-specific room with `join-route`.
  - On unmount, it leaves the room and disconnects cleanly.
- Targeted real-time fan-out:
  - The backend emits `route-event` only to the relevant `route:{routeId}` room.
  - That keeps the live update model scoped to the route being monitored instead of broadcasting every event to every page.
- Hybrid REST + WebSocket state model:
  - The page loads baseline route, stop, and event history over REST.
  - Incoming WebSocket events are merged into the UI immediately.
  - TanStack Query invalidation refreshes the authoritative route and stop data after a live event lands.
- Race-condition handling:
  - The route timeline merges fetched history with live events.
  - Deduplication by event ID prevents the classic fetch-then-subscribe duplication bug if an event arrives while the initial request is in flight.
- Geospatial transparency in the UI:
  - Event timeline entries render proximity labels and distance values from the backend event payload.
  - That means supervisors are not just seeing "stop completed"; they are seeing contextualized operational evidence.
- Operationally useful presentation:
  - Progress bars update from route-stop state.
  - Stop hierarchy is sequence-aware.
  - The timeline acts like a lightweight event stream for route execution, issues, and route completion.

From an interview perspective, the admin app is strong because it shows real-time systems thinking: scoped subscriptions, cache invalidation, event reconciliation, and using geospatial metadata to improve trust in the operational workflow.

## Mobile App

The worker app is where the most practical field-operations logic lives. It is intentionally built around the reality that a service worker may have inconsistent connectivity, may need to act quickly, and still needs location-aware proof of work.

What it solves:

- Gives a worker their assigned route for the day.
- Shows stop hierarchy in execution order.
- Captures completion, missed-stop, and issue-report actions directly at the stop level.
- Associates those actions with location data so the system can compare actual worker position against the expected building position.
- Preserves productivity when connectivity is unreliable by queueing actions locally and syncing them later.

Key technical aspects:

- Offline-first outbox design:
  - Worker actions are stored locally before server confirmation.
  - This prevents blocked workflows when the device is offline or on weak mobile data.
- Best-effort immediate sync:
  - After an action is queued, the app attempts an immediate background sync.
  - If the network is unavailable, the action remains safely in the outbox.
- Automatic recovery:
  - The sync service watches network connectivity changes.
  - It also retries periodically on an interval, which gives the app eventual consistency without forcing the user to manage recovery manually.
- Optimistic UI behavior:
  - As soon as the worker marks a stop complete, missed, or issue, local React Query cache is updated.
  - That means the interface reflects progress immediately instead of waiting for round-trip latency.
- On-device geospatial feedback:
  - The stop detail screen requests foreground GPS permission and reads the current device position.
  - It computes proximity locally against the target building coordinates using the shared geospatial utility package.
  - The worker can see a live label like `On-site`, `Nearby`, or `Far away` before submitting the action.
- Shared geospatial rules across clients and server:
  - The same distance/proximity logic is reused in shared types, reducing drift between what the worker sees and what the backend records.
  - That is important because it keeps UX feedback and audit logic aligned.
- Route execution model:
  - Workers fetch today's assigned route.
  - They can start the route, review sequence-ordered stops, open a stop, capture notes, and submit service outcomes.
  - Those actions later show up in the admin dashboard timeline through the backend event system.

This is the part of the system I would emphasize most in an interview because it demonstrates real operational problem solving: geospatial validation, offline resiliency, optimistic UX, sync orchestration, and the handoff from mobile field activity into live back-office visibility.

## Tech Stack

- Backend: NestJS, Socket.IO, Swagger, class-validator, UUID, in-memory repositories
- Admin web: React, Vite, TanStack Query, React Router, Tailwind CSS, Lucide
- Mobile: Expo, React Native, TanStack Query, Zustand, NetInfo, Expo Location
- Shared contracts: TypeScript workspace package for DTOs, models, offline payloads, and proximity utilities
- DevOps: Docker, GitHub Actions, GCP Cloud Run

## Local Development

### Prerequisites

- Node.js 22+
- Docker and Docker Compose

### Run the apps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API:
   ```bash
   npm run dev:api
   ```
3. Start the admin web app:
   ```bash
   npm run dev:admin
   ```
4. Start the mobile app:
   ```bash
   npm run dev:mobile
   ```

### Docker

Build and start the API on port `8080`:

```bash
docker compose up --build
```

## Deployment

The backend is deployed to GCP Cloud Run via GitHub Actions on pushes to `main`.

Current deployment posture:

- Cloud Run ingress restricted to `internal-and-cloud-load-balancing`
- Default `run.app` URL disabled
- Public API traffic expected through the GCP HTTPS load balancer path

## Roadmap

- Replace in-memory persistence with PostgreSQL / Cloud SQL
- Add stronger auth and tenant-aware access control
- Expand admin analytics around route efficiency and issue trends
- Add richer mobile media capture and background location workflows
