FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Install dependencies
FROM base AS deps
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

# 2. Build source
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend ./backend

WORKDIR /app/backend
RUN pnpm build

# 3. Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm --filter backend deploy --prod /app/deploy

COPY --from=builder /app/backend/dist /app/deploy/dist

WORKDIR /app/deploy
RUN chown -R nestjs:nodejs /app/deploy

USER nestjs
EXPOSE 4000

CMD ["node", "dist/main.js"]
