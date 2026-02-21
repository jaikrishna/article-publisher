# ── Stage 1: Builder ──────────────────────────────────────────────
# Use a slim Python image to install dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies into a separate directory (for clean copying later)
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt


# ── Stage 2: Runtime ──────────────────────────────────────────────
# Start fresh from slim image — no build tools, smaller final image
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application source code
COPY . .

# Create the uploads directory (persisted via Docker volume)
RUN mkdir -p /app/uploads

# Expose Flask port
EXPOSE 5000

# Run with Gunicorn (production WSGI server, NOT flask dev server)
# --workers 2         → 2 worker processes (handles concurrent requests)
# --bind 0.0.0.0:5000 → listen on all interfaces inside the container
# --timeout 120       → 2 min timeout for slow requests
# --preload loads the app ONCE in the master process before forking workers.
# This means db.create_all() runs exactly once, not once per worker — which
# prevents the "table already exists" race condition with SQLite + gunicorn.
CMD ["gunicorn", "run:app", \
     "--bind", "0.0.0.0:5000", \
     "--workers", "2", \
     "--timeout", "120", \
     "--preload", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
