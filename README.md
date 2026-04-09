# Ally Waste POC

A modern logistics and waste management platform proof-of-concept.

## 🚀 Overview
This project demonstrates a high-signal full-stack architecture for field operations. It features a modular NestJS API, a reactive Admin Dashboard, and a professional delivery pipeline.

## 🏗️ Architecture
- **Modular Monolith API**: NestJS with clean domain boundaries.
- **Modern Admin Web**: React + Tailwind CSS + TanStack Query.
- **Shared Package**: Centralized TypeScript types for end-to-end safety.
- **Containerized**: Fully Dockerized backend for consistent local and cloud runtimes.

## 🛠️ Tech Stack
- **Backend**: NestJS, class-validator, Swagger, In-Memory Repositories.
- **Frontend**: Vite, React, Tailwind CSS, Lucide Icons, Zustand.
- **DevOps**: Docker, GitHub Actions, GCP Cloud Run.

## 🏁 Getting Started

### Prerequisites
- Node.js 22+
- Docker & Docker Compose

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API (Local):
   ```bash
   npm run dev:api
   ```
3. Start the Admin Web:
   ```bash
   npm run dev:admin
   ```

### Docker Local Run
Build and start the containerized API on port 8080:
```bash
docker compose up --build
```

## ☁️ Deployment
The backend is automatically deployed to **GCP Cloud Run** via GitHub Actions on every push to `main`.

The intended production-style posture for this POC is:
- Cloud Run ingress restricted to `internal-and-cloud-load-balancing`
- the default `run.app` URL disabled
- public traffic reaching the API only through the GCP HTTPS Load Balancer path

This preserves a simple public `/api/*` path for the admin app without leaving the raw Cloud Run service directly exposed on its default URL.

## 🛡️ Production Readiness (Roadmap)
While this POC uses a Global External Load Balancer for the demo, a production deployment would include:
- **Cloudflare Edge**: WAF, Rate Limiting, and DDoS protection in front of the GCP Load Balancer.
- **Enhanced Caching**: Edge-caching for static React assets via Cloudflare CDN while bypassing cache for `/api/*` to maintain transactional integrity.
- **Persistence**: Migration from In-Memory to **PostgreSQL (Cloud SQL)** via Prisma.
- **Identity**: Integration with **Auth0** or **Firebase Auth** for secure multi-tenant access.

---
*Developed as a high-performance POC for Ally Waste.*
