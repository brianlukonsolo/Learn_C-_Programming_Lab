#!/usr/bin/env python3
"""C++ Academy server.

Dependency-free (Python standard library only) so the image builds reliably
and stays tiny. Responsibilities:

  * Serve the static single-page frontend from ./static
  * POST /api/run   -> compile + execute a C++ snippet with g++, return output
  * GET  /api/health -> liveness probe for the container healthcheck

Everything runs inside the container as the unprivileged `student` user, with
CPU / memory / output / process rlimits and wall-clock timeouts applied to the
learner's code. The container additionally drops Linux capabilities and sets
no-new-privileges (see docker-compose.yml).
"""

import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import threading
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

try:
    import resource  # POSIX only; always present in the Linux container.
except ImportError:  # pragma: no cover - defensive for non-Linux dev hosts.
    resource = None

PORT = int(os.environ.get("PORT", "8088"))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

COMPILE_TIMEOUT = int(os.environ.get("COMPILE_TIMEOUT", "12"))
RUN_TIMEOUT = int(os.environ.get("RUN_TIMEOUT", "6"))
MAX_CODE_BYTES = int(os.environ.get("MAX_CODE_BYTES", "200000"))
# How many compile/run jobs may execute at once (protects host CPU).
MAX_CONCURRENCY = int(os.environ.get("MAX_CONCURRENCY", "4"))
# Allowed C++ standards (feature #7). Maps request value -> g++ flag.
STD_ALLOW = {
    "c++11": "c++11", "c++14": "c++14", "c++17": "c++17",
    "c++20": "c++20", "c++23": "c++2b",
}
DEFAULT_STD = "c++17"

# Bounded run slots + a small LRU result cache for /api/run (feature #12).
_run_slots = threading.BoundedSemaphore(MAX_CONCURRENCY)
_cache_lock = threading.Lock()
_run_cache = OrderedDict()
_CACHE_MAX = 256


def _cache_get(key):
    with _cache_lock:
        if key in _run_cache:
            _run_cache.move_to_end(key)
            return dict(_run_cache[key])
    return None


def _cache_put(key, value):
    with _cache_lock:
        _run_cache[key] = dict(value)
        _run_cache.move_to_end(key)
        while len(_run_cache) > _CACHE_MAX:
            _run_cache.popitem(last=False)
MAX_OUTPUT_BYTES = 100_000  # truncate program output to keep responses sane

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".png": "image/png",
}


def _child_limits():
    """preexec_fn applied to the compiled program: cap CPU, memory, files."""
    if resource is None:
        return
    # CPU seconds — a backstop set slightly *above* the wall-clock timeout so
    # the wall-clock timeout normally fires first (giving a clean timed_out),
    # and this still hard-stops anything that slips past it.
    resource.setrlimit(resource.RLIMIT_CPU, (RUN_TIMEOUT + 2, RUN_TIMEOUT + 3))
    # Address space ~ 256 MB.
    mem = 256 * 1024 * 1024
    try:
        resource.setrlimit(resource.RLIMIT_AS, (mem, mem))
    except (ValueError, OSError):
        pass
    # Max output file size ~ 16 MB (blocks runaway file writes).
    fsize = 16 * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_FSIZE, (fsize, fsize))
    # No core dumps.
    resource.setrlimit(resource.RLIMIT_CORE, (0, 0))


def _truncate(text):
    data = text.encode("utf-8", "replace")
    if len(data) <= MAX_OUTPUT_BYTES:
        return text
    return data[:MAX_OUTPUT_BYTES].decode("utf-8", "replace") + "\n…[output truncated]"


_SIGNAL_NOTES = {
    24: "Program exceeded the CPU time limit and was stopped.",
    9: "Program was killed (likely exceeded the memory limit).",
    11: "Program crashed with a segmentation fault "
        "(invalid memory access — check your pointers/indices).",
    6: "Program aborted (e.g. an uncaught exception or failed assertion).",
    8: "Program crashed with a floating-point error (e.g. divide by zero).",
}


def _resolve_options(std, sanitize):
    flag = STD_ALLOW.get((std or "").lower(), STD_ALLOW[DEFAULT_STD])
    return flag, bool(sanitize)


