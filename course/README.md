# C/C++ Academy — Interactive Systems Programming

Interactive, themeable courses for C and C++. Read clear lessons, hover any
underlined term for an in-depth tooltip, and **run real C or C++ in the
browser** — examples compile with `gcc` or `g++` inside the container.

> **Nothing runs on your host machine.** The toolchain, the web server, and the
> C/C++ compilers all live inside one Docker container, started with a single
> `docker compose` command.

## Run it

From the `course/` directory:

```bash
docker compose up --build
```

Then open **http://localhost:8088** in your browser.

To stop:

```bash
docker compose down
```

> Requires Docker Desktop (Windows/Mac) or Docker Engine + the Compose plugin.
> On older installs the command is `docker-compose up --build`.

## What's inside

| Feature | Detail |
| --- | --- |
| **Two complete courses** | C++ mirrors the cplusplus.com tutorial with a to-do capstone. C follows the K&R 2nd edition roadmap with 10 modules, 26 lessons, and a text-analyzer capstone. |
| **Live compiler** | `POST /api/run` compiles and runs your code with `gcc` or `g++` and returns the output. |
| **Auto-graded exercises** | `POST /api/grade` compiles once and runs your code against hidden test cases, showing per-test pass/fail with expected-vs-actual diffs. |
| **Compiler settings** | Choose the active course's language standard (C90 → C23, C++11 → C++23) and toggle runtime sanitizers (AddressSanitizer + UBSan). Persisted per course. |
| **6 themes (WCAG AA)** | Synthwave (default), Midnight, Nord, Dracula, Solarized Light, Paper — every text/background pair is contrast-checked. |
| **Diagrams** | Animated SVGs for pointers, stack-vs-heap memory, inheritance, and dynamic dispatch. |
| **Tooltips** | Underlined terms reveal deeper explanations on hover or keyboard focus (with full text exposed to screen readers). |
| **Reading size** | A−/A+ control (or `+`/`−` keys) scales all reading text 80–170%. Persisted. |
| **Keyboard shortcuts** | `←/→` lessons, `Shift+Enter` complete, `/` search, `Ctrl/⌘+Enter` run, `?` help. |
| **Accessibility** | Skip link, focus-visible rings, ARIA live regions for output & quiz results, contrast-audited palettes. |
| **Offline fonts** | Inter, Cormorant Garamond, and JetBrains Mono are vendored into the image at build time (graceful fallback to system fonts). |
| **Progress & animations** | Completed lessons, theme, text size, and compiler settings persist in local storage; C and C++ progress are tracked separately. |

### Development mode (live edits, no rebuild)

The production image is fully self-contained. For editing content without
rebuilding, bind-mount the frontend with the dev override:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Edits to `app/static/**` and `app/server.py` then show on a browser refresh.

## How the code sandbox is kept safe

Learner code is untrusted, so it is contained on several layers:

- Runs as an **unprivileged user** (`student`) inside the container.
- The container **drops all Linux capabilities**, sets `no-new-privileges`, and
  caps memory (512 MB) and process count (256).
- Each program gets **CPU, address-space, output-size, and core-dump rlimits**
  plus **wall-clock timeouts** for both compilation and execution.
- Each run uses a throwaway temp directory that is deleted afterward.

This is intended for **local, single-user learning** on `localhost`. Do not
expose port 8088 to an untrusted network.

## Project layout

```
course/
├─ docker-compose.yml      # one service, port 8088, hardened
├─ README.md
└─ app/
   ├─ Dockerfile           # python:3.12-slim + gcc/g++
   ├─ server.py            # stdlib HTTP server: static files + /api/run
   └─ static/
      ├─ index.html
      ├─ css/styles.css    # design tokens + 6 themes + animations
      └─ js/
         ├─ lessons.js     # C++ course content
         ├─ c_lessons.js   # C course content
         ├─ highlighter.js # C/C++ syntax highlighter
         ├─ editor.js      # runnable editor component
         ├─ runner.js      # /api/run client
         └─ app.js         # routing, theming, tooltips, progress
```

No build step, no npm, no CDN — the frontend is plain HTML/CSS/JS served
straight from the container, so it works fully offline.
