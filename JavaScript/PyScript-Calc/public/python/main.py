"""
Main Python entry point for the calculator.

Loads the evaluation engine and exposes it to the browser via Pyodide's
js module.  All real work lives in engine.py / parser.py / arithmetic.py etc.
"""

from __future__ import annotations

from engine import evaluate, run_terminal_command, call_function, SAFE_NAMESPACE

# Re-export for convenience / tests
__all__ = [
    "evaluate",
    "run_terminal_command",
    "call_function",
    "SAFE_NAMESPACE",
]


# ---------------------------------------------------------------------------
# Expose to JavaScript / TypeScript via Pyodide's js module
# ---------------------------------------------------------------------------
try:
    import js  # type: ignore

    def _py_evaluate(expression: str):
        """Wrapper that returns a plain JS-compatible object."""
        result = evaluate(str(expression))
        obj = js.Object.new()
        obj.ok = result["ok"]
        obj.result = result["result"]
        obj.error = result["error"]
        return obj

    js.window.pyEvaluate = _py_evaluate
    js.window.pyReady = True
except ImportError:
    # Running outside the browser (e.g. unit tests)
    pass
