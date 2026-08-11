"""
logarithms.py

Decimal-only logarithmic functions for the scientific calculator.
No use of the math module — all calculations use decimal.getcontext() operations
for higher precision and reproducibility.

This module provides:
- ln, log (change-of-base), log10, log2, log1p, decimal_pow
- helper utilities: to_decimal, set_precision, almost_equal

Notes:
- All inputs are converted to Decimal without going through float.
- Requires a decimal.Context with methods ln, log10, exp (available in modern
  Python's decimal implementation). If those methods are not available, the
  module will raise a RuntimeError recommending a Python upgrade.
"""

from decimal import Decimal, getcontext, InvalidOperation

_ctx = getcontext()

# Quick checks for required context methods. If missing, fail early.
if not (hasattr(_ctx, "ln") and hasattr(_ctx, "log10") and hasattr(_ctx, "exp")):
    raise RuntimeError(
        "The current decimal context does not provide ln/log10/exp. "
        "Please use a Python version whose decimal.Context implements these functions."
    )


def set_precision(prec: int) -> None:
    """Set decimal precision for subsequent calculations.

    Example: set_precision(50)
    """
    if not isinstance(prec, int) or prec <= 0:
        raise ValueError("prec must be a positive integer")
    _ctx.prec = prec


def to_decimal(x) -> Decimal:
    """Convert input to Decimal without intermediate float conversions.

    Accepts int, str, Decimal, or anything convertible to Decimal via the
    Decimal constructor.
    """
    if isinstance(x, Decimal):
        return x
    try:
        return Decimal(x)
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise TypeError(f"Cannot convert {x!r} to Decimal: {exc}")


# Core logarithmic functions using decimal.Context methods


def ln(x) -> Decimal:
    """Natural logarithm (base e) using the decimal context.

    Domain: x > 0.
    """
    xd = to_decimal(x)
    if xd <= 0:
        raise ValueError(f"ln domain error: x must be > 0 (got {x})")
    return _ctx.ln(xd)


def log(base, value) -> Decimal:
    """Logarithm of `value` with given `base`.

    Uses change-of-base: log_base(value) = ln(value) / ln(base).
    Domain: base > 0, base != 1, value > 0.
    """
    bd = to_decimal(base)
    vd = to_decimal(value)
    if bd <= 0 or bd == 1:
        raise ValueError(f"base must be > 0 and != 1 (got {base})")
    if vd <= 0:
        raise ValueError(f"value must be > 0 (got {value})")
    # Use context ln for both for best precision
    return _ctx.ln(vd) / _ctx.ln(bd)


def log10(value) -> Decimal:
    """Common logarithm base 10."""
    vd = to_decimal(value)
    if vd <= 0:
        raise ValueError(f"log10 domain error: value must be > 0 (got {value})")
    return _ctx.log10(vd)


def log2(value) -> Decimal:
    """Logarithm base 2."""
    return log(Decimal(2), value)


def log1p(x) -> Decimal:
    """Accurate computation of ln(1 + x). Domain: x > -1."""
    xd = to_decimal(x)
    if xd <= -1:
        raise ValueError(f"log1p domain error: x must be > -1 (got {x})")
    return _ctx.ln(Decimal(1) + xd)


def decimal_pow(x, y) -> Decimal:
    """Compute x ** y for Decimal x and y using exp(y * ln(x)).

    Handles positive x. For x == 0 and integer y >= 0, returns 0.
    """
    xd = to_decimal(x)
    yd = to_decimal(y)
    if xd == 0:
        # 0 ** y: defined for non-negative integer y; otherwise Error
        if yd == 0:
            # 0**0 is treated as 1 in many contexts; keep it undefined here
            raise ValueError("0 ** 0 is undefined")
        # If y is an integer >= 1, return 0
        if yd == int(yd) and yd >= 1:
            return Decimal(0)
        raise ValueError("0 ** y undefined for non-integer or negative y")
    if xd < 0:
        # Negative base with non-integer exponent would be complex
        if yd == int(yd):
            # integer exponent OK
            return xd.__pow__(int(yd))
        raise ValueError("Negative base with non-integer exponent would be complex")
    # General positive base: exp(y * ln(x))
    return _ctx.exp(yd * _ctx.ln(xd))


# Convenience utility to compare two Decimal values within current precision

def almost_equal(a: Decimal, b: Decimal) -> bool:
    """Return True if a and b are equal within the current decimal context.

    Uses a simple relative comparison based on context precision.
    """
    a_d = to_decimal(a)
    b_d = to_decimal(b)
    # If both are exactly equal, quick True
    if a_d == b_d:
        return True
    # Calculate a relative tolerance from precision: 10**(-prec+2)
    tol = Decimal(10) ** (Decimal(-_ctx.prec + 2))
    # Use relative diff
    try:
        diff = (a_d - b_d).copy_abs()
        denom = max(a_d.copy_abs(), b_d.copy_abs(), Decimal(1))
        return diff <= tol * denom
    except InvalidOperation:
        return False
