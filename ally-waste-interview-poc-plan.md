# Ally Waste Interview POC Plan (v2)

A fast-moving, interview-focused proof of concept designed to show strong full-stack judgment, React + React Native capability, NestJS architecture, offline-capable mobile thinking, containerization, CI/CD discipline, and a credible cloud path on GCP.

This is not meant to be a production build. It is a believable field-operations platform that you can stand up quickly, explain clearly, and extend if there is extra time.

## Current Reality

What the repo already demonstrates well:

- React admin dashboard deployed and usable
- Expo / React Native worker flow with queued offline actions
- NestJS modular monolith with separate domain modules
- shared TypeScript contracts across apps
- Dockerized backend
- GitHub Actions CI/CD path to GCP Cloud Run

What should be framed as next-step hardening rather than complete:

- private Cloud Run ingress behind a load balancer
- GCP-native edge protection, caching, and traffic control
- Cloud SQL provisioning and production Postgres wiring
- real-time event delivery to operations staff
- stronger offline sync guarantees and partial-failure handling
- geospatial routing / distance-aware operational logic

## Interview Positioning

The right senior framing is:

- built an end-to-end operations POC across admin, mobile, and API
- chose a modular monolith deliberately for delivery speed and clean boundaries
- implemented an offline-capable worker workflow with queued sync
- added operational visibility through real-time and geospatial features where they matter
- shipped a Docker artifact and a lightweight CI/CD path to Cloud Run
- identified the next infra steps: private ingress, GCP-native protection, persistence, observability, and geospatial optimization

## Goal

Build a small but credible “Ally Waste”-style platform with:

- an **Admin Dashboard (React web)**
- a **Worker App (React Native / Expo)**
- a **Backend API (NestJS)**
- a **Postgres-ready schema design**
- a **Dockerized backend**
- a **basic CI/CD pipeline with GitHub Actions**
- a **deployment path to GCP Cloud Run**

The main purpose is to demonstrate:

- senior-level architecture and decision-making
- modern React and React Native patterns
- practical state management
- offline-first mobile design
- operational workflows
- cloud readiness
- containerization and delivery discipline
- AI-assisted development speed

---

## Final Stack

### Admin Web

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack Query
- React Router
- React Hook Form
- Zod
- Zustand

### Mobile Worker App

- Expo
- React Native
- TypeScript
- Zustand
- TanStack Query
- React Context where appropriate
- AsyncStorage
- expo-location
- NetInfo
- React Navigation

### Backend API

- NestJS
- TypeScript
- REST API
- in-memory repositories first
- repository abstraction so Postgres can be added cleanly later
- DTO validation
- event log / route status history
- Dockerized for local and Cloud Run deployment

### Database Design

- relational schema documented for PostgreSQL migration
- Prisma schema checked into the repo
- do not block implementation on the DB being complete
- model relationships clearly enough to discuss indexing, scaling, and migration path

### Delivery / Ops

- Docker for backend containerization
- GitHub Actions for CI/CD
- GCP Cloud Run for API deployment
- GCP HTTPS Load Balancer in front of Cloud Run
- GCP-native security and traffic controls where helpful

---

## Architectural Positioning

The backend should be a **modular monolith** that behaves like a set of microservices without the operational overhead of true distributed services.

That means:

- separate business modules
- explicit service boundaries
- isolated repositories
- event-oriented thinking
- clean contracts between modules

But still:

- one repo
- one deployable backend service
- one container
- one Cloud Run service

### Why this is the right call

You do not have time to build, orchestrate, observe, and debug real microservices in three days.

A modular monolith lets you say:
“I deliberately chose a modular monolith for speed and clarity. The module boundaries are clean enough to split later if scale or team topology ever demanded it.”

That is a strong senior answer.

---

## State Management Recommendation

This project should not use Redux unless there is a very specific reason.

### Use:

