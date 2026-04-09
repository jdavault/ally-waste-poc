# Project Overview

## What This Repo Is

**Ally Waste POC** — a full-stack proof of concept for a valet trash and recycling logistics platform, built as an interview demo for a Sr. Engineer role at Ally Waste (Gilbert, AZ).

## What We're Building

- **Admin Dashboard** (`apps/admin-web/`) — React + Vite web app for property managers and ops staff
- **Worker App** (`apps/worker-mobile/`) — Expo React Native app for field valets
- **Backend API** (`apps/api/`) — NestJS modular monolith with REST endpoints
- **Shared Types** (`packages/shared-types/`) — shared TypeScript domain models, enums, DTOs

## Architecture

- **Modular monolith** — 9 NestJS modules with clean boundaries, easily splittable later
- **In-memory repositories** behind a generic `IRepository<T>` interface — swap to Postgres cleanly
- **Offline-first mobile** — Zustand + AsyncStorage persistence, pending action outbox, sync on reconnect
- **Production-first clients** — web and mobile default to live API URLs outside development mode
- **npm workspaces** monorepo — simple, no extra tooling

## Stack

- TypeScript everywhere
- React + Vite + **Tailwind CSS** + TanStack Query + Zustand + React Router (admin)
- Expo + React Native + Zustand + TanStack Query + AsyncStorage + NetInfo + expo-location (mobile)
- NestJS + class-validator + class-transformer (API)
- Docker for backend containerization
- GitHub Actions CI/CD (lint → build → deploy)
- **GCP Cloud Run** (Live Production Backend)
- **GCP HTTPS Load Balancer** in front of Cloud Run
- Prisma schema for the Postgres migration path

## Brand

- Navy `#101A30` — sidebar, header, dark backgrounds
- Green `#7EB141` — primary actions, completed status, logo
- Accent Green `#00D084` — hover states, success indicators
- Soft Gray `#F1F3F5` — section backgrounds
- Text Dark `#32373C` — body text

## Project Status (2026-04-09)

### Completed ✅
- **Modular API**: 9 modules implemented with in-memory persistence and seed data.
- **Admin Web**: Modern Tailwind UI with Sidebar, search, filtering, and pagination.
- **Worker Mobile**: React Navigation flow (Login → Home → Route → Stop).
- **Offline Sync**: Mobile outbox pattern with automatic and manual sync triggers.
- **DevOps**: Dockerized backend live on **GCP Cloud Run** via GitHub Actions.
- **Ingress Hardening**: Cloud Run default URL disabled; API intended to be reached through the load balancer path.
- **Prisma**: Schema checked into repo for Postgres migration planning.
- **Geospatial**: Worker stop detail shows proximity in miles; admin timeline can display proximity info from event payloads.

### In Progress / Upcoming ⏳
- **Admin Static Deploy**: GitHub Actions now includes admin-web publish, but GCS bucket IAM for the service account still needs to be fixed.
- **SPA Fallback**: Direct loads of frontend routes like `/workers` still need proper `index.html` fallback through the current LB/static setup.
- **Realtime**: Small WebSocket event stream for admin route activity.
- **Offline Refinement**: Durable outbox states, retry handling, idempotency, and better worker feedback.

## Current Priorities

1. Fix admin-web production deploy permissions and rerun the workflow
2. Fix SPA deep-link routing for frontend routes
3. Add the small WebSocket event stream
4. Refine offline mobile behavior

## What Success Looks Like

- Working end-to-end demo: admin creates routes, worker completes stops, data flows back
- Strong architecture story for interview discussion
- Offline-first mobile with visible sync behavior
- Dockerized backend deployable to Cloud Run
- Frontend and API both deploy cleanly through the live production path
