# Ally Waste Interview POC Plan (v2)

A fast-moving, interview-focused proof of concept designed to show strong full-stack judgment, React + React Native capability, NestJS architecture, offline-first mobile thinking, containerization, CI/CD discipline, and a credible cloud path on GCP.

This is not meant to be a production build. It is a believable field-operations platform that you can stand up quickly, explain clearly, and extend if there is extra time.

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
- Bootstrap
- TanStack Query
- Zustand
- React Context where appropriate
- React Hook Form
- Zod
- React Router

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
- Expo Router or React Navigation

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

- Prisma schema for PostgreSQL in parallel
- do not block implementation on the DB being complete
- model relationships clearly enough to discuss indexing, scaling, and migration path

### Delivery / Ops

- Docker for backend containerization
- GitHub Actions for CI/CD
- GCP Cloud Run for API deployment
- Cloudflare as CDN / edge / caching / security layer in front of admin assets and read-heavy APIs

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
- admin web can stay local for demo, or be deployed later if time remains
- Cloudflare discussed as the edge layer
- Cloud SQL documented as next step, not required for POC

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
4. offline-first mobile flow
5. Dockerized backend
6. basic GitHub Actions pipeline
7. API deployed to Cloud Run if time remains
8. clean README and architecture story

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
- Bootstrap
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

# Day 2 - Offline-First Mobile + Docker + Backend Cleanup

## Target outcome

- worker app persists data locally
- pending actions outbox works
- GPS capture on stop events works
- backend architecture cleaned up
- backend Dockerized and runs locally in container

## Step 1 - Implement offline-first outbox

Persist:

- worker session
- route snapshot
- stops
- pending actions
- last sync

## Step 2 - Add GPS capture

Capture location on:

- route start
- stop completion
- optional manual ping

## Step 3 - Add event timeline support

Every route action should create an event entry.

## Step 4 - Dockerize the backend

Add:

- `apps/api/Dockerfile`
- `.dockerignore`

Optional:

- `docker-compose.yml` for future backend + postgres local mode

### Definition of done

- backend builds in Docker
- backend runs locally in Docker
- app can hit the containerized backend

## Step 5 - Write initial README sections

Document:

- project purpose
- architecture
- local setup
- Docker commands
- module boundaries
- cloud deployment plan

---

# Day 3 - CI/CD + Cloud Run + Final Polish

## Target outcome

- GitHub Actions CI workflow exists
- optional CD workflow exists
- backend deploys to Cloud Run if time allows
- Prisma schema exists
- architecture story is polished for interview

## Step 1 - Add GitHub Actions CI

On PR / push:

- install
- lint
- typecheck
- build API
- optionally build admin

## Step 2 - Add CD workflow if realistic

On push to main:

- auth to GCP
- build/push Docker image
- deploy to Cloud Run

If deployment automation becomes too costly in time, stop at CI and do manual Cloud Run deployment once.

## Step 3 - Create Prisma schema

Define models and relationships.
Do not let full DB integration derail the demo.

## Step 4 - Deploy API to Cloud Run

Aim for:

- one backend service
- environment variables configured
- healthy startup
- accessible public endpoint for demo if desired

## Step 5 - Final polish

- route progress
- event timeline
- sync status visibility
- architecture diagram
- talking points for Docker / Cloud Run / modular monolith

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

## Cloudflare Talking Points

Use Cloudflare for:

- CDN
- edge caching
- SSL
- WAF
- rate limiting
- static asset delivery

Do not put first-pass route transaction logic there.

Best framing:
“I’d keep transaction-heavy operational workflows on the core API and use Cloudflare for delivery, security, and selective caching.”

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
