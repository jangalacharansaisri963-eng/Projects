"""
Integer / decimal GCD and LCM.

Accepts int, float, and Decimal (including mixes). Non-integer decimals are
scaled to integers, the classic Euclidean algorithm is applied, then the
result is scaled back. No use of the math module.
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import List, Tuple, Union

Number = Union[int, float, Decimal]


def _collect(args: tuple) -> List[Number]:
    numbers: List[Number] = []
    for arg in args:
        if isinstance(arg, (list, tuple)):
            numbers.extend(arg)
        else:
            numbers.append(arg)
    if not numbers:
        raise ValueError("At least one number must be provided")
    return numbers


def _to_decimal(n: Number) -> Decimal:
    if isinstance(n, Decimal):
        d = n
    elif isinstance(n, bool):
        # bool is a subclass of int — reject explicitly
        raise ValueError("Boolean values are not allowed")
    elif isinstance(n, int):
        d = Decimal(n)
    elif isinstance(n, float):
        # str() avoids binary float artifacts (e.g. 0.1)
        d = Decimal(str(n))
    else:
        try:
            d = Decimal(str(n))
        except (InvalidOperation, ValueError, TypeError) as exc:
            raise ValueError(f"Invalid number: {n!r}") from exc

    if not d.is_finite():
        raise ValueError("Only finite numbers are allowed")
    return d


def _scale_to_ints(numbers: List[Number]) -> Tuple[List[int], Decimal]:
    """
    Convert all values to Decimal, multiply by 10**k so every value is an
    integer, return (scaled_ints, scale_factor).
    """
    decs = [_to_decimal(n) for n in numbers]

    places = 0
    for d in decs:
        exp = d.as_tuple().exponent
        if isinstance(exp, int) and exp < 0:
            places = max(places, -exp)

    scale = Decimal(10) ** places
    ints = [int(d * scale) for d in decs]
    return ints, scale


def _unscale(value: int, scale: Decimal) -> Union[int, Decimal]:
    if scale == 1:
        return value
    return Decimal(value) / scale


def gcd(*args: Number) -> Union[int, Decimal]:
    """
    Greatest Common Divisor.

    Accepts ints, floats, and Decimals (mixed OK). Decimals are scaled
    to integers first, so gcd(1.2, 0.8) → 0.4.
    """
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = _collect(args)
    ints, scale = _scale_to_ints(numbers)

    result = abs(ints[0])
    for n in ints[1:]:
        b = abs(n)
        while b:
            result, b = b, result % b
        if result == 1:
            break

    return _unscale(result, scale)


def lcm(*args: Number) -> Union[int, Decimal]:
    """
    Least Common Multiple (always non-negative).

    Accepts ints, floats, and Decimals (mixed OK). Decimals are scaled
    to integers first, so lcm(1.2, 0.8) → 2.4.
    """
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = _collect(args)
    ints, scale = _scale_to_ints(numbers)

    result = abs(ints[0])
    for n in ints[1:]:
        b = abs(n)
        if result == 0 or b == 0:
            result = 0
            break
        # lcm(a, b) = |a * b| / gcd(a, b)  — inline Euclidean
        product = abs(result * b)
        x, y = result, b
        while y:
            x, y = y, x % y
        result = product // x

    return _unscale(result, scale)
