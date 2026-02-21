# ── Stage 1: Build React app ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer caching trick):
# If package.json hasn't changed, Docker reuses the cached
# node_modules layer and skips npm install entirely → faster rebuilds
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy the rest of source code
COPY . .

# Build argument: the backend API URL baked into the React bundle
# Passed in from docker-compose build args
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build the production React bundle → outputs to /app/dist
RUN npm run build


# ── Stage 2: Serve with Nginx ──────────────────────────────────────
# nginx:alpine is tiny (~25MB) and production-grade
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy our built React files into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx starts automatically as the container's main process
CMD ["nginx", "-g", "daemon off;"]
