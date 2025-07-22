# ---- 1. Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build-time environment variable
ARG NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE

# Copy only package files
COPY package*.json ./

# Install all deps
RUN npm install

# Copy all app files
COPY . .

# Build the Next.js app
RUN npm run build

# ---- 2. Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copy built app and static assets
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

# If required, copy server.js or config
COPY --from=builder /app/next.config.js . || true
COPY --from=builder /app/server.js . || true

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
