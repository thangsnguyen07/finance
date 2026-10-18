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

# Prune non-runtime junk (typings, source maps, markdown, tests) from production node_modules and dist
RUN find /app/deploy/node_modules -type f \( -name "*.d.ts" -o -name "*.map" -o -name "*.md" \) -exec rm -f {} + && \
    find /app/deploy/node_modules -type d \( -name "test" -o -name "tests" -o -name "docs" -o -name "example" -o -name "examples" \) -exec rm -rf {} + 2>/dev/null || true && \
    find /app/backend/dist -type f \( -name "*.d.ts" -o -name "*.map" \) -exec rm -f {} +

# 2. Production runtime: minimal Node.js runner without devDependencies, source code, or junk
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy only strictly necessary production runtime artifacts
COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json

RUN chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 4000

CMD ["node", "dist/main.js"]
