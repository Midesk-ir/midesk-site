# Production multi-stage image for Nuxt / Nitro
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG NUXT_PUBLIC_API_BASE=/api/v1
ARG NUXT_PUBLIC_SITE_URL=
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE \
    NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL \
    NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=3072

RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nuxtjs

COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

USER nuxtjs
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
