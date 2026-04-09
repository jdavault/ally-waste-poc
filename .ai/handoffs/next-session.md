# Next Session Handoff

## Last Session: 2026-04-09 (Session 3 — GCP Networking & Load Balancer)

## What Happened This Session

- **GCP Load Balancer fully stood up** (15 sequential steps, verified one-at-a-time):
  - GCS bucket `ally-waste-admin-assets-personal-mcp-485500` in `us-central1` with SPA refresh fix (index.html set as both main and error page) and public read access for `allUsers`.
  - Admin-web production build uploaded to bucket (blocked briefly on missing `Home` icon import in `RouteDetailPage.tsx` — fixed).
  - Global static IP reserved: **`34.8.229.233`**.
  - Google-managed SSL certificate `ally-waste-managed-cert` for `ally-admin.p3solutionsgroup.com` — went `ACTIVE` very quickly (Namecheap A record with 1-min TTL propagated fast).
  - Serverless NEG `ally-waste-api-neg` in `us-central1` targeting the `ally-waste-api` Cloud Run service.
  - Global backend service `ally-waste-api-backend` (EXTERNAL_MANAGED) with the NEG attached.
  - Backend bucket `ally-waste-admin-backend-bucket` wrapping the GCS bucket with Cloud CDN enabled.
  - URL map `ally-waste-url-map` with `/api/*` → backend service, `/*` → frontend bucket.
  - HTTPS target proxy + forwarding rule on port 443.
  - HTTP → HTTPS redirect: `ally-waste-http-redirect` URL map (301 via `defaultUrlRedirect`) + HTTP proxy + port 80 forwarding rule on the same static IP.
- **Worker mobile fixes**:
  - Swapped in Ally Waste brand assets (icon, splash, adaptive-icon, favicon) with navy background `#101A30`.
  - Wrestled with duplicate React error in Metro — root cause: npm workspaces hoisted `react` 19.2.4 from admin-web, mobile needs 19.1.0 to match its react-native renderer. Final fix in `apps/worker-mobile/metro.config.js` uses `resolveRequest` to force `react` imports to resolve from mobile's local `node_modules`; `react-native` still resolves from root (where it's hoisted).
- **Infra script polished**: `scripts/setup-gcp-lb.sh` now includes frontend build/upload and HTTP→HTTPS redirect.
- **Branching**: Created `feat/gcp-bucket-lb-setup` to avoid triggering CI/CD on every push during infra work.

## Current State of the Deployed Architecture

```
User → 34.8.229.233
  ├─ Port 80 → HTTP proxy → redirect URL map → 301 HTTPS
  └─ Port 443 → HTTPS proxy → ally-waste-managed-cert → URL map
                                    ├─ /api/*  → backend service → NEG → Cloud Run (ally-waste-api)
                                    └─ /*      → backend bucket → GCS (admin-web) + Cloud CDN
```

**Cloud Run ingress is still `all`** — the direct `.run.app` URL still works as a fallback. This is intentional until the LB is fully verified.

## What's Working / What's Not (as of session end)

- ✅ DNS resolves `ally-admin.p3solutionsgroup.com` → `34.8.229.233`
- ✅ TCP connects on port 443
- ✅ Cert shows `ACTIVE` for the domain
- ✅ HTTP → HTTPS 301 redirect works (tested with curl)
- ⚠️ **HTTPS TLS handshake was still failing at session end** (`SSL_ERROR_SYSCALL`). This is Google Cloud's known "cert ACTIVE but edges still warming up" behavior — typically resolves in 10–30 mins after cert goes ACTIVE. **Should be working by next session start.**

## First Thing To Do Next Session

**LB IS LIVE** — TLS finished warming up after session end. User confirmed `https://ally-admin.p3solutionsgroup.com/` is reachable.

