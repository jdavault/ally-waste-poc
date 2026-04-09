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

---
*Developed as a high-performance POC for Ally Waste.*
