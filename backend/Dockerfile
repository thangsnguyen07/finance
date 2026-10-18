FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Builder: install dependencies, compile NestJS, and deploy isolated production bundle
FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend
RUN pnpm build

WORKDIR /app
RUN pnpm --filter backend deploy --legacy --prod /app/deploy

# 2. Production runtime: minimal Node.js runner without pnpm, devDependencies, or frontend
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/deploy ./
COPY --from=builder /app/backend/dist ./dist

RUN chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 4000

CMD ["node", "dist/main.js"]