def _compile(code, std_flag, sanitize, workdir):
    """Compile to `workdir/program`. Returns (ok, output, binpath, timed_out)."""
    src = os.path.join(workdir, "main.cpp")
    binpath = os.path.join(workdir, "program")
    with open(src, "w", encoding="utf-8") as fh:
        fh.write(code)
    cmd = ["g++", "-std=" + std_flag, "-O1", "-pipe", "-Wall", "-Wextra"]
    if sanitize:
        # AddressSanitizer + UndefinedBehaviorSanitizer catch memory/UB bugs.
        cmd += ["-fsanitize=address,undefined", "-fno-omit-frame-pointer", "-g"]
    cmd += ["-o", binpath, src]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True,
                              timeout=COMPILE_TIMEOUT, cwd=workdir)
    except subprocess.TimeoutExpired:
        return False, "Compilation timed out.", None, True
    return proc.returncode == 0, _truncate(proc.stdout + proc.stderr), binpath, False


def _run(binpath, stdin_text, workdir, sanitize=False):
    """Run a compiled binary once. Returns a run-result dict."""
    res = {"stdout": "", "stderr": "", "exit_code": None, "timed_out": False}
    env = {"PATH": "/usr/bin:/bin"}
    if sanitize:
        env["ASAN_OPTIONS"] = "detect_leaks=0:abort_on_error=0:print_stats=0"
    try:
        proc = subprocess.run(
            [binpath], input=stdin_text, capture_output=True, text=True,
            timeout=RUN_TIMEOUT, cwd=workdir,
            preexec_fn=_child_limits if resource else None, env=env,
        )
        res["stdout"] = _truncate(proc.stdout)
        res["stderr"] = _truncate(proc.stderr)
        res["exit_code"] = proc.returncode
        if proc.returncode is not None and proc.returncode < 0:
            sig = -proc.returncode
            if sig in (24, 9):
                res["timed_out"] = True
            note = _SIGNAL_NOTES.get(sig, "Program terminated by signal %d." % sig)
            res["stderr"] = (res["stderr"] + ("\n" if res["stderr"] else "") + note).strip()
    except subprocess.TimeoutExpired as exc:
        res["timed_out"] = True
        partial = exc.stdout or ""
        if isinstance(partial, bytes):
            partial = partial.decode("utf-8", "replace")
        res["stdout"] = _truncate(partial)
        res["stderr"] = "Program exceeded the time limit and was stopped."
    return res


def compile_and_run(code, stdin_text, std=DEFAULT_STD, sanitize=False):
    """Compile + run once. Cached and concurrency-limited (features #7, #12)."""
    std_flag, sanitize = _resolve_options(std, sanitize)
    key = hashlib.sha256(
        ("\x00".join([std_flag, "1" if sanitize else "0", stdin_text, code]))
        .encode("utf-8")).hexdigest()
    cached = _cache_get(key)
    if cached is not None:
        cached["cached"] = True
        return cached

    result = {"stage": "compile", "compile_ok": False, "compile_output": "",
              "stdout": "", "stderr": "", "exit_code": None,
              "timed_out": False, "cached": False, "std": std, "sanitize": sanitize}

    with _run_slots:
        workdir = tempfile.mkdtemp(prefix="run_", dir="/tmp/cppwork")
        try:
            ok, output, binpath, ctimeout = _compile(code, std_flag, sanitize, workdir)
            result["compile_output"] = output
            result["timed_out"] = ctimeout
            if not ok:
                _cache_put(key, result)
                return result
            result["compile_ok"] = True
            result["stage"] = "run"
            run = _run(binpath, stdin_text, workdir, sanitize)
            result.update(run)
        finally:
            shutil.rmtree(workdir, ignore_errors=True)

    _cache_put(key, result)
    return result


