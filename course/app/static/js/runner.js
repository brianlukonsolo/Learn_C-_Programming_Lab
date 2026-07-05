/* Talks to the backend. Compiler options (C++ standard + sanitizer) come from
   window.CppSettings, set by app.js and persisted in localStorage. */
(function () {
  "use strict";

  function opts() {
    var s = window.CppSettings && window.CppSettings.get ? window.CppSettings.get() : {};
    return { language: s.language || "cpp", std: s.std || "c++17", sanitize: !!s.sanitize };
  }

  async function post(url, body) {
    var resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      var msg = "Server error (" + resp.status + ")";
      try { var j = await resp.json(); if (j.error) msg = j.error; } catch (e) {}
      throw new Error(msg);
    }
    return resp.json();
  }

  function run(code, stdin) {
    var o = opts();
    return post("api/run", { code: code, stdin: stdin || "", language: o.language, std: o.std, sanitize: o.sanitize });
  }

  function grade(code, tests) {
    var o = opts();
    return post("api/grade", { code: code, tests: tests, language: o.language, std: o.std, sanitize: o.sanitize });
  }

  window.CppRunner = { run: run, grade: grade };
})();
