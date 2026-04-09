# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/
RUN npm install

# Stage 2: Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build shared-types first as API depends on it
RUN npm run build -w @ally-waste/shared-types
RUN npm run build -w @ally-waste/api

# Stage 3: Final Production image
FROM base AS runner
ENV NODE_ENV=production
# Default PORT for Cloud Run, can be overridden
ENV PORT=8080

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/packages/shared-types/package*.json ./packages/shared-types/
COPY --from=builder /app/node_modules ./node_modules

# Copy dist files preserving the workspace structure
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

EXPOSE 8080

# Run from the workspace-relative path
CMD ["node", "apps/api/dist/apps/api/src/main"]