def grade(code, tests, std=DEFAULT_STD, sanitize=False):
    """Compile once, run against each hidden test case (feature #2)."""
    std_flag, sanitize = _resolve_options(std, sanitize)
    out = {"compile_ok": False, "compile_output": "", "passed": 0,
           "total": len(tests), "tests": [], "std": std}

    with _run_slots:
        workdir = tempfile.mkdtemp(prefix="grade_", dir="/tmp/cppwork")
        try:
            ok, output, binpath, _ct = _compile(code, std_flag, sanitize, workdir)
            out["compile_output"] = output
            if not ok:
                return out
            out["compile_ok"] = True
            for t in tests:
                stdin_text = (t.get("stdin") or "")
                expected = (t.get("expected") or "")
                run = _run(binpath, stdin_text, workdir, sanitize)
                got = run["stdout"]
                ok_test = _normalise(got) == _normalise(expected) and not run["timed_out"]
                if ok_test:
                    out["passed"] += 1
                entry = {"name": t.get("name", ""), "pass": ok_test,
                         "timed_out": run["timed_out"]}
                if t.get("show_io", True):
                    entry["stdin"] = stdin_text
                    entry["expected"] = expected
                    entry["got"] = got
                if run["stderr"]:
                    entry["stderr"] = run["stderr"]
                out["tests"].append(entry)
        finally:
            shutil.rmtree(workdir, ignore_errors=True)
    out["all_passed"] = out["total"] > 0 and out["passed"] == out["total"]
    return out


def _normalise(text):
    """Compare output forgivingly: trim trailing spaces per line + overall."""
    lines = [ln.rstrip() for ln in (text or "").replace("\r\n", "\n").split("\n")]
    return "\n".join(lines).strip()


class Handler(BaseHTTPRequestHandler):
    server_version = "CppAcademy/1.0"
    protocol_version = "HTTP/1.1"

    # -- helpers ------------------------------------------------------------
    def _send(self, status, body, content_type="application/json; charset=utf-8"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def log_message(self, fmt, *args):  # quieter logs
        pass

    # -- routing ------------------------------------------------------------
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/api/health":
            self._send(200, json.dumps({"ok": True}))
            return
        self._serve_static(path)

    def do_HEAD(self):
        self.do_GET()

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path not in ("/api/run", "/api/grade"):
            self._send(404, json.dumps({"error": "not found"}))
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_CODE_BYTES + 80_000:
            self._send(413, json.dumps({"error": "Payload too large or empty."}))
            return
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
            code = payload.get("code", "")
            std = payload.get("std", DEFAULT_STD)
            sanitize = bool(payload.get("sanitize", False))
        except (ValueError, AttributeError):
            self._send(400, json.dumps({"error": "Invalid JSON body."}))
            return
        if not isinstance(code, str) or not code.strip():
            self._send(400, json.dumps({"error": "No code provided."}))
            return
        if len(code.encode("utf-8")) > MAX_CODE_BYTES:
            self._send(413, json.dumps({"error": "Code is too long."}))
            return

        if path == "/api/grade":
            tests = payload.get("tests", [])
            if not isinstance(tests, list) or not tests:
                self._send(400, json.dumps({"error": "No test cases provided."}))
                return
            tests = tests[:25]  # cap work per request
            self._send(200, json.dumps(grade(code, tests, std, sanitize)))
            return

        stdin_text = payload.get("stdin", "") or ""
        result = compile_and_run(code, stdin_text, std, sanitize)
        self._send(200, json.dumps(result))

    # -- static files ------------------------------------------------------
    def _serve_static(self, path):
        if path == "/" or path == "":
            path = "/index.html"
        # Normalise & prevent path traversal.
        rel = os.path.normpath(path).lstrip("/\\")
        full = os.path.join(STATIC_DIR, rel)
        if not os.path.abspath(full).startswith(os.path.abspath(STATIC_DIR)):
            self._send(403, "Forbidden", "text/plain; charset=utf-8")
            return
        if not os.path.isfile(full):
            # SPA fallback so deep links still load the app shell.
            full = os.path.join(STATIC_DIR, "index.html")
            if not os.path.isfile(full):
                self._send(404, "Not found", "text/plain; charset=utf-8")
                return
        ext = os.path.splitext(full)[1].lower()
        ctype = CONTENT_TYPES.get(ext, "application/octet-stream")
        try:
            with open(full, "rb") as fh:
                body = fh.read()
        except OSError:
            self._send(500, "Read error", "text/plain; charset=utf-8")
            return
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


def main():
    os.makedirs("/tmp/cppwork", exist_ok=True)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True
    print(f"C++ Academy listening on http://0.0.0.0:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