- **TanStack Query** for server state
- **Zustand** for app-level client state
- **React Context** for stable cross-cutting concerns like auth, config, theme, connectivity, and environment
- **custom hooks** to encapsulate domain logic and keep components clean

### Why this is the best fit

- fast to build
- low ceremony
- easy for Claude/Codex to generate and maintain
- works well in both web and mobile
- clean separation between server cache and local app state
- supports persisted mobile state and offline-first behavior

---

## Product Concept

This POC represents a waste valet / apartment service operations platform.

### Admin Dashboard

For property managers and operations staff:

- manage properties
- manage buildings and units
- manage pickup schedules
- assign routes to workers
- track route status
- review route events and issues
- view worker location updates or completion events

### Worker App

For on-site field workers:

- view assigned route
- see stops / units to service
- mark pickups complete
- mark stops missed
- report issues
- capture GPS location during events
- work offline and sync later

---

## Core Domain Model

### Property

- id
- name
- address
- timezone
- geo coordinates
- active status

### Building

- id
- propertyId
- name or number
- access notes
- geo coordinates

### Unit

- id
- buildingId
- unitNumber
- floor
- service notes
- pickup instructions
- active status

### Pickup Schedule

- id
- propertyId
- daysOfWeek
- timeWindowStart
- timeWindowEnd
- active
- special instructions

### Worker

- id
- name
- phone
- vehicle type
- active

### Route

- id
- propertyId
- workerId
- serviceDate
- status
- startedAt
- completedAt

### Route Stop

- id
- routeId
- buildingId
- unitId
- sequence
- status
- completion timestamp
- GPS lat/lng
- issue code
- optional photo URL

### Vehicle Ping

- id
- workerId
- routeId
- timestamp
- lat
- lng
- speed optional
- heading optional

### Event Log

- id
- entityType
- entityId
- eventType
- payload
- createdAt

---

## Relational Database Design (Postgres / Prisma)

### Tables

- properties
- buildings
- units
- pickup_schedules
- workers
- routes
- route_stops
- vehicle_pings
- event_log

### Relationships

- property has many buildings
- building has many units
- property has many schedules
- worker has many routes
- route has many route stops
- route stop belongs to route, unit, and building
- worker pings belong to worker and optionally route

### Important indexes

- routes `(worker_id, service_date)`
- route_stops `(route_id, sequence)`
- vehicle_pings `(route_id, timestamp desc)`
- units `(building_id, unit_number)`
- pickup_schedules `(property_id, active)`

---

## Backend Design: Modular Monolith That Feels Like Microservices

### Suggested modules

- properties
- buildings
- units
- schedules
- workers
- routes
- tracking
- sync
- events

Each module should have:

- controller
- service
- DTOs
- repository contracts
- repository implementation
- domain types / mappers as needed

### Why this matters

This gives you clean separation and a microservice-like mental model without paying the cost of:

- service discovery
- network boundaries
- multiple repos
- distributed tracing
- local orchestration complexity
- deployment sprawl

---

## Docker Strategy

Yes — the plan should absolutely include Dockerizing the backend.

### Why Docker belongs here

- local dev consistency
- easy Cloud Run deployment target
- credible modern backend workflow
- cleaner handoff between you, Claude, and Codex
- stronger interview signal around platform maturity

### Scope

Only Dockerize the **backend API** for this sprint.

You do not need to containerize the web app or mobile app right now.

### Backend Docker goals

- run API locally in Docker
- support local env vars
- expose standard port
- build once, run locally or in Cloud Run
- optionally support a future Postgres service via docker-compose

### Recommended files

- `apps/api/Dockerfile`
- `.dockerignore`
- optional `docker-compose.yml` at repo root for local backend + postgres later

### Dockerfile shape

Use a multi-stage build.

Example structure:

- base image: `node:22-alpine`
- install deps
- build Nest app
- copy dist + production deps
- run `node dist/main.js`

### Good local workflow