**BLOCKER: React version mismatch in admin-web bundle** (error #527 in browser console):
```
Uncaught Error: Minified React error #527; args[]=19.1.0&args[]=19.2.4
```

Admin-web has `react-dom` 19.2.4 but `react` 19.1.0 got hoisted from worker-mobile (which pins 19.1.0). Vite bundled both, crashing at runtime.

**Fix:**
1. Pin both to the same version in `apps/admin-web/package.json` — simplest is to match mobile at `19.1.0`:
   ```json
   "react": "19.1.0",
   "react-dom": "19.1.0"
   ```
2. Clean install:
   ```bash
   rm -rf node_modules apps/admin-web/node_modules apps/worker-mobile/node_modules
   npm install
   ```
3. Rebuild and redeploy:
   ```bash
   npm run build -w @ally-waste/admin-web
   gcloud storage cp -r apps/admin-web/dist/* gs://ally-waste-admin-assets-personal-mcp-485500/
   ```
4. Verify in browser (hard refresh) — `https://ally-admin.p3solutionsgroup.com/`
5. Then check API: `curl https://ally-admin.p3solutionsgroup.com/api/health`

## Gotchas Found This Session

- **Swagger is at `/spec`, not `/api/spec`** — so `https://ally-admin.p3solutionsgroup.com/spec` will hit the GCS bucket (404), not Cloud Run. **TODO:** Move Swagger to `/api/spec` in `apps/api/src/main.ts` (one-line change on `SwaggerBuilderModule.createSpec(app, { path: 'api/spec' })`).
- **Mobile admin-web build failure** was a missing `Home` icon import — worth scanning for other unused-but-referenced Lucide icons before demo.
- **TLS propagation lag** even after cert ACTIVE — don't panic, wait 10–30 mins after cert flips.

## Next Session: Thu 4/9 afternoon — Verification & Polish

### 1. Verify LB End-to-End (first priority)
- Test domain URLs for admin UI + API health
- Fix Swagger path to `/api/spec`
- Rebuild + redeploy API with the Swagger fix (via CI/CD or manual docker push)

### 2. Point Mobile App at the LB
- Create `apps/worker-mobile/.env`:
  ```
  EXPO_PUBLIC_API_URL=https://ally-admin.p3solutionsgroup.com/api
  ```
- Rebuild the native app: `cd apps/worker-mobile && npx expo run:ios`
- Test full mobile flow against the production backend

### 3. Lock Down Cloud Run Ingress (ONLY after everything above verified)
```bash
gcloud run services update ally-waste-api \
  --region=us-central1 \
  --ingress=internal-and-cloud-load-balancing
```
- Keep this command ready for instant rollback:
  ```bash
  gcloud run services update ally-waste-api --region=us-central1 --ingress=all
  ```

### 4. Cloudflare Integration (optional, ~20 mins)
User wants to weave Cloudflare in for the interview story since it's in the JD. Decision at end of last session was "maybe, if time permits". Approach:
- Add `p3solutionsgroup.com` to Cloudflare
- Change Namecheap nameservers (affects ALL subdomains — verify no other subdomains in use)
- In Cloudflare DNS: `ally-admin` → A → `34.8.229.233` with proxy ON (orange cloud)
- SSL mode: Full (strict)
- Page Rules: cache `/*`, bypass `/api/*`
- Result: Cloudflare WAF + DDoS + CDN at edge, GCP LB behind it

### 5. Prisma Schema (interview talking point)
- Define schema for all 9 entities
- Document indexing strategy
- Do NOT block on Postgres integration — schema alone is the signal

### 6. README + Architecture Diagram
- Local setup, cloud deployment, module boundaries
- Architecture diagram showing: Cloudflare (if added) → GCP LB → [Cloud Run API / GCS admin-web]
- Interview talking points: why modular monolith, why Zustand, offline outbox pattern, same-origin architecture

## Decisions Made This Session

- **LB architecture over Firebase Hosting**: Global external HTTP(S) LB with serverless NEG is the right call because it lets us use same-origin routing (kills CORS), hides the Cloud Run URL behind a custom domain, and gives Cloud CDN for free. Much stronger interview story.
- **SPA Refresh Fix**: Set `index.html` as BOTH `web-main-page-suffix` and `web-error-page` so GCS hands React Router deep links back to the SPA.
- **HTTP→HTTPS redirect via separate URL map**: Cleanest GCP pattern — dedicated redirect URL map with `defaultUrlRedirect`, separate HTTP target proxy, port 80 forwarding rule sharing the same static IP.
- **Metro React resolution fix**: Used `resolveRequest` to override `nodeModulesPaths` for `react` specifically, forcing resolution from `apps/worker-mobile/node_modules/react`. Avoids npm workspace hoisting conflicts.
- **Deferred Cloudflare**: Positioned as an interview talking point + optional Thursday add-on. Not blocking the demo.
- **Branching to protect main**: Created `feat/gcp-bucket-lb-setup` so infra commits don't trigger CI/CD deploys during experimentation.
- **Kept Cloud Run ingress open**: Until the LB is proven end-to-end, the direct `.run.app` URL stays reachable as a fallback.

## Resume Context

**Interview is Friday 4/10 at 2pm.** By end of this session the GCP Load Balancer is wired but TLS was still warming up. Session ended with a commit on `feat/gcp-bucket-lb-setup` that was NOT pushed (per user instruction — wants to avoid accidental CI/CD triggers during infra work). Next session starts with verifying the domain is live, then wiring mobile to the new LB URL, then Swagger path fix, then Cloud Run lockdown, then Prisma schema + README + optional Cloudflare.

## Key URLs & Resources

- **Domain (target)**: `https://ally-admin.p3solutionsgroup.com`
- **API path (target)**: `https://ally-admin.p3solutionsgroup.com/api`
- **Current fallback**: `https://ally-waste-api-399534668698.us-central1.run.app` (direct Cloud Run, still open)
- **GCP Project**: `personal-mcp-485500`
- **Region**: `us-central1`
- **Static IP**: `34.8.229.233`
- **Service account**: `svc-personal-mcp@personal-mcp-485500.iam.gserviceaccount.com` (has Cloud Run Admin, Service Account User, Artifact Registry Reader)
- **Artifact Registry**: `us-central1-docker.pkg.dev/personal-mcp-485500/ally-waste-api/api`
- **Frontend bucket**: `gs://ally-waste-admin-assets-personal-mcp-485500`
- **Current branch**: `feat/gcp-bucket-lb-setup` (NOT pushed)
