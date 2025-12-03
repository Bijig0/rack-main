# Use official Bun image
FROM oven/bun:1.1.18-debian AS base
WORKDIR /app

# Install dependencies from monorepo root
FROM base AS deps

# Install build tools for native modules
RUN apt-get update && apt-get install -y --fix-missing \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy workspace config and lockfile from root
COPY package.json bun.lockb ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install with optional dependencies ignored to skip canvas
RUN bun install --ignore-scripts

# Run the app
FROM base AS runner
WORKDIR /app

# Copy node_modules from deps stage (hoisted to root)
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Expose the server port
EXPOSE 3000

# Run both worker and server concurrently
# Worker runs in background, server runs in foreground
CMD ["sh", "-c", "bun run src/server/worker.ts & bun run src/server/server.ts"]