- local dev: run Nest directly for fastest feedback
- container validation: use Docker before pushing to cloud
- cloud deploy: same container to Cloud Run

### Interview framing

“I optimized local development for speed, but still Dockerized the backend so the deployment artifact matched Cloud Run and the team had a consistent runtime.”

That is exactly the right answer.

---

## CI/CD Strategy with GitHub Actions

Yes — this should be in the plan too.

Not elaborate enterprise CI/CD. Just enough to show discipline.

### Goals

- validate code on push / PR
- build the backend
- optionally build the admin app
- optionally build Docker image
- optionally deploy backend to Cloud Run on main

### Minimum useful pipeline

#### CI workflow

On pull request / push:

- install dependencies
- lint
- typecheck
- run tests if present
- build backend
- optionally build admin app

#### CD workflow

On push to `main`:

- authenticate to GCP
- build Docker image
- push image to Artifact Registry
- deploy to Cloud Run

### Good interview value

This shows:

- practical DevOps maturity
- confidence in containerized delivery
- awareness of deployment automation
- ability to leave behind a maintainable workflow

### What not to do

Do not spend half a day creating an overengineered pipeline.
A clean, small pipeline is enough.

---

## Cloud / Deployment Shape

### POC deployment target

- backend API on **Cloud Run**
- admin web deployed separately as static assets
- GCP HTTPS Load Balancer fronts the API
- GCP-native protection can be layered on without changing the app architecture
- Cloud SQL documented as next step, not required for POC

### Network / Security target state

The target posture should be:

- Cloud Run is not publicly invokable
- ingress is restricted to the load balancer
- `/api` routes from the load balancer to the backend service
- the public admin site talks to the API through the controlled edge path

Do not claim this is complete unless the deployed service has actually been changed to match.

### Optional GCP Hardening Scope

If you add more edge protection in this POC, keep it narrow:

- validate the load balancer and ingress posture end to end
- add GCP-native WAF / DDoS mitigation only if it is low-risk
- keep caching strategy conservative for dynamic API routes
- document where static asset caching happens today and where it could be improved later

### Why Cloud Run

- perfect match for one containerized Nest backend
- minimal ops burden
- fast path to a real deployment
- easy to explain
- strong GCP-native answer

### Future path

- Cloud SQL for PostgreSQL
- Cloud Storage for issue photos and exports
- Cloud Tasks / PubSub for async jobs
- Cloud Functions or Cloud Run Jobs for short-lived work

---

## Three-Day Build Plan

You have three full days. That is enough to produce a much stronger result than a rushed two-day build.

The win condition is:

1. working admin app
2. working worker app
3. working modular Nest API
4. offline-capable mobile flow
5. Dockerized backend
6. basic GitHub Actions pipeline
7. Prisma schema defined in-repo
8. API deployed to Cloud Run behind the desired ingress posture
9. clean README and architecture story
10. one educational geospatial capability

---

## Final Worth-Doing List

The highest-signal remaining work is:

1. geospatial / logistics capability
2. small WebSocket real-time event stream
3. offline mobile refinement
4. admin and mobile operational fidelity
5. Prisma / Postgres path with strong judgment
6. light GCP-native hardening only if low risk

The first three are the core implementation priorities.

---

# Day 1 - Core Product Skeleton + End-to-End Basics

## Target outcome

- workspace running
- shared types defined
- modular Nest API in-memory backend working
- admin app can view routes/properties
- worker app can load today’s route
- basic route completion works end-to-end

## Suggested workspace structure

```txt
ally-waste-poc/
  apps/
    admin-web/
    worker-mobile/
    api/
  packages/
    shared-types/
    shared-utils/
  .github/
    workflows/
```

## Step 1 - Scaffold apps and shared package

### Admin web

- Vite
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- React Router
- React Hook Form
- Zod

### Mobile app

