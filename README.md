# Gaeil

**Teanga Ríomhchlárúcháin as Gaeilge**  
An Irish-language programming language.

Gaeil lets you write programs using Irish keywords. It is a simple, educational language designed so that Irish speakers (and learners) can code in their own language.

## Keywords

| English   | Gaeil      |
|-----------|------------|
| print     | `scríobh`  |
| if        | `má`       |
| else      | `eile`     |
| while     | `fad`      |
| for       | `do`       |
| def       | `feidhm`   |
| return    | `fill`     |
| True      | `fíor`     |
| False     | `bréag`    |
| and       | `agus`     |
| or        | `nó`       |
| not       | `ní`       |
| input     | `léigh`    |
| None      | `neamhní`  |

## Quick Start

```bash
python gaeil.py
```

Or run a file:

```bash
python gaeil.py examples/hello.gaeil
```

## Example

```gaeil
scríobh("Dia duit, a dhomhan!")

feidhm factorial(n):
    má n <= 1:
        fill 1
    eile:
        fill n * factorial(n - 1)

scríobh(factorial(5))
```

## How it works

`gaeil.py` is a lightweight translator that converts Gaeil keywords into Python and executes the result. It is intentionally simple so it can run anywhere Python is available (including phones via Termux).

## GitHub Pages

A simple demo site is available at:  
https://fitzyracing1.github.io/gaeil/

## License

MIT

---

Created with Grok · fitzyracing1

## Documentation

- In-repo docs: [docs/](docs/index.md)
- Wiki: [https://github.com/fitzyracing1/Gaeil/wiki](https://github.com/fitzyracing1/Gaeil/wiki)

## Plans

This project is free, and its license stays as is. Support it through [GitHub Sponsors](https://github.com/sponsors/fitzyracing1):

- **Free**: use the code, community support.
- **Pro ($49/month)**: priority issues and support.
- **Team ($199/month)**: priority support for your team plus early access.
