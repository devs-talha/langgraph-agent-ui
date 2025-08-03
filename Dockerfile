# ---------- 1. Install dependencies only when needed ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Copy only the dependency manifests for caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Enable corepack and activate pnpm@10.5.1, then install dependencies
RUN corepack enable && corepack prepare pnpm@10.5.1 --activate \
  && pnpm install --frozen-lockfile

# ---------- 2. Build the Next.js app ----------
FROM node:20-alpine AS builder
WORKDIR /app
# Copy all files (except those excluded by .dockerignore)
COPY . .
# Copy installed dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Generate .env file for public environment variables
RUN echo "# Public environment variables for Next.js build" > .env && \
    echo "NEXT_PUBLIC_APP_TITLE=${NEXT_PUBLIC_APP_TITLE:-Agent Chat}" >> .env && \
    echo "NEXT_PUBLIC_APP_DESCRIPTION=${NEXT_PUBLIC_APP_DESCRIPTION:-Agent Chat}" >> .env && \
    echo "NEXT_PUBLIC_ALLOW_ATTACHMENTS=${NEXT_PUBLIC_ALLOW_ATTACHMENTS:-false}" >> .env && \
    echo "NEXT_PUBLIC_GITHUB_REPO_URL=${NEXT_PUBLIC_GITHUB_REPO_URL:-https://github.com/devs-talha/langgraph-agent-ui}" >> .env && \
    echo "NEXT_PUBLIC_PROXY_API_URL=${NEXT_PUBLIC_PROXY_API_URL:-http://localhost:3000/api}" >> .env && \
    echo "NEXT_PUBLIC_ASSISTANT_ID=${NEXT_PUBLIC_ASSISTANT_ID:-agent}" >> .env
# Build the Next.js app (outputs to .next/)
RUN npm run build

# ---------- 3. Create the minimal production image ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Optional: Uncomment if you use a custom Next.js config
# COPY --from=builder /app/next.config.js ./

# Copy only the necessary files for production runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js will run on
EXPOSE 3000

# ---- Environment variables ----
# Set env vars at runtime using --env-file or -e flags, never hardcode secrets here!
# Example: docker run --env-file .env -p 3000:3000 wikipedia-agent

# Start the Next.js production server
CMD ["npm", "start"]
