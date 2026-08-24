"""
Calculator evaluation engine.

Owns the controlled namespace and the public evaluate / call_function APIs.
Parsing is delegated to parser.py.
"""

from __future__ import annotations

from typing import Any, Dict

from arithmetic import (
    add,
    subtract,
    multiply,
    divide,
    sqrt,
    cbrt,
    pow as py_pow,
    mod,
    factorial,
)
from constants import pi_digits, e_digits, list_constants
from functions import abs_val, negate, list_functions
from parser import ParseError, parse_expression, eval_node
from utils import safe_str, format_error
from integers import gcd, lcm


def _help() -> str:
    lines = [
        "Calculator Terminal – available commands:",
        "",
        "  help()          – show this help",
        "  functions()     – list mathematical functions",
        "  constants()     – list high-precision constants",
        "  clear()         – clear terminal output (UI side)",
        "",
        "Examples:",
        "  1 + 1",
        "  pow(2, 8)",
        "  sqrt(144)",
        "  factorial(10)",
        "  pi_digits(20)",
        "  e_digits(50)",
    ]
    return "\n".join(lines)


# Controlled namespace available to expressions and the terminal
SAFE_NAMESPACE: Dict[str, Any] = {
    # Arithmetic
    "add": add,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,
    "sqrt": sqrt,
    "cbrt": cbrt,
    "pow": py_pow,
    "mod": mod,
    "factorial": factorial,
    "gcd": gcd
    "lcm": lcm
    # Constants
    "pi_digits": pi_digits,
    "e_digits": e_digits,
    # Helpers
    "abs": abs_val,
    "abs_val": abs_val,
    "negate": negate,
    # Meta
    "help": _help,
    "functions": list_functions,
    "constants": list_constants,
    "clear": None,  # terminal-only, handled on the UI side
    # Convenience low-precision constants
    "pi": 3.141592653589793,
    "e": 2.718281828459045,
}


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
