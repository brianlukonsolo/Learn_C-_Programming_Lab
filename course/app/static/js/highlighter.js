/* Lightweight, dependency-free C/C++ syntax highlighter.
   Tokenises a source string and returns safe HTML with classed spans. */
(function () {
  "use strict";

  var KEYWORDS = new Set([
    "alignas","alignof","and","and_eq","asm","auto","bitand","bitor","break",
    "case","catch","class","compl","concept","const","consteval","constexpr",
    "constinit","const_cast","continue","co_await","co_return","co_yield",
    "decltype","default","delete","do","dynamic_cast","else","enum","explicit",
    "export","extern","for","friend","goto","if","inline","mutable","namespace",
    "new","noexcept","not","not_eq","operator","or","or_eq","private","protected",
    "public","register","reinterpret_cast","requires","return","sizeof","static",
    "static_assert","static_cast","struct","switch","template","this","thread_local",
    "throw","try","typedef","typeid","typename","union","using","virtual","volatile",
    "while","xor","xor_eq","final","override",
    "_Alignas","_Alignof","_Atomic","_Bool","_Complex","_Generic","_Imaginary",
    "_Noreturn","_Static_assert","_Thread_local","restrict"
  ]);

  var TYPES = new Set([
    "int","char","bool","float","double","void","short","long","signed","unsigned",
    "wchar_t","char8_t","char16_t","char32_t","size_t","string","wstring","nullptr_t",
    "vector","map","unordered_map","set","unordered_set","pair","array","list","deque",
    "stack","queue","tuple","ostream","istream","ofstream","ifstream","fstream",
    "stringstream","exception","runtime_error","initializer_list","optional","variant",
    "FILE","fpos_t","ptrdiff_t","va_list"
  ]);

  var LITERALS = new Set(["true","false","nullptr","NULL","cout","cin","cerr","endl","std"]);

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function span(cls, text) { return '<span class="' + cls + '">' + esc(text) + "</span>"; }

  function highlight(src) {
    var out = "";
    var i = 0;
    var n = src.length;
    while (i < n) {
      var c = src[i];

      // Preprocessor directive (whole line)
      if (c === "#" && (i === 0 || src[i - 1] === "\n")) {
        var pe = src.indexOf("\n", i);
        if (pe === -1) pe = n;
        // keep includes' <...> intact but still escaped
        out += span("t-pre", src.slice(i, pe));
        i = pe;
        continue;
      }
      // Line comment
      if (c === "/" && src[i + 1] === "/") {
        var le = src.indexOf("\n", i);
        if (le === -1) le = n;
        out += span("t-com", src.slice(i, le));
        i = le;
        continue;
      }
      // Block comment
      if (c === "/" && src[i + 1] === "*") {
        var be = src.indexOf("*/", i + 2);
        be = be === -1 ? n : be + 2;
        out += span("t-com", src.slice(i, be));
        i = be;
        continue;
      }
      // String / char literal
      if (c === '"' || c === "'") {
        var q = c, j = i + 1;
        while (j < n && src[j] !== q) {
          if (src[j] === "\\") j++;
          j++;
        }
        j = Math.min(j + 1, n);
        out += span("t-str", src.slice(i, j));
        i = j;
        continue;
      }
      // Number
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var k = i;
        while (k < n && /[0-9a-fA-FxXbBoO.eE+\-']/.test(src[k])) {
          // stop a trailing sign unless exponent
          if ((src[k] === "+" || src[k] === "-") && !/[eE]/.test(src[k - 1])) break;
          k++;
        }
        out += span("t-num", src.slice(i, k));
        i = k;
        continue;
      }
      // Identifier / keyword
      if (/[A-Za-z_]/.test(c)) {
        var s = i;
        while (i < n && /[A-Za-z0-9_]/.test(src[i])) i++;
        var word = src.slice(s, i);
        // function call if followed by (
        var rest = src.slice(i);
        var isCall = /^\s*\(/.test(rest);
        if (KEYWORDS.has(word)) out += span("t-key", word);
        else if (TYPES.has(word)) out += span("t-type", word);
        else if (LITERALS.has(word)) out += span("t-type", word);
        else if (isCall) out += span("t-fn", word);
        else out += esc(word);
        continue;
      }
      // Punctuation / operators
      if (/[{}()\[\];,.<>:+\-*/%=&|!?~^]/.test(c)) {
        out += span("t-punct", c);
        i++;
        continue;
      }
      // Whitespace / other
      out += esc(c);
      i++;
    }
    return out;
  }

  window.CppHL = { highlight: highlight, esc: esc };
})();