- Expo
- TypeScript
- Zustand
- TanStack Query
- AsyncStorage
- NetInfo
- expo-location

### API

- NestJS
- TypeScript
- class-validator
- uuid

## Step 2 - Define shared types first

Create shared contracts for:

- Property
- Building
- Unit
- PickupSchedule
- Worker
- Route
- RouteStop
- VehiclePing
- EventLog
- enums for statuses and issue codes

## Step 3 - Build the modular API

Create modules:

- properties
- buildings
- units
- schedules
- workers
- routes
- tracking
- sync
- events

Start with in-memory seed data.

## Step 4 - Build the admin app

First pages:

- dashboard
- properties list
- routes list
- route detail
- workers list or assignment UI

## Step 5 - Build the worker mobile skeleton

Screens:

- worker select
- today’s route
- stop list
- stop detail
- sync status

---

# Day 2 - Geospatial + WebSockets + Offline Refinement

## Target outcome

- GPS and distance context are part of the workflow
- admin receives real-time route event updates
- offline behavior is more durable and visible to the worker
- backend architecture stays simple and demo-safe

## Step 1 - Add one geospatial capability

Keep this intentionally small and explainable.

Recommended options:

- use `geolib` to calculate distance from worker ping to stop location and show proximity bands
- use `@turf/distance` for server-side distance checks and simple geofence validation
- use `@turf/nearest-point-on-line` later if you decide to model route paths

Best POC-sized outcome:

- compute distance-to-stop
- surface "on-site / nearby / far away" in the worker flow or event timeline
- log the computed distance with the event payload for discussion during the interview

## Step 2 - Add a small WebSocket event stream

Keep the scope narrow and demoable.

Recommended outcome:

- broadcast route and stop events to the admin app
- update the route detail timeline in real time
- use existing event concepts instead of inventing a separate real-time model

Good events to stream:

- route started
- route completed
- stop completed
- stop missed
- issue reported
- sync batch processed

## Step 3 - Refine the offline outbox

The current queue proves the concept. The next step is to make it feel field-ready.

Add:

- durable client action IDs
- explicit action states: pending, syncing, synced, failed
- last successful sync timestamp
- manual retry for failed items
- clearer connectivity and queue status in the worker UI

If feasible, also add:

- idempotent handling on the backend for replayed mobile actions
- conflict visibility instead of silent failure

## Step 4 - Preserve event timeline support

Every route action should create an event entry, and admin should be able to consume that timeline clearly.

## Step 5 - Write initial README sections

Document:

- project purpose
- architecture
- local setup
- deployment and ingress posture
- module boundaries
- offline behavior and sync model

---

# Day 3 - Prisma + CI/CD + Cloud Run + Edge Hardening + Final Polish

## Target outcome

- GitHub Actions CI workflow exists
- optional CD workflow exists
- Prisma schema exists in-repo
- backend deploys to Cloud Run
- ingress posture is reviewed and tightened
- architecture story is polished for interview

## Step 1 - Write the Prisma schema

Deliverables:

- `schema.prisma` checked into the repo
- datasource and generator configured
- models cover the core operational entities
- indexes and relationships match the documented migration path

Important constraint:

- do not wire Prisma into the running app unless there is clear spare time after ingress
- do not provision Cloud SQL before the core demo story is safe

Interview framing:

“The schema is defined with Prisma. Swapping in a real Postgres connection is mostly Cloud SQL provisioning and `DATABASE_URL` configuration. I intentionally kept the demo runtime on in-memory repositories so I could preserve reliability while still defining the production data model.”

## Step 2 - Add GitHub Actions CI

On PR / push:

- install
- lint
- typecheck
- build API
- optionally build admin

## Step 3 - Add CD workflow if realistic

On push to main:

- auth to GCP
- build/push Docker image
- deploy to Cloud Run

If deployment automation becomes too costly in time, stop at CI and do manual Cloud Run deployment once.

## Step 4 - Lock down ingress

