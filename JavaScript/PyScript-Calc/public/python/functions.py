"""
Additional mathematical functions exposed to the calculator and terminal.
"""

from __future__ import annotations

from typing import Union

Number = Union[int, float]


def abs_val(x: Number) -> Number:
    return abs(x)


def negate(x: Number) -> Number:
    return -x


def list_functions() -> list[str]:
    return [
        "add(a, b)",
        "subtract(a, b)",
        "multiply(a, b)",
        "divide(a, b)",
        "sqrt(x)",
        "cbrt(x)",
        "pow(x, y)",
        "mod(a, b)",
        "factorial(n)",
        "abs_val(x)",
        "negate(x)",
        "pi_digits(n)",
        "e_digits(n)",
        "lcm(a,b)",
        "gcd(a,b)",
    ]
