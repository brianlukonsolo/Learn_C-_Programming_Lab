/* ============================================================
   C++ Academy — application shell
   Routing, rendering, theming, tooltips, progress, animations.
   ============================================================ */
(function () {
  "use strict";

  // ---------- Themes ----------
  var THEMES = [
    { id: "midnight",  name: "Midnight",        sw: "linear-gradient(135deg,#5eead4,#818cf8)" },
    { id: "nord",      name: "Nord",            sw: "linear-gradient(135deg,#88c0d0,#81a1c1)" },
    { id: "dracula",   name: "Dracula",         sw: "linear-gradient(135deg,#50fa7b,#bd93f9)" },
    { id: "synthwave", name: "Synthwave",       sw: "linear-gradient(135deg,#ff71ce,#01cdfe)" },
    { id: "solarized", name: "Solarized Light", sw: "linear-gradient(135deg,#268bd2,#b58900)" },
    { id: "paper",     name: "Paper",           sw: "linear-gradient(135deg,#6366f1,#0ea5e9)" },
  ];

  // ---------- Diagrams (feature #6) ----------
  // Theme-aware inline SVGs; colours pull from CSS variables, motion from CSS.
  var DIAGRAMS = {
    pointers:
      '<svg viewBox="0 0 560 200" class="dgm" role="img" aria-label="A pointer p stores the address of variable x and points to it">' +
        '<g class="dgm-fade">' +
          '<rect x="40" y="60" width="160" height="80" rx="12" class="dgm-box"/>' +
          '<text x="120" y="50" class="dgm-label">int x</text>' +
          '<text x="120" y="108" class="dgm-val">42</text>' +
          '<text x="120" y="160" class="dgm-addr">@ 0x7ffe04</text>' +
          '<rect x="360" y="60" width="160" height="80" rx="12" class="dgm-box accent"/>' +
          '<text x="440" y="50" class="dgm-label">int* p</text>' +
          '<text x="440" y="108" class="dgm-val">0x7ffe04</text>' +
        '</g>' +
        '<path d="M360 100 L210 100" class="dgm-arrow" marker-end="url(#ah)"/>' +
        '<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">' +
          '<path d="M0 0 L8 3 L0 6 Z" class="dgm-arrowhead"/></marker></defs>' +
      '</svg>',

    memory:
      '<svg viewBox="0 0 560 240" class="dgm" role="img" aria-label="The stack holds local variables; the heap holds memory from new">' +
        '<g class="dgm-fade">' +
          '<text x="130" y="34" class="dgm-title">STACK</text>' +
          '<rect x="40" y="50" width="180" height="40" rx="8" class="dgm-cell"/><text x="130" y="76" class="dgm-cell-t">int n = 4</text>' +
          '<rect x="40" y="96" width="180" height="40" rx="8" class="dgm-cell"/><text x="130" y="122" class="dgm-cell-t">int* arr</text>' +
          '<rect x="40" y="142" width="180" height="40" rx="8" class="dgm-cell dim"/><text x="130" y="168" class="dgm-cell-t dim">main()</text>' +
          '<text x="430" y="34" class="dgm-title">HEAP</text>' +
          '<rect x="340" y="70" width="180" height="110" rx="10" class="dgm-box accent"/>' +
          '<text x="430" y="120" class="dgm-val">new int[4]</text>' +
          '<text x="430" y="150" class="dgm-addr">freed by delete[]</text>' +
        '</g>' +
        '<path d="M340 120 L222 116" class="dgm-arrow" marker-end="url(#ah2)"/>' +
        '<defs><marker id="ah2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0 L8 3 L0 6 Z" class="dgm-arrowhead"/></marker></defs>' +
      '</svg>',

    inheritance:
      '<svg viewBox="0 0 560 230" class="dgm" role="img" aria-label="Dog and Cat inherit from Animal">' +
        '<g class="dgm-fade">' +
          '<rect x="200" y="20" width="160" height="56" rx="12" class="dgm-box accent"/>' +
          '<text x="280" y="46" class="dgm-label">Animal</text><text x="280" y="64" class="dgm-addr">breathe()</text>' +
          '<rect x="60" y="150" width="160" height="60" rx="12" class="dgm-box"/>' +
          '<text x="140" y="176" class="dgm-label">Dog</text><text x="140" y="195" class="dgm-addr">bark()</text>' +
          '<rect x="340" y="150" width="160" height="60" rx="12" class="dgm-box"/>' +
          '<text x="420" y="176" class="dgm-label">Cat</text><text x="420" y="195" class="dgm-addr">meow()</text>' +
        '</g>' +
        '<path d="M250 80 L140 148" class="dgm-arrow"/><path d="M310 80 L420 148" class="dgm-arrow"/>' +
      '</svg>',

    dispatch:
      '<svg viewBox="0 0 560 210" class="dgm" role="img" aria-label="A base Shape pointer calls the correct overridden area at runtime">' +
        '<g class="dgm-fade">' +
          '<rect x="40" y="80" width="170" height="56" rx="12" class="dgm-box accent"/>' +
          '<text x="125" y="104" class="dgm-label">Shape* s</text><text x="125" y="124" class="dgm-addr">s-&gt;area()</text>' +
          '<rect x="350" y="24" width="170" height="52" rx="12" class="dgm-box"/>' +
          '<text x="435" y="48" class="dgm-label">Circle</text><text x="435" y="66" class="dgm-addr">πr²</text>' +
          '<rect x="350" y="140" width="170" height="52" rx="12" class="dgm-box"/>' +
          '<text x="435" y="164" class="dgm-label">Square</text><text x="435" y="182" class="dgm-addr">s·s</text>' +
        '</g>' +
        '<path d="M210 100 L350 50" class="dgm-arrow dashed"/><path d="M210 116 L350 166" class="dgm-arrow"/>' +
        '<defs/></svg>',
  };

  // ---------- Courses / state ----------
  var COURSES = [
    {
      id: "cpp",
      language: "cpp",
      title: "C++ Academy",
      subtitle: "Learn C++ in a day",
      shortName: "C++",
      mark: "C<sup>++</sup>",
      modules: window.CourseData || [],
      homeId: "home",
      startId: "structure",
      doneKey: "cpp_done",
      compilerKey: "cpp_compiler",
      compiler: "g++",
      standardLabel: "C++ standard",
      defaultStd: "c++17",
      standards: [
        ["c++11", "C++11"],
        ["c++14", "C++14"],
        ["c++17", "C++17"],
        ["c++20", "C++20"],
        ["c++23", "C++23"],
      ],
      heroTitle: "Learn C++ in a Day",
      heroEyebrow: "Interactive · Live compiler",
      heroLede: "A hands-on course built from the classic C++ Language Tutorial. Read clear lessons, hover any underlined term for a deeper explanation, and run real C++ right in your browser.",
      completeToast: "🎉 Course complete — you learned C++!",
      features: [
        ["⚡", "Live compiler", "Every example runs through real g++ in a sandboxed container."],
        ["🎨", "Six themes", "Midnight, Nord, Dracula, Synthwave, Solarized, Paper — pick your mood."],
        ["💬", "Smart tooltips", "Underlined terms reveal in-depth explanations on hover."],
        ["📈", "Progress tracking", "Your completed lessons are saved automatically as you go."],
      ],
    },
    {
      id: "c",
      language: "c",
      title: "C Academy",
      subtitle: "Learn ANSI C",
      shortName: "C",
      mark: "C",
      modules: window.CCourseData || [],
      homeId: "c-home",
      startId: "c-structure",
      doneKey: "c_done",
      compilerKey: "c_compiler",
      compiler: "gcc",
      standardLabel: "C standard",
      defaultStd: "c11",
      standards: [
        ["c90", "C90 / ANSI C"],
        ["c99", "C99"],
        ["c11", "C11"],
        ["c17", "C17"],
        ["c23", "C23"],
      ],
      heroTitle: "Learn C",
      heroEyebrow: "K&R roadmap · Live compiler",
      heroLede: "A practical C course inspired by The C Programming Language, 2nd Edition. Work through types, control flow, pointers, arrays, structures, the standard library, and Unix-style I/O with runnable examples.",
      completeToast: "🎉 Course complete — you learned C!",
      features: [
        ["⚡", "Live gcc", "Every C example compiles with gcc inside the sandboxed container."],
        ["🧭", "K&R roadmap", "The course follows the book's arc while using original lesson text and exercises."],
        ["🧪", "Auto-graded C", "Exercises test functions, arrays, pointers, structs, and file-style input."],
        ["📈", "Separate progress", "C and C++ progress are tracked independently."],
      ],
    },
  ];
  var COURSE_MAP = {};
  var LESSON_COURSE = {};
  var MODULES = [];
  var LESSONS = [];      // flat list { ...lesson, module, modIndex }
  var INDEX = {};        // id -> position in LESSONS
  var TIPS = [];         // tooltip HTML store, reset per render
  var course = null;
  var done = new Set();
  var current = null;

  COURSES.forEach(function (c) {
    COURSE_MAP[c.id] = c;
    c.modules.forEach(function (mod) {
      mod.lessons.forEach(function (les) {
        LESSON_COURSE[les.id] = c;
      });
    });
  });
  activateCourse(initialCourseId());

  function initialCourseId() {
    var hash = location.hash.replace("#", "");
    if (hash && LESSON_COURSE[hash]) return LESSON_COURSE[hash].id;
    try {
      var saved = localStorage.getItem("academy_course");
      if (saved && COURSE_MAP[saved]) return saved;
    } catch (e) {}
    return "cpp";
  }

  function activateCourse(id) {
    course = COURSE_MAP[id] || COURSE_MAP.cpp || COURSES[0];
    MODULES = course.modules || [];
    LESSONS = [];
    INDEX = {};
    MODULES.forEach(function (mod, mi) {
      mod.lessons.forEach(function (les) {
        les._mod = mod.title;
        les._mi = mi;
        INDEX[les.id] = LESSONS.length;
        LESSONS.push(les);
      });
    });
    done = loadDone();
    try { localStorage.setItem("academy_course", course.id); } catch (e) {}
  }

  function applyCourseChrome() {
    var select = $("#courseSelect");
    if (select) select.value = course.id;
    var mark = $("#brandMark");
    if (mark) mark.innerHTML = course.mark;
    var title = $("#brandTitle");
    if (title) title.textContent = course.title;
    var subtitle = $("#brandSubtitle");
    if (subtitle) subtitle.textContent = course.subtitle;
    document.title = course.title + " — Interactive Systems Programming";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", course.heroLede);
  }

  function changeCourse(id) {
    if (!COURSE_MAP[id] || id === course.id) return;
    activateCourse(id);
    applyCourseChrome();
    syncSettingsUI();
    buildNav();
    updateProgress();
    go(course.homeId);
  }

  // ---------- Storage helpers ----------
  function loadDone() {
    try { return new Set(JSON.parse(localStorage.getItem(course.doneKey) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveDone() {
    try { localStorage.setItem(course.doneKey, JSON.stringify(Array.from(done))); } catch (e) {}
  }

  // ---------- DOM helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // inline code + bold on already-escaped text
  function fmt(s) {
    return s
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  // strip markup + decode entities for accessible text
  function plain(s) {
    return s.replace(/`/g, "").replace(/\*\*/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
      .replace(/"/g, "&quot;");
  }
  // full inline markup incl. tooltips (accessible: term + definition in aria-label)
  function inline(text) {
    var s = escapeHtml(text);
    s = s.replace(/\[\[([\s\S]+?)\|\|([\s\S]+?)\]\]/g, function (_, term, tip) {
      var id = TIPS.push(fmt(tip)) - 1;
      var aria = plain(term) + " — definition: " + plain(tip);
      return '<span class="tip" tabindex="0" role="button" aria-label="' + aria +
        '" data-tip="' + id + '">' + fmt(term) + "</span>";
    });
    return fmt(s);
  }

  // ============================================================
  //  Theme switcher
  // ============================================================
  function initThemes() {
    var menu = $("#themeMenu");
    var btn = $("#themeBtn");
    var saved = localStorage.getItem("cpp_theme") || "nord";
    applyTheme(saved);

    THEMES.forEach(function (t) {
      var opt = el("button", "theme-option", "");
      opt.setAttribute("role", "menuitem");
      opt.dataset.theme = t.id;
      opt.innerHTML =
        '<span class="swatch" style="background:' + t.sw + '"></span>' +
        "<span>" + t.name + "</span>" +
        '<span class="check">✓</span>';
      opt.addEventListener("click", function () {
        applyTheme(t.id);
        closeMenu();
      });
      menu.appendChild(opt);
    });

    function markActive() {
      var cur = document.documentElement.getAttribute("data-theme");
      menu.querySelectorAll(".theme-option").forEach(function (o) {
        o.classList.toggle("active", o.dataset.theme === cur);
      });
    }
    function openMenu() { menu.classList.add("open"); btn.setAttribute("aria-expanded", "true"); markActive(); }
    function closeMenu() { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== btn) closeMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem("cpp_theme", id); } catch (e) {}
  }

  function initCourseSwitcher() {
    var sel = $("#courseSelect");
    if (!sel) return;
    sel.innerHTML = "";
    COURSES.forEach(function (c) {
      if (!c.modules || !c.modules.length) return;
      var opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.shortName + " course";
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () { changeCourse(sel.value); });
    applyCourseChrome();
  }

  // ============================================================
  //  Sidebar navigation
  // ============================================================
  function buildNav() {
    var nav = $("#lessonNav");
    nav.innerHTML = "";
    MODULES.forEach(function (mod, mi) {
      var group = el("div", "nav-module");
      var head = el("div", "nav-module-head",
        '<span class="mod-num">' + (mi + 1) + '</span><span>' + escapeHtml(mod.title) + "</span>");
      group.appendChild(head);
      mod.lessons.forEach(function (les) {
        var item = el("div", "nav-item");
        item.dataset.id = les.id;
        item.innerHTML = '<span class="dot"></span><span class="nav-label">' +
          escapeHtml(les.nav || les.title) + "</span>";
        item.addEventListener("click", function () { go(les.id); closeSidebar(); });
        group.appendChild(item);
      });
      nav.appendChild(group);
    });
    refreshNavState();
  }

  function refreshNavState() {
    document.querySelectorAll(".nav-item").forEach(function (item) {
      var id = item.dataset.id;
      item.classList.toggle("done", done.has(id));
      item.classList.toggle("active", current === id);
    });
  }

  // ============================================================
  //  Rendering a lesson
  // ============================================================
  function renderLesson(les) {
    TIPS = [];
    var root = $("#lesson");
    root.innerHTML = "";
    root.classList.remove("lesson-enter");
    void root.offsetWidth; // restart animation
    root.classList.add("lesson-enter");

    if (les.eyebrow) root.appendChild(el("span", "eyebrow", escapeHtml(les.eyebrow)));
    if (les.title) root.appendChild(el("h1", null, escapeHtml(les.title)));
    if (les.lede) root.appendChild(el("p", "lede", inline(les.lede)));

    les.blocks.forEach(function (b) {
      var node = renderBlock(b);
      if (node) root.appendChild(node);
    });

    bindTooltips(root);
    setupReveal(root);
    window.scrollTo({ top: 0, behavior: "smooth" });
    root.focus({ preventScroll: true });
  }

  function renderBlock(b) {
    if (b.hero) return renderHero();
    if (b.roadmap) return renderRoadmap();
    if (b.h2) return reveal(el("h2", null, inline(b.h2)));
    if (b.h3) return reveal(el("h3", null, inline(b.h3)));
    if (b.p) return reveal(el("p", null, inline(b.p)));
    if (b.ul) {
      var ul = el("ul");
      b.ul.forEach(function (li) { ul.appendChild(el("li", null, inline(li))); });
      return reveal(ul);
    }
    if (b.ol) {
      var ol = el("ol");
      b.ol.forEach(function (li) { ol.appendChild(el("li", null, inline(li))); });
      return reveal(ol);
    }
    if (b.tip) return reveal(callout("tip", "💡", b.tip));
    if (b.warn) return reveal(callout("warn", "⚠️", b.warn));
    if (b.danger) return reveal(callout("danger", "⛔", b.danger));
    if (b.code) return reveal(window.CppEditor.createStatic(b.code, b.title));
    if (b.run) return reveal(window.CppEditor.createRunnable({ code: b.run, title: b.title, stdin: b.stdin }));
    if (b.quiz) return reveal(renderQuiz(b.quiz));
    if (b.diagram) return reveal(renderDiagram(b.diagram, b.caption));
    if (b.exercise) {
      var ex = {};
      var e = b.exercise;
      ex.title = e.title; ex.code = e.code; ex.tests = e.tests;
      ex.prompt = e.prompt; ex.promptHtml = e.prompt ? inline(e.prompt) : "";
      ex.hint = e.hint; ex.hintHtml = e.hint ? inline(e.hint) : "";
      ex.solution = e.solution;
      return reveal(window.CppEditor.createExercise(ex));
    }
    return null;
  }

  function callout(kind, icon, text) {
    var c = el("div", "callout " + kind);
    c.appendChild(el("span", "ico", icon));
    c.appendChild(el("p", null, inline(text)));
    return c;
  }

  function renderQuiz(q) {
    var box = el("div", "quiz");
    box.appendChild(el("div", "quiz-q", '<span class="qmark">?</span><span>' + inline(q.q) + "</span>"));
    var opts = el("div", "quiz-opts");
    var answered = false;
    q.options.forEach(function (text, i) {
      var opt = el("button", "quiz-opt");
      opt.innerHTML = '<span class="mark">' + String.fromCharCode(65 + i) + "</span><span>" + inline(text) + "</span>";
      opt.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var correct = i === q.answer;
        opts.querySelectorAll(".quiz-opt").forEach(function (o, j) {
          o.classList.add("locked");
          if (j === q.answer) o.classList.add("correct");
        });
        if (!correct) opt.classList.add("wrong");
        fb.className = "quiz-feedback show " + (correct ? "good" : "bad");
        fb.innerHTML = (correct ? "✅ <strong>Correct!</strong> " : "❌ <strong>Not quite.</strong> ") + inline(q.explain);
        if (correct) burst(0.5, 0.5, 28);
      });
      opts.appendChild(opt);
    });
    box.appendChild(opts);
    var fb = el("div", "quiz-feedback");
    fb.setAttribute("role", "status");
    fb.setAttribute("aria-live", "polite");
    box.appendChild(fb);
    return box;
  }

  // ---------- Diagrams (feature #6) ----------
  function renderDiagram(id, caption) {
    var fig = el("figure", "diagram");
    var svg = DIAGRAMS[id] || "";
    fig.innerHTML = '<div class="diagram-stage">' + svg + "</div>";
    if (caption) fig.appendChild(el("figcaption", null, inline(caption)));
    return fig;
  }

  // ---------- Home / hero ----------
  function renderHero() {
    var wrap = el("div", "hero");
    wrap.innerHTML =
      '<span class="eyebrow">' + escapeHtml(course.heroEyebrow) + "</span>" +
      "<h1>" + escapeHtml(course.heroTitle) + "</h1>" +
      '<p class="lede">' + escapeHtml(course.heroLede) + "</p>" +
      '<button class="start-btn" id="startBtn">Start learning →</button>';

    var grid = el("div", "feature-grid");
    course.features.forEach(function (f) {
      grid.appendChild(el("div", "feature",
        '<div class="fico">' + f[0] + "</div><h3>" + escapeHtml(f[1]) + "</h3><p>" + escapeHtml(f[2]) + "</p>"));
    });
    wrap.appendChild(grid);

    setTimeout(function () {
      var sb = $("#startBtn");
      if (sb) sb.addEventListener("click", function () { go(course.startId); });
    }, 0);
    return wrap;
  }

  function renderRoadmap() {
    var wrap = el("div", "roadmap");
    wrap.appendChild(el("h2", null, "Your roadmap"));
    var list = el("div", "road-list");
    MODULES.forEach(function (mod, mi) {
      var realLessons = mod.lessons.filter(function (l) { return l.id !== course.homeId && !l.home; });
      if (!realLessons.length) return;
      var first = realLessons[0];
      var item = el("div", "road-item");
      item.innerHTML = '<span class="rn">' + (mi + 1) + '</span><span class="rt"><strong>' +
        escapeHtml(mod.title) + "</strong><small>" +
        realLessons.map(function (l) { return l.nav || l.title; }).join(" · ") +
        "</small></span>";
      item.addEventListener("click", function () { go(first.id); });
      list.appendChild(item);
    });
    wrap.appendChild(list);
    return wrap;
  }

  // ============================================================
  //  Tooltips
  // ============================================================
  var pop = null, hideTimer = null;
  function bindTooltips(root) {
    pop = $("#tooltipPop");
    root.querySelectorAll(".tip").forEach(function (t) {
      t.addEventListener("mouseenter", function () { showTip(t); });
      t.addEventListener("mouseleave", scheduleHide);
      t.addEventListener("focus", function () { showTip(t); });
      t.addEventListener("blur", hideTip);
    });
  }
  function showTip(t) {
    clearTimeout(hideTimer);
    var id = t.dataset.tip;
    pop.innerHTML = TIPS[id] || "";
    pop.setAttribute("aria-hidden", "false");
    // measure
    pop.style.left = "0px"; pop.style.top = "0px";
    pop.classList.add("show");
    var r = t.getBoundingClientRect();
    var pr = pop.getBoundingClientRect();
    var left = r.left + r.width / 2 - pr.width / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - pr.width - 10));
    var top = r.top - pr.height - 10;
    if (top < 10) top = r.bottom + 10;        // flip below
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }
  function scheduleHide() { hideTimer = setTimeout(hideTip, 120); }
  function hideTip() {
    if (!pop) return;
    pop.classList.remove("show");
    pop.setAttribute("aria-hidden", "true");
  }
  // keep open while hovering the popup
  document.addEventListener("DOMContentLoaded", function () {
    var p = $("#tooltipPop");
    p.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    p.addEventListener("mouseleave", hideTip);
  });

  // ============================================================
  //  Scroll reveal
  // ============================================================
  var io = null;
  var revealRoot = null;
  function reveal(node) { if (node) node.classList.add("reveal"); return node; }
  function revealInView() {
    if (!revealRoot) return;
    revealRoot.querySelectorAll(".reveal:not(.in)").forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight + 40) n.classList.add("in");
    });
  }
  function setupReveal(root) {
    revealRoot = root;
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    root.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });
    requestAnimationFrame(revealInView);
    // Safety nets: requestAnimationFrame is paused while a tab is hidden, so
    // also reveal in-view content on a timer and when the tab becomes visible.
    // This guarantees a lesson is never left stuck at opacity:0.
    setTimeout(revealInView, 400);
    setTimeout(function () {
      // last resort — make absolutely everything visible after a moment
      if (revealRoot) revealRoot.querySelectorAll(".reveal:not(.in)").forEach(function (n) { n.classList.add("in"); });
    }, 2500);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") revealInView();
  });

  // ============================================================
  //  Progress
  // ============================================================
  var CIRC = 2 * Math.PI * 19;
  function updateProgress() {
    // count only real lessons (exclude the welcome page)
    var total = LESSONS.filter(function (l) { return l.id !== course.homeId && !l.home; }).length;
    var completed = 0;
    LESSONS.forEach(function (l) { if (l.id !== course.homeId && !l.home && done.has(l.id)) completed++; });
    var pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    $("#progressPct").textContent = pct + "%";
    $("#ringFill").style.strokeDashoffset = CIRC * (1 - pct / 100);
    if (pct === 100) { burst(0.5, 0.3, 120); toast(course.completeToast); }
  }

  // ============================================================
  //  Pager
  // ============================================================
  function updatePager() {
    var pos = INDEX[current];
    var prev = LESSONS[pos - 1], next = LESSONS[pos + 1];
    var prevBtn = $("#prevBtn"), nextBtn = $("#nextBtn");
    var completeBtn = $("#completeBtn");

    prevBtn.disabled = !prev;
    $("#prevTitle").textContent = prev ? (prev.nav || prev.title) : "—";
    nextBtn.disabled = !next;
    $("#nextTitle").textContent = next ? (next.nav || next.title) : "Finish";

    if (current === course.homeId || (LESSONS[pos] && LESSONS[pos].home)) {
      completeBtn.style.display = "none";
    } else {
      completeBtn.style.display = "";
      var isDone = done.has(current);
      completeBtn.classList.toggle("is-done", isDone);
      completeBtn.textContent = isDone
        ? (next ? "✓ Completed — continue" : "✓ Completed")
        : "Mark complete & continue";
    }
  }

  function markComplete() {
    if (current === course.homeId || (LESSONS[INDEX[current]] && LESSONS[INDEX[current]].home)) return;
    var wasDone = done.has(current);
    done.add(current);
    saveDone();
    refreshNavState();
    updateProgress();
    updatePager();
    if (!wasDone) burst(0.5, 0.4, 40);
    var next = LESSONS[INDEX[current] + 1];
    if (next) go(next.id);
    else toast("That's the whole course — nicely done!");
  }

  // ============================================================
  //  Navigation
  // ============================================================
  function go(id) {
    var targetCourse = LESSON_COURSE[id];
    if (targetCourse && targetCourse.id !== course.id) {
      activateCourse(targetCourse.id);
      applyCourseChrome();
      syncSettingsUI();
      buildNav();
      updateProgress();
    }
    if (!(id in INDEX)) id = course.homeId;
    current = id;
    if (location.hash !== "#" + id) {
      history.pushState(null, "", "#" + id);
    }
    renderLesson(LESSONS[INDEX[id]]);
    refreshNavState();
    updatePager();
  }

  // ============================================================
  //  Search
  // ============================================================
  function initSearch() {
    var input = $("#lessonSearch");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(".nav-module").forEach(function (group) {
        var anyVisible = false;
        group.querySelectorAll(".nav-item").forEach(function (item) {
          var label = item.textContent.toLowerCase();
          var match = !q || label.indexOf(q) !== -1;
          item.classList.toggle("hidden", !match);
          if (match) anyVisible = true;
        });
        var head = group.querySelector(".nav-module-head");
        if (head && head.style.display !== "none") head.style.opacity = anyVisible ? "1" : "0.3";
      });
    });
  }

  // ============================================================
  //  Mobile sidebar
  // ============================================================
  function openSidebar() { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }

  // ============================================================
  //  Toast
  // ============================================================
  var toastTimer = null;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  // ============================================================
  //  Confetti
  // ============================================================
  var cv, ctx, parts = [], raf = null;
  function initConfetti() {
    cv = $("#confetti");
    ctx = cv.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }
  function resizeCanvas() {
    if (!cv) return;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
  }
  function readColors() {
    var s = getComputedStyle(document.documentElement);
    return [s.getPropertyValue("--accent"), s.getPropertyValue("--accent-2"),
            s.getPropertyValue("--accent-3"), s.getPropertyValue("--good")].map(function (c) { return c.trim(); });
  }
  function burst(nx, ny, count) {
    if (!ctx) return;
    var colors = readColors();
    var ox = nx * cv.width, oy = ny * cv.height;
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 4 + Math.random() * 8;
      parts.push({
        x: ox, y: oy,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 4,
        g: 0.18 + Math.random() * 0.1,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        life: 1, color: colors[i % colors.length],
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.012;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, cv.width, cv.height); }
  }

  // ============================================================
  //  Reading text size
  // ============================================================
  var FS_MIN = 0.8, FS_MAX = 1.7, FS_STEP = 0.1;
  var curFs = 1;
  function applyFs(s, announce) {
    curFs = Math.round(Math.min(FS_MAX, Math.max(FS_MIN, s)) * 100) / 100;
    document.documentElement.style.setProperty("--reader-scale", curFs);
    try { localStorage.setItem("cpp_fs", curFs); } catch (e) {}
    var down = $("#fsDown"), up = $("#fsUp");
    if (down) down.disabled = curFs <= FS_MIN + 0.001;
    if (up) up.disabled = curFs >= FS_MAX - 0.001;
    if (announce) toast("Text size " + Math.round(curFs * 100) + "%");
  }
  function initFontSize() {
    var saved = parseFloat(localStorage.getItem("cpp_fs"));
    applyFs(isNaN(saved) ? 1 : saved, false);
    $("#fsDown").addEventListener("click", function () { applyFs(curFs - FS_STEP, true); });
    $("#fsUp").addEventListener("click", function () { applyFs(curFs + FS_STEP, true); });
  }

  // ============================================================
  //  Compiler settings (features #7) + celebrate hook (#2)
  // ============================================================
  var settingsByCourse = {};
  window.CppSettings = { get: getRuntimeSettings };
  window.CppCelebrate = function () { burst(0.5, 0.4, 90); toast("✓ All tests passed — great work!"); };

  function defaultSettings(c) {
    return { std: c.defaultStd, sanitize: false };
  }

  function getCourseSettings(c) {
    c = c || course;
    if (!settingsByCourse[c.id]) {
      var st = defaultSettings(c);
      try {
        var saved = JSON.parse(localStorage.getItem(c.compilerKey) || "{}");
        if (saved.std) st.std = saved.std;
        if (typeof saved.sanitize === "boolean") st.sanitize = saved.sanitize;
      } catch (e) {}
      settingsByCourse[c.id] = st;
    }
    return settingsByCourse[c.id];
  }

  function getRuntimeSettings() {
    var st = getCourseSettings(course);
    return {
      language: course.language,
      std: st.std,
      sanitize: !!st.sanitize,
      compiler: course.compiler,
      languageName: course.shortName,
    };
  }

  function saveCourseSettings() {
    try { localStorage.setItem(course.compilerKey, JSON.stringify(getCourseSettings(course))); } catch (e) {}
  }

  function syncSettingsUI() {
    var sel = $("#stdSelect"), san = $("#sanitizeToggle"), label = $("#stdLabel");
    if (!sel || !san) return;
    var st = getCourseSettings(course);
    sel.innerHTML = "";
    course.standards.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s[0];
      opt.textContent = s[1];
      sel.appendChild(opt);
    });
    if (label) label.textContent = course.standardLabel;
    sel.value = st.std;
    if (sel.value !== st.std) {
      st.std = course.defaultStd;
      sel.value = st.std;
      saveCourseSettings();
    }
    san.checked = !!st.sanitize;
  }

  function initSettings() {
    var sel = $("#stdSelect"), san = $("#sanitizeToggle");
    syncSettingsUI();
    sel.addEventListener("change", function () {
      getCourseSettings(course).std = sel.value;
      saveCourseSettings();
      toast("Standard: " + sel.options[sel.selectedIndex].text);
    });
    san.addEventListener("change", function () {
      getCourseSettings(course).sanitize = san.checked;
      saveCourseSettings();
      toast(san.checked ? "Runtime sanitizers on" : "Runtime sanitizers off");
    });

    var btn = $("#settingsBtn"), menu = $("#settingsMenu");
    function open() { menu.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    function close() { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.contains("open") ? close() : open(); });
    document.addEventListener("click", function (e) { if (!menu.contains(e.target) && e.target !== btn) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // ============================================================
  //  Shortcuts modal + keyboard navigation (feature #5)
  // ============================================================
  function openShortcuts() {
    var m = $("#shortcutsModal");
    m.classList.add("show"); m.setAttribute("aria-hidden", "false");
    var c = $("#shortcutsClose"); if (c) c.focus();
  }
  function closeShortcuts() {
    var m = $("#shortcutsModal");
    m.classList.remove("show"); m.setAttribute("aria-hidden", "true");
  }
  function initShortcuts() {
    $("#helpFab").addEventListener("click", openShortcuts);
    $("#shortcutsClose").addEventListener("click", closeShortcuts);
    $("#shortcutsModal").addEventListener("click", function (e) {
      if (e.target === $("#shortcutsModal")) closeShortcuts();
    });
  }
  function isTyping(e) {
    var t = e.target, tag = t && t.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable);
  }
  function initKeyboard() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeShortcuts(); closeSidebar(); return; }
      if (e.key === "?") { if (isTyping(e)) return; e.preventDefault(); openShortcuts(); return; }
      if (e.key === "/" && !isTyping(e)) { e.preventDefault(); openSidebar(); var s = $("#lessonSearch"); if (s) s.focus(); return; }
      if (isTyping(e)) return;
      if (e.key === "Enter" && e.shiftKey) { e.preventDefault(); markComplete(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key === "ArrowRight") { var n = LESSONS[INDEX[current] + 1]; if (n) { e.preventDefault(); go(n.id); } }
      else if (e.key === "ArrowLeft") { var p = LESSONS[INDEX[current] - 1]; if (p) { e.preventDefault(); go(p.id); } }
      else if (e.key === "+" || e.key === "=") { applyFs(curFs + FS_STEP, true); }
      else if (e.key === "-" || e.key === "_") { applyFs(curFs - FS_STEP, true); }
    });
  }
  function initSkipLink() {
    $("#skipLink").addEventListener("click", function () {
      var l = $("#lesson"); if (l) { l.focus({ preventScroll: false }); l.scrollIntoView(); }
    });
  }

  // ============================================================
  //  Boot
  // ============================================================
  function boot() {
    initThemes();
    initCourseSwitcher();
    initFontSize();
    initSettings();
    initShortcuts();
    initKeyboard();
    initSkipLink();
    initConfetti();
    buildNav();
    initSearch();
    updateProgress();

    $("#prevBtn").addEventListener("click", function () { var p = LESSONS[INDEX[current] - 1]; if (p) go(p.id); });
    $("#nextBtn").addEventListener("click", function () { var n = LESSONS[INDEX[current] + 1]; if (n) go(n.id); });
    $("#completeBtn").addEventListener("click", markComplete);
    $("#menuToggle").addEventListener("click", openSidebar);
    $("#scrim").addEventListener("click", closeSidebar);
    $("#resetProgress").addEventListener("click", function () {
      if (confirm("Reset all course progress?")) {
        done = new Set(); saveDone(); refreshNavState(); updateProgress(); updatePager();
        toast("Progress reset");
      }
    });

    window.addEventListener("popstate", function () {
      var id = location.hash.replace("#", "") || course.homeId;
      go(id);
    });
    window.addEventListener("scroll", hideTip, { passive: true });

    var start = location.hash.replace("#", "");
    go(start || course.homeId);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
