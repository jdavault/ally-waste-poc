# Ally Waste Interview POC

A full-stack logistics and compliance platform built as a proof of concept for **Ally Waste Services**.

## Project Goals

This POC demonstrates senior-level architecture and implementation for:
- **Admin Dashboard (Web)**: Property management and logistics monitoring.
- **Worker App (Mobile)**: Nightly service reporting with offline support.
- **Modular Monolith API**: Scalable NestJS backend with clear domain boundaries.
- **Shared Type System**: Consistent domain models across all layers.

## Tech Stack

- **Monorepo**: npm workspaces
- **Backend**: NestJS (Modular Monolith)
- **Admin Web**: React + Vite + Bootstrap
- **Worker Mobile**: Expo (React Native)
- **State Management**: TanStack Query + Zustand
- **Types**: Shared TypeScript packages
- **Infra (Planned)**: Docker, GCP Cloud Run, GitHub Actions

## Directory Structure

- `apps/api`: NestJS backend API.
- `apps/admin-web`: React-based property manager dashboard.
- `apps/worker-mobile`: Expo-based valet field app.
- `packages/shared-types`: Shared domain models, enums, and DTO types.
- `asset/images`: Official brand assets and reference screenshots.
- `.ai/`: AI-assisted development context (memory, agents, tasks).

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### Installation
```bash
npm install
```

### Development
```bash
# Start the API
npm run dev:api

# Start the Admin Dashboard
npm run dev:admin

# Start the Worker Mobile App
npm run dev:mobile
```

## Brand Guidelines

- **Primary Navy**: `#101A30` (Trust, Logistics)
- **Primary Green**: `#7EB141` (Sustainability, Growth)
- **Secondary Green**: `#00D084` (Action, Success)
- **Soft Gray**: `#F1F3F5` (UI Backgrounds)

---
*Built by Gemini CLI for Ally Waste.*
