# Use a Node.js base image
FROM node:20-slim AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the Vite application
RUN pnpm run build

# Production stage
FROM node:20-slim AS production
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=base /app/dist/spa ./spa

# Expose the port (8080)
EXPOSE 8080

# Start the server (serving the static files from the spa folder)
CMD ["serve", "-s", "spa", "-l", "8080"]