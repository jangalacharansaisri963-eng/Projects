"""
Command registry and Python-style function dispatcher.

Users type calls like:

    is_prime(17)
    find_primes(10, 40)
    goldbach(28)

Logic lives in the individual command modules; this package only routes calls.
"""

from __future__ import annotations

import ast
from typing import Any, Callable, Dict, List

from history_manager import add as history_add

from commands.is_prime import is_prime
from commands.generate_primes import generate_primes
from commands.find_primes import find_primes
from commands.count_primes import count_primes
from commands.next_primes import next_prime
from commands.previous_prime import previous_prime
from commands.nth_prime import nth_prime
from commands.prime_factors import prime_factors
from commands.sum_primes import sum_primes
from commands.largest_prime import largest_prime
from commands.random_prime import random_prime
from commands.twin_primes import twin_primes
from commands.check_twin import check_twin
from commands.prime_gap import prime_gap
from commands.prime_table import prime_table
from commands.mersenne import mersenne_primes, mersenne
from commands.palindrome_primes import palindrome_primes
from commands.emirp import emirp_primes, emirp
from commands.goldbach import goldbach
from commands.stats import stats
from commands.help import help as help_fn
from commands.about import about
from commands.version import version
from commands.clear import clear
from commands.exit import exit as exit_fn
from commands.history import history
from commands.save import save
from commands.load import load


FUNCTIONS: Dict[str, Callable[..., Any]] = {
    "is_prime": is_prime,
    "generate_primes": generate_primes,
    "find_primes": find_primes,
    "count_primes": count_primes,
    "next_prime": next_prime,
    "previous_prime": previous_prime,
    "nth_prime": nth_prime,
    "prime_factors": prime_factors,
    "sum_primes": sum_primes,
    "largest_prime": largest_prime,
    "random_prime": random_prime,
    "twin_primes": twin_primes,
    "check_twin": check_twin,
    "prime_gap": prime_gap,
    "prime_table": prime_table,
    "mersenne_primes": mersenne_primes,
    "mersenne": mersenne,
    "palindrome_primes": palindrome_primes,
    "emirp_primes": emirp_primes,
    "emirp": emirp,
    "goldbach": goldbach,
    "stats": stats,
    "help": help_fn,
    "about": about,
    "version": version,
    "clear": clear,
    "exit": exit_fn,
    "quit": exit_fn,
    "history": history,
    "save": save,
    "load": load,
}


def _eval_arg(node: ast.AST) -> Any:
    """Evaluate a literal argument (numbers, strings, lists, tuples, unary ±)."""
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.Num):  # older Python
        return node.n
    if isinstance(node, ast.Str):
        return node.s
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
        val = _eval_arg(node.operand)
        return val if isinstance(node.op, ast.UAdd) else -val
    if isinstance(node, ast.List):
        return [_eval_arg(elt) for elt in node.elts]
    if isinstance(node, ast.Tuple):
        return tuple(_eval_arg(elt) for elt in node.elts)
    raise ValueError("Only literal arguments are allowed (numbers, strings, lists)")


def _parse_call(line: str) -> tuple[str, list]:
    """
    Parse 'name(arg1, arg2)' into (name, [args]).
    Also accepts bare names like 'help' or 'exit' as zero-arg calls.
    """
    line = line.strip()
    if not line:
        raise ValueError("Empty command")

    # Bare command without parentheses → treat as name()
    if "(" not in line:
        name = line.lower()
        if name in FUNCTIONS:
            return name, []
        raise ValueError(f"Unknown function: {line}. Try help()")

    try:
        tree = ast.parse(line, mode="eval")
    except SyntaxError as exc:
        raise ValueError(f"Syntax error: {exc.msg}") from exc

    body = tree.body
    if not isinstance(body, ast.Call):
        raise ValueError("Expected a function call like is_prime(17)")

    if not isinstance(body.func, ast.Name):
        raise ValueError("Only simple function names are allowed")

    if body.keywords:
        raise ValueError("Keyword arguments are not supported")

    name = body.func.id
    args = [_eval_arg(a) for a in body.args]
    return name, args


def execute_command(command: str) -> None:
    """Parse and run one line of Python-style input."""
    line = command.strip()
    if not line:
        return

    history_add(line)

    try:
        name, args = _parse_call(line)
    except ValueError as exc:
        print(str(exc))
        return

    # case-insensitive lookup
    key = name.lower() if name.lower() in FUNCTIONS else name
    if key not in FUNCTIONS:
        print(f"Unknown function: {name}. Try help()")
        return

    try:
        FUNCTIONS[key](*args)
    except TypeError as exc:
        print(f"Argument error: {exc}")
    except SystemExit:
        raise
    except Exception as exc:
        print(f"Error: {exc}")


execute = execute_command
