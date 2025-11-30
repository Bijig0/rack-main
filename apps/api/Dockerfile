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

# Copy ALL workspace package.json files to ensure proper workspace resolution
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Copy shared package source code BEFORE install (needed for workspace deps)
COPY packages/shared ./packages/shared

# Install dependencies (workspace deps will be resolved correctly)
RUN bun install --frozen-lockfile

# Run the app
FROM base AS runner
WORKDIR /app

# Copy node_modules from deps stage (hoisted to root)
COPY --from=deps /app/node_modules ./node_modules

# Copy the shared package
COPY packages/shared ./packages/shared

# Copy API source code
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Expose the server port
EXPOSE 3000

# Run the server
CMD ["bun", "run", "src/server/server.ts"]