Target:

- remove public Cloud Run access
- restrict ingress so traffic comes through the load balancer path
- verify `/api` still works end to end
- document the exact deployment command and settings used

## Step 5 - Optional GCP edge hardening pass

Only do this if the ingress work is already done.

Candidate scope:

- verify the load balancer path is the only public API path
- evaluate GCP-native WAF / DDoS protection if the current project setup supports it cleanly
- confirm static asset caching behavior
- leave API caching conservative

## Step 6 - Document relational schema and Cloud SQL path

Define models and relationships.
Do not let full DB integration derail the demo.

Document:

- why Prisma is present now
- why Cloud SQL is intentionally deferred
- what environment and network work is still required for cutover

## Step 7 - Final polish

- route progress
- event timeline
- sync status visibility
- architecture diagram
- talking points for Docker / Cloud Run / modular monolith / ingress / GCP-native hardening

---

## Action Items

Priority 0:

- write the Prisma schema now
- keep it in-repo as a concrete artifact for the production data model
- do not migrate the running demo to Cloud SQL before the interview

Priority 1:

- update Cloud Run deployment so the API is no longer publicly invokable
- verify the GCP load balancer is the only public entry path for `/api`
- fix the CD workflow so future deploys preserve the intended ingress posture
- document the exact ingress and IAM settings used in the README or deployment notes

Priority 2:

- add one small geospatial library and ship one visible feature based on distance or proximity
- prefer `geolib` for a lightweight frontend/mobile addition or `@turf/distance` for backend validation
- log or display the computed distance so the feature is demoable

Priority 3:

- add a small WebSocket real-time event stream for route activity
- update admin route detail in real time using the existing event model
- keep it small and avoid live GPS streaming at this stage

Priority 4:

- refine offline mobile behavior into a clearer outbox model
- add explicit sync states, retry handling, and worker-visible sync status
- favor durability and clarity over sync complexity

Priority 5:

- only add GCP-native WAF / DDoS protection if the current setup supports it with low risk
- keep caching conservative for API traffic
- do not spend time on broad edge/network redesign unless it directly strengthens the current demo

Priority 6:

- improve admin and mobile operational fidelity after the geospatial, real-time, and offline work lands
- keep interview wording precise until ingress is actually private
- say “Cloud Run + load balancer path” instead of “locked down behind internal ingress” until verified
- say “offline-capable queued sync POC” instead of “production-grade offline replay”

---

## Suggested API Endpoints

### Properties

- `GET /properties`
- `GET /properties/:id`

### Buildings / Units

- `GET /properties/:id/buildings`
- `GET /buildings/:id/units`

### Workers

- `GET /workers`
- `GET /workers/:id/today-route`

### Routes

- `GET /routes`
- `GET /routes/:id`
- `GET /routes/:id/stops`
- `POST /routes`
- `POST /routes/:id/assign-worker`

### Route Stop Actions

- `POST /route-stops/:id/complete`
- `POST /route-stops/:id/miss`
- `POST /route-stops/:id/issue`

### Sync

- `POST /sync/mobile-actions`

### Tracking

- `POST /workers/:id/location-ping`

### Events

- `GET /routes/:id/events`

---

## Offline-First Strategy

### Persist locally

- current worker
- active route
- stop statuses
- pending actions outbox
- last sync timestamp

### Pending action shape

```ts
type PendingAction =
  | {
      type: 'COMPLETE_STOP';
      stopId: string;
      timestamp: string;
      gps?: { lat: number; lng: number };
    }
  | { type: 'MISS_STOP'; stopId: string; timestamp: string; reason?: string }
  | {
      type: 'REPORT_ISSUE';
      stopId: string;
      timestamp: string;
      issueCode: string;
      notes?: string;
    };
```

### Behavior

- if online, call API immediately
- if offline, store action
- replay queue on reconnect
- keep rejected actions visible

