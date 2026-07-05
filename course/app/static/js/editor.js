/* Runnable C++ editor: a textarea with a live syntax-highlight overlay,
   a Run button, an optional stdin box, and a console for results. */
(function () {
  "use strict";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function syncHighlight(ta, hl) {
    var code = ta.value;
    // trailing newline keeps the last line visible during scroll
    hl.innerHTML = window.CppHL.highlight(code) + "\n";
    hl.scrollTop = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
  }

  function autoHeight(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.max(120, ta.scrollHeight) + "px";
  }

  function runtime() {
    var s = window.CppSettings && window.CppSettings.get ? window.CppSettings.get() : {};
    return {
      compiler: s.compiler || (s.language === "c" ? "gcc" : "g++"),
      languageName: s.languageName || (s.language === "c" ? "C" : "C++"),
    };
  }

  /* Build a full runnable code card. opts: { code, title, stdin } */
  function createRunnable(opts) {
    opts = opts || {};
    var card = el("div", "code-card");

    var head = el("div", "code-head");
    head.appendChild(el("div", "code-dots", "<span></span><span></span><span></span>"));
    head.appendChild(el("span", "code-title", opts.title || "main.cpp"));
    var actions = el("div", "code-actions");
    var resetBtn = el("button", "code-btn", "↺ Reset");
    var runBtn = el("button", "code-btn run", "▶ Run");
    actions.appendChild(resetBtn);
    actions.appendChild(runBtn);
    head.appendChild(actions);
    card.appendChild(head);

    var wrap = el("div", "editor-wrap");
    var hl = el("pre", "hl");
    hl.setAttribute("aria-hidden", "true");
    var ta = el("textarea");
    ta.spellcheck = false;
    ta.autocapitalize = "off";
    ta.setAttribute("autocomplete", "off");
    ta.setAttribute("autocorrect", "off");
    ta.setAttribute("aria-label", runtime().languageName + " code editor");
    var initial = (opts.code || "").replace(/\s+$/, "");
    ta.value = initial;
    wrap.appendChild(hl);
    wrap.appendChild(ta);
    card.appendChild(wrap);

    // optional stdin
    var stdinTa = null;
    if (opts.stdin !== undefined && opts.stdin !== null) {
      var sr = el("div", "stdin-row");
      // When the example ships with starter values, make clear they're a
      // sample the learner can change — not something they typed.
      var hasSample = String(opts.stdin).trim().length > 0;
      var labelText = hasSample
        ? 'Standard input (stdin) <span class="stdin-hint">· sample values — edit freely</span>'
        : "Standard input (stdin)";
      sr.appendChild(el("label", null, labelText));
      stdinTa = el("textarea");
      stdinTa.value = opts.stdin;
      stdinTa.setAttribute("aria-label", "Standard input");
      sr.appendChild(stdinTa);
      card.appendChild(sr);
    }

    var console = el("div", "console");
    var cHead = el("div", "console-head", "<span>Output</span>");
    var stat = el("span", "stat", "");
    cHead.appendChild(stat);
    var cBody = el("div", "console-body collapsed");
    cBody.setAttribute("role", "status");
    cBody.setAttribute("aria-live", "polite");
    console.appendChild(cHead);
    console.appendChild(cBody);
    card.appendChild(console);

    function refresh() { syncHighlight(ta, hl); autoHeight(ta); }

    ta.addEventListener("input", refresh);
    ta.addEventListener("scroll", function () { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; });

    // Tab inserts two spaces; Ctrl/Cmd+Enter runs.
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        refresh();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        doRun();
      }
    });

    resetBtn.addEventListener("click", function () {
      ta.value = initial;
      refresh();
      cBody.className = "console-body collapsed";
      stat.className = "stat";
      stat.textContent = "";
    });

    async function doRun() {
      runBtn.disabled = true;
      runBtn.innerHTML = '<span class="spinner"></span> Running';
      cBody.className = "console-body";
      cBody.innerHTML = '<span style="color:var(--text-faint)">Compiling with ' + runtime().compiler + '…</span>';
      stat.className = "stat";
      stat.textContent = "";
      try {
        var res = await window.CppRunner.run(ta.value, stdinTa ? stdinTa.value : "");
        renderResult(res);
      } catch (err) {
        cBody.innerHTML = '<span class="out-err">' + window.CppHL.esc(err.message || String(err)) + "</span>" +
          '<br><span style="color:var(--text-faint)">Is the container running? Try <code>docker compose up</code>.</span>';
        stat.className = "stat err";
        stat.textContent = "connection error";
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = "▶ Run";
      }
    }

    function renderResult(res) {
      var html = "";
      if (!res.compile_ok) {
        stat.className = "stat err";
        stat.textContent = "compile error";
        html += '<span class="out-label">Compiler</span>';
        html += '<span class="out-err">' + window.CppHL.esc(res.compile_output || "Compilation failed.") + "</span>";
        cBody.innerHTML = html;
        return;
      }
      // warnings from a successful compile
      if (res.compile_output && res.compile_output.trim()) {
        html += '<span class="out-label">Compiler warnings</span>';
        html += '<span class="out-warn">' + window.CppHL.esc(res.compile_output) + "</span>";
      }
      html += '<span class="out-label">Program output</span>';
      html += res.stdout ? window.CppHL.esc(res.stdout) : '<span style="color:var(--text-faint)">(no output)</span>';
      if (res.stderr && res.stderr.trim()) {
        html += '<span class="out-label">stderr</span><span class="out-err">' + window.CppHL.esc(res.stderr) + "</span>";
      }
      cBody.innerHTML = html;
      if (res.timed_out) {
        stat.className = "stat err";
        stat.textContent = "timed out";
      } else {
        stat.className = res.exit_code === 0 ? "stat ok" : "stat err";
        stat.textContent = "exit " + res.exit_code;
      }
    }

    runBtn.addEventListener("click", doRun);

    // initial paint (after insertion into DOM for correct sizing)
    requestAnimationFrame(refresh);

    return card;
  }

  /* Read-only, highlighted code block. Includes "Edit & Run" (feature #8). */
  function createStatic(code, title) {
    var card = el("div", "code-card");
    var head = el("div", "code-head");
    head.appendChild(el("div", "code-dots", "<span></span><span></span><span></span>"));
    head.appendChild(el("span", "code-title", title || "example.cpp"));
    var actions = el("div", "code-actions");
    var copyBtn = el("button", "code-btn", "⧉ Copy");
    var editBtn = el("button", "code-btn", "▶ Edit &amp; Run");
    editBtn.title = "Open this snippet in an editor and run it";
    actions.appendChild(copyBtn);
    actions.appendChild(editBtn);
    head.appendChild(actions);
    card.appendChild(head);

    var pre = el("pre", "code");
    var codeEl = el("code");
    codeEl.innerHTML = window.CppHL.highlight(code.replace(/\s+$/, ""));
    pre.appendChild(codeEl);
    card.appendChild(pre);

    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(code).then(function () {
        copyBtn.textContent = "✓ Copied";
        setTimeout(function () { copyBtn.innerHTML = "⧉ Copy"; }, 1400);
      }).catch(function () {});
    });

    editBtn.addEventListener("click", function () {
      var runnable = createRunnable({ code: code, title: title || "snippet.cpp" });
      if (card.parentNode) card.parentNode.replaceChild(runnable, card);
      requestAnimationFrame(function () {
        var ta = runnable.querySelector("textarea");
        if (ta) ta.focus();
      });
    });
    return card;
  }

  /* Auto-graded exercise (feature #2).
     opts: { prompt, code (starter), tests:[{name,stdin,expected,show_io}],
             hint, solution, title } */
  function createExercise(opts) {
    opts = opts || {};
    var card = el("div", "exercise");

    var head = el("div", "exercise-head");
    head.innerHTML = '<span class="ex-badge">Exercise</span>';
    if (opts.prompt) {
      var p = el("div", "ex-prompt");
      p.innerHTML = opts.promptHtml || window.CppHL.esc(opts.prompt);
      head.appendChild(p);
    }
    card.appendChild(head);

    // editor (reuse the runnable card visual, minus stdin/console)
    var codeCard = el("div", "code-card");
    var cHead = el("div", "code-head");
    cHead.appendChild(el("div", "code-dots", "<span></span><span></span><span></span>"));
    cHead.appendChild(el("span", "code-title", opts.title || "solution.cpp"));
    var cActions = el("div", "code-actions");
    var resetBtn = el("button", "code-btn", "↺ Reset");
    var hintBtn = opts.hint ? el("button", "code-btn", "💡 Hint") : null;
    var solBtn = opts.solution ? el("button", "code-btn", "👁 Solution") : null;
    var runBtn = el("button", "code-btn run", "✓ Run tests");
    if (hintBtn) cActions.appendChild(hintBtn);
    if (solBtn) cActions.appendChild(solBtn);
    cActions.appendChild(resetBtn);
    cActions.appendChild(runBtn);
    cHead.appendChild(cActions);
    codeCard.appendChild(cHead);

    var wrap = el("div", "editor-wrap");
    var hl = el("pre", "hl"); hl.setAttribute("aria-hidden", "true");
    var ta = el("textarea");
    ta.spellcheck = false; ta.autocapitalize = "off";
    ta.setAttribute("autocomplete", "off"); ta.setAttribute("autocorrect", "off");
    ta.setAttribute("aria-label", runtime().languageName + " exercise code editor");
    var initial = (opts.code || "").replace(/\s+$/, "");
    ta.value = initial;
    wrap.appendChild(hl); wrap.appendChild(ta);
    codeCard.appendChild(wrap);

    var results = el("div", "ex-results");
    results.setAttribute("role", "status");
    results.setAttribute("aria-live", "polite");
    codeCard.appendChild(results);
    card.appendChild(codeCard);

    function refresh() { syncHighlight(ta, hl); autoHeight(ta); }
    ta.addEventListener("input", refresh);
    ta.addEventListener("scroll", function () { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2; refresh();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault(); doGrade();
      }
    });
    resetBtn.addEventListener("click", function () { ta.value = initial; refresh(); results.className = "ex-results"; results.innerHTML = ""; });
    if (hintBtn) hintBtn.addEventListener("click", function () {
      results.className = "ex-results show";
      results.innerHTML = '<div class="ex-hint">💡 ' + (opts.hintHtml || window.CppHL.esc(opts.hint)) + "</div>";
    });
    if (solBtn) solBtn.addEventListener("click", function () {
      if (!window.confirm("Show the full solution? Try the exercise first!")) return;
      ta.value = opts.solution.replace(/\s+$/, ""); refresh();
    });

    async function doGrade() {
      runBtn.disabled = true;
      runBtn.innerHTML = '<span class="spinner"></span> Testing';
      results.className = "ex-results show";
      results.innerHTML = '<span style="color:var(--text-faint)">Compiling &amp; running tests…</span>';
      try {
        var res = await window.CppRunner.grade(ta.value, opts.tests || []);
        renderGrade(res);
      } catch (err) {
        results.innerHTML = '<div class="ex-fail-banner">' + window.CppHL.esc(err.message || String(err)) + "</div>";
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = "✓ Run tests";
      }
    }

    function renderGrade(res) {
      var html = "";
      if (!res.compile_ok) {
        html += '<div class="ex-fail-banner">Your code didn\'t compile:</div>';
        html += '<pre class="ex-compile">' + window.CppHL.esc(res.compile_output || "") + "</pre>";
        results.innerHTML = html;
        return;
      }
      var allPass = res.all_passed;
      html += '<div class="ex-summary ' + (allPass ? "good" : "bad") + '">' +
        (allPass ? "✓ All tests passed" : "✗ " + res.passed + " / " + res.total + " tests passed") + "</div>";
      html += '<ul class="ex-test-list">';
      (res.tests || []).forEach(function (t) {
        html += '<li class="ex-test ' + (t.pass ? "pass" : "fail") + '">';
        html += '<span class="ex-test-mark">' + (t.pass ? "✓" : "✗") + "</span>";
        html += '<span class="ex-test-name">' + window.CppHL.esc(t.name || "test") + "</span>";
        if (!t.pass && (t.expected !== undefined || t.got !== undefined)) {
          html += '<div class="ex-diff">';
          if (t.stdin) html += '<div><b>input</b><pre>' + window.CppHL.esc(t.stdin) + "</pre></div>";
          html += '<div><b>expected</b><pre>' + window.CppHL.esc(t.expected || "") + "</pre></div>";
          html += '<div><b>your output</b><pre>' + window.CppHL.esc(t.got || "(none)") + "</pre></div>";
          if (t.stderr) html += '<div><b>stderr</b><pre class="out-err">' + window.CppHL.esc(t.stderr) + "</pre></div>";
          html += "</div>";
        }
        html += "</li>";
      });
      html += "</ul>";
      results.innerHTML = html;
      if (allPass && typeof window.CppCelebrate === "function") window.CppCelebrate();
    }

    runBtn.addEventListener("click", doGrade);
    requestAnimationFrame(refresh);
    return card;
  }

  window.CppEditor = {
    createRunnable: createRunnable,
    createStatic: createStatic,
    createExercise: createExercise,
  };
})();
