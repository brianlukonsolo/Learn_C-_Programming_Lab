<div align="center">

# 🚀 C++ Academy — Learn C++ in a Day ⚙️

### *An interactive, luxuriously-themed C++ course with a live in-browser compiler — all running in Docker* 🐳

![C++](https://img.shields.io/badge/C%2B%2B-11_→_23-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![Docker](https://img.shields.io/badge/Runs_in-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![g++](https://img.shields.io/badge/Compiler-g%2B%2B-FE7A16?style=for-the-badge&logo=gnu&logoColor=white)
![No build step](https://img.shields.io/badge/Frontend-Zero_Build-50fa7b?style=for-the-badge)
![A11y](https://img.shields.io/badge/Contrast-WCAG_AA-88c0d0?style=for-the-badge)

🎨 **6 themes** · ⚡ **real g++** · 🧪 **auto-graded exercises** · 🏗️ **capstone project** · ♿ **accessible** · 📴 **fully offline**

</div>

---

## ✨ What is this?

A **hands-on, single-day C++ course** built from the classic [cplusplus.com C++ Language Tutorial](http://www.cplusplus.com/doc/tutorial/). You read clear, beginner-friendly lessons, hover any underlined term for a deeper explanation, and **run real C++ right in your browser** — every snippet is compiled by `g++` inside a sandboxed container.

> 🔒 **Nothing runs on your host machine.** The web server, the toolchain, and the C++ compiler all live inside one Docker container, started with a single command.

---

## 🏁 Quick start

```bash
cd course
docker compose up --build
```

Then open 👉 **http://localhost:8088** 👈 in your browser.

To stop:

```bash
docker compose down
```

> 💡 Requires **Docker Desktop** (Windows/Mac) or **Docker Engine + Compose**.
> On older installs the command is `docker-compose up --build`.

---

## 🌟 Features

| | Feature | What you get |
|---|---|---|
| 📚 | **13 modules + capstone** | Basics → control flow → OOP → templates → file I/O, then a 3-step **build-a-to-do-app** capstone. |
| ⚡ | **Live compiler** | Edit code and hit ▶ **Run** — compiled by real `g++` and executed in a sandbox. |
| 🧪 | **Auto-graded exercises** | Your code is run against hidden test cases with pass/fail + expected-vs-actual diffs. |
| 🛠️ | **Compiler settings** | Pick the **C++ standard** (11 → 23) and toggle **AddressSanitizer** to catch memory bugs. |
| 🎨 | **6 luxury themes** | Each one contrast-checked for **WCAG AA** legibility. |
| 🖼️ | **Animated diagrams** | Pointers, stack vs heap, inheritance, and dynamic dispatch — visualised. |
| 💬 | **Smart tooltips** | Underlined terms reveal in-depth explanations (screen-reader friendly). |
| 🔠 | **Adjustable text size** | `A−` / `A+` (or `+` / `−` keys) scale reading text 80–170%. |
| ⌨️ | **Keyboard shortcuts** | Fly through lessons without touching the mouse. |
| 📈 | **Progress tracking** | Completed lessons, theme, text size & compiler settings are remembered. |
| ✨ | **Polished motion** | Smooth transitions, scroll reveals, an animated background, and 🎉 confetti on milestones. |
| 📴 | **Offline-perfect** | Fonts are vendored into the image — no CDN, no npm, no internet needed at runtime. |

---

## 🎨 Themes

Switch any time from the palette button — your choice is remembered.

| Theme | Vibe |
|---|---|
| ❄️ **Nord** *(default)* | Frosted arctic calm |
| 🌌 **Midnight** | Obsidian + platinum |
| 🧛 **Dracula** | Royal aubergine |
| 🌆 **Synthwave** | Neon retro night |
| ☀️ **Solarized** | Warm parchment |
| 📄 **Paper** | Pristine white luxe |

---

## ⌨️ Keyboard shortcuts

| Keys | Action |
|---|---|
| `←` / `→` | ⬅️ Previous / ➡️ Next lesson |
| `Shift` + `Enter` | ✅ Mark complete & continue |
| `/` | 🔍 Search lessons |
| `Ctrl` / `⌘` + `Enter` | ▶️ Run code (inside an editor) |
| `+` / `−` | 🔠 Larger / smaller text |
| `?` | ❓ Show all shortcuts |
| `Esc` | ✖️ Close dialogs & menus |

---

## 🗺️ Course roadmap

1. 🧱 **Getting Started** — program structure, input/output
2. 📦 **Variables & Types** — types, `auto`, constants
3. ➕ **Operators** — arithmetic, comparison, logic
4. 🔀 **Control Flow** — `if`, loops, `switch`
5. 🧩 **Functions** — overloading, defaults, recursion
6. 🔢 **Arrays & Strings** — `vector`, `std::string`
7. 📍 **Pointers & Memory** — `new` / `delete`, smart pointers
8. 🏷️ **Data Structures** — `struct`, `enum`, unions
9. 🎭 **Classes & Objects** — encapsulation, constructors
10. 🌳 **Inheritance & Polymorphism** — `virtual`, abstract classes
11. 🧠 **Advanced** — templates, namespaces, exceptions, casting
12. 🏗️ **Capstone** — build a command-line to-do app (graded!)
13. 📂 **Standard Library & Tooling** — preprocessor, file I/O

---

## 🔒 How the sandbox stays safe

Learner code is untrusted, so it's contained on several layers:

- 👤 Runs as an **unprivileged user** inside the container
- 🧱 **Drops all Linux capabilities**, sets `no-new-privileges`, caps memory (512 MB) & processes (256)
- ⏱️ **CPU, memory, output-size & wall-clock limits** on every program
- 🗑️ Each run uses a **throwaway temp directory**, deleted afterward

> ⚠️ Intended for **local, single-user learning** on `localhost`. Don't expose port `8088` to an untrusted network.

---

## 🧑‍💻 Development mode (optional)

The production image is fully self-contained. To edit content **without rebuilding**, bind-mount the frontend:

```bash
cd course
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Edits to `app/static/**` and `app/server.py` then show on a browser refresh. 🔄

---

## 📁 Project structure

```
Learn_C++_Programming_Lab/
├─ 📄 README.md                  ← you are here
├─ 📕 c++_programming_tutorial.pdf  (the source material)
└─ 📂 course/
   ├─ 🐳 docker-compose.yml      (one hardened service, port 8088)
   ├─ 🐳 docker-compose.dev.yml  (optional live-edit override)
   ├─ 📖 README.md               (detailed course docs)
   └─ 📂 app/
      ├─ 🐳 Dockerfile           (python:3.12-slim + g++)
      ├─ 🐍 server.py            (static files + /api/run + /api/grade)
      └─ 📂 static/
         ├─ index.html
         ├─ 🎨 css/styles.css    (6 themes + animations)
         └─ 📜 js/               (lessons, highlighter, editor, runner, app)
```

---

<div align="center">

### 🎓 Ready? `docker compose up` and open **http://localhost:8088** — happy hacking! 💜

*Built with care — clear language, smooth motion, and real, runnable C++.*

</div>
