FROM node:20-alpine AS builder
WORKDIR /app

# Copy root and workspace manifests
COPY package.json package-lock.json* ./
COPY server/package.json server/package.json

# Install deps for workspaces
RUN npm ci

# Copy server source
COPY server/tsconfig.json server/tsconfig.json
COPY server/src server/src

# Build server
RUN npm -w server run build

FROM node:20-alpine
WORKDIR /app

# Copy production files
COPY package.json package-lock.json* ./
COPY server/package.json server/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/server/dist server/dist

ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "server/dist/index.js"]


