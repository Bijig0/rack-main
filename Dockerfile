# Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Copy dependency files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# The actual start command will be overridden by Railway service config
CMD ["bun", "run", "start:api"]