This is one of the strongest parts of the architecture to discuss in interview.

---

## Docker / Cloud Run Notes

### Local dev

Use direct local Nest run for the fastest inner loop.

### Container validation

Use Docker to confirm the deployable runtime.

### Cloud deployment

Use the same backend image for Cloud Run.

### Strong talking point

“I kept the local development loop fast, but still packaged the backend in Docker so my runtime artifact matched production and Cloud Run.”

---

## GitHub Actions Notes

### CI is the priority

If time gets tight, prioritize:

- lint
- typecheck
- build

### CD is optional but nice

If you have enough time:

- build/push image
- deploy to Cloud Run

### Strong talking point

“I didn’t overengineer the pipeline. I created a small CI/CD path that validates the code and can promote the same container image to Cloud Run.”

---

## GCP Hardening Talking Points

Use GCP-native controls for:

- load balancer-backed public routing
- ingress restriction on Cloud Run
- optional security hardening where it is low-risk
- selective caching awareness for static versus transactional traffic

Do not overcomplicate the public path for a time-boxed POC.

Best framing:
“I kept the public surface area tight by routing the app through the load balancer path, removing the default Cloud Run URL, and leaving room for additional GCP-native protection as the next operational step.”

---

## Suggested Commands / Packages

## Admin web

```bash
npm create vite@latest admin-web -- --template react-ts
cd admin-web
npm install @tanstack/react-query zustand react-router-dom bootstrap react-hook-form zod @hookform/resolvers
```

## Worker mobile

```bash
npx create-expo-app@latest worker-mobile
cd worker-mobile
npm install zustand @tanstack/react-query @react-native-async-storage/async-storage @react-native-community/netinfo zod react-hook-form
npx expo install expo-location
```

## API

```bash
npm i -g @nestjs/cli
nest new api
cd api
npm install class-validator class-transformer uuid
```

---

## Suggested Folder Structure

```txt
ally-waste-poc/
  apps/
    admin-web/
      src/
        app/
        pages/
        components/
        api/
        hooks/
        store/
        context/
        types/
    worker-mobile/
      src/
        app/
        screens/
        api/
        hooks/
        store/
        offline/
        context/
        services/
        types/
    api/
      src/
        modules/
          properties/
          buildings/
          units/
          schedules/
          workers/
          routes/
          tracking/
          sync/
          events/
        common/
        repositories/
        seed/
      Dockerfile
  packages/
    shared-types/
    shared-utils/
  .github/
    workflows/
```

---

## What Not To Do

- do not build real microservices
- do not add Kubernetes to the implementation
- do not overbuild auth
- do not let CI/CD consume a full day
- do not fully productionize Postgres before the demo works
- do not chase background tracking perfection
- do not spend too much time styling

---

## Strong Talking Points To Prepare

### Why modular monolith?

- fastest way to ship
- clean module boundaries
- easy to reason about
- easier to split later if needed
- avoids unnecessary distributed complexity

### Why Docker?

- consistent runtime
- Cloud Run-friendly artifact
- better handoff and deployment discipline
- stronger platform story

### Why GitHub Actions?

- lightweight CI/CD
- validates changes quickly
- easy path to Cloud Run deploy
- enough maturity without heavy ceremony

### Why Zustand?

- lightweight
- easy persistence
- excellent for web and mobile
- much less ceremony than Redux

### Why TanStack Query?

- ideal for server state
- caching and invalidation built in
- keeps local vs remote state clean

### Why Cloud Run?

- ideal for one backend container
- low ops
- strong GCP-native deployment path

---

## Final Execution Advice

Optimize for:

- a working demo
- a modular backend
- a strong mobile offline story
- a Dockerized API
- a basic GitHub Actions pipeline
- a believable Cloud Run deployment path

The interviewer does not need a perfect production platform.
They need to see that you can make sound technical decisions, move quickly, and shape a system the right way under time pressure.
