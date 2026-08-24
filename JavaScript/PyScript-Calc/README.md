# PyScript + TypeScript Calculator

A browser-first calculator that keeps **all math in pure Python** (via PyScript/Pyodide) while the UI is written in **TypeScript + Vite**.

## Features

- Clean mobile-friendly calculator UI
- Python arithmetic engine (`add`, `subtract`, `multiply`, `divide`, `sqrt`, `cbrt`, `pow`, `mod`, `factorial`)
- High-precision constants up to **800 decimal digits** (`pi_digits`, `e_digits`) with caching
- Safe expression evaluator (no unrestricted `eval`)
- Python Terminal mode that uses the **same** Python backend
- Fully client-side – no backend server

## Project structure

```
/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   ├── style.css
│   └── ui/
│       ├── calculator.ts
│       ├── display.ts
│       └── keyboard.ts
└── public/
    └── python/
        ├── main.py          # JS bridge entry
        ├── engine.py        # evaluate / namespace
        ├── parser.py        # safe AST parse + walk
        ├── arithmetic.py
        ├── constants.py
        ├── functions.py
        ├── utils.py
        └── test_arithmetic.py
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

The `dist/` folder is ready for static hosting (Vercel, Netlify, GitHub Pages, etc.).

## Python tests

```bash
cd public/python
python test_arithmetic.py
```

## Architecture notes

- **TypeScript** owns the UI, buttons, keyboard, display, and terminal chrome.
- **Python** owns every calculation and the safe expression evaluator.
- Communication is centralized through `window.pyEvaluate(expression)` exposed by `main.py`.
- Both the keypad calculator and the Terminal call the same Python functions.
