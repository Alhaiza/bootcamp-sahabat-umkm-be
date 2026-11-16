# ==========================================
# Sahabat-UMKM Backend Multi-Stage Dockerfile
# ==========================================

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Pasang build tools untuk kompilasi native addons (bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime Production
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy dependensi terkompilasi dari builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Buat non-root user untuk keamanan container
USER node

EXPOSE 3000

# Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
