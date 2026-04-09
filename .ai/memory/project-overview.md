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
- **npm workspaces** monorepo — simple, no extra tooling

## Stack

- TypeScript everywhere
- React + Vite + **Tailwind CSS** + TanStack Query + Zustand + React Router (admin)
- Expo + React Native + Zustand + TanStack Query + AsyncStorage + NetInfo + expo-location (mobile)
- NestJS + class-validator + class-transformer (API)
- Docker for backend containerization
- GitHub Actions CI/CD (lint → build → deploy)
- **GCP Cloud Run** (Live Production Backend)
- Cloudflare as CDN/edge layer

## Brand

- Navy `#101A30` — sidebar, header, dark backgrounds
- Green `#7EB141` — primary actions, completed status, logo
- Accent Green `#00D084` — hover states, success indicators
- Soft Gray `#F1F3F5` — section backgrounds
- Text Dark `#32373C` — body text

## Project Status (4/8 Close-out)

### Completed ✅
- **Modular API**: 9 modules implemented with in-memory persistence and seed data.
- **Admin Web**: Modern Tailwind UI with Sidebar, search, filtering, and pagination.
- **Worker Mobile**: React Navigation flow (Login → Home → Route → Stop).
- **Offline Sync**: Mobile outbox pattern with automatic and manual sync triggers.
- **DevOps**: Dockerized backend live on **GCP Cloud Run** via GitHub Actions.
- **API Unification**: All local development unified on port 8080.

### In Progress / Upcoming ⏳
- **GCP Networking**: Global Load Balancer, Serverless NEG, and Static IP setup.
- **Native Assets**: Finalize iOS/Android icon and splash screen generation.
- **Data Persistence**: Prisma schema and Postgres migration (optional for POC).

## Timeline

- Tue 4/7: Scaffold monorepo + shared types + module shells (DONE)
- Wed 4/8: API implementation + Tailwind Admin + Offline Mobile + Cloud Run (DONE)
- Thu 4/9: GCP Load Balancer + NEG + Mobile Refinement + Prisma
- Fri 4/10: Polish + interview at 2pm

## What Success Looks Like

- Working end-to-end demo: admin creates routes, worker completes stops, data flows back
- Strong architecture story for interview discussion
- Offline-first mobile with visible sync behavior
- Dockerized backend deployable to Cloud Run
