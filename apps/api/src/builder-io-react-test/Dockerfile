# Dockerfile for builder-io-react-test Railway deployment
# Build context: repository root
FROM node:20-slim AS base
WORKDIR /app

# Install dependencies needed for build
RUN apt-get update && apt-get install -y --fix-missing \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files from builder-io-react-test directory
COPY apps/api/src/builder-io-react-test/package.json ./
COPY apps/api/src/builder-io-react-test/package-lock.json* ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY apps/api/src/builder-io-react-test ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --fix-missing dumb-init && rm -rf /var/lib/apt/lists/*

# Copy built files and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

# Expose port (Railway sets PORT env var)
EXPOSE ${PORT:-3000}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Start the server with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server/node-build.mjs"]
