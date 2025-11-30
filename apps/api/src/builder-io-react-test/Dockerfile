# Use a Node.js base image
FROM node:20-slim AS base

# Set the working directory
WORKDIR /app

# Copy the rest of the application files first
COPY . .

# Install ALL dependencies including devDependencies (needed for vite build)
RUN npm install --include=dev

# Build the Vite application (only build client for static deployment)
RUN npm run build:client

# Production stage
FROM node:20-slim AS production
WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=base /app/dist/spa ./spa

# Expose the port (8000)
EXPOSE 8000

# Start the server (serving the static files from the spa folder)
CMD ["serve", "-s", "spa", "-l", "8000"]