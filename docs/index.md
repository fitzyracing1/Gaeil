# Gaeil

Gaeil is a small educational programming language with Irish-language keywords. `gaeil.py` translates the Gaeil keywords into Python and runs the result with `exec`. See the README for the full keyword table, for example `scríobh` = print, `má` = if, `eile` = else, `fad` = while, `feidhm` = def, `fill` = return.

## Getting started

```bash
python gaeil.py                          # runs a built-in demo
python gaeil.py examples/hello.gaeil     # run a file (also: factorial.gaeil, fizzbuzz.gaeil)
```

## How it works

| File | Role |
|---|---|
| `gaeil.py` | keyword translation to Python, then `exec`. `main()` runs a file or the demo |
| `examples/` | sample programs |
| `docs/index.html` | demo site |

Because programs run as Python through `exec`, only run Gaeil files you trust. The repo has no tests and no CI.

MIT License. Copyright (c) 2026 Joshua Almeida
