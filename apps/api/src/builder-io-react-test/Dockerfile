# Use a Node.js base image
FROM node:20-slim AS base

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Set the working directory
WORKDIR /app

# Copy the rest of the application files first
COPY . .

# Install ALL dependencies including devDependencies (needed for vite build)
# Use longer timeout and retry logic to handle network issues
RUN pnpm config set fetch-timeout 600000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000 && \
    pnpm install --include=dev

# Build the Vite application (only build client for static deployment)
RUN pnpm run build:client

# Production stage
FROM node:20-slim AS production
WORKDIR /app

# Install serve (use npm for simple global binary install)
RUN npm install -g serve

# Copy built files
COPY --from=base /app/dist/spa ./spa

# Expose the port (8000)
EXPOSE 8000

# Start the server (serving the static files from the spa folder)
CMD ["serve", "-s", "spa", "-l", "8000"]