from __future__ import annotations

from decimal import Decimal
from typing import Union

Number = Union[int, float, Decimal]


def gcd(*args: Number) -> int:
    """Calculate the Greatest Common Divisor for up to 10 (or more) numbers without helper functions."""
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = []
    for arg in args:
        if isinstance(arg, (list, tuple)):
            numbers.extend(arg)
        else:
            numbers.append(arg)

    if not numbers:
        raise ValueError("At least one number must be provided")

    result = abs(int(numbers[0]))
    for num in numbers[1:]:
        b = abs(int(num))
        while b:
            result, b = b, result % b
        if result == 1:
            break
    return result


def lcm(*args: Number) -> int:
    """Calculate the Least Common Multiple for up to 10 (or more) numbers without helper functions."""
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = []
    for arg in args:
        if isinstance(arg, (list, tuple)):
            numbers.extend(arg)
        else:
            numbers.append(arg)

    if not numbers:
        raise ValueError("At least one number must be provided")

    result = int(numbers[0])
    for num in numbers[1:]:
        b = int(num)
        if result == 0 or b == 0:
            result = 0
            break
        
        # Inline GCD calculation
        product = abs(result * b)
        x, y = abs(result), abs(b)
        while y:
            x, y = y, x % y
        common_divisor = x
        
        result = product // common_divisor
    return result
    
