"""
Calculator evaluation engine.

Owns the controlled namespace and the public evaluate / call_function APIs.
Parsing is delegated to parser.py.  All heavy math lives in puremath /
scientific / units (pure Python, no math/cmath).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from arithmetic import (
    add as arith_add,
    subtract as arith_subtract,
    multiply as arith_multiply,
    divide as arith_divide,
    sqrt as arith_sqrt,
    cbrt as arith_cbrt,
    pow as arith_pow,
    mod as arith_mod,
    factorial as arith_factorial,
)
from constants import pi_digits, e_digits, list_constants
from utilities import sqrtrem, cbrtrem, divrem
from functions import abs_val, negate, list_functions as list_basic_functions
from parser import ParseError, parse_expression, eval_node
from utils import safe_str, format_error
from integers import (
    gcd as int_gcd,
    lcm as int_lcm,
    gcd_fraction,
    lcm_fraction,
    least_number_to_add,
    least_number_to_subtract,
    greatest_n_digit_number,
    least_n_digit_number,
    greatest_number_dividing_leaving_same_remainder,
    least_number_leaving_same_remainder,
    least_number_leaving_respective_differences,
)

# Pure-Python scientific layer
from scientific import (
    PI, E, TAU, PHI,
    FUNCTION_TABLE,
    list_scientific,
    FUNCTION_CATALOG,
)
from units import convert, list_units, list_categories, unit_info, count_units, units


def _help() -> str:
    lines = [
        "╔══════════════════════════════════════════════════════════╗",
        "║           PyCalc Terminal  –  Pure Python Engine         ║",
        "╚══════════════════════════════════════════════════════════╝",
        "",
        "  help()              – this help",
        "  functions()         – list all mathematical functions",
        "  constants()         – high-precision constants",
        "  categories()        – unit categories",
        "  units([category])   – list units (optionally by category)",
        "  convert(v, from, to)– unit conversion",
        "  clear()             – clear terminal (UI side)",
        "",
        "Factorial:  5!   (5+1)!   factorial(10)",
        "Logs:       log(100)  log(100, 10)  ln(e)  log10(1000)  log2(8)",
        "Trig:       sin(pi/2)  cosd(60)  tan(0)  asin(1)  …",
        "Hyperbolic: sinh(1)  cosh(0)  tanh(0.5)  asinh(1) …",
        "Units:      convert(1, 'm', 'ft')  convert(100, 'C', 'F')",
        "",
        "Examples:",
        "  2**10 + 5!",
        "  sqrt(144) + cbrt(27)",
        "  log(100, 10)",
        "  sind(30) + cosd(60)",
        "  convert(5, 'mi', 'km')",
        "  gcd(24, 36, 60)",
        "  pi_digits(30)",
        "  fib(20)",
        "  nCr(10, 3)",
    ]
    return "\n".join(lines)


def _list_all_functions() -> str:
    names = sorted(set(FUNCTION_CATALOG) | set(SAFE_NAMESPACE.keys()))
    callable_names = []
    for n in names:
        obj = SAFE_NAMESPACE.get(n) or FUNCTION_TABLE.get(n)
        if callable(obj) and not n.startswith("_"):
            callable_names.append(n)
    callable_names = sorted(set(callable_names))
    cols = 4
    rows = []
    for i in range(0, len(callable_names), cols):
        chunk = callable_names[i : i + cols]
        rows.append("  ".join(f"{c:<22}" for c in chunk))
    header = f"Mathematical functions ({len(callable_names)}):\n\n"
    return header + "\n".join(rows)


# Build the big namespace
SAFE_NAMESPACE: Dict[str, Any] = {
    # --- Arithmetic (kept for compatibility) ---
    "add": arith_add,
    "subtract": arith_subtract,
    "multiply": arith_multiply,
    "divide": arith_divide,
    "sqrt": arith_sqrt,
    "cbrt": arith_cbrt,
    "pow": arith_pow,
    "mod": arith_mod,
    "factorial": arith_factorial,
    # --- Number theory from integers.py ---
    "gcd": int_gcd,
    "lcm": int_lcm,
    "gcd_fraction": gcd_fraction,
    "lcm_fraction": lcm_fraction,
    "least_number_to_add": least_number_to_add,
    "least_number_to_subtract": least_number_to_subtract,
    "greatest_n_digit_number": greatest_n_digit_number,
    "least_n_digit_number": least_n_digit_number,
    "greatest_number_dividing_leaving_same_remainder": greatest_number_dividing_leaving_same_remainder,
    "least_number_leaving_same_remainder": least_number_leaving_same_remainder,
    "least_number_leaving_respective_differences": least_number_leaving_respective_differences,
    # --- Constants ---
    "pi_digits": pi_digits,
    "e_digits": e_digits,
    "pi": PI,
    "e": E,
    "tau": TAU,
    "phi": PHI,
    "π": PI,
    "τ": TAU,
    "φ": PHI,
    # --- Helpers ---
    "abs": abs_val,
    "abs_val": abs_val,
    "negate": negate,
    # --- Utilities ---
    "sqrtrem": sqrtrem
    "cbrtrem": cbrtrem
    "divrem": divrem
    # --- Meta ---
    "help": _help,
    "functions": _list_all_functions,
    "constants": list_constants,
    "clear": None,
    # --- Units ---
    "convert": convert,
    "list_units": list_units,
    "units": units,
    "list_categories": list_categories,
    "categories": list_categories,
    "unit_info": unit_info,
    "count_units": count_units,
}

# Inject the entire puremath FUNCTION_TABLE (300+ entries)
for _name, _fn in FUNCTION_TABLE.items():
    if _name not in SAFE_NAMESPACE and callable(_fn):
        SAFE_NAMESPACE[_name] = _fn

# Prefer puremath versions of common names when available
for _prefer in (
    "sqrt", "cbrt", "factorial", "log", "ln", "log10", "log2",
    "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
    "exp", "pow", "gcd", "lcm", "floor", "ceil", "round", "abs",
):
    if _prefer in FUNCTION_TABLE:
        SAFE_NAMESPACE[_prefer] = FUNCTION_TABLE[_prefer]

# logb(base, value) convenience (opposite arg order of log)
def _logb(base: Any, value: Any) -> float:
    return FUNCTION_TABLE["log"](value, base)

SAFE_NAMESPACE["logb"] = _logb
SAFE_NAMESPACE["log_base"] = _logb


def _resolve_name(name: str) -> Any:
    if name in SAFE_NAMESPACE:
        return SAFE_NAMESPACE[name]
    raise ParseError(f"Unknown name: {name}")


def _call_func(name: str, args: list) -> Any:
    if name not in SAFE_NAMESPACE or not callable(SAFE_NAMESPACE[name]):
        raise ParseError(f"Unknown or non-callable function: {name}")
    try:
        return SAFE_NAMESPACE[name](*args)
    except Exception as exc:
        raise ParseError(format_error(exc)) from exc


def evaluate(expression: str) -> Dict[str, Any]:
    """
    Safely evaluate a mathematical expression.
    Returns {"ok": bool, "result": str|None, "error": str|None}.
    """
    try:
        tree = parse_expression(expression)
        result = eval_node(tree, _resolve_name, _call_func)
        return {"ok": True, "result": safe_str(result), "error": None}
    except ParseError as exc:
        return {"ok": False, "result": None, "error": str(exc)}
    except Exception as exc:
        return {"ok": False, "result": None, "error": format_error(exc)}


def run_terminal_command(command: str) -> Dict[str, Any]:
    """Entry point used by the Terminal UI — same engine as the keypad."""
    return evaluate(command)


def call_function(name: str, *args: Any) -> Dict[str, Any]:
    """Direct function call (optional convenience for the TypeScript side)."""
    if name not in SAFE_NAMESPACE or not callable(SAFE_NAMESPACE[name]):
        return {"ok": False, "result": None, "error": f"Unknown function: {name}"}
    try:
        result = SAFE_NAMESPACE[name](*args)
        return {"ok": True, "result": safe_str(result), "error": None}
    except Exception as exc:
        return {"ok": False, "result": None, "error": format_error(exc)}
