from __future__ import annotations

from decimal import Decimal
from typing import Union

Number = Union[int, float, Decimal]


def gcd(a: Number, b: Number) -> int:
    """Calculate the Greatest Common Divisor using the Euclidean algorithm."""
    # Convert inputs to integers to safely handle arithmetic operations
    a_int, b_int = abs(int(a)), abs(int(b))
    while b_int:
        a_int, b_int = b_int, a_int % b_int
    return a_int


def lcm(a: Number, b: Number) -> int:
    """Calculate the Least Common Multiple."""
    a_int, b_int = int(a), int(b)
    if a_int == 0 or b_int == 0:
        return 0
    return abs(a_int * b_int) // gcd(a_int, b_int)
  
