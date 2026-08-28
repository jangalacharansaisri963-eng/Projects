# PyCalc – Scientific Calculator (PyScript + TypeScript)

A browser-first **scientific calculator** that keeps **all math in pure Python** (via PyScript/Pyodide) while the UI is written in **TypeScript + Vite**.

## Features

- **Scientific keypad** with Basic / Scientific / Constants modes
- **Postfix factorial** – `5!`, `(5+1)!` (parser rewrites to `factorial(...)`)
- **360+ pure-Python functions** in the Terminal (trig, hyperbolic, logs, combinatorics, stats, number theory, finance helpers, …)
- **Unit Converter sheet** (~450 units) – UI only; conversion logic is pure Python `convert(value, from, to)`
- High-precision constants (`pi_digits`, `e_digits`) with caching
- Safe expression evaluator (no unrestricted `eval`)
- Fully client-side – no backend server

## Terminal examples

```
5!
(5+1)!
2**10 + factorial(5)
log(100)          # natural log
log(100, 10)      # log base 10
logb(10, 100)     # same, base-first order
sin(pi/2)
sind(30)
sinh(1)
convert(1, 'm', 'ft')
convert(100, 'C', 'F')
nCr(10, 3)
fib(20)
gcd(24, 36, 60)
help()
functions()
units('length')
```

## Project structure

```
/
├── index.html
├── package.json
├── src/
│   ├── main.ts
│   ├── style.css
│   └── ui/
│       ├── calculator.ts   # scientific keypad
│       ├── display.ts
│       └── keyboard.ts
└── public/python/
    ├── main.py
    ├── engine.py           # SAFE_NAMESPACE (~370 callables)
    ├── parser.py           # factorial ! rewrite + safe AST
    ├── puremath.py         # zero-dependency math primitives
    ├── scientific.py       # facade + function table
    ├── units.py            # unit conversion engine
    ├── arithmetic.py
    ├── integers.py
    ├── constants.py
    └── …
```

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
```

The `dist/` folder is ready for static hosting.

## Architecture

- **TypeScript** owns the UI (tabs, scientific keypad, unit converter chrome, terminal).
- **Python** owns every calculation, unit conversion, and the safe expression evaluator.
- Communication is centralized through `window.pyEvaluate(expression)`.
- Both the keypad, Terminal, and Unit Converter call the same pure-Python backend.
