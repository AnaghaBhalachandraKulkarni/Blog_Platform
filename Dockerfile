# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN useradd -m nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]

