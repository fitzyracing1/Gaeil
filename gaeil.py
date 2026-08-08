#!/usr/bin/env python3
"""
Gaeil — Teanga Ríomhchlárúcháin as Gaeilge
Simple Irish-keyword to Python translator + runner.
"""

import re
import sys

KEYWORDS = {
    r'\bscríobh\b': 'print',
    r'\bmá\b': 'if',
    r'\beile\b': 'else',
    r'\bfad\b': 'while',
    r'\bdo\b': 'for',
    r'\bfeidhm\b': 'def',
    r'\bfill\b': 'return',
    r'\bfíor\b': 'True',
    r'\bbréag\b': 'False',
    r'\bagus\b': 'and',
    r'\bnó\b': 'or',
    r'\bní\b': 'not',
    r'\bléigh\b': 'input',
    r'\bneamhní\b': 'None',
}

def translate(source: str) -> str:
    code = source
    for pattern, replacement in KEYWORDS.items():
        code = re.sub(pattern, replacement, code, flags=re.UNICODE)
    return code

def run_gaeil(source: str, show_translation: bool = True):
    py_code = translate(source)
    if show_translation:
        print("--- Gaeil → Python ---")
        print(py_code)
        print("--- Output ---")
    exec(compile(py_code, "<gaeil>", "exec"), {"__name__": "__main__"})

def main():
    if len(sys.argv) > 1:
        path = sys.argv[1]
        with open(path, encoding="utf-8") as f:
            source = f.read()
        run_gaeil(source)
    else:
        # Interactive demo
        demo = '''
scríobh("Dia duit ó Gaeil!")
x = 7
má x > 5:
    scríobh("Tá x níos mó ná 5")
eile:
    scríobh("Tá x beag")
'''
        run_gaeil(demo)

if __name__ == "__main__":
    main()
