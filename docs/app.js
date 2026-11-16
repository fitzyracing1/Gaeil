/* Gaeil site — static, no trackers. Keyword map copied from gaeil.py. */
(() => {
  "use strict";

  const KEYWORDS = [
    ["scríobh", "print"],
    ["má", "if"],
    ["eile", "else"],
    ["fad", "while"],
    ["do", "for"],
    ["feidhm", "def"],
    ["fill", "return"],
    ["fíor", "True"],
    ["bréag", "False"],
    ["agus", "and"],
    ["nó", "or"],
    ["ní", "not"],
    ["léigh", "input"],
    ["neamhní", "None"],
  ];

  const PYODIDE_VERSION = "0.29.2";
  const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
  const REPO_API = "https://api.github.com/repos/fitzyracing1/Gaeil";

  const EXAMPLES = {
    hello: `# Hello World as Gaeilge
scríobh("Dia duit, a dhomhan!")
scríobh("Fáilte go Gaeil — teanga ríomhchlárúcháin as Gaeilge.")
`,
    factorial: `feidhm factorial(n):
    má n <= 1:
        fill 1
    eile:
        fill n * factorial(n - 1)

uimhir = 5
scríobh("Toradh factorial(5):")
scríobh(factorial(uimhir))
`,
    fizzbuzz: `i = 1
fad i <= 20:
    má i % 3 == 0 agus i % 5 == 0:
        scríobh("FizzBuzz")
    eile má i % 3 == 0:
        scríobh("Fizz")
    eile má i % 5 == 0:
        scríobh("Buzz")
    eile:
        scríobh(i)
    i = i + 1
`,
  };

  const FILES = {
    hello: "hello.gaeil",
    factorial: "factorial.gaeil",
    fizzbuzz: "fizzbuzz.gaeil",
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeRe(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Faithful port of gaeil.py: re.sub(r'\bkeyword\b', replacement, flags=re.UNICODE)
  function translate(source) {
    let code = source;
    for (const [from, to] of KEYWORDS) {
      const re = new RegExp(
        `(?<![\\p{L}\\p{N}_])${escapeRe(from)}(?![\\p{L}\\p{N}_])`,
        "gu"
      );
      code = code.replace(re, to);
    }
    return code;
  }

  function highlight(source, lang) {
    const keywordList =
      lang === "gaeil" ? KEYWORDS.map(([ga]) => ga) : KEYWORDS.map(([, py]) => py);
    const keywordSet = new Set(keywordList);
    const kwRe = new RegExp(
      `(?<![\\p{L}\\p{N}_])(?:${keywordList.map(escapeRe).join("|")})(?![\\p{L}\\p{N}_])`,
      "gu"
    );
    const identRe = /[\p{L}_][\p{L}\p{N}_]*/gu;
    const tokenRe = new RegExp(
      `(#.*)|("[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|'[^'\\\\]*(?:\\\\.[^'\\\\]*)*')|(${kwRe.source})|(\\b\\d+(?:\\.\\d+)?)|(${identRe.source})`,
      "gu"
    );
    let html = "";
    let last = 0;
    const text = source.endsWith("\n") ? source : source;
    text.replace(tokenRe, (match, cmt, str, kw, num, ident, offset) => {
      html += escapeHtml(text.slice(last, offset));
      if (cmt) html += `<span class="tok-cmt">${escapeHtml(cmt)}</span>`;
      else if (str) html += `<span class="tok-str">${escapeHtml(str)}</span>`;
      else if (kw) html += `<span class="tok-kw">${escapeHtml(kw)}</span>`;
      else if (num) html += `<span class="tok-num">${escapeHtml(num)}</span>`;
      else if (ident) {
        const next = text.slice(offset + ident.length).match(/^\s*\(/);
        const isFn =
          next && !keywordSet.has(ident) && ident !== "True" && ident !== "False" && ident !== "None";
        html += isFn
          ? `<span class="tok-fn">${escapeHtml(ident)}</span>`
          : escapeHtml(ident);
      }
      last = offset + match.length;
      return match;
    });
    html += escapeHtml(text.slice(last));
    return html;
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function applyTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("gaeil-theme", next);
    } catch (_) {
      /* ignore unavailable storage */
    }
    const toggle = $("#theme-toggle");
    if (toggle) {
      const toLight = next === "dark";
      toggle.setAttribute("aria-pressed", String(next === "light"));
      toggle.setAttribute("aria-label", toLight ? "Switch to light mode" : "Switch to dark mode");
      toggle.title = toLight ? "Switch to light mode" : "Switch to dark mode";
    }
  }
  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("gaeil-theme");
    } catch (_) {
      saved = null;
    }
    applyTheme(saved === "light" || saved === "dark" ? saved : "dark");
    $("#theme-toggle")?.addEventListener("click", () => {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  function initNav() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    if (!header || !toggle || !nav) return;
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    const close = () => setOpen(false);
    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("is-open"));
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  function initCopy() {
    $$("[data-copy]").forEach((btn) => {
      const original = btn.textContent;
      btn.addEventListener("click", async () => {
        const text = btn.getAttribute("data-copy") || "";
        const ok = await copyText(text);
        btn.dataset.copied = ok ? "true" : "false";
        btn.textContent = ok ? "Copied" : "Copy failed";
        window.setTimeout(() => {
          btn.dataset.copied = "false";
          btn.textContent = original;
        }, 1600);
      });
    });
  }

  function formatStars(count) {
    if (typeof count !== "number" || !Number.isFinite(count)) return "";
    if (count < 1000) return String(count);
    if (count < 10000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return `${Math.round(count / 1000)}k`;
  }

  async function loadRepoMeta() {
    const starEl = $("#star-count");
    const versionEl = $("#version-label");
    const versionNote = $("#version-note");
    try {
      const repoRes = await fetch(REPO_API);
      if (repoRes.ok) {
        const repo = await repoRes.json();
        const label = formatStars(repo.stargazers_count);
        if (starEl && label) {
          starEl.textContent = label;
          starEl.hidden = false;
        }
      } else if (starEl) {
        starEl.hidden = true;
      }
    } catch (_) {
      if (starEl) starEl.hidden = true;
    }

    let numbered = null;
    try {
      const relRes = await fetch(`${REPO_API}/releases?per_page=20`);
      if (relRes.ok) {
        const releases = await relRes.json();
        numbered = (releases || []).find(
          (item) => item && !item.draft && /^v?\d+\.\d+/.test(item.tag_name || "")
        );
      }
    } catch (_) {
      numbered = null;
    }
    if (!numbered) {
      try {
        const tagRes = await fetch(`${REPO_API}/tags?per_page=20`);
        if (tagRes.ok) {
          const tags = await tagRes.json();
          numbered = (tags || []).find((item) => /^v?\d+\.\d+/.test(item.name || ""));
          if (numbered) numbered = { tag_name: numbered.name };
        }
      } catch (_) {
        numbered = null;
      }
    }
    if (versionEl) {
      if (numbered && numbered.tag_name) {
        versionEl.textContent = numbered.tag_name;
        if (versionNote) versionNote.textContent = "Latest numbered tag";
      } else {
        versionEl.textContent = "v0.1";
        if (versionNote) versionNote.textContent = "No numbered release yet";
      }
    }
  }

  async function loadExample(name) {
    const file = FILES[name];
    if (!file) return EXAMPLES.hello;
    const urls = [`examples/${file}`, `../examples/${file}`];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.text();
      } catch (_) {
        /* try the next location or the inlined copy */
      }
    }
    return EXAMPLES[name] || EXAMPLES.hello;
  }

  function setHighlighted(pre, source, lang) {
    if (!pre) return;
    pre.innerHTML = highlight(source, lang);
  }

  function initComparison() {
    const gaeilPre = $("#compare-gaeil");
    const pythonPre = $("#compare-python");
    const gaeilName = $("#compare-gaeil-name");
    const pythonName = $("#compare-python-name");
    const tabs = $$(".js-example-tab");
    if (!gaeilPre || !pythonPre || !tabs.length) return;

    const set = async (name) => {
      const source = await loadExample(name);
      const py = translate(source);
      setHighlighted(gaeilPre, source, "gaeil");
      setHighlighted(pythonPre, py, "python");
      if (gaeilName) gaeilName.textContent = FILES[name] || `${name}.gaeil`;
      if (pythonName) pythonName.textContent = (FILES[name] || `${name}.gaeil`).replace(/\.gaeil$/, ".py");
      tabs.forEach((tab) => {
        const on = tab.dataset.example === name;
        tab.setAttribute("aria-selected", String(on));
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => set(tab.dataset.example));
    });
    set("factorial");
  }

  let pyodideLoader = null;
  let pyodideRuntime = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(s);
    });
  }

  function loadPyodideRuntime() {
    if (pyodideRuntime) return Promise.resolve(pyodideRuntime);
    if (pyodideLoader) return pyodideLoader;
    pyodideLoader = (async () => {
      if (typeof window.loadPyodide !== "function") {
        await loadScript(`${PYODIDE_INDEX}pyodide.js`);
      }
      pyodideRuntime = await window.loadPyodide({ indexURL: PYODIDE_INDEX });
      await pyodideRuntime.runPythonAsync(`
def __gaeil_run(src):
    import sys, io, traceback
    buf_out, buf_err = io.StringIO(), io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = buf_out, buf_err
    ns = {"__name__": "__main__"}
    try:
        exec(compile(src, "<gaeil>", "exec"), ns)
        return ("ok", buf_out.getvalue(), buf_err.getvalue())
    except Exception:
        return ("err", buf_out.getvalue(), traceback.format_exc())
    finally:
        sys.stdout, sys.stderr = old_out, old_err
`);
      return pyodideRuntime;
    })();
    return pyodideLoader;
  }

  function initPlayground() {
    const sourceEl = $("#playground-source");
    const pythonEl = $("#playground-python");
    const outputEl = $("#playground-output");
    const statusEl = $("#playground-status");
    const selectEl = $("#playground-example");
    const runBtn = $("#playground-run");
    const resetBtn = $("#playground-reset");
    if (!sourceEl || !pythonEl || !outputEl || !runBtn) return;

    let activeExample = "hello";
    let loadedSource = EXAMPLES.hello;

    const setStatus = (state, message) => {
      if (!statusEl) return;
      statusEl.dataset.state = state;
      statusEl.textContent = message;
    };

    const syncPython = () => {
      const py = translate(sourceEl.value);
      pythonEl.innerHTML = highlight(py, "python");
    };

    const showOutput = (text, kind) => {
      outputEl.classList.remove("is-error", "is-empty");
      if (!text) {
        outputEl.classList.add("is-empty");
        outputEl.textContent = "No output.";
        return;
      }
      if (kind === "error") outputEl.classList.add("is-error");
      outputEl.textContent = text;
    };

    const fillExample = async (name) => {
      activeExample = name;
      loadedSource = await loadExample(name);
      sourceEl.value = loadedSource;
      syncPython();
      outputEl.classList.add("is-empty");
      outputEl.classList.remove("is-error");
      outputEl.textContent = "Click Run to translate this Gaeil and execute it in the browser.";
      setStatus("idle", "Python in the browser is loaded on the first Run. Nothing is sent to a server.");
    };

    sourceEl.addEventListener("input", syncPython);
    selectEl?.addEventListener("change", () => fillExample(selectEl.value));
    resetBtn?.addEventListener("click", () => fillExample(activeExample));

    runBtn.addEventListener("click", async () => {
      syncPython();
      const py = translate(sourceEl.value);
      runBtn.disabled = true;
      showOutput("Loading Python…", "empty");
      setStatus("loading", `Downloading the Pyodide ${PYODIDE_VERSION} runtime from a CDN. This happens once.`);
      try {
        const pyodide = await loadPyodideRuntime();
        setStatus("running", "Running in the browser…");
        const runner = pyodide.globals.get("__gaeil_run");
        const result = runner(py);
        const state = result.get(0);
        const out = result.get(1) || "";
        const err = result.get(2) || "";
        result.destroy?.();
        runner.destroy?.();
        if (state === "ok") {
          const text = err ? `${out}${out && !out.endsWith("\n") ? "\n" : ""}${err}` : out;
          showOutput(text, "ok");
          setStatus("ok", "Finished.");
        } else {
          const text = `${out}${out ? "\n" : ""}${err}`;
          showOutput(text, "error");
          setStatus("error", "The program raised an error.");
        }
      } catch (err) {
        showOutput(String(err && err.message ? err.message : err), "error");
        setStatus("error", "The playground could not load or run Python.");
        pyodideLoader = null;
        pyodideRuntime = null;
      } finally {
        runBtn.disabled = false;
      }
    });

    fillExample(selectEl ? selectEl.value : "hello");
  }

  function initHeroHighlight() {
    const pre = $("#hero-code");
    if (pre) setHighlighted(pre, EXAMPLES.hello, "gaeil");
  }

  initTheme();
  initNav();
  initCopy();
  initHeroHighlight();
  initComparison();
  initPlayground();
  loadRepoMeta();
})();
