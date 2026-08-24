"""
High-precision mathematical constants.
Supports up to 800 decimal digits using Python's decimal module.
"""

from __future__ import annotations

from decimal import Decimal, getcontext, ROUND_HALF_UP
from typing import Dict

MAX_DIGITS = 800

# Cache for generated constants: key = (name, digits)
_cache: Dict[tuple, str] = {}


def _set_precision(digits: int) -> None:
    # Extra digits for intermediate accuracy
    getcontext().prec = digits + 10
    getcontext().rounding = ROUND_HALF_UP


def _validate_digits(digits: int) -> int:
    if not isinstance(digits, int):
        try:
            digits = int(digits)
        except (TypeError, ValueError):
            raise ValueError("Number of digits must be an integer")
    if digits < 1:
        raise ValueError("Number of digits must be at least 1")
    if digits > MAX_DIGITS:
        raise ValueError(f"Maximum supported precision is {MAX_DIGITS} decimal digits")
    return digits


def pi_digits(digits: int = 50) -> str:
    """
    Return π as a string with the requested number of decimal digits.
    Cached for repeated requests.
    """
    digits = _validate_digits(digits)
    key = ("pi", digits)
    if key in _cache:
        return _cache[key]

    _set_precision(digits)
    # Machin-like formula: π/4 = 4*arctan(1/5) - arctan(1/239)
    # Using decimal for high precision
    one = Decimal(1)
    pi = (
        Decimal(4)
        * (
            Decimal(4) * _arctan(one / Decimal(5))
            - _arctan(one / Decimal(239))
        )
    )
    # Format to exactly `digits` decimal places
    quant = Decimal(10) ** -digits
    result = str(pi.quantize(quant))
    _cache[key] = result
    return result


def e_digits(digits: int = 50) -> str:
    """
    Return e as a string with the requested number of decimal digits.
    Cached for repeated requests.
    """
    digits = _validate_digits(digits)
    key = ("e", digits)
    if key in _cache:
        return _cache[key]

    _set_precision(digits)
    # Series: e = sum(1/n!)
    e = Decimal(1)
    term = Decimal(1)
    n = 1
    # Enough terms for the requested precision
    while True:
        term /= Decimal(n)
        if term == 0:
            break
        e += term
        n += 1
        if n > digits * 2 + 20:  # safety
            break

    quant = Decimal(10) ** -digits
    result = str(e.quantize(quant))
    _cache[key] = result
    return result


def _arctan(x: Decimal) -> Decimal:
    """Compute arctan(x) using Taylor series for |x| < 1."""
    # arctan(x) = x - x^3/3 + x^5/5 - ...
    result = Decimal(0)
    term = x
    n = 1
    x2 = x * x
    while term != 0:
        result += term / Decimal(n)
        term *= -x2
        n += 2
        if n > getcontext().prec * 2:
            break
    return result


def clear_cache() -> None:
    """Clear the constant cache (useful for testing)."""
    _cache.clear()


def list_constants() -> list[str]:
    return [
        "pi_digits(n)  – π with n decimal digits (max 800)",
        "e_digits(n)   – e with n decimal digits (max 800)",
    ]
