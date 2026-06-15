# C++ Academy — single self-contained image.
# Serves the static frontend AND compiles/runs learner C++ with g++.
FROM python:3.12-slim

# g++ toolchain + curl (used once at build time to vendor web fonts).
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Unprivileged user. All untrusted compilation/execution happens as this user.
RUN useradd --create-home --uid 10001 student

WORKDIR /app

# Vendor the display + body fonts so the luxury look is identical offline
# (feature #14). Done BEFORE copying the app so this layer stays cached across
# content edits. Failures are non-fatal — the CSS falls back to system fonts.
RUN mkdir -p /app/static/fonts \
    && base="https://cdn.jsdelivr.net/npm/@fontsource" \
    && for f in \
        "inter/files/inter-latin-400-normal.woff2" \
        "inter/files/inter-latin-500-normal.woff2" \
        "inter/files/inter-latin-600-normal.woff2" \
        "inter/files/inter-latin-700-normal.woff2" \
        "cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2" \
        "cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2" \
        "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2" \
        "jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2" \
       ; do \
         out="/app/static/fonts/$(basename "$f")"; \
         curl -fsSL "$base/$f" -o "$out" || echo "font fetch skipped: $f"; \
       done

COPY server.py /app/server.py
COPY static /app/static

# Scratch space for temporary source files / binaries, owned by the runner.
RUN mkdir -p /tmp/cppwork && chown -R student:student /tmp/cppwork /app

USER student

ENV PORT=8088 \
    PYTHONUNBUFFERED=1

EXPOSE 8088

CMD ["python3", "/app/server.py"]
