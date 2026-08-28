"""
Pure Python arithmetic engine for the calculator.
All calculations happen here — never in TypeScript/JavaScript.
"""

from __future__ import annotations

import math
from typing import Union

Number = Union[int, float]


def add(a: Number, b: Number) -> Number:
    return a + b


def subtract(a: Number, b: Number) -> Number:
    return a - b


def multiply(a: Number, b: Number) -> Number:
    return a * b


def divide(a: Number, b: Number) -> Number:
    if b == 0:
        raise ZeroDivisionError("Division by zero")
    return a / b


def sqrt(x: Number) -> float:
    if x < 0:
        raise ValueError("Square root of negative number is not supported")
    return math.sqrt(x)


def cbrt(x: Number) -> float:
    # Python 3.11+ has math.cbrt, but we support older runtimes via **
    if x >= 0:
        return x ** (1.0 / 3.0)
    return -((-x) ** (1.0 / 3.0))


def pow(x: Number, y: Number) -> Number:
    try:
        result = x ** y
        # Avoid complex results for this calculator
        if isinstance(result, complex):
            raise ValueError("Complex results are not supported")
        return result
    except OverflowError:
        raise OverflowError("Result is too large")


def mod(a: Number, b: Number) -> Number:
    if b == 0:
        raise ZeroDivisionError("Modulo by zero")
    return a % b


def factorial(n: Number) -> int:
    if not isinstance(n, (int, float)) or (isinstance(n, float) and not n.is_integer()):
        raise ValueError("Factorial requires a non-negative integer")
    n = int(n)
    if n < 0:
        raise ValueError("Factorial of negative number is not defined")
    if n > 1000:
        raise ValueError("Factorial argument too large (max 1000)")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
