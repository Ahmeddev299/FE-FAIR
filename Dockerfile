# ---- 1. Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- 2. Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.ts . || true
COPY --from=builder /app/server.js . || true

EXPOSE 3000
CMD ["npm", "start"]
