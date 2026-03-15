# =============================================================================
# Stage 1: Build the Svelte/Vite application
# =============================================================================
# Pin base image to a specific version; use Alpine variant to minimise build
# image size.  Update the tag when upgrading Bun.
# To regenerate a SHA digest pin:
#   docker pull oven/bun:1-alpine && docker inspect --format='{{index .RepoDigests 0}}' oven/bun:1-alpine
FROM oven/bun:1-alpine AS build

WORKDIR /app

# --- Layer-cache optimisation ---
# 1) Copy only dependency manifests.  This layer is cached as long as
#    package.json and bun.lock are unchanged.
COPY package.json bun.lock ./

# 2) Install ALL dependencies (dev included -- Vite is a devDependency).
RUN bun install --frozen-lockfile

# 3) Copy source tree (cache-busted by any source change).
COPY . .

# 4) Produce static assets in /app/dist.
RUN bun run build


# =============================================================================
# Stage 2: Production nginx image (non-root, unprivileged port)
# =============================================================================
# Pin to a specific minor release.  Update when upgrading nginx.
# To regenerate a SHA digest pin:
#   docker pull nginx:1.27-alpine && docker inspect --format='{{index .RepoDigests 0}}' nginx:1.27-alpine
FROM nginx:1.27-alpine AS production

# curl is lighter than wget for health probes and already common in CI images.
RUN apk add --no-cache curl \
    # Remove default site to avoid conflicts
    && rm -f /etc/nginx/conf.d/default.conf \
    && rm -rf /usr/share/nginx/html/*

# Copy the container-specific nginx config.
COPY nginx-app.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the build stage.
COPY --from=build /app/dist /usr/share/nginx/html

# ---------------------------------------------------------------------------
# Non-root setup
# ---------------------------------------------------------------------------
# The official nginx image ships a "nginx" user (UID 101).  We grant it
# ownership of every path the worker process needs to write to at runtime.
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx

# Unprivileged port (>=1024 required for non-root).
EXPOSE 8080

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
# Hit the dedicated /health endpoint that returns 200 with no access-log noise.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -sf http://localhost:8080/health || exit 1

# ---------------------------------------------------------------------------
# Graceful shutdown & signal handling
# ---------------------------------------------------------------------------
# SIGQUIT tells nginx to finish serving in-flight requests before exiting.
# The exec-form CMD ensures nginx is PID 1 and receives signals directly
# (no shell wrapper that would swallow them).
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
