# Dockerfile for Railway deployment
FROM oven/bun:1.1.18-debian AS base
WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y --fix-missing \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy workspace config and bun.lockb
COPY package.json bun.lockb ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies (ignore scripts to skip canvas compilation with Bun)
RUN bun install --ignore-scripts

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Expose the server port (Railway uses PORT env var)
EXPOSE ${PORT:-3000}

# Run the server
CMD ["bun", "run", "src/server/server.ts"]