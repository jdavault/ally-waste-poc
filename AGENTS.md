# Repository Guidelines

## Project Structure & Module Organization
This repository uses npm workspaces. Application code lives in `apps/`:
- `apps/api`: NestJS API organized by feature modules under `src/modules/*`; end-to-end tests live in `test/`.
- `apps/admin-web`: Vite + React admin dashboard with pages in `src/pages`, shared UI in `src/components`, and API helpers in `src/api`.
- `apps/worker-mobile`: Expo/React Native worker app with screens in `src/screens`, state in `src/store`, and offline logic in `src/offline`.
- `packages/shared-types`: shared DTOs, enums, and models consumed by all apps.
- `asset/images` and `scripts/` hold static assets and deployment helpers.

## Build, Test, and Development Commands
- `npm install`: install all workspace dependencies.
- `npm run dev:api`: run the Nest API in watch mode.
- `npm run dev:admin`: start the admin web app with Vite.
- `npm run dev:mobile`: start the Expo dev client.
- `npm run build:api` and `npm run build:admin`: production builds for backend and web.
- `npm run lint`: run ESLint across workspaces that define it.
- `npm run typecheck`: run TypeScript checks across workspaces.
- `npm run test:api`: run API unit tests. Use `npm run test:e2e -w @ally-waste/api` for e2e coverage.

## Coding Style & Naming Conventions
Use TypeScript throughout. Follow the existing style in each app:
- API uses Prettier + ESLint; prefer 2-space indentation, `*.module.ts`, `*.service.ts`, `*.controller.ts`, and `*.repository.ts`.
- Admin web uses React function components in PascalCase files such as `RoutesPage.tsx`; hooks and helpers use camelCase.
- Keep shared contract changes in `packages/shared-types` and update consumers in the same change.

## Testing Guidelines
Jest is configured in `apps/api`. Place unit tests beside source files as `*.spec.ts`; keep e2e tests in `apps/api/test/*.e2e-spec.ts`. There is no established automated test suite for `admin-web` or `worker-mobile` yet, so validate those changes with `npm run lint`, `npm run typecheck`, and a manual smoke test.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits, for example `feat: ...`, `fix(admin-web): ...`, and `docs: ...`. Keep commits scoped to one concern and include the app or package name when helpful. PRs should include a short summary, linked issue or ticket, commands run for verification, and screenshots for UI changes.

## Configuration Tips
Prefer environment variables over hardcoded URLs. `apps/admin-web` reads `VITE_API_URL`; `apps/worker-mobile` reads `EXPO_PUBLIC_API_URL`. The API defaults to port `8080`, so set client env vars explicitly when local defaults do not match your device or emulator.
